import { TUser } from './models/users.model';

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
      token?: string;
      file?: Express.Multer.File;
    }
  }
}
