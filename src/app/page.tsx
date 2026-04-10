// src/app/page.tsx

export default function Home() {
  const plans = [
    {
      name: "Starter Listing",
      price: "KES 1999",
      icon: "/icons/starter-cheetah.jpg",
    },
    {
      name: "Local Boost",
      price: "KES 3999",
      icon: "/icons/boost-buffalo.jpg",
    },
    {
      name: "Growth Engine",
      price: "KES 5999",
      icon: "/icons/growthengine-rhino.jpg",
    },
    {
      name: "Market Leader",
      price: "KES 7999",
      icon: "/icons/marketleader-elephant.jpg",
    },
    {
      name: "Super Visibility",
      price: "KES 10000",
      icon: "/icons/superactivevisibility-lion.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center px-4">

      {/* NAV */}
      <nav className="w-full max-w-6xl flex justify-between items-center py-5 border-b">
        <h1 className="text-2xl font-bold">DAPC</h1>

        <div className="flex gap-6 text-sm text-gray-700">
          <span>Home</span>
          <span>Exposure</span>
          <span>Leads</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center mt-12 max-w-2xl">
        <h2 className="text-4xl font-bold leading-tight">
          Is Your Business <br /> Visible Online?
        </h2>

        <p className="text-gray-600 mt-4">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <input
            className="border rounded-md px-4 py-2 w-80"
            placeholder="Enter business name (e.g. Langata Hospital)"
          />

          <button className="bg-black text-white px-6 py-2 rounded-md">
            Run Audit
          </button>
        </div>
      </section>

      {/* PRICING */}
      <section className="mt-16 w-full max-w-6xl">
        <h3 className="text-2xl font-semibold text-center mb-8">
          Choose Your Growth Tier
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">

          {plans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
            >

              {/* ICON (SAFE) */}
              <img
                src={plan.icon}
                alt={plan.name}
                className="w-14 h-14 mb-3 rounded-full object-cover"
              />

              {/* PLAN NAME */}
              <h4 className="font-semibold text-md">{plan.name}</h4>

              {/* PRICE */}
              <p className="text-gray-700 mt-2">{plan.price}</p>

              {/* BUTTON */}
              <button className="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm">
                Subscribe
              </button>

            </div>
          ))}

        </div>
      </section>

    </main>
  );
}