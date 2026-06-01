import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  url: string;
}

export default function PasswordResetEmail({ url }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: 40 }}>
        <Container>
          <Heading>Reset your password</Heading>
          <Text>
            Click the button below to reset your password. This link expires in
            15 minutes.
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Link
              href={url}
              style={{
                background: "#000",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Reset Password
            </Link>
          </Section>
          <Text style={{ color: "#666", fontSize: 14 }}>
            If you didn't request this, ignore this email.
          </Text>
          <Text style={{ color: "#666", fontSize: 14 }}>
            If the button doesn't work, copy and paste this URL:
          </Text>
          <Text style={{ color: "#666", fontSize: 12, wordBreak: "break-all" }}>
            {url}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
