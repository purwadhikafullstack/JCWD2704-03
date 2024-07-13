import { type NextFunction, type Response, type Request } from 'express';
import usersServices from '@/services/user.services';
import authService from '@/services/auth.service';

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

  async resendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, message } = await usersServices.resendVerification(req);
      res.status(201).send({
        message,
        email,
      });
    } catch (error) {
      next(error);
    }
  }

  async userGoogleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } =
        await authService.userGoogleLogin(req);
      res
        .cookie('access_token', accessToken)
        .cookie('refresh_token', refreshToken)
        .status(200)
        .send({
          message: 'New user has logged in using Google Login',
        });
    } catch (error) {
      next(error);
    }
  }

  async tenantGoogleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } =
        await authService.tenantGoogleLogin(req);
      res
        .cookie('access_token', accessToken)
        .cookie('refresh_token', refreshToken)
        .status(200)
        .send({
          message: 'New tenant has logged in using Google Login',
        });
    } catch (error) {
      next(error);
    }
  }
}
