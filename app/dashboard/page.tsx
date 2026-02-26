import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import SearchBar from "@/components/SearchBar";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get all businesses this user belongs to
  const memberships = await prisma.businessUser.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    include: {
      business: {
        include: {
          subscriptions: true,
        },
      },
    },
  });

  const businesses = memberships.map((membership) => {
    const subscription = membership.business.subscriptions[0];

    return {
      id: membership.business.id,
      name: membership.business.name,
      slug: membership.business.slug,
      role: membership.role,
      subscriptionStatus: subscription?.status ?? "none",
    };
  });

  return (
    <AppLayout>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-bold mb-6">Your Businesses</h1>

      {businesses.length === 0 ? (
        <div className="p-6 border rounded-2xl bg-white shadow-sm">
          <p className="text-gray-500">
            You don’t belong to any businesses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="p-6 bg-white rounded-2xl shadow-sm border"
            >
              <h2 className="text-lg font-semibold mb-2">
                {business.name}
              </h2>

              <p className="text-sm text-gray-500 mb-1">
                Slug: {business.slug}
              </p>

              <p className="text-sm mb-1">
                Role:{" "}
                <span className="font-medium">
                  {business.role}
                </span>
              </p>

              <p
                className={`text-sm font-medium ${
                  business.subscriptionStatus === "active"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                Subscription: {business.subscriptionStatus}
              </p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}