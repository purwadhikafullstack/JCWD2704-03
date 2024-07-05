import { Role } from '@prisma/client';

export type TUser = {
  id: string;
  email: string;
  password?: string;
  social_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role: Role;
  isVerified?: boolean | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} | null;

export type TDecode = {
  type: string;
  user: TUser;
};
