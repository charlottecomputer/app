"use server";

import { cookies } from "next/headers";

export async function createSession(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
}
