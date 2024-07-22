// import { Request } from 'express';
// import { prisma } from '../libs/prisma';
// import { generateInvoice } from '@/utils/invoice';

// class ReservationService {
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
//     // Dapatkan semua kamar dengan kategori yang diberikan
//     const rooms = await prisma.room.findMany({
//       where: { id: room_id },
//       select: {
//         id: true,
//         roomCategory_id: true,
//       },
//     });

//     if (rooms.length < total_room) {
//       // Tidak cukup kamar dalam kategori ini
//       return false;
//     }
//     console.log('jumlah room yg tersedia', rooms); // ini bakal ngeluarin semua room di kategory tersebut
//     // Dapatkan semua pesanan untuk kamar-kamar ini dalam rentang tanggal yang diberikan
//     const conflictingOrders = await prisma.order.findMany({
//       where: {
//         room_id: {
//           in: rooms.map((room) => room.id),
//         },
//         AND: [
//           {
//             checkIn_date: {
//               lte: checkOut_date,
//             },
//           },
//           {
//             checkOut_date: {
//               gte: checkIn_date,
//             },
//           },
//         ],
//         status: 'success',
//       },
//     });

//     console.log(conflictingOrders); // ini ngecheck kalau misal udah ada kamar yg di order di tanggal checkIn sama checkOut
//     // Hitung total kamar yang dipesan untuk rentang tanggal yang diberikan
//     let totalBookedRooms = 0;
//     conflictingOrders.forEach((order) => {
//       totalBookedRooms += order.total_room;
//     });

//     // Periksa apakah kamar yang diminta tersedia
//     const isAvailable = rooms.length - totalBookedRooms >= total_room;
//     if (!isAvailable) {
//       throw new Error(
//         'Jumlah kamar yang diminta tidak tersedia untuk tanggal yang dipilih',
//       );
//     }

//     const initialRoom = await prisma.room.findFirst({
//       where: { id: room_id },
//       select: {
//         id: true,
//         roomCategory_id: true,
//       },
//     });

//     if (!initialRoom) {
//       throw new Error('Room not found');
//     }

//     const roomCategory_id = initialRoom.roomCategory_id;

//     // Dapatkan ID kamar yang tersedia untuk kategori yang diberikan
//     const availableRooms = await prisma.room.findFirst({
//       where: {
//         roomCategory_id,
//         id: {
//           notIn: conflictingOrders.map((order) => order.room_id),
//         },
//       },
//       take: total_room,
//     });

//     const room = await prisma.roomCategory.findFirst({
//       where: { id: room_id },
//     });
//     if (!room) {
//       throw new Error('Room not found');
//     }

//     const parsedTotalRoom = parseInt(total_room, 10);
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

//     // const order = await prisma.order.create({
//     //   data: {
//     //     user: { connect: { id: user_id } },
//     //     property: { connect: { id: property_id } },
//     //     // room: {
//     //     //   connect: availableRooms?.id,
//     //     // },
//     //     checkIn_date: new Date(checkIn_date),
//     //     checkOut_date: new Date(checkOut_date),
//     //     total_room: parsedTotalRoom,
//     //     total_price: adjustedTotalPrice,
//     //     payment_method,
//     //     invoice_id: generateInvoice(property_id),
//     //     status,
//     //     createdAt: new Date(),
//     //     updatedAt: new Date(),
//     //   },
//     // });
//     // setTimeout(
//     //   async () => {
//     //     const expireOrder = await prisma.order.findUnique({
//     //       where: { id: order.id },
//     //     });
//     //     if (expireOrder && expireOrder.status === 'pending_payment') {
//     //       // Fetch current room availability before updating
//     //       const currentRoom = await prisma.room.findFirst({
//     //         where: { id: room_id },
//     //       });

//     //       if (!currentRoom) {
//     //         throw new Error('Room not found during cancellation process');
//     //       }
//     //       // Cancel the order
//     //       await prisma.$transaction([
//     //         prisma.order.update({
//     //           where: { id: expireOrder.id },
//     //           data: { status: 'cancelled' },
//     //         }),
//     //       ]);
//     //     }
//     //   },
//     //   60 * 60 * 1000,
//     // );
//     // return order;
//   }
// }
