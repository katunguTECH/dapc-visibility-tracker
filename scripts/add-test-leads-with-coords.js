// scripts/add-test-leads-with-coords.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTestLeads() {
  const testLeads = [
    {
      name: "Test Garage - Nairobi CBD",
      address: "Moi Avenue, Nairobi, Kenya",
      phone: "+254 700 000 001",
      placeId: "test_cbd_1",
      lat: -1.286389,
      lng: 36.817223,
      status: "new"
    },
    {
      name: "Test Garage - Westlands",
      address: "Westlands Road, Nairobi, Kenya",
      phone: "+254 700 000 002",
      placeId: "test_westlands_1",
      lat: -1.267262,
      lng: 36.802636,
      status: "new"
    },
    {
      name: "Test Garage - Kilimani",
      address: "Kilimani Road, Nairobi, Kenya",
      phone: "+254 700 000 003",
      placeId: "test_kilimani_1",
      lat: -1.291599,
      lng: 36.785367,
      status: "new"
    }
  ];

  for (const lead of testLeads) {
    try {
      const existing = await prisma.lead.findUnique({
        where: { placeId: lead.placeId }
      });
      if (!existing) {
        await prisma.lead.create({ data: lead });
        console.log(`✅ Added: ${lead.name} (${lead.lat}, ${lead.lng})`);
      } else {
        console.log(`⏭️ Skipped: ${lead.name} (already exists)`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  await prisma.$disconnect();
  console.log('✅ Done!');
}

addTestLeads();
