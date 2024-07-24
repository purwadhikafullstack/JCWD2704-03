import { Request } from 'express';
import { prisma } from '../libs/prisma';
import sendBookingReminders from '@/cron/reminder';
import { startExpireDenyOrdersCron } from '@/cron/denyOrder';
class StatusService {
  async changeStatusOrderByTenant(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'pending_payment',
        cancel_date: new Date(),
      },
    });
    let cronStarted = false;
    if (!cronStarted) {
      startExpireDenyOrdersCron();
      cronStarted = true;
    }

    // setTimeout(
    //   async () => {
    //     const expireOrder = await prisma.order.findUnique({
    //       where: { id: orderId },
    //       include: {
    //         OrderRoom: {
    //           // Mengambil relasi OrderRoom
    //           include: {
    //             room: true, // Mengambil data Room dari OrderRoom
    //           },
    //         },
    //       },
    //     });
    //     if (expireOrder && expireOrder.status === 'pending_payment') {
    //       // Ambil semua room_id dari OrderRoom
    //       const room_ids = expireOrder.OrderRoom.map(
    //         (orderRoom) => orderRoom.room_id,
    //       );

    //       if (room_ids.length === 0) {
    //         throw new Error(
    //           'No rooms found for the order during cancellation process',
    //         );
    //       }
    //       // Fetch rooms emeriksa apakah semua kamar yang terdaftar ditemukan di database.
    //       const currentRooms = await prisma.room.findMany({
    //         where: {
    //           id: { in: room_ids },
    //         },
    //       });

    //       if (currentRooms.length !== room_ids.length) {
    //         throw new Error(
    //           'One or more rooms not found during cancellation process',
    //         );
    //       }
    //       // Cancel the order
    //       await prisma.$transaction([
    //         prisma.order.update({
    //           where: { id: expireOrder.id },
    //           data: {
    //             status: 'cancelled',
    //             checkIn_date: new Date('1970-01-01T00:00:00Z'),
    //             checkOut_date: new Date('1970-01-01T00:00:00Z'),
    //           },
    //         }),
    //       ]);
    //     }
    //   },
    //   60 * 60 * 1000,
    // );
    return updateStatus;
  }
  async cancelOrderByTenant(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        checkIn_date: new Date('1970-01-01T00:00:00Z'),
        checkOut_date: new Date('1970-01-01T00:00:00Z'),
      },
    });
    return updateStatus;
  }
  async cancelOrderByUser(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        checkIn_date: new Date('1970-01-01T00:00:00Z'),
        checkOut_date: new Date('1970-01-01T00:00:00Z'),
      },
    });
    return updateStatus;
  }

  async confirmOrder(req: Request) {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'success',
      },
    });
    if (updateStatus) await sendBookingReminders(orderId);
    const isDataReviewExist = await prisma.review.findFirst({
      where: { order_id: order.id, property_id: order.property_id },
    });

    if (!isDataReviewExist) {
      await prisma.review.create({
        data: {
          property_id: order.property_id,
          user_id: order.user_id,
          order_id: orderId,
          review: '',
          rating: 0,
        },
      });
    }

    return updateStatus;
  }
  async renderPaymentProof(req: Request) {
    const data = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });
    return data?.payment_proof;
  }
}

export default new StatusService();
