"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded border p-8 text-center">
          <h1 className="text-xl font-bold">Check your email</h1>
          <p className="text-gray-500">
            If an account exists with that email, a reset link has been sent.
          </p>
          <a href="/login" className="text-sm underline">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded border p-8"
      >
        <h1 className="text-xl font-bold">Forgot password</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black py-2 text-white hover:bg-gray-800"
        >
          Send reset link
        </button>
        <a href="/login" className="text-sm text-gray-500 underline">
          Back to sign in
        </a>
      </form>
    </div>
  );
}
