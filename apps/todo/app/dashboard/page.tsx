import { getTasks } from "@/actions/todo-actions";
import { getUserProfile } from "@/actions/user-actions";
import { TodayView } from "@/components/today-view";
import { ProjectCard } from "@/components/project-card";
import { ProjectsSection } from "@/components/projects-section";
import { Text } from "@aliveui";
import { redirect } from "next/navigation";
import { Task } from "@/types/todo";

export default async function DashboardPage() {
  const { tasks, projects = [], error } = await getTasks();

  if (error === "Unauthorized") {
    redirect("/login");
  }

  const user = await getUserProfile();

  // Group tasks by project
  const tasksByProject = tasks.reduce((acc, task) => {
    if (task.projectId) {
      if (!acc[task.projectId]) acc[task.projectId] = [];
      acc[task.projectId].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {user?.name?.[0] || "U"}
        </div>
        <div>
          <Text variant="regular" className="text-sm text-muted-foreground">Welcome back</Text>
          <Text variant="h1" className="text-3xl font-bold">{user?.name || "User"}</Text>
        </div>
      </div>

      {/* Today View */}
      <section>
        <TodayView tasks={tasks} projects={projects} />
      </section>

      {/* Projects Grid */}
      <ProjectsSection projects={projects} tasksByProject={tasksByProject} />
    </div>
  );
}
