import { prisma } from "@/lib/prisma";
import { ResetPasswordForm } from "./form";

interface Props {
  params: { token: string };
}

async function getTokenData(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  return record;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = params;
  const record = await getTokenData(token);

  if (!record || record.expires < new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Invalid or expired link</h1>
        <p className="text-gray-500">
          This password reset link is invalid or has expired.
        </p>
        <a href="/forgot-password" className="text-sm underline">
          Request a new link
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  );
}
