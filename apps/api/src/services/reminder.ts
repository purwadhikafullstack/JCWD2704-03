import type { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { transporter } from '../libs/nodemailer';
import { Request } from 'express';
import fs from 'fs';
import { join } from 'path';
import { render } from 'mustache';

class ReminderService {
  async getOrdersForReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        checkIn_date: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return orders;
  }

  async sendReminderEmail(user: any, order: any, pathToEmailTemplate: string) {
    const template = fs
      .readFileSync(join(__dirname, pathToEmailTemplate))
      .toString();

    const html = render(template, {
      username: user.username,
      checkInDate: order.checkIn_date.toISOString().split('T')[0],
    });

    let returnFromTransporter = await transporter
      .sendMail({
        to: user.email,
        subject: 'Check-In Reminder',
        html,
      })
      .then(() => 'Email sent successfully')
      .catch((error) => error.message);

    return returnFromTransporter;
  }

  async checkForReminders() {
    const orders = await this.getOrdersForReminders();

    for (const order of orders) {
      await this.sendReminderEmail(
        order.user,
        order,
        '/../templates/reminder.html',
      );
    }
  }
}

export default new ReminderService();
