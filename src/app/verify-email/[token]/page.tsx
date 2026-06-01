import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ResendForm } from "./resend-form";

interface Props {
  params: { token: string };
}

async function getTokenData(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  return record;
}

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = params;

  const record = await getTokenData(token);

  if (!record) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Invalid or expired link</h1>
        <p className="text-gray-500">
          This verification link is invalid. Request a new one below.
        </p>
        <ResendForm />
      </div>
    );
  }

  if (record.expires < new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Link expired</h1>
        <p className="text-gray-500">
          This verification link has expired. Request a new one below.
        </p>
        <ResendForm email={record.identifier} />
      </div>
    );
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { id: record.id },
  });

  redirect("/login?verified=true");
}
