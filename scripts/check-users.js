// scripts/check-users.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log("Users found:", users.length);
        if (users.length > 0) {
            console.log("First user ID:", users[0].id);
            console.log("First user email:", users[0].email);
        } else {
            console.log("No users found. Creating a default user...");
            const user = await prisma.user.create({
                data: {
                    clerkId: 'default-clerk-id',
                    email: 'default@dapc.co.ke',
                    name: 'Default User'
                }
            });
            console.log("✅ Default user created with ID:", user.id);
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
