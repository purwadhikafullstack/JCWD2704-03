// import { Request } from 'express';
// import { prisma } from '../libs/prisma';
// import { generateInvoice } from '@/utils/invoice';
// import sharp from 'sharp';
// import { scheduleRoomAvailabilityUpdate } from '@/libs/scheduler';
// import sendBookingReminders from '@/libs/reminder';
// import moment from 'moment-timezone';
// class ReservationService {
//   async getAllOrder(req: Request) {
//     try {
//       const orders = await prisma.order.findMany();
//       return orders;
//     } catch (error) {
//       throw new Error(`Error fetching orders: ${error}`);
//     }
//   }
//   async getOrderByOrderId(req: Request) {
//     const { orderId } = req.params;
//     const data = await prisma.order.findUnique({
//       where: { id: orderId },
//       select: {
//         checkIn_date: true,
//         checkOut_date: true,
//         total_room: true,
//         total_price: true,
//         payment_method: true,
//         room: true,
//         property: true,
//         invoice_id: true,
//         id: true,
//       },
//     });
//     if (!data) {
//       throw new Error('Order not found');
//     }

//     return data;
//   }
//   async getOrderByUserId(req: Request) {
//     const staticUserId = 'cly9wnpqn0008zgag7m5r2b3i';
//     const data = await prisma.order.findMany({
//       // where: { user_id: req.user?.id },
//       where: { user_id: staticUserId },
//       orderBy: {
//         updatedAt: 'desc',
//       },
//       include: {
//         property: true,
//         room: true,
//         user: true,
//       },
//     });
//     return data;
//   }
//   async getOrderBySellerId(req: Request) {
//     const data = await prisma.order.findMany({
//       where: {
//         property: {
//           tenant_id: 'cly9whjqn0000zgagrd8gp3ji',
//           // tenant_id: req.user?.id,
//         },
//       },
//       include: {
//         user: true,
//         property: true,
//         room: true,
//       },
//       orderBy: {
//         updatedAt: 'desc',
//       },
//     });
//     return data;
//   }

//   async createOrder(req: Request) {
//     const {
//       user_id,
//       property_id,
//       room_id,
//       checkIn_date,
//       checkOut_date,
//       total_room,
//       payment_method,
//       total_price,
//       status = 'pending_payment',
//     } = req.body;
//     const parsedTotalRoom = parseInt(total_room, 10);

//     const room = await prisma.room.findFirst({
//       where: { id: room_id },
//     });
//     if (!room) {
//       throw new Error('Room not found');
//     }
//     const checkIn = new Date(checkIn_date);
//     const checkOut = new Date(checkOut_date);
//     const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
//     // Calculate the duration in days
//     const durationInDays = Math.ceil(diff / (1000 * 3600 * 24));

//     console.log(durationInDays);
//     if (checkIn > checkOut) {
//       console.error('Check-out date must be after check-in date!');
//     }
//     let adjustedTotalPrice;
//     if (room.peak_price) {
//       adjustedTotalPrice = durationInDays * parsedTotalRoom * room.peak_price;
//     } else {
//       adjustedTotalPrice = durationInDays * parsedTotalRoom * room.price;
//     }
//     await prisma.room.update({
//       where: { id: room_id },
//       data: {
//         availability: room.availability - total_room,
//       },
//     });
//     scheduleRoomAvailabilityUpdate(checkIn, room_id, parsedTotalRoom, false); // Reduce availability at check-in
//     scheduleRoomAvailabilityUpdate(checkOut, room_id, parsedTotalRoom, true); // Increase availability at check-out

//     const order = await prisma.order.create({
//       data: {
//         user: { connect: { id: user_id } },
//         property: { connect: { id: property_id } },
//         room: { connect: { id: room_id } },
//         checkIn_date: new Date(checkIn_date),
//         checkOut_date: new Date(checkOut_date),
//         total_room: parsedTotalRoom,
//         total_price: adjustedTotalPrice,
//         payment_method,
//         invoice_id: generateInvoice(property_id),
//         status,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     setTimeout(
//       async () => {
//         const expireOrder = await prisma.order.findUnique({
//           where: { id: order.id },
//         });
//         if (expireOrder && expireOrder.status === 'pending_payment') {
//           // Fetch current room availability before updating
//           const currentRoom = await prisma.room.findFirst({
//             where: { id: room_id },
//           });

//           if (!currentRoom) {
//             throw new Error('Room not found during cancellation process');
//           }
//           // Cancel the order
//           await prisma.$transaction([
//             prisma.order.update({
//               where: { id: expireOrder.id },
//               data: { status: 'cancelled' },
//             }),
//             prisma.room.update({
//               where: { id: room_id },
//               data: {
//                 availability: currentRoom.availability + parsedTotalRoom,
//               },
//             }),
//           ]);
//         }
//       },
//       60 * 60 * 1000,
//     );
//     return order;
//   }
//   async updateOrder(req: Request) {
//     const { orderId } = req.params;
//     const { file } = req;
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: {
//         property: true,
//         room: true,
//       },
//     });
//     if (!order) {
//       throw new Error('Order Not Found');
//     }
//     let paymentProofBuffer: Buffer | null = order.payment_proof;
//     let status = order.status;
//     if (file) {
//       paymentProofBuffer = await sharp(file.buffer).png().toBuffer();
//       status = 'awaiting_confirmation';
//     }
//     const updatedOrder = await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         payment_date: moment.tz('Asia/Jakarta').format(),
//         payment_proof: paymentProofBuffer,
//         status: status,
//         updatedAt: new Date(),
//       },
//     });
//     console.log('testttt', moment.tz('Asia/Jakarta').format());

//     if (updatedOrder) await sendBookingReminders(orderId);
//     return updatedOrder;
//   }
// }

// export default new ReservationService();
