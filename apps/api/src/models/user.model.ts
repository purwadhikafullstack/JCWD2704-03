import { Role } from '@prisma/client';

export type TUser = {
  id: string;
  email: string;
  password: string | null;
  social_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: Role;
  isVerified: boolean | null;
  image: Buffer | null;
  createdAt: Date;
  updatedAt: Date;
};
