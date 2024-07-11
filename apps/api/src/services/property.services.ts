import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';

class PropertyService {
  async getRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<number> {
    // Get the initial availability of the room
    const room = await prisma.room.findUnique({
      where: { id: roomId }, // Specify the room ID here
      select: { availability: true },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    // Get the count of bookings for the room within the specified date range
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

    // Calculate remaining availability
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
          City: true,
        },
      });

      return properties;
    } catch (error) {
      throw new Error('Error searching properties');
    }
  }
}

export default new PropertyService();
