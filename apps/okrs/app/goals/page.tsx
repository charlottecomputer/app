import { getTasks } from "@/actions/todo-actions";
import { getUserProfile } from "@/actions/user-actions";
import { GoalsAccordion } from "@/components/goals-accordion";
import { Text } from "@aliveui";
import { redirect } from "next/navigation";
import { Task } from "@/types/todo";

export default async function GoalsPage() {
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
        <div className="flex flex-col gap-8 p-6 max-w-screen overflow-x-hidden mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <Text variant="h1" className="text-3xl font-bold">Goals</Text>
                </div>
            </div>

            {/* Goals Accordion */}
            <GoalsAccordion projects={projects} tasksByProject={tasksByProject} />
        </div>
    );
}
