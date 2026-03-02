import AppLayout from "@/components/layout/AppLayout"; // Keep this if AppLayout is in root components
import VisibilityScoreCard from "./VisibilityScoreCard"; // FIXED: Use ./ for same folder
import ScoreBreakdown from "./ScoreBreakdown";           // FIXED
import Badges from "./Badges";                           // FIXED
import Charts from "./Charts";                           // FIXED

export default function DashboardComponent() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <VisibilityScoreCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScoreBreakdown />
          <Badges />
        </div>
        <Charts />
      </div>
    </AppLayout>
  );
}