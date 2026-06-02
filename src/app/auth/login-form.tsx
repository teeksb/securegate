"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    searchParams.get("reset") === "true"
      ? "Password reset successful. Sign in with your new password."
      : ""
  );
  const [loading, setLoading] = useState(false);

  function clearError() {
    if (error) setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email.trim() || !password.trim()) {
      setError("Invalid email or password");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.code === "RateLimit") {
          setError("Too many attempts, your account has been blocked");
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {error && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-5 rounded-xl bg-white p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            {success}
          </div>
        )}

        <FormField label="Email" name="email" type="email" placeholder="you@example.com" required onFocus={clearError} />
        <FormField label="Password" name="password" type="password" placeholder="Enter your password" required onFocus={clearError} />

        <SubmitButton loading={loading} loadingText="Signing in…">
          Sign in
        </SubmitButton>

        <div className="flex items-center justify-between text-sm">
          <a href="/auth?mode=forgot-password" className="text-indigo-600 hover:text-indigo-700 hover:underline">
            Forgot password?
          </a>
          <span className="text-gray-500">
            No account?{" "}
            <a href="/auth?mode=signup" className="text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign up
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}
