import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessName = searchParams.get("business") || "this business";
  const score = parseInt(searchParams.get("score") || "0");
  const trust = searchParams.get("trust") || "";

  // Logic to generate smart leads based on audit gaps
  const leadOpportunities = [
    {
      id: "rep-01",
      title: "Reputation Rescue",
      description: `Your trust rating is ${trust}. High-ranking competitors in Nairobi average 4.5⭐. You need 15+ positive reviews to bridge the gap.`,
      impact: "High",
      type: "Review Management"
    },
    {
      id: "dir-02",
      title: "Local Directory Sync",
      description: `We detected missing profiles on Kenya Business Directory and Yellow Pages. Syncing these adds 15% to your visibility score.`,
      impact: "Medium",
      type: "SEO"
    },
    {
      id: "key-03",
      title: "Competitor Keyword Theft",
      description: `Top performers in your category are ranking for 'Best ${businessName} Services'. We can optimize your meta-tags to capture this traffic.`,
      impact: "High",
      type: "Content"
    }
  ];

  return NextResponse.json({
    business: businessName,
    opportunities: score < 90 ? leadOpportunities : leadOpportunities.slice(1, 2)
  });
}