"use client";

import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const body = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const errArr = Object.values(data.errors ?? {}) as string[][];
        const firstError = errArr.find(Boolean)?.[0] ?? data.message ?? "Signup failed";
        setError(firstError);
        return;
      }

      setError("");
      setSuccess(true);
    } catch (err) {
      console.error("Signup fetch error:", err);
      setError("Network error — check console");
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Check your email</h1>
        <p className="text-gray-500 text-center max-w-sm">
          We sent a verification link to your email. Click the link to activate
          your account before signing in.
        </p>
        <a href="/login" className="text-sm underline">
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded border p-8"
      >
        <h1 className="text-xl font-bold">Sign Up</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          name="name"
          placeholder="Name"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8, upper, lower, number)"
          required
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black py-2 text-white hover:bg-gray-800"
        >
          Sign Up
        </button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
