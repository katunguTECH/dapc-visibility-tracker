import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!business || business.length < 3) return NextResponse.json({ score: 0 });

  try {
    // STEP 1: Identify the Business & its Category
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    // Bouncer: If it's gibberish or not found
    if (!target || !target.title.toLowerCase().includes(business.toLowerCase().split(' ')[0])) {
      return NextResponse.json({ score: 11, rank: "Not Found", status: "Identity Failed" });
    }

    // STEP 2: Category Discovery (The "Reality Check")
    const category = target.category || "Business";
    const discRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in Nairobi`, gl: "ke", num: 20 })
    });
    const discData = await discRes.json();
    const competitors = discData.places || [];

    // Find Actual Rank in Category
    const rankIndex = competitors.findIndex((p: any) => 
      p.title.toLowerCase().includes(target.title.toLowerCase()) || p.address === target.address
    );

    // STEP 3: Strict Scoring Algorithm (Enticement Logic)
    let score = 10;
    
    // Website is a huge factor for professional score
    if (target.website) score += 25;
    
    // Reviews Weighting (Only Safaricom-level brands get max points)
    const reviewCount = target.user_ratings_total || 0;
    if (reviewCount > 1000) score += 30;
    else if (reviewCount > 100) score += 15;
    else if (reviewCount > 10) score += 5;

    // Rank Weighting
    if (rankIndex === 0) score += 34; // #1 gets the boost
    else if (rankIndex > 0 && rankIndex < 5) score += 15;
    else score -= 10; // Penalty for being buried

    // Social & Contact Scan (Simulated for this demo)
    const hasWhatsApp = target.phoneNumber?.startsWith('07') || target.phoneNumber?.startsWith('+2547');
    if (hasWhatsApp) score += 5;

    // The Ceiling: Small brands cannot cross 65% easily
    const isMegaBrand = reviewCount > 1500 && target.website;
    const finalScore = isMegaBrand ? Math.min(score, 99) : Math.min(score, 65);

    return NextResponse.json({
      score: Math.max(finalScore, 11),
      rank: rankIndex !== -1 ? `#${rankIndex + 1} in Nairobi` : "Below Top 20",
      businessName: target.title,
      address: target.address,
      trust: target.rating ? `${target.rating} ⭐ (${reviewCount})` : "Verified",
      leads: {
        phone: target.phoneNumber || "Not Found",
        whatsapp: hasWhatsApp ? target.phoneNumber : "Not Found",
        email: "Scan Website for Email",
        facebook: "Check Socials",
        instagram: "Check Socials"
      }
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "Error" });
  }
}