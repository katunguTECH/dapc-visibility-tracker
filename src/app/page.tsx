// src/app/page.tsx

export default function Home() {
  const plans = [
    {
      name: "Starter Listing",
      price: "KES 1999",
    },
    {
      name: "Local Boost",
      price: "KES 3999",
    },
    {
      name: "Growth Engine",
      price: "KES 5999",
    },
    {
      name: "Market Leader",
      price: "KES 7999",
    },
    {
      name: "Super Visibility",
      price: "KES 10000",
      icon: "/icons/superactivevisibility-lion.jpg", // ✅ correct path
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4">
      
      {/* NAV */}
      <nav className="w-full max-w-5xl flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">DAPC</h1>
        <div className="flex gap-6 text-sm">
          <span>Home</span>
          <span>Exposure</span>
          <span>Leads</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center mt-10">
        <h2 className="text-3xl font-bold mb-4">
          Is Your Business <br /> Visible Online?
        </h2>
        <p className="text-gray-600 mb-6">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        <input
          placeholder="Enter business name (e.g. Langata Hospital)"
          className="border px-4 py-2 w-80 rounded-md"
        />

        <div className="mt-4">
          <button className="bg-black text-white px-6 py-2 rounded-md">
            Run Audit
          </button>
        </div>
      </section>

      {/* PRICING */}
      <section className="mt-12 w-full max-w-5xl">
        <h3 className="text-xl font-semibold text-center mb-6">
          Choose Your Growth Tier
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 flex flex-col items-center text-center shadow-sm"
            >
              
              {/* ✅ ICON ONLY FOR SUPER VISIBILITY */}
              {plan.icon && (
                <img
                  src={plan.icon}
                  alt="Super Visibility"
                  className="w-12 h-12 mb-2"
                />
              )}

              <h4 className="font-semibold">{plan.name}</h4>
              <p className="mt-2">{plan.price}</p>

              <button className="mt-3 bg-black text-white px-4 py-1 rounded">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}