import type { TUser } from '@/models/users.model';
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

class UserService {
  async userRegisterEmail(req: Request) {
    console.log('Start function userRegisterEmail');

    const { email } = req.body;
    console.log('User email:', email);

    const existingUser = await prisma.user.findMany({
      where: {
        email,
      },
    });
    console.log('Existing user:', existingUser);

    if (existingUser.length)
      throw new Error('Email has already been registered');

    const newUser = await prisma.user.create({
      data: {
        email,
        role: 'user',
        isVerified: false,
      },
    });
    console.log('New user created:', newUser);

    // TODO: GANTI TEMPLATENYA
    let sentEmail = await this.sendingEmail(
      newUser.id,
      newUser.email,
      '/../templates/verification.html',
      'Confirm Your Email Address For Atcasa',
      'verify',
    );
  }

  async tenantRegisterEmail(req: Request) {
    console.log('Start function tenantRegisterEmail');

    const { email } = req.body;
    console.log('Tenant input email:', email);
    console.log(req.user);

    const existingUser = await prisma.user.findMany({
      where: {
        email,
      },
    });
    console.log('Existing user check result:', existingUser);

    if (existingUser.length) throw new Error('Email has already been used');

    const newUser = await prisma.user.create({
      data: {
        email,
        role: 'tenant',
        isVerified: false,
      },
    });
    console.log('New user created:', newUser);

    // TODO: GANTI TEMPLATENYA
    let sentEmail = await this.sendingEmail(
      newUser.id,
      newUser.email,
      '/../templates/verification.html',
      'Confirm Your Email Address For Atcasa',
      'verify',
    );
  }

  async sendingEmail(
    userId: string,
    userEmail: string,
    pathToEmailTemplate: string,
    emailSubject: string,
    verify_url: string,
  ) {
    const verifyToken = createToken({ id: userId }, '1hr');

    const template = fs
      .readFileSync(__dirname + pathToEmailTemplate)
      .toString();

    const html = render(template, {
      email: userEmail,
      verify_url: `http://localhost:3000/${verify_url}/${verifyToken}`,
    });

    let returnFromTransporter = await transporter
      .sendMail({
        to: userEmail,
        subject: emailSubject,
        html,
      })
      .then((info) => {
        return 'Email sent successfully';
      })
      .catch((error) => {
        return error.message;
      });
    return returnFromTransporter;
  }

  async sendVerification(req: Request) {
    console.log('Start function sendVerification');

    try {
      const { token } = req.params;

      const user = verify(token, SECRET_KEY) as TUser;

      if (!user || !user.id) {
        throw new Error('Invalid token/user');
      }

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          isVerified: true,
        },
      });

      return { success: true };
    } catch (error) {
      console.log('Error sending verification:', error);
    }
  }

  async userEntryData(req: Request) {
    const { token, password, first_name, last_name } = req.body;

    const decodedToken = verify(token, SECRET_KEY) as { id: string };

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Invalid token');
    }

    const userId = decodedToken.id;

    const hashPass = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        password: hashPass,
      },
    });

    console.log('User data updated:', updatedUser);
  }

  async userLogin(req: Request) {}
}

export default new UserService();
