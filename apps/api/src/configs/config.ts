import 'dotenv/config';
import { CorsOptions } from 'cors';

export const PORT = process.env.PORT || 6000;

export const SECRET_KEY = process.env.SECRET_KEY || '';

export const corsOptions: CorsOptions = {
  origin: process.env.BASE_WEB_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};
export const user = process.env.nodemailer_email || '';
export const pass = process.env.nodemailer_pass || '';
