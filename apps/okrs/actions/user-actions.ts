"use server";

import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, USERS_TABLE_NAME } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";

async function getCurrentUserId() {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");

  try {
    const command = new GetUserCommand({ AccessToken: token });
    const response = await cognitoClient.send(command);
    return response.Username; // This is the userId
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Unauthorized");
  }
}

/**
 * Sync user from Cognito to DynamoDB
 * Call this after login/signup to ensure the user exists in our database
 */
export async function syncUser(userId: string, email: string, name?: string) {
  try {
    // Check if user already exists
    const getCommand = new GetCommand({
      TableName: USERS_TABLE_NAME,
      Key: { userId },
    });

    const existingUser = await dynamoDb.send(getCommand);
    
    if (!existingUser.Item) {
      // Create new user
      const putCommand = new PutCommand({
        TableName: USERS_TABLE_NAME,
        Item: {
          userId,
          email,
          name: name || email.split("@")[0], // Default name from email
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      await dynamoDb.send(putCommand);
    }
  } catch (error) {
    console.error("Failed to sync user:", error);
  }
}

/**
 * Get user profile from DynamoDB
 */
export async function getUserProfile() {
  try {
    const userId = await getCurrentUserId();
    
    const command = new GetCommand({
      TableName: USERS_TABLE_NAME,
      Key: { userId },
    });

    const response = await dynamoDb.send(command);
    return response.Item || null;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return null;
  }
}
