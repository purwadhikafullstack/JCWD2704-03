import 'dotenv/config';
import { CorsOptions } from 'cors';

export const PORT = process.env.PORT || 6000;

export const SECRET_KEY = process.env.SECRET_KEY || '';

// export const corsOptions: CorsOptions = {
//   origin: ['http://localhost:3000'], //url localhost frontend
//   credentials: true,
// };

export const corsOptions: CorsOptions = {
  origin: [
    'https://84aa-182-253-55-247.ngrok-free.app',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};
export const user = process.env.nodemailer_email || '';
export const pass = process.env.nodemailer_pass || '';
