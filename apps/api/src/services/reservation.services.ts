import { Request } from 'express';
import { prisma } from '../libs/prisma';
import { generateInvoice } from '@/utils/invoice';
import sharp from 'sharp';
import moment from 'moment-timezone';
import { connect } from 'ngrok';
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
        RoomCategory: true,
        OrderRoom: true,
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
        user: true,
        RoomCategory: true,
        OrderRoom: true,
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
        property: true,
        user: true,
        RoomCategory: true,
        OrderRoom: true,
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
      room_id,
      checkIn_date,
      room_ids, // Array of room IDs
      checkOut_date,
      payment_method,
      total_price,
      roomCategory_id,
      status = 'pending_payment',
    } = req.body;

    let roomIdsArray = room_ids.split(',');
    roomIdsArray = [...new Set(roomIdsArray)];
    console.log('Number of rooms:', roomIdsArray.length);
    console.log('Room IDs:', roomIdsArray);

    const room = await prisma.room.findFirst({
      where: { id: roomIdsArray[0] },
      select: {
        roomCategory: true,
      },
    });

    if (!room) {
      throw new Error('Room not found');
    }
    const checkIn = new Date(checkIn_date);
    const checkOut = new Date(checkOut_date);
    const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
    // Calculate the duration in days
    const durationInDays = Math.ceil(diff / (1000 * 3600 * 24));
    console.log(durationInDays);
    if (checkIn > checkOut) {
      console.error('Check-out date must be after check-in date!');
    }

    // console.log('berapa kamar yang di minta', roomIdsArray.length());
    let adjustedTotalPrice;
    if (room.roomCategory.peak_price) {
      adjustedTotalPrice =
        durationInDays * roomIdsArray.length * room.roomCategory.peak_price;
    } else {
      adjustedTotalPrice =
        durationInDays * roomIdsArray.length * room.roomCategory.price;
    }

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user_id } },
        property: { connect: { id: property_id } },
        RoomCategory: { connect: { id: roomCategory_id } },
        checkIn_date: new Date(checkIn_date),
        checkOut_date: new Date(checkOut_date),
        total_price: adjustedTotalPrice,
        payment_method,
        invoice_id: generateInvoice(property_id),
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const orderRooms = roomIdsArray.map((room_id: string) => ({
      order_id: order.id,
      room_id,
    }));

    await prisma.orderRoom.createMany({
      data: orderRooms,
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
              data: {
                status: 'cancelled',
                checkIn_date: new Date('1970-01-01T00:00:00Z'),
                checkOut_date: new Date('1970-01-01T00:00:00Z'),
              },
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
        OrderRoom: true,
        RoomCategory: true,
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
