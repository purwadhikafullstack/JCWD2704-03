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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, role } =
        await authService.userLogin(req);

      if (role && role == 'tenant') {
        res
          .cookie('access_token', accessToken)
          .cookie('refresh_token', refreshToken)
          .send({
            message: 'Login as seller',
            role: 'seller',
            url: '/dashboard',
          });
      } else if (role && role === 'user') {
        res
          .cookie('access_token', accessToken)
          .cookie('refresh_token', refreshToken)
          .send({
            message: 'Login as buyer',
            role: 'buyer',
            url: '/',
          });
      } else {
        res.status(400).send('Role is invalid');
      }
    } catch (error) {
      next(error);
    }
  }

  async sendChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let result = await authService.sendChangePasswordLink(req);
      if (result) {
        res.status(200).send({ message: result });
      } else {
        res.status(400).send({
          message: 'Your email is not registered, please register first.',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyChangePass(req: Request, res: Response, next: NextFunction) {
    try {
      let result = await authService.verifyChangePass(req);
      res.status(200).send({ message: result });
    } catch (error) {
      next(error);
    }
  }

  async validateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token, isVerified } = await authService.validate(req);

      res.send({
        message: 'success',
        isVerified,
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }
}
