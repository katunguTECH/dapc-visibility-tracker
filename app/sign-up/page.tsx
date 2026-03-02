"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter Listing",
    price: "KES 1,999",
    slug: "starter-listing",
    description: "Basic visibility for new businesses.",
    features: ["Standard Directory Listing", "Basic SEO Optimization", "Weekly Traffic Reports"],
  },
  {
    name: "Local Boost",
    price: "KES 3,999",
    slug: "local-boost",
    description: "Stand out in your local neighborhood.",
    features: ["Featured Search Result", "Google Maps Integration", "Customer Review Management"],
  },
  {
    name: "Growth Engine",
    price: "KES 5,999",
    slug: "growth-engine",
    description: "Accelerated growth for established shops.",
    features: ["Social Media Automation", "Competitor Tracking", "Monthly Performance Audit"],
  },
  {
    name: "Market Leader",
    price: "KES 7,999",
    slug: "market-leader",
    description: "Dominance in your specific industry.",
    features: ["Industry-specific AI Strategy", "Priority Ad Placement", "Verified Business Badge"],
  },
  {
    name: "Super Active Visibility",
    price: "KES 10,000",
    slug: "super-active-visibility",
    description: "The ultimate package for maximum reach.",
    features: ["24/7 AI-Driven Marketing", "Dedicated Account Manager", "Unlimited Business Locations"],
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Visibility Plan</h1>
        <p className="text-lg text-gray-600 mb-12">Scalable solutions to grow your business presence in Kenya.</p>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.slug} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-black">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">/month</span>
              </div>

              <ul className="text-left mb-8 flex-grow space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.slug}`}
                className="block text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}