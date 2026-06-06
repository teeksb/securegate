"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Something went wrong");
        return;
      }

      setSent(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900">Check your email</h1>
        <p className="text-gray-500">If an account exists with that email, a reset link has been sent.</p>
        <a href="/auth?mode=login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-8"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900">Forgot password</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <FormField label="Email" name="email" type="email" placeholder="you@example.com" required />

      <SubmitButton loading={loading} loadingText="Sending…">
        Send reset link
      </SubmitButton>

      <a href="/auth?mode=login" className="text-center text-sm text-gray-500 hover:text-gray-600 hover:underline">
        Back to sign in
      </a>
    </form>
  );
}
