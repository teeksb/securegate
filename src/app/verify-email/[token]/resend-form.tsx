"use client";

import { useState } from "react";

interface Props {
  email?: string;
}

export function ResendForm({ email: initialEmail }: Props) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  if (sent) {
    return <p className="text-green-600">Verification email sent!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      {!initialEmail && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="rounded border px-3 py-2"
        />
      )}
      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Resend verification email
      </button>
    </form>
  );
}
