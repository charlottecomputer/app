import {
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  type SignUpCommandInput,
  type InitiateAuthCommandInput,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, cognitoConfig } from "./cognito";

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, attributes?: Record<string, string>) {
  const username = self.crypto.randomUUID();
  const params: SignUpCommandInput = {
    ClientId: cognitoConfig.clientId,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      ...(attributes
        ? Object.entries(attributes).map(([Name, Value]) => ({ Name, Value }))
        : []),
    ],
  };

  const command = new SignUpCommand(params);
  const response = await cognitoClient.send(command);
  
  return {
    username,
    userSub: response.UserSub,
    userConfirmed: response.UserConfirmed,
    codeDeliveryDetails: response.CodeDeliveryDetails,
  };
}

/**
 * Confirm user sign up with verification code
 */
export async function confirmSignUp(email: string, code: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
    ConfirmationCode: code,
  });

  await cognitoClient.send(command);
  return { success: true };
}

/**
 * Sign in a user and get tokens
 */
export async function signIn(email: string, password: string) {
  const params: InitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: cognitoConfig.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(params);
  const response = await cognitoClient.send(command);

  if (!response.AuthenticationResult) {
    throw new Error("Authentication failed");
  }

  return {
    accessToken: response.AuthenticationResult.AccessToken!,
    idToken: response.AuthenticationResult.IdToken!,
    refreshToken: response.AuthenticationResult.RefreshToken!,
    expiresIn: response.AuthenticationResult.ExpiresIn!,
  };
}

/**
 * Sign out a user globally (invalidate all tokens)
 */
export async function signOut(accessToken: string) {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  await cognitoClient.send(command);
  return { success: true };
}

/**
 * Initiate forgot password flow
 */
export async function forgotPassword(email: string) {
  const command = new ForgotPasswordCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
  });

  const response = await cognitoClient.send(command);
  
  return {
    codeDeliveryDetails: response.CodeDeliveryDetails,
  };
}

/**
 * Confirm forgot password with code and new password
 */
export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  });

  await cognitoClient.send(command);
  return { success: true };
}

/**
 * Get current user information using access token
 */
export async function getCurrentUser(accessToken: string) {
  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  const response = await cognitoClient.send(command);

  // Parse user attributes into a more usable format
  const attributes: Record<string, string> = {};
  response.UserAttributes?.forEach((attr) => {
    if (attr.Name && attr.Value) {
      attributes[attr.Name] = attr.Value;
    }
  });

  return {
    username: response.Username!,
    attributes,
    userAttributes: response.UserAttributes,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  const params: InitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: cognitoConfig.clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  const command = new InitiateAuthCommand(params);
  const response = await cognitoClient.send(command);

  if (!response.AuthenticationResult) {
    throw new Error("Token refresh failed");
  }

  return {
    accessToken: response.AuthenticationResult.AccessToken!,
    idToken: response.AuthenticationResult.IdToken!,
    expiresIn: response.AuthenticationResult.ExpiresIn!,
  };
}
