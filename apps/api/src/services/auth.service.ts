import type { TUser } from '@/models/user.model';
import { Request } from 'express';
import { comparePassword, hashPassword } from '../libs/bcrypt';
import { createToken } from '../libs/jwt';
import { transporter } from '../libs/nodemailer';
import { SECRET_KEY } from '../configs/config';
import { verify } from 'jsonwebtoken';
import fs from 'fs';
import { join } from 'path';
import { render } from 'mustache';
import { prisma } from '../libs/prisma';
import type { Prisma } from '@prisma/client';
import userServices from './user.services';

class AuthService {
  async userGoogleLogin(req: Request) {
    console.log('Start function Google login');

    const { email, social_id, first_name, last_name } = req.body;
    console.log('Received data:', { email, social_id, first_name, last_name });

    try {
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { social_id }],
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            social_id,
            first_name,
            last_name,
            role: 'user',
            isVerified: true,
          },
        });
        console.log('User created:', user);
      } else {
        if (!user.social_id) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { social_id },
          });
          console.log('User updated:', user);
        }
      }

      const accessToken = createToken(user, '1hr');
      const refreshToken = createToken({ id: user.id }, '1hr');
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error in userGoogleLogin:', error);
      throw new Error('Failed to login with Google');
    }
  }

  async tenantGoogleLogin(req: Request) {
    console.log('Start function Google login');

    const { email, social_id, first_name, last_name } = req.body;
    console.log('Received data:', { email, social_id, first_name, last_name });

    try {
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { social_id }],
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            social_id,
            first_name,
            last_name,
            role: 'tenant',
            isVerified: true,
          },
        });
        console.log('User created:', user);
      } else {
        if (!user.social_id) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { social_id },
          });
          console.log('User updated:', user);
        }
      }

      const accessToken = createToken(user, '1hr');
      const refreshToken = createToken({ id: user.id }, '1hr');
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error in userGoogleLogin:', error);
      throw new Error('Failed to login with Google');
    }
  }

  // async userLogin(req: Request) {
  //   const { email, password } = req.body;

  //   const where: Prisma.UserWhereUniqueInput = {
  //     email: email,
  //   };

  //   const select: Prisma.UserSelectScalar = {
  //     id: true,
  //     email: true,
  //     first_name: true,
  //     last_name: true,
  //     social_id: true,
  //     image: true,
  //     isVerified: true,
  //     password: true,
  //     role: true,
  //   };

  //   const data = await prisma.user.findFirst({
  //     select,
  //     where,
  //   });

  //   if (!data) throw new Error('Wrong e-mail!');
  //   if (!data.password) throw new Error('Wrong e-mail!');

  //   if (data.role === 'tenant' && req.body.role !== 'tenant') {
  //     throw new Error('Please log in on the property host login page.');
  //   }

  //   if (data.role === 'user' && req.body.role !== 'user') {
  //     throw new Error('Please log in on the guest login page.');
  //   }

  //   const checkUser = await comparePassword(data.password, password);
  //   if (!checkUser) throw new Error('Wrong password!');

  //   const userData: TUser = {
  //     id: data.id,
  //     email: data.email,
  //     first_name: data.first_name,
  //     last_name: data.last_name,
  //     social_id: data.social_id,
  //     image: data.image,
  //     isVerified: data.isVerified,
  //     role: data.role,
  //     password: data.password,
  //     createdAt: data.createdAt,
  //     updatedAt: data.updatedAt,
  //   };

  //   delete userData.password;

  //   const accessToken = createToken(userData, '1hr');
  //   const refreshToken = createToken({ id: userData.id }, '1hr');

  //   return {
  //     accessToken,
  //     refreshToken,
  //     role: userData.role,
  //   };
  // }

  async userLogin(req: Request) {
    const { email, password } = req.body;

    const where: Prisma.UserWhereUniqueInput = {
      email: email,
    };

    const select: Prisma.UserSelect = {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      social_id: true,
      image: true,
      isVerified: true,
      password: true,
      role: true,
    };

    const data = await prisma.user.findFirst({
      select,
      where,
    });

    if (!data) throw new Error('Wrong e-mail!');
    if (!data.password) throw new Error('Wrong e-mail!');

    if (data.role !== 'user') {
      throw new Error('Please log in on the property host login page.');
    }

    const checkUser = await comparePassword(data.password, password);
    if (!checkUser) throw new Error('Wrong password!');

    const userData: TUser = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      social_id: data.social_id,
      image: data.image,
      isVerified: data.isVerified,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    delete userData.password;
    delete userData.image;

    const accessToken = createToken(userData, '1hr');
    const refreshToken = createToken({ id: userData.id }, '1hr');

    return {
      accessToken,
      refreshToken,
      role: userData.role,
    };
  }

  async tenantLogin(req: Request) {
    const { email, password } = req.body;

    const where: Prisma.UserWhereUniqueInput = {
      email: email,
    };

    const select: Prisma.UserSelect = {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      social_id: true,
      image: true,
      isVerified: true,
      password: true,
      role: true,
    };

    const data = await prisma.user.findFirst({
      select,
      where,
    });
    if (!data) throw new Error('Wrong e-mail!');
    if (!data.password) throw new Error('Wrong e-mail!');

    if (data.role !== 'tenant') {
      throw new Error('Please log in on the guest login page.');
    }

    const checkUser = await comparePassword(data.password, password);
    if (!checkUser) throw new Error('Wrong password!');

    const userData: TUser = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      social_id: data.social_id,
      image: data.image,
      isVerified: data.isVerified,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    delete userData.password;

    const accessToken = createToken(userData, '1hr');
    const refreshToken = createToken({ id: userData.id }, '1hr');

    return {
      accessToken,
      refreshToken,
      role: userData.role,
    };
  }

  async sendChangePasswordLink(req: Request) {
    const { email } = req.body;
    const select: Prisma.UserSelectScalar = {
      id: true,
      first_name: true,
    };
    const data = await prisma.user.findUnique({
      select,
      where: {
        email: email,
      },
    });
    if (data === null) {
      return false;
    } else {
      let sendEmailResult = await userServices.sendingEmail(
        data.id,
        email,
        '/../templates/resetpassword.html',
        'We received request to change your password on Atcasa',
        'auth/changePassword',
      );
      return sendEmailResult;
    }
  }

  // async verifyChangePass(req: Request) {
  //   try {
  //     const { token, newPassword } = req.body;
  //     const user = verify(token, SECRET_KEY) as TUser;
  //     if (!user || !user.id) {
  //       throw new Error('invalid token');
  //     }
  //     const hashPass = await hashPassword(newPassword);
  //     await prisma.user.update({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         password: hashPass,
  //       },
  //     });
  //     return 'Password has changed succesfully!';
  //   } catch (error) {
  //     return 'Failed to change password from our API';
  //   }
  // }

  async verifyChangePass(req: Request) {
    try {
      const { token, newPassword } = req.body;
      const user = verify(token, SECRET_KEY) as TUser;
      if (!user || !user.id) {
        throw new Error('Invalid token');
      }
      const hashPass = await hashPassword(newPassword);
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashPass,
        },
      });
      return {
        message: 'Password has changed successfully!',
        updatedUser,
      };
    } catch (error) {
      throw new Error('Failed to change password from our API');
    }
  }

  async validate(req: Request) {
    const select: Prisma.UserSelectScalar = {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      image: true,
      isVerified: true,
      role: true,
    };

    const data = await prisma.user.findUnique({
      select,
      where: {
        id: req.user?.id,
      },
    });

    const access_token = createToken(data, '1hr');

    return { access_token, isVerified: data?.isVerified };
  }
}

export default new AuthService();
