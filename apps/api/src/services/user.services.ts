import type { TUser } from '@/models/user.model';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../libs/bcrypt';
import { createToken } from '../libs/jwt';
import { transporter } from '../libs/nodemailer';
import { BASE_WEB_URL, SECRET_KEY } from '../configs/config';
import { verify } from 'jsonwebtoken';
import fs from 'fs';
import path, { join } from 'path';
import { render } from 'mustache';
import { prisma } from '../libs/prisma';
import type { Prisma } from '@prisma/client';
import sharp from 'sharp';
import shortid from 'shortid';
import { addHours } from 'date-fns';
import { generateVerificationUrl } from '@/utils/sendingEmail';

class UserService {
  async userRegisterEmail(req: Request) {
    console.log('Start function userRegisterEmail');

    const { email } = req.body;
    console.log('User email:', email);

    try {
      const existingUser = await prisma.user.findMany({ where: { email } });

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

      const verificationToken = createToken({ id: newUser.id }, '1h');
      const tokenExpiration = addHours(new Date(), 1);

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          verificationToken,
          tokenExpiration,
        },
      });

      let sentEmail = await this.sendingEmail(
        newUser.email,
        verificationToken,
        'Confirm Your Email Address For Atcasa',
        '/../templates/verification.html',
        'verify',
      );
      console.log('Email sent:', sentEmail);
    } catch (error) {
      console.error('Error in userRegisterEmail:', error);
      throw error;
    }
  }

  async tenantRegisterEmail(req: Request) {
    console.log('Start function tenantRegisterEmail');

    const { email } = req.body;
    console.log('Tenant input email:', email);

    try {
      const existingUser = await prisma.user.findMany({ where: { email } });

      if (existingUser.length) {
        const error = new Error('Email has already been registered');
        (error as any).statusCode = 409;
        throw error;
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          role: 'tenant',
          isVerified: false,
        },
      });
      console.log('New user created:', newUser);

      const verificationToken = createToken({ id: newUser.id }, '1h');
      const tokenExpiration = addHours(new Date(), 1);

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          verificationToken,
          tokenExpiration,
        },
      });

      let sentEmail = await this.sendingEmail(
        newUser.email,
        verificationToken,
        'Confirm Your Email Address For Atcasa',
        '/../templates/verification.html',
        'verify',
      );
    } catch (error) {
      console.error('Error in tenantRegisterEmail:', error);
      throw error;
    }
  }

  async sendingEmail(
    userEmail: string,
    verificationToken: string,
    emailSubject: string,
    templatePath: string,
    action: 'verify' | 'reverify' | 'changePassword',
  ) {

    if (!userEmail) {
      console.error('No recipient email defined');
      return 'No recipient email defined';
    }
    const verifyToken = createToken({ id: userId }, '1hr');
    const template = fs
      .readFileSync(__dirname + pathToEmailTemplate)
      .toString();
    const html = render(template, {
      email: userEmail,
      verify_url: `${'https://jcwd270403.purwadhikabootcamp.com'}/${verify_url}/${verifyToken}`,
    });

    const template = fs.readFileSync(__dirname + templatePath).toString();

    const verifyUrl = generateVerificationUrl(verificationToken, action);

    const html = template
      .replace('{{verify_url}}', verifyUrl)
      .replace('{{email_subject}}', emailSubject);

    try {
      await transporter.sendMail({
        to: userEmail,
        subject: emailSubject,
        html,
      });
      return 'Email sent successfully';
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  async sendVerification(req: Request) {
    const { token } = req.params;

    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    try {
      console.log('Received token:', token);

      const decodedToken = verify(token, process.env.SECRET_KEY as string) as {
        id: string;
      };

      console.log('Decoded token:', decodedToken);

      if (!decodedToken || !decodedToken.id) {
        console.error('Invalid token');
        return { isVerified: false, message: 'Invalid token', user: null };
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: decodedToken.id },
      });

      console.log('Existing user:', existingUser);

      if (!existingUser) {
        console.error('User not found');
        return { isVerified: false, message: 'User not found', user: null };
      }

      if (
        existingUser.tokenExpiration &&
        new Date() > new Date(existingUser.tokenExpiration)
      ) {
        console.error('Token has expired');
        return { isVerified: false, message: 'Token has expired', user: null };
      }

      if (existingUser.verificationToken !== token) {
        console.error('Invalid token');
        return { isVerified: false, message: 'Invalid token', user: null };
      }

      if (existingUser.isVerified) {
        console.error('User already verified');
        return {
          isVerified: true,
          message: 'User already verified',
          user: existingUser,
        };
      }

      console.log('Token verification successful');
      return {
        isVerified: false,
        message: 'Token is valid but user not yet verified',
        user: existingUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error during verification:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      return {
        isVerified: false,
        message: 'Error during verification',
        user: null,
      };
    }
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

    if (user.isVerified) {
      throw new Error('User is already verified');
    }

    const hashPass = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        password: hashPass,
        isVerified: true,
        verificationToken: null,
        tokenExpiration: null,
      },
    });

    // console.log('Updated User:', updatedUser);
    console.log('User Role:', user.role);

    return { ...updatedUser, role: user.role };
  }

  async resendVerification(
    req: Request,
  ): Promise<{ email?: string; message: string }> {
    try {
      const { email } = req.body;

      if (!email) {
        return { message: 'Email is required' };
      }

      const select: Prisma.UserSelectScalar = {
        id: true,
        isVerified: true,
      };

      const data = await prisma.user.findUnique({
        select,
        where: { email: email },
      });

      if (!data) {
        return { message: 'User not found' };
      }

      if (data.isVerified) {
        return { message: 'You have previously verified your email' };
      }

      const verificationToken = createToken({ id: data.id }, '1h');
      console.log('Generated verificationToken:', verificationToken);
      const tokenExpiration = addHours(new Date(), 1);

      await prisma.user.update({
        where: { id: data.id },
        data: {
          verificationToken,
          tokenExpiration,
        },
      });

      const message = await this.sendingEmail(
        email,
        verificationToken,
        'Confirm Your Email Address For Atcasa',
        '/../templates/verification.html',
        'verify',
      );

      return { email, message: message || 'Verification email sent' };
    } catch (error) {
      console.error('Error resend email', error);
      return { message: 'Internal server error' };
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
        const verificationToken = createToken({ id: userId }, '1h');
        const tokenExpiration = addHours(new Date(), 1);

        updatedData.email = email;
        updatedData.isVerified = false;
        updatedData.isRequestingEmailChange = true;
        updatedData.verificationToken = verificationToken;
        updatedData.tokenExpiration = tokenExpiration;

        console.log('Preparing to send verification email to:', email);

        const sentEmail = await this.sendingEmail(
          email,
          verificationToken,
          'We received a request to change your e-mail on Atcasa',
          '/../templates/reverify.html',
          'reverify',
        );

        if (!sentEmail) {
          throw new Error('Failed to send verification email');
        }

        console.log('Verification email sent');
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

      // console.log('Updated User:', updatedUser);

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
        '1h',
      );

      return { user: updatedUserInfo, token: newToken };
    } catch (error) {
      console.error('Error in editUserProfile:', error);
      throw error;
    }
  }

  async reverifyEmail(req: Request) {
    const token = req.params.token as string;

    console.log('Received token:', token);

    if (!token) {
      throw new Error('Token is required');
    }

    try {
      const decodedToken = verify(token, process.env.SECRET_KEY as string) as {
        id: string;
        email: string;
        isVerified: boolean;
        first_name: string;
        last_name: string;
        isRequestingEmailChange: boolean;
        image_name: string | null;
        role: string;
        type: string;
        iat: number;
        exp: number;
      };

      console.log('Decoded token:', decodedToken);

      if (!decodedToken || !decodedToken.id) {
        throw new Error('Invalid token');
      }

      const id = decodedToken.id;
      console.log('User ID from token:', id);

      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      // console.log('Fetched user:', user);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isRequestingEmailChange) {
        throw new Error('Invalid or expired token');
      }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          isVerified: true,
          isRequestingEmailChange: false,
          verificationToken: null,
          tokenExpiration: null,
        },
      });

      // console.log('Updated user:', updatedUser);

      console.log('Email verification successful for user:', id);

      const newToken = createToken(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          isVerified: updatedUser.isVerified,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          isRequestingEmailChange: updatedUser.isRequestingEmailChange,
          image_name: updatedUser.image_name,
          role: updatedUser.role,
          type: 'access-token',
        },
        '1h',
      );

      return {
        message: 'Email verified successfully',
        token: newToken,
        role: updatedUser.role,
      };
    } catch (error) {
      console.error('Error in reverifyEmail:', error);
      throw new Error('Internal server error');
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
