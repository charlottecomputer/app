"use server";

import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, TABLE_NAME } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";
import { revalidatePath } from "next/cache";
import type { Todo, TodosResponse, TodoActionResponse } from "@/types/todo";

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
    
    // Type-safe mapping with validation
    const todos: Todo[] = (response.Items || []).map((item) => ({
      userId: String(item.userId),
      todoId: String(item.todoId),
      content: String(item.content),
      completed: Boolean(item.completed),
      createdAt: String(item.createdAt),
    }));
    
    return { todos };
  } catch (error) {
    console.error("Failed to get todos:", error);
    return { 
      todos: [], 
      error: error instanceof Error ? error.message : "Failed to fetch todos" 
    };
  }
}

export async function createTodo(content: string): Promise<TodoActionResponse> {
  try {
    // Input validation
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Content is required" };
    }
    
    if (content.length > 500) {
      return { success: false, error: "Content cannot exceed 500 characters" };
    }

    const userId = await getCurrentUserId();
    const todoId = crypto.randomUUID();
    
    const todo: Todo = {
      userId,
      todoId,
      content: content.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
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
