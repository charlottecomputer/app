"use server";

import { getKeyResults } from "./key-results-actions";
import type { KeyResult } from "@/types/key-results";

/**
 * Get today's todos (limited to first 3 for preview cards)
 */
export async function getTodayKeyResults(limit?: number): Promise<KeyResult[]> {
  try {
    const { keyResults, error } = await getKeyResults();

    if (error || !keyResults) {
      console.error("Failed to fetch keyResults:", error);
      return [];
    }

    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const todaysKeyResults = keyResults.filter(kr => {
      // 1. Check specific due date
      if (kr.dueDate && kr.dueDate.startsWith(dateString)) return true;

      // 2. Check recurrence
      if (kr.recurrence) {
        if (kr.recurrence.type === 'daily') return true;
        
        if (kr.recurrence.type === 'weekdays') {
          return dayIndex >= 1 && dayIndex <= 5;
        }

        if (kr.recurrence.type === 'weekly' && kr.frequency) {
          return kr.frequency.includes(dayIndex);
        }
      }

      // Default: if no recurrence/date, maybe don't show in "Today" unless it was created today?
      // For now, let's assume "Today" view is strictly for scheduled items.
      return false;
    });

    if (limit) {
      return todaysKeyResults.slice(0, limit);
    }

    return todaysKeyResults;
  } catch (error) {
    console.error("Failed to get today's keyResults:", error);
    return [];
  }
}
