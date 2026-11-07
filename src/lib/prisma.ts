console.log('DB URL length:', process.env.DATABASE_URL?.length);
console.log('DB URL starts:', process.env.DATABASE_URL?.slice(0, 30));
console.log('DB URL ends:', process.env.DATABASE_URL?.slice(-25));
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;