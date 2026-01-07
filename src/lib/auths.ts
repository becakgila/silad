// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { log } from "node:console";

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
    GoogleProvider({
      id: "google",
      name: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,            
    }),
    GoogleProvider({
      id: "googleMhs",
      name: "googleMhs",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,            
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
     async signIn({ account, profile, user }) {
      if (account?.provider === 'google') {
        try {          
                    
          // Check if the user's email from Google exists in your database
          const userInDB = await prisma.users.findUnique({
            where: { email: profile?.email },
          });                                       

          if (userInDB) {
            
            user.level = userInDB.level;
            user.id = String(userInDB.id);
            // user.nim= user.nim,
            user.name= userInDB.name;
            user.email= userInDB.email;

            return true; 
          } else {
            // User does not exist, return false or redirect to an unauthorized page
            // You can return '/unauthorized' to redirect to a custom error page
            return false; 
          }
        } catch (error) {
          console.error("Database error during sign-in:", error);
          return false; // Handle database connection errors gracefully
        }
      }
      if (account?.provider === 'googleMhs') {
        try {          
                    
          // Check if the user's email from Google exists in your database
          const userInDB = await prisma.mahasiswa.findUnique({
            where: { email: profile?.email },
          });                                       

          if (userInDB) {
            user.level = "mahasiswa";
            user.id = String(userInDB.nim);
            user.nim = userInDB.nim;
            user.name = userInDB.nama;
            user.email = userInDB.email;

            return true; 
          } else {
            // User does not exist, return false or redirect to an unauthorized page
            // You can return '/unauthorized' to redirect to a custom error page
            return false; 
          }
        } catch (error) {
          console.error("Database error during sign-in:", error);
          return false; // Handle database connection errors gracefully
        }
      }
      // For other providers or credentials, return true if you want to allow them
      return true;
    },
    async jwt({ token, user }) {

      console.log(user, 'jwt');
      
      if (user) {
        token.level = user.level;
        token.id = user.id;
        token.nim = (user as any).nim ?? token.nim;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).level = token.level;
        (session.user as any).id = token.id;
        (session.user as any).nim = token.nim;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};