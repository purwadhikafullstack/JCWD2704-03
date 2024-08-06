import 'dotenv/config';
import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://jcwd270403.purwadhikabootcamp.com',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};

export const PORT = process.env.PORT || 6000;
export const SECRET_KEY = process.env.SECRET_KEY || '';
export const user = process.env.nodemailer_email || '';
export const pass = process.env.nodemailer_pass || '';
export const BASE_WEB_URL = process.env.BASE_WEB_URL;
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
