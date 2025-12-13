"use server";

import { getKeyResults } from "./key-results-actions";
import type { KeyResult } from "@/types/key-results";

/**
 * Get today's todos (limited to first 3 for preview cards)
 */
export async function getTodayKeyResults(limit: number = 3): Promise<KeyResult[]> {
  try {
    const { keyResults, error } = await getKeyResults();

    if (error || !keyResults) {
      console.error("Failed to fetch keyResults:", error);
      return [];
    }

    // For now, return all todos since we don't have date filtering
    // In the future, filter by today's date based on createdAt or a dueDate field
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return keyResults
      .slice(0, limit); // Limit to specified number
  } catch (error) {
    console.error("Failed to get today's keyResults:", error);
    return [];
  }
}
