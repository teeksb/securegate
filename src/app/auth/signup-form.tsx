"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

export function SignupForm() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate(name: string, email: string, password: string): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Field cannot be empty";
    if (!email.trim()) errs.email = "Field cannot be empty";
    if (!password.trim()) errs.password = "Field cannot be empty";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    const clientErrors = validate(name, email, password);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.errors)) {
            mapped[key] = (msgs as string[])[0];
          }
          setFieldErrors(mapped);
        }
        const errValues = Object.values(data.errors ?? {}) as string[][];
        const firstError = errValues.find(Boolean)?.[0] ?? data.message ?? "Signup failed";
        setError(firstError);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
        <p className="text-gray-500">
          We sent a verification link to your email. Click the link to activate your account before signing in.
        </p>
        <a href="/auth?mode=login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          Go to sign in →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <FormField label="Full name" name="name" placeholder="Enter full name" required autoFocus error={fieldErrors.name}
        onChange={() => setFieldErrors((p) => ({ ...p, name: "" }))} />

      <FormField label="Email" name="email" type="email" placeholder="you@example.com" required
        value={email}
        onChange={(e) => {
          const val = e.currentTarget.value;
          setEmail(val);
          setEmailTouched(true);
          setFieldErrors((p) => ({ ...p, email: "" }));
        }}
        error={
          emailTouched && email.length > 0 && !isValidEmail(email)
            ? "Enter a valid email address"
            : fieldErrors.email
        } />

      <FormField label="Password" name="password" type="password" placeholder="Min 8 chars, upper, lower, number"
        required value={password}
        onChange={(e) => { setPassword(e.currentTarget.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
        error={fieldErrors.password} />

      <PasswordStrengthIndicator password={password} />

      <SubmitButton loading={loading} loadingText="Creating account…">
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/auth?mode=login" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
