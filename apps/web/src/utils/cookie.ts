import { CookieOptions } from 'express';

export const cookieOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  domain: process.env.NEXT_PUBLIC_BASE_API_URL,
};
