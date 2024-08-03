import { CookieOptions } from 'express';

export const cookieOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  domain: process.env.BASE_WEB_URL,
};

// export const cookieHTTPonlyOpt: CookieOptions = {
//   sameSite: 'strict',
//   httpOnly: true,
//   secure: true,
//   domain: process.env.BASE_WEB_URL,
// };
