// scripts/create-test-lead.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestLead() {
    try {
        // Check if lead already exists
        const existing = await prisma.lead.findFirst({
            where: {
                placeId: "test_place_123"
            }
        });

        if (existing) {
            console.log("ℹ️ Test lead already exists!");
            console.log("📝 Lead ID:", existing.id);
            console.log("🏢 Name:", existing.name);
            console.log("📍 Address:", existing.address);
            return existing;
        }

        const lead = await prisma.lead.create({
            data: {
                name: "Nairobi Auto Care Garage",
                address: "Mombasa Road, Nairobi, Kenya",
                phone: "+254 722 123 456",
                placeId: "test_place_123",
                status: "new"
            }
        });
        console.log("✅ Test lead created!");
        console.log("📝 Lead ID:", lead.id);
        console.log("🏢 Name:", lead.name);
        console.log("📍 Address:", lead.address);
        console.log("📞 Phone:", lead.phone);
        return lead;
    } catch (error) {
        console.error("❌ Error creating lead:", error.message);
        if (error.code === 'P2002') {
            console.log("💡 Tip: A lead with this placeId already exists.");
        }
    } finally {
        await prisma.$disconnect();
    }
}

createTestLead();
