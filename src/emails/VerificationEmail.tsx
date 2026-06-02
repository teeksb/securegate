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

interface VerificationEmailProps {
  url: string;
}

export default function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: 40 }}>
        <Container>
          <Heading>Verify your email</Heading>
          <Text>Click the button below to verify your email address.</Text>
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
              Verify Email
            </Link>
          </Section>
          <Text style={{ color: "#666", fontSize: 14 }}>
            If the button doesn&apos;t work, copy and paste this URL into your
            browser:
          </Text>
          <Text style={{ color: "#666", fontSize: 12, wordBreak: "break-all" }}>
            {url}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
