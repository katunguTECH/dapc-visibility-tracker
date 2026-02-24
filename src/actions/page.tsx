import AppLayout from "@/components/layout/AppLayout";
import { actionCenterData, recommendationsData } from "@/data/mockData";

export default function ActionCenterPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">DAPC Action Center</h1>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Active Work</h2>
          <ul className="list-disc list-inside">
            {actionCenterData.map((task) => (
              <li key={task.task}>
                {task.task} —{" "}
                <span
                  className={`${
                    task.status === "Completed"
                      ? "text-green-600"
                      : task.status === "In Progress"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Recommendations</h2>
          <ul className="list-disc list-inside">
            {recommendationsData.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}