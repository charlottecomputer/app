import { getTodos } from "@/actions/todo-actions";
import { getUserProfile } from "@/actions/user-actions";
import { TodoList } from "./todo-list";
import { Button, Card, CardContent } from "@aliveui";
import { X } from "lucide-react";

export default async function DashboardPage() {
  const { todos } = await getTodos();
  const user = await getUserProfile();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold">
          {user?.name?.[0] || "U"}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">My Tasks</p>
          <h1 className="text-3xl font-bold">Hi, {user?.name || "User"}</h1>
        </div>
      </div>

      {/* Todo List */}
      <div>
        <TodoList initialTodos={todos} />
      </div>
    </div>
  );
}
