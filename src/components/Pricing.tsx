"use client";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" }
];

export default function Pricing({ onSubscribe }: { onSubscribe: (plan: any) => void }) {
  return (
    <section id="pricing" className="w-full py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-12 animate-fade-in">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="p-6 border-2 rounded-[2rem] flex flex-col items-center bg-white shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer animate-fade-in delay-150"
            >
              <img src={plan.icon} className="w-24 h-24 rounded-full mb-4" alt={plan.name} />
              <h3 className="font-black text-center text-sm mb-2">{plan.name}</h3>
              <p className="text-2xl font-black mb-6">KES {plan.price.toLocaleString()}</p>

              <button
                type="button"
                onClick={() => onSubscribe(plan)}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-[10px] hover:bg-green-600 transition-all shadow-md"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}