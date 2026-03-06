import BusinessSearch from "@/components/BusinessSearch";

export default function LandingPage() {
  return (
    <main className="p-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold">Track Your Business Visibility</h1>
        <p className="mt-2 text-gray-600">
          Search any business to see their digital footprint and lead potential.
        </p>
      </section>

      {/* Search Component */}
      <BusinessSearch />
    </main>
  );
}