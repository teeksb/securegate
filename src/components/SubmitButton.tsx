"use client";

import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  children,
  loading,
  loadingText,
  disabled,
  ...buttonProps
}: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      {...buttonProps}
    >
      {loading ? loadingText ?? children : children}
    </button>
  );
}
