import Link from "next/link";
import BusinessSearch from "@/components/businesssearch";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Track Your Business Visibility
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover your digital footprint and lead potential with our AI-powered analyzer.
        </p>

        {/* CTA Button */}
        <Link
          href="#business-search"
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Analyze Now
        </Link>
      </section>

      {/* Business Search Section */}
      <section
        id="business-search"
        className="w-full max-w-6xl px-6 py-16 bg-white rounded-xl shadow-lg -mt-12"
      >
        <BusinessSearch />
      </section>

      {/* Features / Benefits Section */}
      <section className="w-full max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-12">
        <div className="bg-blue-50 p-8 rounded-xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-gray-700">
            Get accurate competitor analysis, reach estimates, and SEO metrics instantly.
          </p>
        </div>
        <div className="bg-blue-50 p-8 rounded-xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">Visual Comparison</h3>
          <p className="text-gray-700">
            Compare your reach against top competitors with powerful charts and visuals.
          </p>
        </div>
        <div className="bg-blue-50 p-8 rounded-xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
          <p className="text-gray-700">
            Simply enter your business name and see instant results — no technical skills required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} DAPC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Exposure
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Leads
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}