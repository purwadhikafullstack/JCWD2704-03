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

  //   async userLogin(req: Request) {
  //     const { email, password } = req.body;

  //     const where: Prisma.UserWhereUniqueInput = {
  //       email: email,
  //     };

  //     const select: Prisma.UserSelectScalar = {
  //       id: true,
  //       email: true,
  //       first_name: true,
  //       last_name: true,
  //       social_id: true,
  //       image: true,
  //       isVerified: true,
  //       password: true,
  //       role: true,
  //     };

  //     const data = await prisma.user.findFirst({
  //       select,
  //       where,
  //     });

  //     if (!data) throw new Error('Wrong e-mail!');
  //     if (!data.password) throw new Error('Wrong e-mail!');

  //     const checkUser = await comparePassword(data.password, password);
  //     if (!checkUser) throw new Error('Wrong password!');

  //     // Ensure data conforms to TUser type
  //     const userData: TUser = {
  //       id: data.id,
  //       email: data.email,
  //       first_name: data.first_name,
  //       last_name: data.last_name,
  //       social_id: data.social_id,
  //       image: data.image,
  //       isVerified: data.isVerified,
  //       role: data.role,
  //       password: data.password, // Note that this can be null
  //       createdAt: data.createdAt,
  //       updatedAt: data.updatedAt,
  //     };

  //     delete userData.password; // Assuming you don't want to return the password

  //     const accessToken = createToken(userData, '1hr');
  //     const refreshToken = createToken({ id: userData.id }, '1hr');

  //     return {
  //       accessToken,
  //       refreshToken,
  //       role: userData.role,
  //     };
  //   }
}

export default new AuthService();
