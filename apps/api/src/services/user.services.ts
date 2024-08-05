import type { TUser } from '@/models/user.model';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../libs/bcrypt';
import { createToken } from '../libs/jwt';
import { transporter } from '../libs/nodemailer';
import { SECRET_KEY } from '../configs/config';
import { verify } from 'jsonwebtoken';
import fs from 'fs';
import path, { join } from 'path';
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
    const verifyToken = createToken({ id: userId }, '1hr');
    const template = fs
      .readFileSync(__dirname + pathToEmailTemplate)
      .toString();
    const html = render(template, {
      email: userEmail,
      verify_url: `${'https://jcwd270403.purwadhikabootcamp.com'}/${verify_url}/${verifyToken}`,
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
      return { redirectUrl: '/' };
    }

    await prisma.user.update({
      where: { id: decodedToken.id },
      data: { isVerified: true },
    });

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
        updatedData.email = email;
        updatedData.isVerified = false;
        updatedData.isRequestingEmailChange = true;

        console.log('Preparing to send verification email to:', email);

        const baseUrl =
          'https://jcwd270403.purwadhikabootcamp.com' ||
          'http://localhost:3000';
        const token = createToken(
          {
            id: userId,
            email: user.email,
            isVerified: user.isVerified,
            first_name: user.first_name,
            last_name: user.last_name,
            isRequestingEmailChange: true,
            image_name: user.image_name,
            role: user.role,
            type: 'access-token',
          },
          '1h',
        );
        const verificationUrl = `${baseUrl}/reverify/${token}`;

        const templatePath = path.join(__dirname, '../templates/reverify.html');
        let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
        const html = htmlTemplate.replace(
          /{verificationUrl}/g,
          verificationUrl,
        );

        const mailOptions = {
          from: 'purwadhika2704@gmail.com',
          to: email,
          subject: 'Email Address Change Request',
          html,
        };

        // Send the email
        try {
          await transporter.sendMail(mailOptions);
          console.log('Verification email sent');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
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
      // Decode and verify the token
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

      // Fetch the user from the database
      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      console.log('Fetched user:', user);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isRequestingEmailChange) {
        throw new Error('Invalid or expired token');
      }

      // Update the user record
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          isVerified: true,
          isRequestingEmailChange: false,
        },
      });

      console.log('Updated user:', updatedUser);

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
        '1h', // Adjust the expiration time as needed
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
