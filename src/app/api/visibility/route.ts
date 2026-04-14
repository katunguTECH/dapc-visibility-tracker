// src/app/api/visibility/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Type definitions
interface SocialStatus {
  facebook: boolean | string;
  twitter: boolean | string;
  instagram: boolean | string;
  tiktok: boolean | string;
}

interface Competitor {
  name: string;
  score: number;
}

interface BusinessData {
  id: string;
  name: string;
  canonicalName: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  mapsPresence: boolean;
  mapsUrl?: string;
  seoScore: number;
  overallScore: number;
  social: SocialStatus;
  competitors: Competitor[];
  lastVerified: string;
}

interface BusinessDatabase {
  businesses: BusinessData[];
}

// Cache for the database (load once)
let cachedDatabase: BusinessDatabase | null = null;

function loadDatabase(): BusinessDatabase {
  if (cachedDatabase) return cachedDatabase;
  
  try {
    const filePath = path.join(process.cwd(), "src/data/businesses.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    cachedDatabase = JSON.parse(fileContents);
    return cachedDatabase!;
  } catch (error) {
    console.error("Failed to load business database:", error);
    // Return empty database on error
    return { businesses: [] };
  }
}

function normalizeBusinessName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function findBusinessData(searchName: string): any {
  const db = loadDatabase();
  const normalizedSearch = normalizeBusinessName(searchName);
  
  // 1. Try exact match on name or canonicalName
  let business = db.businesses.find(
    (b) =>
      normalizeBusinessName(b.name) === normalizedSearch ||
      normalizeBusinessName(b.canonicalName) === normalizedSearch
  );
  
  // 2. Try partial match (for "Le-Paz" matching "LE-PAZ INTERNATIONAL SCHOOL")
  if (!business) {
    business = db.businesses.find(
      (b) =>
        normalizeBusinessName(b.name).includes(normalizedSearch) ||
        normalizedSearch.includes(normalizeBusinessName(b.name))
    );
  }
  
  // 3. If found in database, return accurate data
  if (business) {
    // Convert social URLs/booleans to consistent format
    const socialStatus = {
      facebook: !!business.social.facebook,
      twitter: !!business.social.twitter,
      instagram: !!business.social.instagram,
      tiktok: !!business.social.tiktok,
    };
    
    return {
      business: business.canonicalName,
      score: business.overallScore,
      seoScore: business.seoScore,
      mapsPresence: business.mapsPresence,
      mapsUrl: business.mapsUrl || null,
      address: business.address || null,
      phone: business.phone || null,
      email: business.email || null,
      website: business.website || null,
      social: socialStatus,
      competitors: business.competitors || [],
      lastVerified: business.lastVerified,
      dataSource: "verified_business_database",
    };
  }
  
  // 4. Business not found - return structured "needs verification" response
  return {
    business: searchName,
    score: null,
    seoScore: null,
    mapsPresence: false,
    social: {
      facebook: false,
      twitter: false,
      instagram: false,
      tiktok: false,
    },
    competitors: [],
    needsVerification: true,
    dataSource: "unknown",
    message: "This business is not yet in our verified database. Please submit accurate information.",
    timestamp: Date.now(),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const business = searchParams.get("business") || "";
    
    if (!business.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }
    
    const data = findBusinessData(business);
    
    const response = {
      ...data,
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("API Error:", error);
    
    // Safe fallback that clearly indicates an error
    return NextResponse.json({
      business: "Error Loading Data",
      score: 0,
      seoScore: 0,
      mapsPresence: false,
      social: {
        facebook: false,
        twitter: false,
        instagram: false,
        tiktok: false,
      },
      competitors: [],
      error: true,
      message: "Unable to load business data. Please try again.",
      timestamp: Date.now(),
    });
  }
}