import type { TUser } from '@/models/user.model';
import { Request, Response } from 'express';
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
import sharp from 'sharp';
import shortid from 'shortid';

class UserService {
  async userRegisterEmail(req: Request) {
    console.log('Start function userRegisterEmail');

    const { email } = req.body;
    console.log('User email:', email);

    try {
      const existingUser = await prisma.user.findMany({
        where: {
          email,
        },
      });
      console.log('Existing user:', existingUser);

      if (existingUser.length) {
        const error = new Error('Email has already been registered');
        (error as any).statusCode = 409;
        throw error;
      }

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
      console.log('Email sent:', sentEmail);
    } catch (error) {
      console.error('Error in userRegisterEmail:', error);
      throw error; // Rethrow the error after logging it
    }
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
    const tokenStore: Record<string, { used: boolean }> = {};

    const verifyToken = createToken({ id: userId }, '1hr');

    tokenStore[verifyToken] = { used: false };

    const template = fs
      .readFileSync(__dirname + pathToEmailTemplate)
      .toString();
    const html = render(template, {
      email: userEmail,
      verify_url: `${process.env.BASE_WEB_URL}/${verify_url}/${verifyToken}`,
    });

    let returnFromTransporter = await transporter
      .sendMail({
        to: userEmail,
        subject: emailSubject,
        html,
      })
      .then(() => 'Email sent successfully')
      .catch((error) => error.message);

    return returnFromTransporter;
  }

  async sendVerification(req: Request) {
    const { token } = req.params;

    if (!token) {
      throw new Error('Token is missing');
    }

    const decodedToken = verify(token, process.env.SECRET_KEY as string) as {
      id: string;
    };

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Invalid token');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    if (existingUser.isVerified) {
      // Redirect to home if already verified
      return { redirectUrl: '/' };
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: decodedToken.id },
      data: { isVerified: true },
    });

    // After verification, redirect to the form page where the user will submit additional info
    return { redirectUrl: `/verify/${token}` };
  }

  async userEntryData(req: Request) {
    const { token, password, first_name, last_name } = req.body;
    const decodedToken = verify(token, SECRET_KEY) as { id: string };

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Invalid token');
    }

    const userId = decodedToken.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hashPass = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        password: hashPass,
        isVerified: true,
      },
    });

    console.log('Updated User:', updatedUser); // Log the updated user
    console.log('User Role:', user.role); // Log the role

    return { ...updatedUser, role: user.role }; // Include the role in the response
  }

  async resendVerification(req: Request) {
    try {
      const { email } = req.body;
      const select: Prisma.UserSelectScalar = {
        id: true,
        isVerified: true,
      };
      const data = await prisma.user.findUnique({
        select,
        where: { email: email },
      });
      if (data) {
        if (data.isVerified) {
          return 'You have previously verified your email';
        } else {
          let message = await this.sendingEmail(
            data.id,
            email,
            '/../templates/verification.html',
            'Confirm Your Email Address For Atcasa',
            'verify',
          );
          return message;
        }
      }
    } catch (error) {
      console.log('error resend email');
    }
  }

  async editUserProfile(req: Request) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const { email, first_name, last_name, password } = req.body;
    const file = req.file;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedData: Prisma.UserUpdateInput = {};

      if (email && email !== user.email) {
        console.log('test 2');

        updatedData.email = email;
        updatedData.isVerified = false;
        updatedData.isRequestingEmailChange = true;

        console.log('Preparing to send verification email to:', email);
        const sentEmail = await this.sendingEmail(
          user.id,
          email,
          '/../templates/verification.html',
          'Confirm Your Email Address For Atcasa',
          'verify',
        );

        console.log('Verification email result:', sentEmail);
      }

      if (first_name !== undefined) {
        updatedData.first_name = first_name;
        console.log('First name updated to:', first_name);
      }

      if (last_name !== undefined) {
        updatedData.last_name = last_name;
        console.log('Last name updated to:', last_name);
      }

      if (password) {
        updatedData.password = await hashPassword(password);
        console.log('Password updated');
      }

      if (file) {
        const buffer = await sharp(file.buffer).png().toBuffer();
        updatedData.image = buffer;
        const imageName = shortid.generate();
        updatedData.image_name = imageName;
        console.log('Image updated');
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });

      console.log('Updated User:', updatedUser);

      const updatedUserInfo = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          isVerified: true,
          first_name: true,
          last_name: true,
          isRequestingEmailChange: true,
          image_name: true,
          role: true,
        },
        where: { id: userId },
      });

      const newToken = createToken(
        {
          ...updatedUserInfo,
          type: 'access-token',
        },
        '15m',
      );

      return { user: updatedUserInfo, token: newToken };
    } catch (error) {
      console.error('Error in editUserProfile:', error);
      throw error;
    }
  }

  async renderPicUser(req: Request) {
    const imageName = req.params.imageName;
    const data = await prisma.user.findUnique({
      where: {
        image_name: imageName,
      },
    });
    return data?.image ?? null;
  }

  async getProfileByTenantId(req: Request) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    delete (user as any).image;

    return user;
  }
}

export default new UserService();
