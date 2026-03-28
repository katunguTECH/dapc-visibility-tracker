import { NextResponse } from "next/server";
// Use /server for API routes
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(req: Request) {
  // Await the auth() call in the App Router
  const { userId } = await auth(); 
  
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ... rest of your code
}