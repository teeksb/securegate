import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generateToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordLimiter, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    await forgotPasswordLimiter.limit(ip);

    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = generateToken();
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.deleteMany({ where: { email } });

      await prisma.passwordResetToken.create({
        data: { email, token, expires },
      });

      sendPasswordResetEmail(email, token).catch((err) =>
        console.error("Password reset email send failed:", err)
      );
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot-password error:", error);
    return NextResponse.json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  }
}
