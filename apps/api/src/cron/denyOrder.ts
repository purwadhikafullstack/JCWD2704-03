import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
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
      }

      console.log(`${unpaidOrders.length} unpaid orders cancelled.`);
    } catch (error) {
      console.error('Error cancelling unpaid orders:', error);
    }
  });
};
