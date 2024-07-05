import { PrismaClient } from '@prisma/client';

export default new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export const prisma = new PrismaClient();
