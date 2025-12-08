"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@aliveui/ui";
import { signUp } from "@/lib/auth-service";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const name = formData.get("name") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, { given_name: name });
      // Redirect to confirmation page or login
      // For now, let's redirect to a verify page (we'll need to create this)
      router.push(`/verify?email=${encodeURIComponent(email)}&username=${encodeURIComponent(result.username)}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <SignupForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
