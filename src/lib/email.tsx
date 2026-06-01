import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
  secure: process.env.SMTP_SECURE === "true",
});

const from = process.env.SMTP_FROM || "noreply@localhost";

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;
  console.log(`[VERIFICATION] ${email} → ${url}`);

  try {
    const html = await render(<VerificationEmail url={url} />);

    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email address",
      html,
    });
  } catch (err) {
    console.error("sendVerificationEmail failed:", err);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const url = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
    const html = await render(<PasswordResetEmail url={url} />);

    await transporter.sendMail({
      from,
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (err) {
    console.error("sendPasswordResetEmail failed:", err);
  }
}
