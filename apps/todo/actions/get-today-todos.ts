"use server";

import { getTodos } from "./todo-actions";
import type { Todo } from "@/types/todo";

/**
 * Get today's todos (limited to first 3 for preview cards)
 */
export async function getTodayTodos(limit: number = 3): Promise<Todo[]> {
  try {
    const { todos, error } = await getTodos();
    
    if (error || !todos) {
      console.error("Failed to fetch todos:", error);
      return [];
    }
    
    // For now, return all todos since we don't have date filtering
    // In the future, filter by today's date based on createdAt or a dueDate field
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return todos
      .slice(0, limit); // Limit to specified number
  } catch (error) {
    console.error("Failed to get today's todos:", error);
    return [];
  }
}
