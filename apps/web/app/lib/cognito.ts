import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

// Cognito configuration from environment variables
export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
};

// Validate configuration
if (!cognitoConfig.region || !cognitoConfig.userPoolId || !cognitoConfig.clientId) {
  throw new Error(
    "Missing required Cognito configuration. Please check your .env.local file."
  );
}

// Create and export the Cognito client
export const cognitoClient = new CognitoIdentityProviderClient({
  region: cognitoConfig.region,
});
