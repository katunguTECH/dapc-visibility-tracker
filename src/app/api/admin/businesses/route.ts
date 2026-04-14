import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filePath = path.join(process.cwd(), "src/data/businesses.json");
    
    // Read existing database
    const existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    // Create new business entry
    const newBusiness = {
      id: body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: body.name,
      canonicalName: body.canonicalName || body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      website: body.website,
      mapsPresence: body.mapsPresence,
      mapsUrl: body.mapsUrl,
      seoScore: body.seoScore,
      overallScore: body.overallScore,
      social: body.social,
      competitors: body.competitors || [],
      lastVerified: new Date().toISOString().split("T")[0],
    };
    
    // Check if business already exists
    const existingIndex = existingData.businesses.findIndex(
      (b: any) => b.name.toLowerCase() === body.name.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      // Update existing
      existingData.businesses[existingIndex] = newBusiness;
    } else {
      // Add new
      existingData.businesses.push(newBusiness);
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ success: true, business: newBusiness });
    
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { error: "Failed to save business" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/businesses.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ businesses: [] });
  }
}