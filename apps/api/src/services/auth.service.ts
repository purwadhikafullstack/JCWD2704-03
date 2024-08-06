import type { TUser } from '@/models/user.model';
import { Request } from 'express';
import { comparePassword, hashPassword } from '../libs/bcrypt';
import { createToken } from '../libs/jwt';
import { transporter } from '../libs/nodemailer';
import { SECRET_KEY } from '../configs/config';
import { verify } from 'jsonwebtoken';
import fs from 'fs';
import { prisma } from '../libs/prisma';
import type { Prisma } from '@prisma/client';
import userServices from './user.services';
import { addHours } from 'date-fns';

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
      image_name: true,
      isRequestingEmailChange: true,
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
      image_name: data.image_name,
      isRequestingEmailChange: data.isRequestingEmailChange,
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
      image_name: true,
      isRequestingEmailChange: true,
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
      image_name: data.image_name,
      isRequestingEmailChange: data.isRequestingEmailChange,
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

  async sendChangePasswordLink(req: Request) {
    const { email } = req.body;

    const select: Prisma.UserSelectScalar = {
      id: true,
      first_name: true,
    };

    const user = await prisma.user.findUnique({
      select,
      where: { email: email },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const verificationToken = createToken({ id: user.id }, '1h'); // Token valid for 1 hour
    const tokenExpiration = addHours(new Date(), 1); // Set expiration time

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        tokenExpiration,
      },
    });

    const message = await userServices.sendingEmail(
      email,
      verificationToken,
      'We received a request to change your password on Atcasa',
      '/../templates/resetpassword.html', // Path to email template
      'changePassword',
    );

    return { message: message || 'Password reset email sent' };
  }

  async verifyTokenUser(req: Request) {
    const { token } = req.params;
    const decodedToken = verify(token, SECRET_KEY) as { id: string };

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Invalid token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        verificationToken: true,
        tokenExpiration: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (
      user.verificationToken !== token ||
      !user.tokenExpiration ||
      new Date() > new Date(user.tokenExpiration)
    ) {
      throw new Error('Token is invalid or has expired');
    }

    return user;
  }

  async verifyChangePass(req: Request) {
    const { token, newPassword } = req.body;

    const decodedToken = verify(token, SECRET_KEY) as { id: string };

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Invalid token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hashPass = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        password: hashPass,
        verificationToken: null,
        tokenExpiration: null,
      },
    });

    return {
      message: 'Password has been changed successfully!',
      updatedUser,
    };
  }

  async validate(req: Request) {
    const select: Prisma.UserSelectScalar = {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      isVerified: true,
      role: true,
      isRequestingEmailChange: true,
      image_name: true,
    };

    const data = await prisma.user.findUnique({
      select,
      where: {
        id: req.user?.id,
      },
    });

    const access_token = createToken(data, '1hr');

    return {
      access_token,
      isVerified: data?.isVerified,
      isRequestingEmailChange: data?.isRequestingEmailChange,
      role: data?.role,
    };
  }
}

export default new AuthService();
