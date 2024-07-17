import { Request } from 'express';
import { prisma } from '../libs/prisma';
import { generateInvoice } from '@/utils/invoice';
import sharp from 'sharp';
import moment from 'moment-timezone';
class ReservationService {
  async getAllOrder(req: Request) {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error}`);
    }
  }
  async getOrderByOrderId(req: Request) {
    const { orderId } = req.params;
    const data = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        property: true,
        user: true,
        room: true,
      },
    });
    if (!data) {
      throw new Error('Order not found');
    }

    return data;
  }
  async getOrderByUserId(req: Request) {
    const staticUserId = 'cly9wnpqn0008zgag7m5r2b3i';
    const data = await prisma.order.findMany({
      // where: { user_id: req.user?.id },
      where: { user_id: staticUserId },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        property: true,
        room: true,
        user: true,
      },
    });
    return data;
  }
  async getOrderBySellerId(req: Request) {
    const data = await prisma.order.findMany({
      where: {
        property: {
          tenant_id: 'cly9whjqn0000zgagrd8gp3ji',
          // tenant_id: req.user?.id,
        },
      },
      include: {
        user: true,
        property: true,
        room: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return data;
  }
  async createOrder(req: Request) {
    const {
      user_id,
      property_id,
      roomCategory_id,
      room_id,
      checkIn_date,
      checkOut_date,
      total_room = 1,
      payment_method,
      total_price,
      status = 'pending_payment',
    } = req.body;

    const checkIn = new Date(checkIn_date);
    const checkOut = new Date(checkOut_date);
    const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
    const durationInDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (checkIn > checkOut) {
      throw new Error('Check-out date must be after check-in date!');
    }

    // Ambil informasi harga kamar
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: room_id },
    });

    if (!roomCategory) {
      throw new Error('Room category not found.');
    }
    console.log(roomCategory);

    const rooms = await prisma.room.findMany({
      where: { id: room_id },
      select: {
        id: true,
        roomCategory_id: true,
      },
    });
    console.log(rooms);

    // Check room availability
    const conflictingOrders = await prisma.order.findMany({
      where: {
        room_id: {
          in: rooms.map((room) => room.id),
        },
        AND: [
          {
            checkIn_date: {
              lte: checkOut_date,
            },
          },
          {
            checkOut_date: {
              gte: checkIn_date,
            },
          },
        ],
      },
    }); // ini ngecheck kalau misal udah ada kamar yg di order di tanggal checkIn sama checkOut

    console.log(conflictingOrders);

    // Dapatkan ID kamar yang tersedia untuk kategori yang diberikan
    const availableRooms = await prisma.room.findFirst({
      where: {
        roomCategory: { id: roomCategory.id },
        id: {
          notIn: conflictingOrders.map((order) => order.room_id),
        },
      },
      take: total_room,
    });

    let adjustedTotalPrice;
    if (roomCategory.peak_price) {
      adjustedTotalPrice =
        durationInDays * total_room * roomCategory.peak_price;
    } else {
      adjustedTotalPrice = durationInDays * total_room * roomCategory.price;
    }

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user_id } },
        property: { connect: { id: property_id } },
        room: { connect: { id: availableRooms?.id } },
        checkIn_date: checkIn,
        checkOut_date: checkOut,
        total_price: adjustedTotalPrice,
        total_room,
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
  async updateOrder(req: Request) {
    const { orderId } = req.params;
    const { file } = req;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        property: true,
        room: true,
      },
    });
    if (!order) {
      throw new Error('Order Not Found');
    }
    let paymentProofBuffer: Buffer | null = order.payment_proof;
    let status = order.status;
    if (file) {
      paymentProofBuffer = await sharp(file.buffer).png().toBuffer();
      status = 'awaiting_confirmation';
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_date: moment.tz('Asia/Jakarta').format(),
        payment_proof: paymentProofBuffer,
        status: status,
        updatedAt: new Date(),
      },
    });
    console.log('testttt', moment.tz('Asia/Jakarta').format());

    return updatedOrder;
  }
}

export default new ReservationService();
