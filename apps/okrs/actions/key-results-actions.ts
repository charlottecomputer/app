"use server";

import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, KEY_RESULTS_TABLE } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";
import { revalidatePath } from "next/cache";
import type {
  KeyResult, KeyResultsResponse, KeyResultsActionResponse,
  CreateKeyResultInput, UpdateKeyResultInput
} from "@/types/key-results";

async function getCurrentUserId(): Promise<string> {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");

  try {
    const command = new GetUserCommand({ AccessToken: token });
    const response = await cognitoClient.send(command);
    if (!response.Username) {
      throw new Error("User ID not found");
    }
    return response.Username; // This is the 'sub' (userId)
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Unauthorized");
  }
}

export async function getKeyResults(): Promise<KeyResultsResponse> {
  try {
    const userId = await getCurrentUserId();

    const command = new QueryCommand({
      TableName: KEY_RESULTS_TABLE,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    const response = await dynamoDb.send(command);
    const items = response.Items || [];

    const keyResults: KeyResult[] = [];

    items.forEach((item) => {
      if (item.type !== 'objective') {
        // Assume everything else is a KeyResult (formerly tasks/subtasks)
        // We map legacy fields to new fields if necessary
        keyResults.push({
          userId: String(item.userId),
          keyResultId: String(item.id),
          content: String(item.content),
          completed: Boolean(item.completed),
          createdAt: String(item.createdAt),

          requiredTouches: item.requiredTouches || 1,
          currentTouches: item.currentTouches || 0,

          projectId: item.projectId,
          icon: item.icon || item.emoji, // Map legacy emoji to icon
          unit: item.unit,
          color: item.color,

          lastCompletedAt: item.lastCompletedAt,
          recurrence: item.recurrence,
          dueDate: item.dueDate,
          priority: item.priority,
          reminders: item.reminders,
          type: 'keyResult',
          frequency: item.frequency
        });
      }
    });

    // Check for recurring keyResults that need to be reset
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasksToReset: KeyResult[] = [];

    keyResults.forEach(task => {
      if (task.recurrence && task.completed && task.lastCompletedAt) {
        const lastCompleted = new Date(task.lastCompletedAt);
        lastCompleted.setHours(0, 0, 0, 0);

        if (lastCompleted.getTime() < today.getTime()) {
          // Completed before today. Check if it should be active today.
          let shouldReset = false;
          const { type, days } = task.recurrence;
          const dayOfWeek = today.getDay();

          if (type === 'daily') shouldReset = true;
          else if (type === 'weekdays') shouldReset = dayOfWeek >= 1 && dayOfWeek <= 5;
          else if (type === 'weekly' && days?.includes(dayOfWeek)) shouldReset = true;
          else if (type === 'monthly') shouldReset = today.getDate() === (task.recurrence.dayOfMonth || new Date(task.createdAt).getDate());
          else if (type === 'yearly') {
            const created = new Date(task.createdAt);
            shouldReset = today.getDate() === created.getDate() && today.getMonth() === created.getMonth();
          }

          if (shouldReset) {
            tasksToReset.push(task);
          }
        }
      }
    });

    // Perform resets
    if (tasksToReset.length > 0) {
      await Promise.all(tasksToReset.map(async (task) => {
        // Reset task in memory
        task.completed = false;
        task.currentTouches = 0;

        // Update KeyResult in DB
        await updateKeyResult({
          keyResultId: task.keyResultId,
          completed: false,
          currentTouches: 0
        });
      }));
    }

    return { keyResults, objectives: [] };
  } catch (error) {
    console.error("Failed to get keyResults:", error);
    return {
      keyResults: [],
      objectives: [],
      error: error instanceof Error ? error.message : "Failed to fetch keyResults"
    };
  }
}



export async function createKeyResult(input: CreateKeyResultInput): Promise<KeyResultsActionResponse> {
  try {
    if (!input.content || input.content.trim().length === 0) {
      return { success: false, error: "Content is required" };
    }

    const userId = await getCurrentUserId();
    const keyResultId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const keyResult: any = {
      userId,
      id: keyResultId, // Store keyResultId in id field
      content: input.content.trim(),
      completed: false,
      createdAt,

      projectId: input.projectId,
      icon: input.icon,
      unit: input.unit,
      color: input.color,

      requiredTouches: input.requiredTouches || 1,
      currentTouches: 0,

      recurrence: input.recurrence,
      dueDate: input.dueDate,
      priority: input.priority,
      reminders: input.reminders,
      frequency: input.frequency,

      type: 'keyResult'
    };

    await dynamoDb.send(new PutCommand({
      TableName: KEY_RESULTS_TABLE,
      Item: keyResult,
    }));

    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to create keyResult:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create keyResult"
    };
  }
}

export async function updateKeyResult(input: UpdateKeyResultInput): Promise<KeyResultsActionResponse> {
  try {
    if (!input.keyResultId) {
      return { success: false, error: "KeyResult ID is required" };
    }

    const userId = await getCurrentUserId();

    // Build update expression dynamically
    let updateExpression = "set updatedAt = :updatedAt";
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames: Record<string, string> = {};

    if (input.content !== undefined) {
      updateExpression += ", content = :content";
      expressionAttributeValues[":content"] = input.content.trim();
    }

    if (input.completed !== undefined) {
      updateExpression += ", completed = :completed";
      expressionAttributeValues[":completed"] = input.completed;

      if (input.completed) {
        updateExpression += ", lastCompletedAt = :lastCompletedAt";
        expressionAttributeValues[":lastCompletedAt"] = new Date().toISOString();
      }
    }

    if (input.currentTouches !== undefined) {
      updateExpression += ", currentTouches = :currentTouches";
      expressionAttributeValues[":currentTouches"] = input.currentTouches;
    }

    if (input.requiredTouches !== undefined) {
      updateExpression += ", requiredTouches = :requiredTouches";
      expressionAttributeValues[":requiredTouches"] = input.requiredTouches;
    }

    if (input.icon !== undefined) {
      updateExpression += ", icon = :icon";
      expressionAttributeValues[":icon"] = input.icon;
    }

    if (input.projectId !== undefined) {
      updateExpression += ", projectId = :projectId";
      expressionAttributeValues[":projectId"] = input.projectId;
    }

    if (input.recurrence !== undefined) {
      updateExpression += ", recurrence = :recurrence";
      expressionAttributeValues[":recurrence"] = input.recurrence;
    }

    if (input.dueDate !== undefined) {
      updateExpression += ", dueDate = :dueDate";
      expressionAttributeValues[":dueDate"] = input.dueDate;
    }

    if (input.priority !== undefined) {
      updateExpression += ", priority = :priority";
      expressionAttributeValues[":priority"] = input.priority;
    }

    if (input.reminders !== undefined) {
      updateExpression += ", reminders = :reminders";
      expressionAttributeValues[":reminders"] = input.reminders;
    }

    if (input.unit !== undefined) {
      updateExpression += ", unit = :unit";
      expressionAttributeValues[":unit"] = input.unit;
    }

    if (input.color !== undefined) {
      updateExpression += ", color = :color";
      expressionAttributeValues[":color"] = input.color;
    }

    if (input.frequency !== undefined) {
      updateExpression += ", frequency = :frequency";
      expressionAttributeValues[":frequency"] = input.frequency;
    }

    const command = new UpdateCommand({
      TableName: KEY_RESULTS_TABLE,
      Key: { userId, id: input.keyResultId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update keyResult:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update keyResult"
    };
  }
}

export async function deleteKeyResult(keyResultId: string): Promise<KeyResultsActionResponse> {
  try {
    if (!keyResultId) {
      return { success: false, error: "KeyResult ID is required" };
    }

    const userId = await getCurrentUserId();

    const command = new DeleteCommand({
      TableName: KEY_RESULTS_TABLE,
      Key: { userId, id: keyResultId },
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete keyResult:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete keyResult"
    };
  }
}



export async function getDailyProgress(): Promise<{ total: number; completed: number }> {
  try {
    const { keyResults } = await getKeyResults();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = keyResults.filter(task => {
      // 1. Check specific due date
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }

      // 2. Check recurrence
      if (task.recurrence) {
        const { type, days } = task.recurrence;
        const dayOfWeek = today.getDay(); // 0 = Sunday

        if (type === 'daily') return true;
        if (type === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
        if (type === 'weekly' && days?.includes(dayOfWeek)) return true;
        if (type === 'monthly') return today.getDate() === (task.recurrence.dayOfMonth || new Date(task.createdAt).getDate());
        if (type === 'yearly') {
          const created = new Date(task.createdAt);
          return today.getDate() === created.getDate() && today.getMonth() === created.getMonth();
        }
      }

      return false;
    });

    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;

    return { total, completed };
  } catch (error) {
    console.error("Failed to get daily progress:", error);
    return { total: 0, completed: 0 };
  }
}
