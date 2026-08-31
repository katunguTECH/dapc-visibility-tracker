// scripts/geocode-leads.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function geocodeAddress(address) {
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
  
  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        { lat: null },
        { lng: null }
      ]
    }
  });
  
  console.log(`📊 Found ${leads.length} leads without coordinates`);
  
  let updated = 0;
  let failed = 0;
  
  for (const lead of leads) {
    console.log(`📍 Geocoding: ${lead.name} - ${lead.address}`);
    
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
      console.log(`✅ Updated ${lead.name} (${coords.lat}, ${coords.lng})`);
    } else {
      failed++;
      console.log(`❌ Failed to geocode ${lead.name}`);
    }
    
    // Rate limiting to avoid hitting Google's quota
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ Complete! Updated: ${updated}, Failed: ${failed}`);
  await prisma.$disconnect();
}

geocodeAllLeads();
