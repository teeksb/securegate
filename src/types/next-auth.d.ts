import { DefaultSession } from "next-auth";

declare module "@auth/core/types" {
  interface User {
    emailVerified: Date | null;
  }
  interface Session {
    user: {
      id: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    emailVerified: Date | null;
  }
}
