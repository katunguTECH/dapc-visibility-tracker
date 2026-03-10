import BusinessSearch from "@/components/BusinessSearch";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ExposurePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Visibility Exposure Analysis</h1>
      
      <div className="grid gap-8">
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Analyze New Business</h2>
          <div className="max-w-md">
            <BusinessSearch />
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-center">
            Your tracking data and analytics will appear here after a search is completed.
          </p>
        </section>
      </div>
    </div>
  );
}