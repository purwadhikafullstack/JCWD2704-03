import { transporter } from '@/libs/nodemailer';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const startExpireDenyOrdersCron = () => {
  var cron = require('node-cron');
  console.log('Starting expire orders cron job...');
  cron.schedule('*/5 * * * *', async () => {
    const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
    try {
      const unpaidOrders = await prisma.order.findMany({
        where: {
          status: 'pending_payment',
          cancel_date: {
            lte: oneHourAgo,
          },
        },
        include: { OrderRoom: true },
      });

      for (const unpaidOrder of unpaidOrders) {
        await prisma.order.update({
          where: { id: unpaidOrder.id },
          data: {
            status: 'cancelled',
            checkIn_date: new Date('1970-01-01T00:00:00Z'),
            checkOut_date: new Date('1970-01-01T00:00:00Z'),
          },
        });
        const orderDetails = await prisma.order.findUnique({
          where: { id: unpaidOrder.id },
          include: {
            user: true,
            property: true,
            RoomCategory: true,
          },
        });
        const templatePath = path.join(
          __dirname,
          '../templates/cancelled.html',
        );
        let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

        if (orderDetails) {
          const userEmail = orderDetails.user.email;
          const propertyName = orderDetails.property.name;
          const roomType =
            orderDetails.RoomCategory?.type || 'Unknown Room Type';
          const html = htmlTemplate
            .replace(/{propertyName}/g, propertyName)
            .replace(/{roomType}/g, roomType);

          transporter.sendMail({
            from: 'atcasaco@gmail.com',
            to: userEmail,
            subject: 'Booking Cancelled',
            html,
          });
          console.log('kiiriim email', userEmail);
        }
      }

      console.log(`${unpaidOrders.length} unpaid orders cancelled.`);
    } catch (error) {
      console.error('Error cancelling unpaid orders:', error);
    }
  });
};
