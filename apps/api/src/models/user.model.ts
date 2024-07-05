import { Role } from '@prisma/client';

export type TUser = {
  id: string;
  email: string;
  password?: string;
  social_id?: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  isVerified?: boolean | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} | null;
