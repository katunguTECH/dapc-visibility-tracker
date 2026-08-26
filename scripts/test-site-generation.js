// scripts/test-site-generation.js
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Import the AISiteGenerator (with .cjs extension)
const { AISiteGenerator } = require('../src/services/aiSiteGenerator.cjs');

const prisma = new PrismaClient();

async function testSiteGeneration() {
    try {
        console.log("🚀 Testing AI Site Generation...");
        console.log("=" .repeat(50));

        // Get a lead
        const lead = await prisma.lead.findFirst({
            where: {
                status: 'new'
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (!lead) {
            console.log("❌ No leads found.");
            console.log("💡 Run: npm run create-lead");
            return;
        }

        console.log("📝 Found lead:", lead.name);
        console.log("🆔 Lead ID:", lead.id);
        console.log("📍 Location:", lead.address);

        // Initialize generator
        console.log("\n🤖 Initializing AI Site Generator...");
        const generator = new AISiteGenerator();

        // Generate site
        console.log("⏳ Generating site (this may take 10-20 seconds)...");
        const startTime = Date.now();
        const result = await generator.generateAndAttachToLead(lead.id);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        console.log("\n✅ SUCCESS!");
        console.log("=" .repeat(50));
        console.log("🏢 Business:", result.businessName);
        console.log("🔗 Site URL:", result.siteUrl);
        console.log("⏱️ Generation Time:", duration, "seconds");

        // Check if file exists
        const filePath = path.join(__dirname, '..', 'public', 'sites', `${lead.id}.html`);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log("📁 File Saved:", filePath);
            console.log("📊 File Size:", (stats.size / 1024).toFixed(2), "KB");
        }

        console.log("\n💡 Next Steps:");
        console.log(`1. View site: http://localhost:3000/sites/${lead.id}.html`);
        console.log(`2. Check all sites: http://localhost:3000/test-sites`);

    } catch (error) {
        console.error("❌ Test failed:", error.message);
        if (error.stack) {
            console.error("Stack:", error.stack);
        }
    } finally {
        await prisma.$disconnect();
    }
}

testSiteGeneration();
