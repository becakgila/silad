import NextAuth from "next-auth";
import { initDatabase } from "@/helper/database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend the User type to include our custom fields
declare module "next-auth" {
  interface User {
    level?: string;
  }
  interface Session {
    user: User & {
      level?: string;
    };
  }
}

export const runtime = 'nodejs';

const handlers = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
            console.log('berhasil1');
          const { models } = await initDatabase();
          console.log('berhasil2');

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter an email and password");
          }

          console.log('berhasil3');

          const user = await models.Users.findOne({ 
            where: { email: credentials.email }
          });

          if (!user) {
            throw new Error("No user found with that email");
          }

          console.log('berhasil4');

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          console.log('berhasil');
          

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            level: user.level,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/signin',
    error: '/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.level = user.level;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).level = token.level;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handlers as GET, handlers as POST };