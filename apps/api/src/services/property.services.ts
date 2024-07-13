import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { Request } from 'express';

class PropertyService {
  async getRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<number> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { availability: true },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    const bookings = await prisma.order.findMany({
      where: {
        room_id: roomId,
        AND: [
          {
            checkIn_date: { lte: checkOut },
          },
          {
            checkOut_date: { gte: checkIn },
          },
        ],
      },
    });

    const bookedRooms = bookings.reduce(
      (total, booking) => total + booking.total_room,
      0,
    );

    const remainingAvailability = room.availability - bookedRooms;

    return remainingAvailability;
  }

  async searchProperties(
    location: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<any[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          AND: [
            { city: { contains: location } },
            {
              Room: {
                some: {
                  availability: { gte: 1 },
                  Order: {
                    none: {
                      AND: [
                        { checkIn_date: { lte: checkOut } },
                        { checkOut_date: { gte: checkIn } },
                        { status: { not: 'cancelled' } },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          Room: {
            include: {
              Order: true,
            },
          },
          tenant: true,
          // City: true,
        },
      });

      return properties;
    } catch (error) {
      throw new Error('Error searching properties');
    }
  }

  async getAllProp() {}

  async getAllRoom(req: Request) {
    const { id } = req.params;
    const rooms = await prisma.room.findMany({
      where: {
        property_id: id,
      },
    });
    return rooms;
  }

  async getRoomByRoomId(req: Request) {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
    });
    return room;
  }

  async renderPicProperty(req: Request) {
    const data = await prisma.property.findUnique({
      where: {
        id: req.params.id,
      },
    });
    return data?.pic;
  }

  async renderPicRoom(req: Request) {
    const data = await prisma.room.findUnique({
      where: {
        id: req.params.id,
      },
    });
    return data?.pic;
  }
}

export default new PropertyService();
