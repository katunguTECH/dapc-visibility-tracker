export default function SignUpPage() {
  const plans = [
    {
      name: "Starter Listing",
      price: "KES 1,999",
      slug: "starter",
    },
    {
      name: "Local Boost",
      price: "KES 3,999",
      slug: "local-boost",
    },
    {
      name: "Growth Engine",
      price: "KES 5,999",
      slug: "growth-engine",
    },
    {
      name: "Market Leader",
      price: "KES 7,999",
      slug: "market-leader",
    },
    {
      name: "Super Active Visibility",
      price: "KES 10,000",
      slug: "super-active",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Choose Your Visibility Plan
      </h1>

      <p className="text-gray-600 mb-12 text-center max-w-xl">
        Select the subscription that best fits your business growth goals.
      </p>

      <div className="grid gap-8 w-full max-w-4xl md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.slug}
            className="border rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-2xl font-bold mb-6">{plan.price}</p>

            <Link
              href={`/checkout?plan=${plan.slug}`}
              className="block text-center bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Select Plan
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}