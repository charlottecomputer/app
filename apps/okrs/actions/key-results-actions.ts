"use server";

import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, TABLE_NAME } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";
import { revalidatePath } from "next/cache";
import type {
  KeyResult, Objective, Subtask, KeyResultsResponse, KeyResultsActionResponse,
  CreateKeyResultInput, CreateProjectInput, UpdateKeyResultInput, UpdateProjectInput,
  UpdateKeyResultInput
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
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    const response = await dynamoDb.send(command);
    const items = response.Items || [];

    const keyResults: KeyResult[] = [];
    const objectives: Objective[] = [];
    const subtasks: Subtask[] = [];

    items.forEach((item) => {
      if (item.type === 'objective') {
        objectives.push({
          userId: String(item.userId),
          projectId: String(item.todoId), // stored as todoId
          name: String(item.name),
          icon: item.icon,
          color: item.color,
          createdAt: String(item.createdAt),
          type: 'objective'
        });
      } else if (item.type === 'subtask') {
        keyResults.push({
          keyResultId: String(item.todoId), // stored as todoId
          keyResultId: item.keyResultId,
          content: String(item.content),
          completed: Boolean(item.completed),
          requiredTouches: item.requiredTouches || 1,
          currentTouches: item.currentTouches || 0,
          createdAt: String(item.createdAt),
          icon: item.icon,
          unit: item.unit,
          color: item.color,
          frequency: item.frequency,
        });
      } else {
        // Assume 'todo' or 'task' or undefined is a KeyResult
        keyResults.push({
          userId: String(item.userId),
          keyResultId: String(item.todoId),
          content: String(item.content),
          completed: Boolean(item.completed),
          createdAt: String(item.createdAt),
          projectId: item.projectId,
          icon: item.icon,
          lastCompletedAt: item.lastCompletedAt,
          recurrence: item.recurrence,
          dueDate: item.dueDate,
          priority: item.priority,
          reminders: item.reminders,
          type: 'task',
          subtasks: [] // Will populate below
        });
      }
    });

    // Nest subtasks into keyResults
    subtasks.forEach(subtask => {
      const task = keyResults.find(t => t.keyResultId === subtask.keyResultId);
      if (task) {
        task.subtasks = task.subtasks || [];
        task.subtasks.push(subtask);
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

        // Reset subtasks in memory
        if (task.subtasks) {
          task.subtasks.forEach(sub => {
            sub.completed = false;
            sub.currentTouches = 0;
          });
        }

        // Update KeyResult in DB
        await updateTask({
          keyResultId: task.keyResultId,
          completed: false
        });

        // Update Subtasks in DB
        if (task.subtasks) {
          await Promise.all(task.subtasks.map(sub => updateSubtask({
            subtaskId: sub.subtaskId,
            keyResultId: task.keyResultId,
            completed: false,
            currentTouches: 0
          })));
        }
      }));
    }

    return { keyResults, objectives };
  } catch (error) {
    console.error("Failed to get keyResults:", error);
    return {
      keyResults: [],
      objectives: [],
      error: error instanceof Error ? error.message : "Failed to fetch keyResults"
    };
  }
}

export async function createProject(input: CreateProjectInput): Promise<KeyResultsActionResponse> {
  try {
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Objective name is required" };
    }

    const userId = await getCurrentUserId();
    const projectId = `PROJECT#${crypto.randomUUID()}`;

    const objective: Objective = {
      userId,
      projectId,
      name: input.name.trim(),
      icon: input.icon,
      color: input.color,
      createdAt: new Date().toISOString(),
      type: 'objective'
    };

    const item = {
      ...objective,
      todoId: projectId, // Store projectId in todoId field
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create objective:", error);
    return { success: false, error: "Failed to create objective" };
  }
}

export async function createTask(input: CreateKeyResultInput): Promise<KeyResultsActionResponse> {
  try {
    if (!input.content || input.content.trim().length === 0) {
      return { success: false, error: "Content is required" };
    }

    const userId = await getCurrentUserId();
    const keyResultId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const task: any = {
      userId,
      todoId: keyResultId, // Store keyResultId in todoId field
      content: input.content.trim(),
      completed: false,
      createdAt,
      projectId: input.projectId,
      icon: input.icon,
      recurrence: input.recurrence,
      dueDate: input.dueDate,
      priority: input.priority,
      reminders: input.reminders,
      type: 'task'
    };

    // Create KeyResult
    await dynamoDb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: task,
    }));

    // Create Subtasks if any
    if (input.subtasks && input.subtasks.length > 0) {
      for (const sub of input.subtasks) {
        const subtaskId = `SUBTASK#${crypto.randomUUID()}`;
        const subtaskItem = {
          userId,
          todoId: subtaskId,
          keyResultId,
          content: sub.content,
          requiredTouches: sub.requiredTouches,
          currentTouches: 0,
          completed: false,
          createdAt,
          icon: sub.icon,
          type: 'subtask'
        };
        await dynamoDb.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: subtaskItem
        }));
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task"
    };
  }
}

export async function createSubtask(keyResultId: string, content: string, requiredTouches: number = 1, icon?: string, unit?: string, color?: string, frequency?: number[]): Promise<KeyResultsActionResponse> {
  try {
    const userId = await getCurrentUserId();
    const subtaskId = `SUBTASK#${crypto.randomUUID()}`;

    const subtaskItem = {
      userId,
      todoId: subtaskId,
      keyResultId,
      content,
      requiredTouches,
      currentTouches: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      icon,
      unit,
      color,
      frequency,
      type: 'subtask'
    };

    await dynamoDb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: subtaskItem
    }));

    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return { success: false, error: "Failed to create subtask" };
  }
}

export async function createOrphanSubtask(content: string, requiredTouches: number = 1, icon?: string, unit?: string, color?: string, frequency?: number[]): Promise<KeyResultsActionResponse> {
  try {
    const userId = await getCurrentUserId();

    // 1. Find existing "Daily Inbox" task
    const { keyResults } = await getKeyResults();
    let inboxTask = keyResults.find(t => t.content === "Daily Inbox" && t.recurrence?.type === 'daily');

    let keyResultId = inboxTask?.keyResultId;

    // 2. If not found, create it
    if (!keyResultId) {
      const newTaskId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newTask = {
        userId,
        todoId: newTaskId,
        content: "Daily Inbox",
        completed: false,
        createdAt,
        projectId: "inbox", // Default to inbox objective
        icon: "📥",
        recurrence: { type: 'daily' }, // Recur daily so it's always "today"
        dueDate: today.toISOString(),
        type: 'task'
      };

      await dynamoDb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newTask
      }));

      keyResultId = newTaskId;
    }

    // 3. Create the subtask linked to this task
    return await createSubtask(keyResultId, content, requiredTouches, icon, unit, color, frequency);

  } catch (error) {
    console.error("Failed to create orphan subtask:", error);
    return { success: false, error: "Failed to create orphan subtask" };
  }
}

export async function updateSubtask(input: UpdateKeyResultInput): Promise<KeyResultsActionResponse> {
  try {
    const userId = await getCurrentUserId();

    let updateExpression = "set updatedAt = :updatedAt";
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };

    if (input.content !== undefined) {
      updateExpression += ", content = :content";
      expressionAttributeValues[":content"] = input.content;
    }
    if (input.completed !== undefined) {
      updateExpression += ", completed = :completed";
      expressionAttributeValues[":completed"] = input.completed;
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

    await dynamoDb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId: input.subtaskId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    // Check if all subtasks are complete to complete the parent task?
    // Or let the client handle that? 
    // For now, let's just update the subtask.

    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update subtask:", error);
    return { success: false, error: "Failed to update subtask" };
  }
}

export async function deleteSubtask(subtaskId: string): Promise<KeyResultsActionResponse> {
  try {
    const userId = await getCurrentUserId();

    await dynamoDb.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId: subtaskId }
    }));

    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    return { success: false, error: "Failed to delete subtask" };
  }
}

export async function updateTask(input: UpdateKeyResultInput): Promise<KeyResultsActionResponse> {
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

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId: input.keyResultId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task"
    };
  }
}

export async function deleteTask(keyResultId: string): Promise<KeyResultsActionResponse> {
  try {
    if (!keyResultId) {
      return { success: false, error: "KeyResult ID is required" };
    }

    const userId = await getCurrentUserId();

    // TODO: Should also delete subtasks. 
    // For now, just delete the task. Subtasks will be orphaned (or we can query and delete).

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId: keyResultId },
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task"
    };
  }
}

export async function updateProject(input: UpdateProjectInput): Promise<KeyResultsActionResponse> {
  try {
    if (!input.projectId) {
      return { success: false, error: "Objective ID is required" };
    }

    const userId = await getCurrentUserId();

    // Build update expression dynamically
    let updateExpression = "set updatedAt = :updatedAt";
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames: Record<string, string> = {};

    if (input.name !== undefined) {
      updateExpression += ", #name = :name";
      expressionAttributeValues[":name"] = input.name.trim();
      expressionAttributeNames["#name"] = "name"; // name is reserved keyword
    }

    if (input.icon !== undefined) {
      updateExpression += ", icon = :icon";
      expressionAttributeValues[":icon"] = input.icon;
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
      TableName: TABLE_NAME,
      Key: { userId, todoId: input.projectId }, // projectId is stored in todoId field
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to update objective:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update objective"
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
    // A task is completed if it is marked completed.
    // The client/action logic should ensure task.completed is true when all subtasks are done.
    const completed = todayTasks.filter(t => t.completed).length;

    return { total, completed };
  } catch (error) {
    console.error("Failed to get daily progress:", error);
    return { total: 0, completed: 0 };
  }
}
