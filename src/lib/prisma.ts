import { PrismaClient } from '../generated/prisma';

declare global {
  // allow globalThis to carry a Prisma instance in dev to avoid multiple clients
   
  var prisma: PrismaClient | undefined;
}

const client = (globalThis as any).prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = client;

export default client;
