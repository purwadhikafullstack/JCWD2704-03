import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import moment, { locales } from 'moment-timezone';
import { transporter } from '@/libs/nodemailer';
const prisma = new PrismaClient();

// Function to send reminder emails
export default async function sendBookingReminders(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        status: 'awaiting_confirmation',
      },
      include: {
        user: true,
        property: true,
      },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    const templatePath = path.join(__dirname, 'checkinreminder.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    htmlTemplate = htmlTemplate.replace('{propertyName}', order.property.name);
    htmlTemplate = htmlTemplate.replace(
      '{checkInDate}',
      moment(order.checkIn_date).format('MMMM Do YYYY'),
    );
    var cron = require('node-cron');
    let targetDate = new Date();
    if (order) {
      targetDate = new Date(order?.checkIn_date);
    }
    console.log(order?.checkIn_date);
    function getCronExpression(date: Date) {
      const second = 10;
      const minute = 59;
      const hours = 23;
      const dayOfMonth = date.getUTCDate() - 1;
      const month = date.getUTCMonth() + 1;
      // const second = 10;
      // const minute = 59;
      // const hours = 23;
      // const dayOfMonth = date.getUTCDate() - 1;
      // const month = date.getUTCMonth() + 1;
      return `${second} ${minute} ${hours} ${dayOfMonth} ${month} *`;
    }
    console.log(getCronExpression(targetDate));

    const task = cron.schedule(
      getCronExpression(targetDate),
      () => {
        console.log('masuk function');
        const krimEmail = transporter.sendMail({
          from: 'purwadhika2704@gmail.com',
          to: order.user.email,
          subject: 'Booking Reminder',
          html: htmlTemplate,
        });
        console.log('kiiriim email', krimEmail);

        task.stop();
      },
      {
        scheduled: true,
        timezone: 'Asia/Jakarta',
      },
    );
  } catch (error) {
    console.error('Error retrieving orders:', error);
  }
}
