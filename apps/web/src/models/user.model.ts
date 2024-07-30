import { JwtPayload } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  password?: string;
  social_id?: string;
  role: string;
  first_name: string;
  last_name: string;
  image?: string;
  isVerified?: string;
  image_name?: string;
  isRequestingEmailChange?: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
  user: User;
}

export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  role: 'user' | 'tenant';
  url: string;
}

export interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    first_name: string | null;
    last_name: string | null;
    isRequestingEmailChange: boolean;
    image_name: string | null;
    role: string;
  };
}
