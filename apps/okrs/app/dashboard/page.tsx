import { getKeyResults } from "@/actions/key-results-actions";
import { getUserProfile } from "@/actions/user-actions";
import { TodayView } from "@/components/today-view";
import { Text } from "@aliveui";
import { redirect } from "next/navigation";
import { KeyResult } from "@/types/key-results";

export default async function DashboardPage() {
  const { keyResults, objectives = [], error } = await getKeyResults();

  if (error === "Unauthorized") {
    redirect("/login");
  }

  const user = await getUserProfile();

  // Group keyResults by project
  const keyResultsByObjective = keyResults.reduce((acc, keyResult) => {
    if (keyResult.projectId) {
      if (!acc[keyResult.projectId]) acc[keyResult.projectId] = [];
      acc[keyResult.projectId].push(keyResult);
    }
    return acc;
  }, {} as Record<string, KeyResult[]>);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {user?.name?.[0] || "U"}
        </div>
        <div>
          <Text variant="regular" className="text-sm text-muted-foreground">Welcome back</Text>
          <Text variant="regular" className="ml-2 font-bold">{user?.name || "User"}</Text>
        </div>
      </div>

      {/* Today View */}
      <section>
        <TodayView keyResults={keyResults} objectives={objectives} />
      </section>

    </div>
  );
}
