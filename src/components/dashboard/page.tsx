import AppLayout from "@/components/layout/AppLayout";
import VisibilityScoreCard from "@/components/dashboard/VisibilityScoreCard";
import ScoreBreakdown from "@/components/dashboard/ScoreBreakdown";
import Badges from "@/components/dashboard/Badges";
import Charts from "@/components/dashboard/Charts";

export default function DashboardPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <VisibilityScoreCard />
      <ScoreBreakdown />
      <Charts />
      <Badges />
    </AppLayout>
  );
}