import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get('business');
  const location = searchParams.get('location') || 'Nairobi';

  // In a real app, you would call Google Places API or a scraper here.
  // For now, we return a professional structured report.
  const mockReport = {
    businessName: business,
    location: location,
    timestamp: new Date().toISOString(),
    score: 38,
    audit: {
      googleMaps: {
        status: "Unoptimized",
        issue: "Missing NAP (Name, Address, Phone) consistency",
        coordinates: { lat: -1.286389, lng: 36.817223 } // Nairobi center
      },
      socials: {
        facebook: { found: true, followers: "1.2k", status: "Active" },
        tiktok: { found: false, followers: 0, status: "Missing" },
        x: { found: false, followers: 0, status: "Missing" }
      },
      seo: {
        metaDescription: "Missing",
        loadSpeed: "2.4s",
        mobileFriendly: true,
        keywords: ["Local Search", "Kenya Business"]
      },
      competitors: [
        { name: "Top Competitor A", score: 72, gap: "High" },
        { name: "Top Competitor B", score: 65, gap: "Medium" }
      ]
    }
  };

  return NextResponse.json(mockReport);
}