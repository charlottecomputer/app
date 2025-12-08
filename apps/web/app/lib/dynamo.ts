import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { cognitoConfig } from "./cognito";

const client = new DynamoDBClient({
  region: cognitoConfig.region,
  // Credentials are automatically loaded from:
  // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  // 2. Shared credentials file (~/.aws/credentials)
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "todos";
export const USERS_TABLE_NAME = "users";
