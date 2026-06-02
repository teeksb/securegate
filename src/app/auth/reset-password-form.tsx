"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
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
        const firstError = errArr.find(Boolean)?.[0] ?? data.message ?? "Reset failed";
        setError(firstError);
        return;
      }

      router.push("/auth?mode=login&reset=true");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <FormField label="New password" name="password" type="password"
        placeholder="Min 8 chars, upper, lower, number" required
        value={password} onChange={(e) => setPassword(e.currentTarget.value)} />

      <PasswordStrengthIndicator password={password} />

      <FormField label="Confirm new password" name="confirmPassword" type="password"
        placeholder="Re-enter your new password" required />

      <SubmitButton loading={loading} loadingText="Resetting…">
        Reset password
      </SubmitButton>
    </form>
  );
}
