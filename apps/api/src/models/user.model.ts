import { Role } from '@prisma/client';

export type TUser = {
  id: string;
  email: string;
  password?: string | null;
  social_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: Role;
  isVerified: boolean | null;
  isRequestingEmailChange?: boolean | null;
  image?: Buffer | null;
  image_name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  verificationToken?: string | null;
  tokenExpiration?: Date;
};

export type TDecode = {
  type: string;
  user: TUser;
};
