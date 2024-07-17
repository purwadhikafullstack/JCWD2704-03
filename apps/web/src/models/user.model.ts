export interface User {
  id: string;
  email: string;
  password: string;
  social_id: string;
  role: string;
  first_name: string;
  last_name: string;
  image: string;
  isVerified: string;
}
export type TUser = {
  id?: string;
  email?: string;
  password?: string;
  social_id: string;
  role?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  isVerified?: boolean;
};
