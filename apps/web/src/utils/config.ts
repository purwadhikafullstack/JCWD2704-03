import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const cookiesOpt: Partial<ResponseCookie> = {
  // sameSite: 'strict',
  // secure: true,
  // domain: process.env.NEXT_PUBLIC_BASE_API_URL,
};
