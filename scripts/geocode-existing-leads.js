// scripts/geocode-existing-leads.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Use your Google Maps API key from .env
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyD-BY3elC33y7R9SOKEw-jpc2HpfF6pyhU';

async function geocodeAddress(address) {
  if (!address) return null;
  
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for "${address}":`, error.message);
    return null;
  }
}

async function geocodeAllLeads() {
  console.log('🔍 Fetching leads without coordinates...');
  
  try {
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { lat: null },
          { lng: null }
        ]
      }
    });
    
    console.log(`📊 Found ${leads.length} leads without coordinates`);
    
    if (leads.length === 0) {
      console.log('✅ All leads already have coordinates!');
      await prisma.$disconnect();
      return;
    }
    
    let updated = 0;
    let failed = 0;
    
    for (const lead of leads) {
      if (!lead.address) {
        console.log(`⚠️ No address for: ${lead.name}, skipping`);
        failed++;
        continue;
      }
      
      console.log(`📍 Geocoding: ${lead.name} - ${lead.address.substring(0, 50)}...`);
      
      const coords = await geocodeAddress(lead.address);
      
      if (coords) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            lat: coords.lat,
            lng: coords.lng,
          }
        });
        updated++;
        console.log(`✅ Updated ${lead.name} (${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)})`);
      } else {
        failed++;
        console.log(`❌ Failed to geocode ${lead.name}`);
      }
      
      // Rate limiting to avoid hitting Google's quota
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 Results: Updated ${updated}, Failed ${failed}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('✅ Done!');
  }
}

geocodeAllLeads();
