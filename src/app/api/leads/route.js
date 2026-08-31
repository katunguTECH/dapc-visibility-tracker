import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
console.log('DB URL length:', process.env.DATABASE_URL?.length);
console.log('DB URL starts:', process.env.DATABASE_URL?.slice(0, 30));
console.log('DB URL ends:', process.env.DATABASE_URL?.slice(-25));
const prisma = new PrismaClient();
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const location = searchParams.get('location');
  
  console.log('🔍 Search request:', { query, location });
  
  try {
    // If no query provided, return existing leads
    if (!query) {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      console.log('📊 Returning existing leads:', leads.length);
      return NextResponse.json({ leads });
    }
    
    // Server-side calls must use an UNRESTRICTED (or IP-restricted) key.
    // The NEXT_PUBLIC_ key is exposed to the browser and is typically
    // HTTP-referrer restricted, which makes server fetch() calls fail
    // with REQUEST_DENIED (silently, if you don't log data.status).
    const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Build the search URL
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    if (location) {
      searchUrl += `&location=${location}&radius=50000`;
    }
    
    // Fetch multiple pages of results
    const allResults = [];
    let nextPageToken = null;
    let pageCount = 0;
    
    do {
      let pageUrl = searchUrl;
      if (nextPageToken) {
        pageUrl += `&pagetoken=${nextPageToken}`;
      }
      
      const response = await fetch(pageUrl);
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('❌ Google Places API error:', data.status, data.error_message);
        break;
      }
      
      if (data.results) {
        allResults.push(...data.results);
      }
      
      nextPageToken = data.next_page_token;
      pageCount++;
      
      // Safety limit - max 5 pages (100 results)
      if (pageCount >= 5) break;
      
      // Wait 2 seconds between pages (required by Google)
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } while (nextPageToken);
    
    console.log('📋 Total results fetched:', allResults.length);
    
    // Process each business to check for website
    const leads = [];
    
    for (const place of allResults) {
      console.log('🏢 Processing:', place.name, place.place_id);
      
      // Get detailed place info including website
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,geometry,rating,user_ratings_total&key=${apiKey}`;
      
      const detailResponse = await fetch(detailUrl);
      const detailData = await detailResponse.json();
      
      if (detailData.status === 'OK') {
        const placeDetails = detailData.result;
        
        // Check if business has website
        const hasWebsite = !!placeDetails.website;
        console.log('🏢 Business:', placeDetails.name, 'Has Website:', hasWebsite);
        
        // Only add businesses WITHOUT websites
        if (!hasWebsite) {
          // Check if lead already exists
          const existingLead = await prisma.lead.findUnique({
            where: { placeId: place.place_id }
          });
          
          if (!existingLead) {
            const lead = await prisma.lead.create({
              data: {
                name: placeDetails.name || place.name,
                address: placeDetails.formatted_address || place.formatted_address,
                phone: placeDetails.formatted_phone_number || null,
                email: null,
                placeId: place.place_id,
                lat: placeDetails.geometry?.location?.lat || place.geometry?.location?.lat,
                lng: placeDetails.geometry?.location?.lng || place.geometry?.location?.lng,
                status: "new"
              }
            });
            leads.push(lead);
            console.log('✅ Added lead:', lead.name);
          } else {
            leads.push(existingLead);
            console.log('✅ Lead already exists:', existingLead.name);
          }
        } else {
          console.log('⏭️ Skipping (has website):', placeDetails.name);
        }
      } else {
        // This is the branch that was silently swallowing every result.
        console.error('❌ Place Details failed for', place.name, '-', detailData.status, detailData.error_message || '');
      }
    }
    
    console.log('🎯 Total leads found:', leads.length);
    return NextResponse.json({ leads });
    
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({ 
      leads: [], 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { query, location } = await request.json();
    
    const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Use Google Places API to search for businesses
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    if (location) {
      searchUrl += `&location=${location}&radius=50000`;
    }
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      return NextResponse.json({ 
        success: false, 
        error: `Google Places API error: ${data.status}` 
      }, { status: 400 });
    }
    
    // Process each business to check for website
    const leads = [];
    
    for (const place of data.results) {
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,geometry,rating,user_ratings_total&key=${apiKey}`;
      
      const detailResponse = await fetch(detailUrl);
      const detailData = await detailResponse.json();
      
      if (detailData.status === 'OK') {
        const placeDetails = detailData.result;
        
        if (!placeDetails.website) {
          // Check if lead already exists
          const existingLead = await prisma.lead.findUnique({
            where: { placeId: place.place_id }
          });
          
          if (!existingLead) {
            const lead = await prisma.lead.create({
              data: {
                name: placeDetails.name || place.name,
                address: placeDetails.formatted_address || place.formatted_address,
                phone: placeDetails.formatted_phone_number || null,
                email: null,
                placeId: place.place_id,
                lat: placeDetails.geometry?.location?.lat,
                lng: placeDetails.geometry?.location?.lng,
                status: "new"
              }
            });
            leads.push(lead);
          } else {
            leads.push(existingLead);
          }
        }
      } else {
        console.error('❌ Place Details failed for', place.name, '-', detailData.status, detailData.error_message || '');
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      leads,
      count: leads.length 
    });
    
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
