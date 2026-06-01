"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errArr = Object.values(data.errors ?? {}) as string[][];
        const firstError =
          errArr.find(Boolean)?.[0] ?? data.message ?? "Reset failed";
        setError(firstError);
        return;
      }

      router.push("/login?reset=true");
    } catch {
      setError("Network error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded border p-8"
    >
      <h1 className="text-xl font-bold">Reset password</h1>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <input
        name="password"
        type="password"
        placeholder="New password (min 8, upper, lower, number)"
        required
        className="rounded border px-3 py-2"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        required
        className="rounded border px-3 py-2"
      />
      <button
        type="submit"
        className="rounded bg-black py-2 text-white hover:bg-gray-800"
      >
        Reset password
      </button>
    </form>
  );
}
