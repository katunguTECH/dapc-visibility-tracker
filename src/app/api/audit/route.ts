import { NextResponse } from "next/server";
import levenshtein from "fast-levenshtein"; // Import the helper

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const apiKey = process.env.SERP_API_KEY?.trim();

  try {
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    // --- THE FIX: FUZZY VALIDATION ---
    if (target) {
      const distance = levenshtein.get(
        businessQuery.toLowerCase(), 
        target.title.toLowerCase()
      );
      
      // Calculate a similarity percentage
      const longestLength = Math.max(businessQuery.length, target.title.length);
      const similarity = ((longestLength - distance) / longestLength) * 100;

      // If similarity is below 60%, it's likely an accidental fallback result
      if (similarity < 60) {
        return NextResponse.json({ 
          score: 0, 
          status: "Verification Failed", 
          message: "No matching business found." 
        });
      }
    } else {
      return NextResponse.json({ score: 0, status: "Not Found" });
    }

    // ... (rest of your ranking and competitor logic)
    return NextResponse.json({
        score: 85, // Example successful score
        businessName: target.title,
        // ...
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "Error" });
  }
}