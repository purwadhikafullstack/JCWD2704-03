import { Request } from 'express';
import { prisma } from '../libs/prisma';
class ReservationService {
  async getAllOrder(req: Request) {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error}`);
    }
  }
  async getOrderByUserId(req: Request) {
    const { userId } = req.params;
    const data = await prisma.order.findMany({
      where: { user_id: userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        user_id: true,
        property_id: true,
        room_id: true,
        checkIn_date: true,
        checkOut_date: true,
        total_room: true,
        total_price: true,
        guest: true,
        payment_proof: true,
        status: true,
        invoice_id: true,
        createdAt: true,
        updatedAt: true,
        property: {
          select: {
            id: true,
            tenant_id: true,
            desc: true,
            city: true,
            category: true,
            pic: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      checkOut_date,
      total_room,
      payment_proof,
      total_price,
      guest,
      status = 'pending_payment',
    } = req.body;
    const parsedTotalRoom = parseInt(total_room, 10);
    const room = await prisma.room.findFirst({
      where: { id: room_id },
    });
    if (!room) {
      throw new Error('Room not found');
    }
    const roomPrice = room?.price;
    const adjustedTotalPrice = total_room * roomPrice;
    await prisma.room.update({
      where: { id: room_id },
      data: {
        availability: room.availability - total_room,
      },
    });

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user_id } },
        property: { connect: { id: property_id } },
        room: { connect: { id: room_id } },
        checkIn_date: new Date(checkIn_date),
        checkOut_date: new Date(checkOut_date),
        total_room: parsedTotalRoom,
        total_price: adjustedTotalPrice,
        guest,
        payment_proof,
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
          // Cancel the order
          await prisma.order.update({
            where: { id: expireOrder.id },
            data: { status: 'cancelled' },
          });
        }
      },
      60 * 60 * 1000,
    );
    return order;
  }
}

export default new ReservationService();
