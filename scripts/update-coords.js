// scripts/update-coords.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCoordinates() {
  // Define coordinates for specific addresses
  const coordMap = {
    "Mombasa Road": { lat: -1.319842, lng: 36.848558 },
    "Muringa Rd": { lat: -1.287650, lng: 36.823420 },
    "Garden Estate Rd": { lat: -1.235000, lng: 36.880000 },
    "Jabavu Ln": { lat: -1.291599, lng: 36.785367 },
    "Ndemi Road": { lat: -1.268000, lng: 36.800000 },
    "Moi Avenue": { lat: -1.286389, lng: 36.817223 },
    "Westlands Road": { lat: -1.267262, lng: 36.802636 },
    "Enterprise Road": { lat: -1.303118, lng: 36.892291 },
  };

  // Get all leads without coordinates
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
  let skipped = 0;

  for (const lead of leads) {
    let coords = null;
    
    // Try to find coordinates by matching address
    for (const [key, value] of Object.entries(coordMap)) {
      if (lead.address && lead.address.includes(key)) {
        coords = value;
        break;
      }
    }

    if (coords) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          lat: coords.lat,
          lng: coords.lng,
        }
      });
      updated++;
      console.log(`✅ Updated: ${lead.name} (${coords.lat}, ${coords.lng})`);
    } else {
      skipped++;
      console.log(`⚠️ No coordinates found for: ${lead.name} - ${lead.address || 'No address'}`);
    }
  }

  console.log(`\n📊 Results: Updated ${updated}, Skipped ${skipped}`);
  await prisma.$disconnect();
  console.log('✅ Done!');
}

updateCoordinates().catch(console.error);
