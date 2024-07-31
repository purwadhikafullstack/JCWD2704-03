import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { Request } from 'express';
import { TProperty } from '@/models/property.model';
import sharp from 'sharp';
import shortid from 'shortid';

class PropertyService {
  async getRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<number> {
    // Temukan kamar dengan ID yang diberikan
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        roomCategory: true,
        property: true,
      },
    });

    //   if (!room) {
    //     throw new Error('Room not found');
    //   }

    // Temukan semua pesanan yang konflik dengan periode check-in dan check-out
    const bookings = await prisma.orderRoom.findMany({
      where: {
        room_id: roomId,
        room: {
          deletedAt: null,
        },
        order: {
          AND: [
            { checkIn_date: { lte: checkOut } },
            { checkOut_date: { gte: checkIn } },
            { status: { not: 'cancelled' } },
          ],
          property: {
            deletedAt: null, // Pastikan properti tidak dihapus
          },
          RoomCategory: {
            deletedAt: null, // Pastikan kategori kamar tidak dihapus
          },
        },
      },
    });

    // Hitung total kamar yang dipesan berdasarkan orderRoom yang terkait dengan ID kamar
    const totalBookedRooms = bookings.length;

    // Temukan total kamar berdasarkan roomCategory_id
    const totalRoomsInCategory = await prisma.room.count({
      where: { roomCategory_id: room?.roomCategory_id },
    });

    // Ketersediaan kamar dihitung sebagai total kamar di kategori - kamar yang dipesan
    const remainingAvailability = totalRoomsInCategory - totalBookedRooms;

    return remainingAvailability;
  }

  async searchProperties(
    city: string,
    checkIn: Date,
    checkOut: Date,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      // Find properties with pagination
      const properties = await prisma.property.findMany({
        where: {
          city: { contains: city },
          deletedAt: null,
          Room: {
            some: {
              deletedAt: null,
              roomCategory: {
                deletedAt: null,
              },
              OrderRoom: {
                none: {
                  order: {
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
        },
        include: {
          Room: {
            where: {
              deletedAt: null,
            },
            include: {
              roomCategory: true, // Include roomCategory to access price
            },
          },
          tenant: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Find total properties count
      const totalProperties = await prisma.property.count({
        where: {
          city: { contains: city },
          deletedAt: null,
          Room: {
            some: {
              deletedAt: null,
              roomCategory: {
                deletedAt: null,
              },
              OrderRoom: {
                none: {
                  order: {
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
        },
      });

      // Calculate lowest price per property
      const propertiesWithLowestPrice = properties.map((property) => {
        const rooms = property.Room || [];
        const lowestPrice = rooms
          .map((room) => room.roomCategory.price) // Map prices from RoomCategory
          .reduce((min, price) => (price < min ? price : min), Infinity); // Find the minimum price

        return {
          ...property,
          lowestPrice: isFinite(lowestPrice) ? lowestPrice : null, // Add lowest price to property
        };
      });

      return {
        properties: propertiesWithLowestPrice,
        totalProperties,
        totalPages: Math.ceil(totalProperties / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new Error('Error searching properties');
    }
  }

  async getAllPropByTenantId(req: Request) {
    try {
      // Check if req.user and req.user.id are defined
      if (!req.user || !req.user.id) {
        throw new Error('User or User ID is undefined');
      }

      // Log tenant ID for debugging purposes
      console.log('Fetching properties for tenant ID:', req.user.id);

      // Fetch properties associated with the tenant ID
      const properties = await prisma.property.findMany({
        where: { tenant_id: req.user.id, deletedAt: null },
        // Filter by tenant ID
        include: {
          RoomCategory: true, // Include RoomCategory, but it should not filter out properties without RoomCategory
        },
      });

      // Log the retrieved properties for debugging
      console.log('Retrieved properties:', properties);

      // Return the properties
      return properties;
    } catch (error) {
      // Log any errors that occur during the fetch
      console.error('Error fetching properties:', error);

      // Rethrow the error to be handled by the calling function
      throw error;
    }
  }

  async getProfilePropertyByTenantId(req: Request) {
    try {
      const { id } = req.params;

      const properties = await prisma.property.findMany({
        where: { tenant_id: id, deletedAt: null },

        include: {
          RoomCategory: true,
        },
      });

      console.log('Retrieved properties:', properties);
      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

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
    const room = await prisma.roomCategory.findUnique({
      where: { id },
      // include: {
      //   property: true,
      //   Room: true, // Make sure this relation exists in your Prisma schema
      //   Order: true, // Make sure this relation exists in your Prisma schema
      // },
    });

    return room;
  }

  async getPropertyDetailHost(req: Request) {
    const { propertyId } = req.params;

    // Check if propertyId is provided
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // Fetch property details from the database
    const data = await prisma.property.findUnique({
      where: { id: propertyId },
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
        pic_name: true,
        deletedAt: true,
        RoomCategory: {
          include: {
            Room: {
              include: {
                OrderRoom: {
                  include: {
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Handle case where property is not found or is deleted
    if (!data || data.deletedAt) {
      throw new Error('Property not found or is deleted');
    }

    // Calculate the remaining rooms for each category
    const roomCategoriesWithAvailableRooms = data.RoomCategory.map(
      (category) => {
        // Skip the room category if it is deleted
        if (category.deletedAt) {
          return null;
        }

        const totalRooms = category.Room.filter(
          (room) => !room.deletedAt,
        ).length; // Count only non-deleted rooms
        const bookedRooms = category.Room.filter((room) => {
          return (
            !room.deletedAt &&
            room.OrderRoom.some((orderRoom) => {
              const order = orderRoom.order;
              const orderCheckIn = new Date(order.checkIn_date);
              const orderCheckOut = new Date(order.checkOut_date);
              return (
                orderCheckIn < new Date() &&
                orderCheckOut > new Date() &&
                order.status !== 'cancelled'
              );
            })
          );
        }).length;

        return totalRooms > 0
          ? {
              // Only include categories with at least one room
              ...category,
              roomCount: totalRooms, // Added roomCount
              remainingRooms: totalRooms - bookedRooms,
            }
          : null;
      },
    ).filter((category) => category !== null); // Filter out null categories

    return {
      ...data,
      RoomCategory: roomCategoriesWithAvailableRooms,
    };
  }

  async getPropertyDetail(req: Request) {
    const { name } = req.params;
    const { checkIn, checkOut } = req.query;

    const formattedName = name.replace(/-/g, ' ');

    if (!formattedName || !checkIn || !checkOut) {
      throw new Error(
        'Nama properti, tanggal check-in, dan tanggal check-out diperlukan',
      );
    }

    // Safely get the checkIn and checkOut values
    const checkInValue = Array.isArray(checkIn) ? checkIn[0] : checkIn;
    const checkOutValue = Array.isArray(checkOut) ? checkOut[0] : checkOut;

    // Check if they are strings before creating Date objects
    if (typeof checkInValue !== 'string' || typeof checkOutValue !== 'string') {
      throw new Error('Format tanggal check-in atau check-out tidak valid');
    }

    // Convert to Date objects
    const checkInDateObj = new Date(checkInValue);
    const checkOutDateObj = new Date(checkOutValue);

    const data = await prisma.property.findFirst({
      where: { name: formattedName, deletedAt: null },
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
        pic_name: true,
        updatedAt: true,
        deletedAt: true,
        RoomCategory: {
          include: {
            Room: {
              include: {
                OrderRoom: {
                  include: {
                    order: true,
                  },
                },
              },
              where: {
                deletedAt: null,
                // Hanya sertakan kamar yang tidak memiliki pesanan yang bertentangan
                OrderRoom: {
                  none: {
                    // roomCategory:{},
                    // property:{},
                    // room:{},
                    order: {
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
          where: { deletedAt: null },
        },
      },
    });

    // Hitung sisa kamar untuk setiap kategori
    const roomCategoriesWithAvailableRooms = data?.RoomCategory.map(
      (category) => {
        const totalRooms = category.Room.length;
        const bookedRooms = category.Room.filter((room) => {
          return room.OrderRoom.some((orderRoom) => {
            const orderCheckIn = new Date(orderRoom.order.checkIn_date);
            const orderCheckOut = new Date(orderRoom.order.checkOut_date);
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

  async renderPicProperty(req: Request): Promise<Buffer | null> {
    const picName = req.params.picName;
    const property = await prisma.property.findUnique({
      where: {
        pic_name: picName,
      },
    });

    return property?.pic || null;
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

    const picName = shortid.generate();

    const createProperty = await prisma.property.create({
      data: {
        tenant: {
          connect: {
            id: userId,
          },
        },
        pic: buffer,
        pic_name: picName,
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

    const picName = shortid.generate();

    const updatedData: any = {
      name,
      category,
      desc,
      address,
      city,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      pic: buffer,
      pic_name: picName,
    };

    if (buffer) {
      updatedData.pic = buffer;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updatedData,
    });
  }

  async deleteProperty(req: Request) {
    const propertyId = req.params.propertyId;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        RoomCategory: {
          include: {
            Room: {
              include: {
                OrderRoom: {
                  include: {
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new Error('Property not found.');
    }

    const today = new Date();

    // Check if any associated rooms have future or ongoing orders
    const hasFutureOrders = property.RoomCategory.some((roomCategory) =>
      roomCategory.Room.some((room) =>
        room.OrderRoom.some(
          (orderRoom) => orderRoom.order.checkOut_date >= today,
        ),
      ),
    );

    if (hasFutureOrders) {
      throw new Error(
        'Cannot delete the property because it has rooms with future or ongoing orders.',
      );
    }

    // Soft delete all rooms associated with the room categories of the property
    await prisma.room.updateMany({
      where: {
        roomCategory: {
          property_id: propertyId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Soft delete all room categories associated with the property
    await prisma.roomCategory.updateMany({
      where: {
        property_id: propertyId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Soft delete the property
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message:
        'Property and associated room categories and rooms successfully deleted.',
    };
  }
}

export default new PropertyService();
