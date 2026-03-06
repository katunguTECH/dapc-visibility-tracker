import BusinessSearch from "@/components/BusinessSearch";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">
        Track Your Business Visibility
      </h1>

      <p className="text-gray-600 mb-8">
        Search any business to see their digital footprint and lead potential.
      </p>

      <BusinessSearch />
    </div>
  );
}