import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { Request } from 'express';
import { TProperty } from '@/models/property.model';
import sharp from 'sharp';

class PropertyService {
  // async getRoomAvailability(
  //   roomId: string,
  //   checkIn: Date,
  //   checkOut: Date,
  // ): Promise<number> {
  //   const room = await prisma.room.findUnique({
  //     where: { id: roomId },
  //     // select: { availability: true },
  //   });

  //   if (!room) {
  //     throw new Error('Room not found');
  //   }

  //   const bookings = await prisma.order.findMany({
  //     where: {
  //       room_id: roomId,
  //       AND: [
  //         {
  //           checkIn_date: { lte: checkOut },
  //         },
  //         {
  //           checkOut_date: { gte: checkIn },
  //         },
  //       ],
  //     },
  //   });

  //   const bookedRooms = bookings.reduce(
  //     (total, booking) => total + booking.total_room,
  //     0,
  //   );

  //   const remainingAvailability = room.availability - bookedRooms;

  //   return remainingAvailability;
  // }

  async searchProperties(
    city: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<any[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          AND: [
            { city: { contains: city } },
            {
              Room: {
                some: {
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

  // async getPropertyDetail(req: Request) {
  //   const { name } = req.params;
  //   const { checkIn, checkOut } = req.query;

  //   const formattedName = name.replace(/-/g, ' ');

  //   if (!formattedName || !checkIn || !checkOut) {
  //     throw new Error(
  //       'Property name, check-in, and check-out dates are required',
  //     );
  //   }

  //   // Safely get the checkIn and checkOut values
  //   const checkInValue = Array.isArray(checkIn) ? checkIn[0] : checkIn;
  //   const checkOutValue = Array.isArray(checkOut) ? checkOut[0] : checkOut;

  //   // Check if they are strings before creating Date objects
  //   if (typeof checkInValue !== 'string' || typeof checkOutValue !== 'string') {
  //     throw new Error('Invalid check-in or check-out date format');
  //   }

  //   // Convert to Date objects
  //   const checkInDateObj = new Date(checkInValue);
  //   const checkOutDateObj = new Date(checkOutValue);

  //   const data = await prisma.property.findFirst({
  //     where: { name: formattedName },
  //     select: {
  //       id: true,
  //       name: true,
  //       desc: true,
  //       city: true,
  //       category: true,
  //       address: true,
  //       latitude: true,
  //       longitude: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       RoomCategory: {
  //         include: {
  //           Room: {
  //             include: {
  //               Order: true,
  //             },
  //             where: {
  //               roomCategory: {
  //                 Order: {
  //                   none: {
  //                     OR: [
  //                       {
  //                         checkIn_date: {
  //                           lte: checkOutDateObj,
  //                         },
  //                       },
  //                       {
  //                         checkOut_date: {
  //                           gte: checkInDateObj,
  //                         },
  //                       },
  //                     ],
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const roomCategoriesWithAvailableRooms = data?.RoomCategory.map(
  //     (category) => {
  //       const totalRooms = category.Room.length;
  //       const bookedRooms = category.Room.filter((room) => {
  //         return room.Order.some((order) => {
  //           const orderCheckIn = new Date(order.checkIn_date);
  //           const orderCheckOut = new Date(order.checkOut_date);
  //           return (
  //             orderCheckIn <= checkOutDateObj && orderCheckOut >= checkInDateObj
  //           );
  //         });
  //       }).length;

  //       return {
  //         ...category,
  //         remainingRooms: totalRooms - bookedRooms,
  //       };
  //     },
  //   );

  //   return {
  //     ...data,
  //     RoomCategory: roomCategoriesWithAvailableRooms,
  //   };
  // }

  async getRoomByRoomId(req: Request) {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
    });
    return room;
  }

  async getPropertyDetail(req: Request) {
    const { name } = req.params;
    const { checkIn, checkOut } = req.query;

    const formattedName = name.replace(/-/g, ' ');

    if (!formattedName || !checkIn || !checkOut) {
      throw new Error(
        'Property name, check-in, and check-out dates are required',
      );
    }

    // Safely get the checkIn and checkOut values
    const checkInValue = Array.isArray(checkIn) ? checkIn[0] : checkIn;
    const checkOutValue = Array.isArray(checkOut) ? checkOut[0] : checkOut;

    // Check if they are strings before creating Date objects
    if (typeof checkInValue !== 'string' || typeof checkOutValue !== 'string') {
      throw new Error('Invalid check-in or check-out date format');
    }

    // Convert to Date objects
    const checkInDateObj = new Date(checkInValue);
    const checkOutDateObj = new Date(checkOutValue);

    const data = await prisma.property.findFirst({
      where: { name: formattedName },
      select: {
        id: true,
        name: true,
        desc: true,
        city: true,
        category: true,
        address: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        RoomCategory: {
          include: {
            Room: {
              include: {
                Order: true,
              },
              where: {
                // Only include rooms that have no conflicting orders
                Order: {
                  none: {
                    OR: [
                      {
                        checkIn_date: {
                          lt: checkOutDateObj,
                        },
                        checkOut_date: {
                          gt: checkInDateObj,
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate the remaining rooms for each category
    const roomCategoriesWithAvailableRooms = data?.RoomCategory.map(
      (category) => {
        const totalRooms = category.Room.length;
        const bookedRooms = category.Room.filter((room) => {
          return room.Order.some((order) => {
            const orderCheckIn = new Date(order.checkIn_date);
            const orderCheckOut = new Date(order.checkOut_date);
            return (
              orderCheckIn <= checkOutDateObj && orderCheckOut >= checkInDateObj
            );
          });
        }).length;

        return {
          ...category,
          remainingRooms: totalRooms - bookedRooms,
        };
      },
    ).filter((category) => category.remainingRooms > 0); // Filter out categories with no remaining rooms

    return {
      ...data,
      RoomCategory: roomCategoriesWithAvailableRooms,
    };
  }

  async renderPicProperty(req: Request) {
    const data = await prisma.property.findUnique({
      where: {
        id: req.params.id,
      },
    });
    return data?.pic;
  }

  // async renderPicRoom(req: Request) {
  //   const data = await prisma.room.findUnique({
  //     where: {
  //       id: req.params.id,
  //     },
  //   });
  //   return data?.pic;
  // }

  async createProperty(req: Request) {
    const userId = req.user?.id;
    const { file } = req;

    const { name, category, pic, desc, city, address, latitude, longitude } =
      req.body as TProperty;

    if (!file) throw new Error('No file uploaded');
    const buffer = await sharp(req.file?.buffer).png().toBuffer();
    const existingProperty = await prisma.property.findFirst({
      where: { name },
    });

    if (existingProperty)
      throw new Error(
        'There is a listing with the same name. Please choose different name.',
      );

    const parsedLatitude = latitude ? parseFloat(String(latitude)) : undefined;
    const parsedLongitude = longitude
      ? parseFloat(String(longitude))
      : undefined;

    const createProperty = await prisma.property.create({
      data: {
        tenant: {
          connect: {
            id: userId,
          },
        },
        pic: buffer,
        name,
        category,
        desc,
        city,
        address,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      },
    });

    return createProperty;
  }

  async updateProperty(req: Request) {
    const { propertyId } = req.params;

    const { file } = req;
    const userId = req.user?.id;

    const currentProperty = await prisma.property.findUnique({
      where: { id: propertyId, tenant_id: userId },
    });

    if (!currentProperty) {
      throw new Error('Listing is not found');
    }

    const { name, category, desc, city, address, latitude, longitude } =
      req.body as TProperty;

    let buffer;
    if (file) {
      buffer = await sharp(file.buffer).png().toBuffer();
    }

    const parsedLatitude = latitude ? parseFloat(String(latitude)) : undefined;
    const parsedLongitude = longitude
      ? parseFloat(String(longitude))
      : undefined;

    const updatedData: any = {
      name,
      category,
      desc,
      address,
      city,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      pic: buffer,
    };

    if (buffer) {
      updatedData.pic = buffer;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updatedData,
    });
  }

  async createRoom(req: Request) {}

  async updateRoom(req: Request) {}
}

export default new PropertyService();
