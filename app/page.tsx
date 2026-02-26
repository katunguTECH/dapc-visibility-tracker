import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default async function HomePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center px-6">
      
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Meet Your DAPC AI Assistant
        </h1>

        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Ask about your businesses, subscriptions, performance,
          or anything related to your DAPC account.
        </p>
      </div>

      {/* AI Assistant */}
      <div className="w-full max-w-3xl">
        <SearchBar />
      </div>

    </main>
  );
}