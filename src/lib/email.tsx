import { Resend } from "resend";
import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/auth?mode=verify-email&token=${token}`;
  console.log(`[VERIFICATION] ${email} → ${url}`);

  try {
    const { error } = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      react: <VerificationEmail url={url} />,
    });

    if (error) console.error("sendVerificationEmail failed:", error);
  } catch (err) {
    console.error("sendVerificationEmail threw:", err);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/auth?mode=reset-password&token=${token}`;
  console.log(`[PASSWORD-RESET] ${email} → ${url}`);

  try {
    const { error } = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      react: <PasswordResetEmail url={url} />,
    });

    if (error) console.error("sendPasswordResetEmail failed:", error);
  } catch (err) {
    console.error("sendPasswordResetEmail threw:", err);
  }
}
