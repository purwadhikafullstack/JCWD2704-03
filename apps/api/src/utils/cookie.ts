import { CookieOptions } from 'express';

export const cookiesOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  domain: process.env.BASE_API_URL,
};

// export const cookieHTTPonlyOpt: CookieOptions = {
//   sameSite: 'strict',
//   httpOnly: true,
//   secure: true,
//   domain: process.env.BASE_API_URL,
// };
