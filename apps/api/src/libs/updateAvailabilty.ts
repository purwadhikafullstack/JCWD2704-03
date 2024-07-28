// import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
// import path from 'path';
// import { transporter } from './nodemailer';
// import moment, { locales } from 'moment-timezone';
// const prisma = new PrismaClient();

// export default async function updateAvalibility(
//   orderId: string,
//   roomId: string,
// ) {
//   try {
//     const order = await prisma.order.findUnique({
//       where: {
//         id: orderId,
//         status: 'success',
//       },
//     });
//     var cron = require('node-cron');
//     let targetDate = new Date();
//     if (order) {
//       targetDate = new Date(order?.checkIn_date);
//     }
//     console.log(order?.checkIn_date);
//     function getCronExpression(date: Date) {
//       const second = date.getUTCSeconds();
//       const minute = date.getUTCMinutes();
//       const hours = date.getUTCHours();
//       const dayOfMonth = date.getUTCDate();
//       const month = date.getUTCMonth() + 1;
//       return `${second} ${minute} ${hours} ${dayOfMonth} ${month} *`;
//     }
//     console.log(getCronExpression(targetDate));

//     const task = cron.schedule(
//       getCronExpression(targetDate),
//       () => {
//         console.log('masuk function');
//         async () => {
//           const room = await prisma.room.findFirst({ where: { id: roomId } });
//           if (!room) {
//             throw new Error('Room not found');
//           }
//           if (!order?.total_room) {
//             throw new Error('total room not found');
//           }
//           const newAvailability = room.availability - order?.total_room;
//           await prisma.room.update({
//             where: { id: roomId },
//             data: {
//               availability: newAvailability,
//             },
//           });
//         };
//         task.stop();
//       },
//       {
//         scheduled: true,
//         timezone: 'Asia/Jakarta',
//       },
//     );
//   } catch (error) {
//     console.error('Error retrieving orders:', error);
//   }
// }
import { Request } from 'express';
import { prisma } from '../libs/prisma';
import { generateInvoice } from '@/utils/invoice';

class ReservationService {
  async createOrder(req: Request) {
    const {
      user_id,
      property_id,
      room_id,
      checkIn_date,
      checkOut_date,
      total_room,
      payment_method,
      total_price,
      status = 'pending_payment',
    } = req.body;
    const rooms = await prisma.room.findMany({
      where: { id: room_id },
      select: {
        roomCategory_id: true,
      },
    });

    if (rooms.length < total_room) {
      // Tidak cukup kamar dalam kategori ini
      return false;
    }
    console.log(rooms);
    const room = await prisma.roomCategory.findFirst({
      where: { id: room_id },
    });
    if (!room) {
      throw new Error('Room not found');
    }
    const parsedTotalRoom = parseInt(total_room, 10);
    const checkIn = new Date(checkIn_date);
    const checkOut = new Date(checkOut_date);
    const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
    // Calculate the duration in days
    const durationInDays = Math.ceil(diff / (1000 * 3600 * 24));

    console.log(durationInDays);
    if (checkIn > checkOut) {
      console.error('Check-out date must be after check-in date!');
    }
    let adjustedTotalPrice;
    if (room.peak_price) {
      adjustedTotalPrice = durationInDays * parsedTotalRoom * room.peak_price;
    } else {
      adjustedTotalPrice = durationInDays * parsedTotalRoom * room.price;
    }
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user_id } },
        property: { connect: { id: property_id } },
        room: { connect: { id: room_id } },
        checkIn_date: new Date(checkIn_date),
        checkOut_date: new Date(checkOut_date),
        total_room: parsedTotalRoom,
        total_price: adjustedTotalPrice,
        payment_method,
        invoice_id: generateInvoice(property_id),
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    setTimeout(
      async () => {
        const expireOrder = await prisma.order.findUnique({
          where: { id: order.id },
        });
        if (expireOrder && expireOrder.status === 'pending_payment') {
          // Fetch current room availability before updating
          const currentRoom = await prisma.room.findFirst({
            where: { id: room_id },
          });

          if (!currentRoom) {
            throw new Error('Room not found during cancellation process');
          }
          // Cancel the order
          await prisma.$transaction([
            prisma.order.update({
              where: { id: expireOrder.id },
              data: { status: 'cancelled' },
            }),
          ]);
        }
      },
      60 * 60 * 1000,
    );
    return order;
  }
}
