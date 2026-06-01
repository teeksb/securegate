import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: true });
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    sendVerificationEmail(email, token).catch((err) =>
      console.error("Resend verification email failed:", err)
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
