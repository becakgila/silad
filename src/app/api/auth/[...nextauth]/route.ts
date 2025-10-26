import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma'

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

        console.log('test');
        
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter an email and password");
          }

          // Find user with Prisma
          const user = await prisma.users.findUnique({ where: { email: credentials.email } });
          if (!user) {
            throw new Error("No user found with that email");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: typeof user.id === 'bigint' ? user.id.toString() : String(user.id),
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
        token.id = user.id;
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