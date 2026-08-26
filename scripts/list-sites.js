// scripts/list-sites.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function listSites() {
    try {
        console.log("📋 Checking generated sites...");
        console.log("=" .repeat(50));

        const leads = await prisma.lead.findMany({
            where: {
                status: 'site_generated'
            },
            orderBy: {
                createdAt: 'desc'  // Changed from updatedAt to createdAt
            },
            take: 20
        });

        if (leads.length === 0) {
            console.log("ℹ️ No sites generated yet.");
            console.log("Run: npm run test-site");
            return;
        }

        console.log(`✅ Found ${leads.length} generated sites:\n`);

        for (const lead of leads) {
            const filePath = path.join(__dirname, '..', 'public', 'sites', `${lead.id}.html`);
            const exists = fs.existsSync(filePath);
            const stats = exists ? fs.statSync(filePath) : null;
            
            console.log(`🏢 ${lead.name}`);
            console.log(`   🆔 ${lead.id}`);
            console.log(`   📁 ${exists ? '✅' : '❌'} File ${exists ? 'exists' : 'missing'}`);
            if (exists) {
                console.log(`   📊 ${(stats.size / 1024).toFixed(2)} KB`);
            }
            console.log(`   🔗 http://localhost:3000/sites/${lead.id}.html`);
            console.log(`   📅 ${new Date(lead.createdAt).toLocaleString()}`);
            console.log("");
        }

        console.log("💡 To generate more sites, run: npm run test-site");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

listSites();
