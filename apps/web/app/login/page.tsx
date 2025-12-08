"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@aliveui/ui";
import { signIn, getCurrentUser } from "@/lib/auth-service";
import { createSession } from "@/actions/auth-actions";
import { syncUser } from "@/actions/user-actions";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn(email, password);
      await createSession(result.accessToken);
      
      // Sync user to DynamoDB
      const userInfo = await getCurrentUser(result.accessToken);
      const userId = userInfo.username;
      const userName = userInfo.attributes["given_name"] || email.split("@")[0];
      await syncUser(userId, email, userName);
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="flex  items-center justify-center h-full p-4">
      <div className="w-full max-w-md space-y-4">
        {verified && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            Email verified successfully! Please log in.
          </div>
        )}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
