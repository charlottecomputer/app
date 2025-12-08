"use server";

import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, TABLE_NAME } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";
import { revalidatePath } from "next/cache";
import type { Todo, Project, TodosResponse, TodoActionResponse, CreateTodoInput, CreateProjectInput, UpdateTodoInput, UpdateProjectInput } from "@/types/todo";

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

export async function getTodos(): Promise<TodosResponse> {
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

    const todos: Todo[] = [];
    const projects: Project[] = [];

    items.forEach((item) => {
      if (item.type === 'project') {
        projects.push({
          userId: String(item.userId),
          projectId: String(item.todoId), // We store projectId in todoId field for single table design
          name: String(item.name),
          emoji: item.emoji,
          color: item.color,
          createdAt: String(item.createdAt),
          type: 'project'
        });
      } else {
        todos.push({
          userId: String(item.userId),
          todoId: String(item.todoId),
          content: String(item.content),
          completed: Boolean(item.completed),
          createdAt: String(item.createdAt),
          projectId: item.projectId,
          requiredTouches: item.requiredTouches || 1,
          currentTouches: item.currentTouches || 0,
          emoji: item.emoji,
          recurrence: item.recurrence,
          type: 'todo'
        });
      }
    });

    return { todos, projects };
  } catch (error) {
    console.error("Failed to get todos:", error);
    return {
      todos: [],
      projects: [],
      error: error instanceof Error ? error.message : "Failed to fetch todos"
    };
  }
}

export async function createProject(input: CreateProjectInput): Promise<TodoActionResponse> {
  try {
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Project name is required" };
    }

    const userId = await getCurrentUserId();
    const projectId = `PROJECT#${crypto.randomUUID()}`;

    const project: Project = {
      userId,
      projectId, // This maps to todoId in DB
      name: input.name.trim(),
      emoji: input.emoji,
      color: input.color,
      createdAt: new Date().toISOString(),
      type: 'project'
    };

    // Map to DB schema where SK is todoId
    const item = {
      ...project,
      todoId: projectId, // Store projectId in todoId field
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function createTodo(input: CreateTodoInput): Promise<TodoActionResponse> {
  try {
    // Input validation
    if (!input.content || input.content.trim().length === 0) {
      return { success: false, error: "Content is required" };
    }

    if (input.content.length > 500) {
      return { success: false, error: "Content cannot exceed 500 characters" };
    }

    const userId = await getCurrentUserId();
    const todoId = crypto.randomUUID();

    const todo: Todo = {
      userId,
      todoId,
      content: input.content.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      projectId: input.projectId,
      requiredTouches: input.requiredTouches || 1,
      currentTouches: 0,
      emoji: input.emoji,
      recurrence: input.recurrence,
      dueDate: input.dueDate,
      priority: input.priority,
      reminders: input.reminders,
      type: 'todo'
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: todo,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to create todo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create todo"
    };
  }
}

export async function toggleTodo(todoId: string, completed: boolean): Promise<TodoActionResponse> {
  try {
    if (!todoId) {
      return { success: false, error: "Todo ID is required" };
    }

    const userId = await getCurrentUserId();

    // For simple toggle, we just set completed. 
    // For multi-touch, the client should calculate logic and call updateTodoProgress if needed, 
    // but for backward compatibility we keep this.

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId },
      UpdateExpression: "set completed = :completed",
      ExpressionAttributeValues: {
        ":completed": completed,
      },
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle todo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update todo"
    };
  }
}

export async function updateTodoProgress(todoId: string, currentTouches: number, completed: boolean): Promise<TodoActionResponse> {
  try {
    if (!todoId) {
      return { success: false, error: "Todo ID is required" };
    }

    const userId = await getCurrentUserId();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId },
      UpdateExpression: "set currentTouches = :currentTouches, completed = :completed",
      ExpressionAttributeValues: {
        ":currentTouches": currentTouches,
        ":completed": completed,
      },
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to update todo progress:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update todo"
    };
  }
}

export async function deleteTodo(todoId: string): Promise<TodoActionResponse> {
  try {
    if (!todoId) {
      return { success: false, error: "Todo ID is required" };
    }

    const userId = await getCurrentUserId();

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId, todoId },
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete todo"
    };
  }
}
export async function updateProject(input: UpdateProjectInput): Promise<TodoActionResponse> {
  try {
    if (!input.projectId) {
      return { success: false, error: "Project ID is required" };
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

    if (input.emoji !== undefined) {
      updateExpression += ", emoji = :emoji";
      expressionAttributeValues[":emoji"] = input.emoji;
    }

    if (input.color !== undefined) {
      updateExpression += ", color = :color";
      expressionAttributeValues[":color"] = input.color;
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

    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project"
    };
  }
}

export async function updateTodo(input: UpdateTodoInput): Promise<TodoActionResponse> {
  try {
    if (!input.todoId) {
      return { success: false, error: "Todo ID is required" };
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
    }

    if (input.currentTouches !== undefined) {
      updateExpression += ", currentTouches = :currentTouches";
      expressionAttributeValues[":currentTouches"] = input.currentTouches;
    }

    if (input.requiredTouches !== undefined) {
      updateExpression += ", requiredTouches = :requiredTouches";
      expressionAttributeValues[":requiredTouches"] = input.requiredTouches;
    }

    if (input.emoji !== undefined) {
      updateExpression += ", emoji = :emoji";
      expressionAttributeValues[":emoji"] = input.emoji;
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
      Key: { userId, todoId: input.todoId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await dynamoDb.send(command);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to update todo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update todo"
    };
  }
}
