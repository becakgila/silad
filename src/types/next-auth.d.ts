import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    nim?: string;
    level?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      nim?: string;
      level?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    nim?: string;
    level?: string;
  }
}
