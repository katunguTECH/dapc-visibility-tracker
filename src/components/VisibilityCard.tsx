// src/components/VisibilityCard.tsx
"use client";

interface VisibilityCardProps {
  business: string;
  score: number;
  seoScore: number;
  mapsPresence: boolean;
  social: {
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
    tiktok: boolean;
  };
  competitors?: any[];
}

interface Recommendation {
  title: string;
  description: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export default function VisibilityCard({
  business,
  score,
  seoScore,
  mapsPresence,
  social,
}: VisibilityCardProps) {
  // Helper to get score color
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "text-green-600";
    if (scoreValue >= 60) return "text-yellow-600";
    if (scoreValue >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (scoreValue: number) => {
    if (scoreValue >= 80) return "bg-green-100";
    if (scoreValue >= 60) return "bg-yellow-100";
    if (scoreValue >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  // Generate personalized recommendations based on audit data and business name
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Overall score
    if (score < 50) {
      recommendations.push({
        title: "Urgent: Improve Overall Visibility",
        description: `${business}'s visibility score is ${score}/100, which is below average.`,
        action: `Complete a full business profile for ${business} on Google, Bing, and Yelp. Ensure NAP (Name, Address, Phone) consistency across all platforms.`,
        priority: "high",
      });
    } else if (score < 70) {
      recommendations.push({
        title: "Boost Your Visibility Score",
        description: `${business}'s score of ${score}/100 has room for improvement.`,
        action: `Increase local citations and encourage customer reviews for ${business} on Google Maps and Facebook.`,
        priority: "medium",
      });
    }

    // SEO score
    if (seoScore < 50) {
      recommendations.push({
        title: "Critical SEO Improvements Needed",
        description: `${business}'s SEO score is ${seoScore}/100. Search engines struggle to find you.`,
        action: `Add meta titles/descriptions, improve page load speed for ${business}'s website, and target local keywords like 'best ${business} in [city]'.`,
        priority: "high",
      });
    } else if (seoScore < 70) {
      recommendations.push({
        title: "Enhance On‑Page SEO",
        description: `SEO score ${seoScore}/100. Good but not great for ${business}.`,
        action: `Optimize image alt tags, create quality backlinks, and publish regular blog content relevant to ${business}'s industry.`,
        priority: "medium",
      });
    }

    // Google Maps
    if (!mapsPresence) {
      recommendations.push({
        title: "Claim Your Google Maps Listing",
        description: `${business} is not verified on Google Maps, making it hard for local customers to find you.`,
        action: `Go to Google Business Profile, claim your listing for ${business}, verify it (by postcard or phone), and add photos, hours, and services.`,
        priority: "high",
      });
    } else {
      recommendations.push({
        title: "Optimize Your Google Maps Profile",
        description: `${business} is on Google Maps – great! But there's more you can do.`,
        action: `Add high‑quality photos of ${business}, respond to all reviews, post updates weekly, and use Google Posts to share offers.`,
        priority: "medium",
      });
    }

    // Facebook
    if (!social.facebook) {
      recommendations.push({
        title: "Create a Facebook Business Page",
        description: `Facebook is essential for ${business} to engage locally and build trust.`,
        action: `Set up a Facebook Page for ${business}, fill in all business details, and start posting weekly updates and promotions.`,
        priority: "high",
      });
    } else {
      recommendations.push({
        title: "Boost Facebook Engagement",
        description: `${business} has a Facebook page – now make it work harder.`,
        action: `Post at least 3 times per week about ${business}, respond to messages within 24 hours, and run low‑cost local ads to increase reach.`,
        priority: "medium",
      });
    }

    // Instagram
    if (!social.instagram) {
      recommendations.push({
        title: "Start Using Instagram",
        description: `Instagram is vital for ${business} to showcase visual content and reach younger audiences.`,
        action: `Create an Instagram Business account for ${business} linked to your Facebook page. Post high‑quality photos/reels 4–5 times per week.`,
        priority: "medium",
      });
    } else {
      recommendations.push({
        title: "Improve Instagram Presence",
        description: `${business} is on Instagram – let's grow your following.`,
        action: `Use relevant hashtags for ${business}, collaborate with micro‑influencers, and post Stories daily to stay top‑of‑mind.`,
        priority: "low",
      });
    }

    // Twitter/X
    if (!social.twitter) {
      recommendations.push({
        title: "Establish a Twitter/X Presence",
        description: `Twitter helps ${business} with customer service and real‑time updates.`,
        action: `Create a business handle for ${business}, share industry news, engage with local trends, and respond to mentions promptly.`,
        priority: "low",
      });
    } else {
      recommendations.push({
        title: "Leverage Twitter/X for Engagement",
        description: `${business}'s Twitter account exists – now use it strategically.`,
        action: `Tweet 2‑3 times daily about ${business}, join local Twitter chats, and use polls or threads to boost engagement.`,
        priority: "low",
      });
    }

    // TikTok (only if score > 40, meaning somewhat established)
    if (!social.tiktok && score > 40) {
      recommendations.push({
        title: "Expand to TikTok",
        description: `TikTok is the fastest‑growing platform for brand awareness – great for ${business}.`,
        action: `Create short, entertaining videos showcasing ${business}'s products or behind‑the‑scenes content. Aim for 2‑3 videos per week.`,
        priority: "low",
      });
    }

    // Limit to top 5 most important
    return recommendations.slice(0, 5);
  };

  const recommendations = generateRecommendations();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center text-white">
          <h2 className="text-xl font-semibold">Visibility Report</h2>
          <span className="text-xs opacity-80">Powered by DAPC AI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Business Name & Score */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{business}</h3>
            <p className="text-sm text-gray-500">Visibility audit completed</p>
          </div>
          <div className="mt-2 md:mt-0 text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBackground(score)}`}>
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">/100</p>
            <p className="text-sm font-medium mt-1">
              {score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Poor"}
            </p>
          </div>
        </div>

        {/* Score Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* SEO Score */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">SEO Score</span>
              <span className={`text-lg font-bold ${getScoreColor(seoScore)}`}>{seoScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  seoScore >= 80 ? "bg-green-500" : seoScore >= 60 ? "bg-yellow-500" : seoScore >= 40 ? "bg-orange-500" : "bg-red-500"
                }`}
                style={{ width: `${seoScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {seoScore >= 70 ? "Good optimization" : seoScore >= 50 ? "Needs improvement" : "Critical issues detected"}
            </p>
          </div>

          {/* Google Maps */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Google Maps</span>
              <span className={`text-lg font-bold ${mapsPresence ? "text-green-600" : "text-red-600"}`}>
                {mapsPresence ? "Verified" : "Not Found"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {mapsPresence
                ? "Your business appears on Google Maps"
                : "Claim your listing to appear in local searches"}
            </p>
          </div>
        </div>

        {/* Social Media Presence */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">Social Media Presence</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg text-center ${social.facebook ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
              <div className="text-2xl mb-1">{social.facebook ? "✅" : "❌"}</div>
              <p className="text-xs font-medium">Facebook</p>
              <p className="text-xs text-gray-500">{social.facebook ? "Active" : "Not Active"}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${social.twitter ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
              <div className="text-2xl mb-1">{social.twitter ? "✅" : "❌"}</div>
              <p className="text-xs font-medium">Twitter/X</p>
              <p className="text-xs text-gray-500">{social.twitter ? "Active" : "Not Active"}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${social.instagram ? "bg-pink-50 border border-pink-200" : "bg-gray-50"}`}>
              <div className="text-2xl mb-1">{social.instagram ? "✅" : "❌"}</div>
              <p className="text-xs font-medium">Instagram</p>
              <p className="text-xs text-gray-500">{social.instagram ? "Active" : "Not Active"}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${social.tiktok ? "bg-black/5 border border-gray-300" : "bg-gray-50"}`}>
              <div className="text-2xl mb-1">{social.tiktok ? "✅" : "❌"}</div>
              <p className="text-xs font-medium">TikTok</p>
              <p className="text-xs text-gray-500">{social.tiktok ? "Active" : "Not Active"}</p>
            </div>
          </div>
        </div>

        {/* NEW: Recommended Actions Section - Fully Customized */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋 Recommended Actions for {business}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Personalized just for you</span>
          </h4>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {rec.priority === "high" && (
                      <span className="inline-flex h-3 w-3 rounded-full bg-red-500 mt-1.5"></span>
                    )}
                    {rec.priority === "medium" && (
                      <span className="inline-flex h-3 w-3 rounded-full bg-yellow-500 mt-1.5"></span>
                    )}
                    {rec.priority === "low" && (
                      <span className="inline-flex h-3 w-3 rounded-full bg-green-500 mt-1.5"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="mt-2 bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>✍️ Action:</strong> {rec.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-xs text-gray-400">
            These recommendations are based on {business}'s current audit. Complete them to see your score improve.
          </div>
        </div>
      </div>
    </div>
  );
}