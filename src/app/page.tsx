import BusinessSearch from "../components/BusinessSearch";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm">
        <div className="text-2xl font-bold text-blue-600">
          DAPC Tracker
        </div>
        <div className="space-x-6 hidden md:block">
          <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
          <a href="#search" className="text-gray-600 hover:text-blue-600">AI Search</a>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="search"
        className="max-w-4xl mx-auto pt-20 pb-16 px-4 text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Track Your Business{" "}
          <span className="text-blue-600">Visibility</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Search any business to see their digital footprint and lead potential.
        </p>

        <BusinessSearch />
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 px-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">📡 Total Exposure</h2>
            <p className="text-gray-600">
              Analyze how many people see your brand across all digital channels.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">📈 Lead Tracker</h2>
            <p className="text-gray-600">
              Real-time data on incoming inquiries and conversion potential.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Best Value</h2>
          <div className="border rounded-2xl p-10 shadow-lg inline-block">
            <h3 className="text-2xl font-bold mb-4">💎 Pro Plan</h3>
            <p className="text-gray-600 mb-6">
              Unlimited searches and automated reporting for agencies.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
              Upgrade Now →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-gray-100 py-6 text-center text-gray-500">
        © 2026 DAPC Visibility Tracker. All rights reserved.
      </footer>
    </div>
  );
}