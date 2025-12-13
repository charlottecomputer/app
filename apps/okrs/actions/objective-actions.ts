"use server";

import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { dynamoDb, OBJECTIVES_TABLE } from "@/lib/dynamo";
import { cognitoClient } from "@/lib/cognito";
import { getSessionToken } from "./auth-actions";
import { revalidatePath } from "next/cache";
import type {
    Objective,
    KeyResultsActionResponse,
    createObjectiveInput,
    UpdateObjectiveInput
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

export async function getObjectives(): Promise<{ objectives: Objective[]; error?: string }> {
    try {
        const userId = await getCurrentUserId();

        const command = new QueryCommand({
            TableName: OBJECTIVES_TABLE,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        });

        const response = await dynamoDb.send(command);
        const items = response.Items || [];

        const objectives: Objective[] = [];

        items.forEach((item) => {
            if (item.type === 'objective') {
                objectives.push({
                    userId: String(item.userId),
                    projectId: String(item.id), // stored as id
                    name: String(item.name),
                    icon: item.icon,
                    color: item.color,
                    createdAt: String(item.createdAt),
                    type: 'objective'
                });
            }
        });

        return { objectives };
    } catch (error) {
        console.error("Failed to get objectives:", error);
        return {
            objectives: [],
            error: error instanceof Error ? error.message : "Failed to fetch objectives"
        };
    }
}

export async function createObjective(input: createObjectiveInput): Promise<KeyResultsActionResponse> {
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
            id: projectId, // Store projectId in id field
        };

        const command = new PutCommand({
            TableName: OBJECTIVES_TABLE,
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

export async function updateObjective(input: UpdateObjectiveInput): Promise<KeyResultsActionResponse> {
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

        const command = new UpdateCommand({
            TableName: OBJECTIVES_TABLE,
            Key: { userId, id: input.projectId }, // projectId is stored in id field
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

export async function deleteObjective(projectId: string): Promise<KeyResultsActionResponse> {
    try {
        if (!projectId) {
            return { success: false, error: "Objective ID is required" };
        }

        const userId = await getCurrentUserId();

        const command = new DeleteCommand({
            TableName: OBJECTIVES_TABLE,
            Key: { userId, id: projectId },
        });

        await dynamoDb.send(command);
        revalidatePath("/dashboard");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete objective:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete objective"
        };
    }
}
