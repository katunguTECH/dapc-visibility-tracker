// create-test-lead.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestLead() {
    try {
        const lead = await prisma.lead.create({
            data: {
                name: "Nairobi Auto Care Garage",
                address: "Mombasa Road, Nairobi, Kenya",
                phone: "+254 722 123 456",
                placeId: "test_place_123",
                status: "new"
            }
        });
        console.log("✅ Test lead created:", lead);
        console.log("📝 Lead ID:", lead.id);
        return lead;
    } catch (error) {
        console.error("❌ Error creating lead:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestLead();