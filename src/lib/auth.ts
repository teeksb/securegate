import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/validations/auth";
import { loginLimiter, getIp } from "@/lib/rate-limit";

class RateLimitError extends CredentialsSignin {
  code = "RateLimit";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // Rate-limiting applied here (not middleware) so the response is identical
      // to a normal auth failure — attacker cannot tell if they hit the limit.
      authorize: async (credentials, request) => {
        const ip = getIp(request);

        try {
          const { success } = await loginLimiter.limit(ip);
          if (!success) {
            console.log(`[rate-limit] Login blocked for ${ip}`);
            throw new RateLimitError();
          }
        } catch (err) {
          if (err instanceof RateLimitError) throw err;
          console.error("[rate-limit] Login limiter error:", err);
        }

        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (!user.emailVerified) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger }) => {
      if (user) {
        token.id = user.id!;
        token.emailVerified = user.emailVerified;
      }
      if (trigger === "update") {
        return { ...token, ...user };
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
});
