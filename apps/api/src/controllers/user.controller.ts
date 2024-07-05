import { type NextFunction, type Response, type Request } from 'express';
import usersServices from '@/services/user.services';

export class UserController {
  async userRegisterEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await usersServices.userRegisterEmail(req);
      res.status(201).send({
        message: 'New user has been registered',
      });
    } catch (error) {
      next(error);
    }
  }

  async tenantRegisterEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await usersServices.tenantRegisterEmail(req);
      res.status(201).send({
        message: 'New user has been registered',
      });
    } catch (error) {
      next(error);
    }
  }

  async sendVerif(req: Request, res: Response, next: NextFunction) {
    try {
      await usersServices.sendVerification(req);
      res.send({ message: 'Verification success' });
    } catch (error) {
      next(error);
    }
  }

  async userEntryData(req: Request, res: Response, next: NextFunction) {
    try {
      await usersServices.userEntryData(req);
      res.status(201).send({
        message: 'User data has been updated',
      });
    } catch (error) {
      next(error);
    }
  }
}
