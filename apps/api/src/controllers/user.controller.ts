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

  // sendVerification = async (req: Request, res: Response) => {
  //   try {
  //     const { token } = req.params;
  //     const result = await verifyUserToken(token);

  //     if (result.message === 'User already verified') {
  //       res.status(200).json(result);
  //     } else {
  //       res.status(200).json(result);
  //     }
  //   } catch (error) {
  //     console.log('Error sending verification:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  async userEntryData(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await usersServices.userEntryData(req);
      res.status(201).send({
        message: 'User data has been updated',
        updatedUser,
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

  // async login(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { accessToken, refreshToken, role } =
  //       await authService.userLogin(req);

  //     if (role === 'tenant') {
  //       res
  //         .cookie('access_token', accessToken, {
  //           secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  //         })
  //         .cookie('refresh_token', refreshToken, {
  //           secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  //         })
  //         .send({
  //           message: 'Login as tenant',
  //           role: 'tenant',
  //           url: '/dashboard',
  //         });
  //     } else if (role === 'user') {
  //       res.status(400).send({
  //         error: 'Unauthorized',
  //         message: 'Please log in on the guest login page.',
  //       });
  //     } else {
  //       res.status(400).send({
  //         error: 'Invalid role',
  //         message: 'Role is invalid',
  //       });
  //     }
  //   } catch (error) {
  //     // Log the error for debugging
  //     console.error('Login error:', error);
  //     // Pass the error to the next middleware
  //     next(error);
  //   }
  // }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, role } =
        await authService.userLogin(req);

      if (role === 'user') {
        res
          .cookie('access_token', accessToken, {
            secure: process.env.NODE_ENV === 'production',
          })
          .cookie('refresh_token', refreshToken, {
            secure: process.env.NODE_ENV === 'production',
          })
          .send({
            message: 'Login as user',
            role: 'user',
            url: '/',
          });
      } else {
        res.status(400).send({
          error: 'Invalid role',
          message: 'Role is invalid',
        });
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        res.status(400).send({
          error: 'Unauthorized',
          message: error.message,
        });
      } else {
        res.status(500).send({
          error: 'Unknown Error',
          message: 'An unexpected error occurred.',
        });
      }
    }
  }

  async tenantLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, role } =
        await authService.tenantLogin(req);

      if (role === 'tenant') {
        res
          .cookie('access_token', accessToken, {
            secure: process.env.NODE_ENV === 'production',
          })
          .cookie('refresh_token', refreshToken, {
            secure: process.env.NODE_ENV === 'production',
          })
          .send({
            message: 'Login as tenant',
            role: 'tenant',
            url: '/dashboard',
          });
      } else {
        res.status(400).send({
          error: 'Invalid role',
          message: 'Role is invalid. Please log in with the correct role.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);

      // Directly return the error message from the service
      if (error instanceof Error) {
        res.status(400).send({
          error: 'Unauthorized',
          message: error.message,
        });
      } else {
        res.status(500).send({
          error: 'Unknown Error',
          message: 'An unexpected error occurred.',
        });
      }
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
      const result = await authService.verifyChangePass(req);
      res.status(200).send(result);
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

  async editUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersServices.editUserProfile(req);
      res
        .status(200)
        .json({
          message: 'User profile data has been updated',
          user: result.user,
          token: result.token,
        })
        .cookie('access_token', result.token, {
          secure: process.env.NODE_ENV === 'production',
        });
    } catch (error) {
      next(error);
    }
  }

  async renderPicUser(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await usersServices.renderPicUser(req);
      if (!blob) {
        return res.status(404).send('User profile pic not found');
      }
      res.set('Content-Type', 'image/png');
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }

  async getProfileByTenantId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await usersServices.getProfileByTenantId(req);
      res.status(200).json({
        data,
        message: 'Fetching profile successful',
      });
    } catch (error) {
      next(error);
    }
  }
}
