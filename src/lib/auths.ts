// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        
        
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
    CredentialsProvider({
      id: "CredentialsMhs",
      name: "CredentialsMhs",
      credentials: {
        nim: { label: "nim", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        
        try {      
          
          if (!credentials?.nim || !credentials?.password) {
            throw new Error("Please enter an nim and password");
          }

          // Find user with Prisma
          const user = await prisma.mahasiswa.findUnique({ where: { nim: credentials.nim } });
          if (!user) {
            throw new Error("No user found with that nim");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.nim,
            nim: user.nim,
            name: user.nama,
            email: user.email,
            level: "mahasiswa",
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
    signOut: '/',
    error: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 30 days
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
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};