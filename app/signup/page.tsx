"use client";

import Link from "next/link"; // FIXED: Added missing import
import { Check } from "lucide-react"; // Common icon for pricing pages

const plans = [
  {
    name: "Starter",
    price: "$0",
    slug: "starter",
    description: "Perfect for testing the waters.",
    features: ["Track 1 Business", "Weekly Reports", "Basic AI Insights"],
  },
  {
    name: "Professional",
    price: "$29",
    slug: "pro",
    description: "For growing businesses.",
    features: ["Track 5 Businesses", "Daily Reports", "Advanced AI Strategy", "Priority Support"],
  },
  {
    name: "Enterprise",
    price: "$99",
    slug: "enterprise",
    description: "Maximum visibility.",
    features: ["Unlimited Businesses", "Real-time Alerts", "Custom AI Models", "Dedicated Account Manager"],
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 mb-12">Select the plan that best fits your business needs.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.slug} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">/mo</span>
              </div>

              <ul className="text-left mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-3 text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.slug}`}
                className="block text-center bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}