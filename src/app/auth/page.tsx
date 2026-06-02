import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form";

interface Props {
  searchParams: { mode?: string; token?: string };
}

export default async function AuthPage({ searchParams }: Props) {
  const { mode, token } = searchParams;

  // --- verify-email: server-side token check ---
  if (mode === "verify-email" && token) {
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      return (
        <PageShell>
          <InvalidLink
            title="Invalid or expired link"
            message="This verification link is invalid or has expired."
          >
            <ResendVerification email={record?.identifier} />
          </InvalidLink>
        </PageShell>
      );
    }

    await prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: record.id },
    });

    redirect("/auth?mode=login&verified=true");
  }

  // --- reset-password: server-side token check ---
  if (mode === "reset-password" && token) {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      return (
        <PageShell>
          <InvalidLink
            title="Invalid or expired link"
            message="This password reset link is invalid or has expired."
          >
            <a
              href="/auth?mode=forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Request a new link
            </a>
          </InvalidLink>
        </PageShell>
      );
    }

    return (
      <PageShell>
        <ResetPasswordForm token={token} />
      </PageShell>
    );
  }

  // --- form routing ---
  return (
    <PageShell>
      {mode === "signup" && <SignupForm />}
      {mode === "forgot-password" && <ForgotPasswordForm />}
      {(!mode || mode === "login") && <LoginForm />}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <a
        href="/"
        className="text-[clamp(1rem,3vw,1.5rem)] font-bold tracking-tight text-gray-900 hover:text-indigo-600"
      >
        SecureGate
      </a>
      {children}
    </div>
  );
}

function InvalidLink({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">{message}</p>
      {children}
    </div>
  );
}

function ResendVerification({ email }: { email?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">
        {email
          ? `The link for ${email} has expired.`
          : "We couldn't find that verification link."}
      </p>
      <ResendForm email={email} />
    </div>
  );
}

// --- Resend form (inline client component) ---
import { ResendFormInner } from "./resend-form";

function ResendForm({ email }: { email?: string }) {
  return <ResendFormInner email={email} />;
}
