import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { Request } from 'express';
import { TRoomCategory } from '@/models/roomCat.model';
import sharp from 'sharp';

class RoomService {
  async createRoomCategory(req: Request) {
    console.log(new Date('1970-01-01'));

    const userId = req.user?.id;
    const propertyId = req.params.propertyId;
    const {
      type,
      guest,
      price,
      peak_price,
      start_date_peak,
      end_date_peak,
      isBreakfast,
      isRefunable,
      isSmoking,
      bed,
      desc,
      numberOfRooms,
    } = req.body as TRoomCategory & { numberOfRooms: number };
    const { file } = req;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, tenant_id: userId },
    });

    if (!property) {
      throw new Error(
        'Property not found or you do not have permission to add rooms to this property.',
      );
    }

    const existingRoomCategory = await prisma.roomCategory.findFirst({
      where: {
        property_id: propertyId,
        type,
      },
    });

    if (existingRoomCategory) {
      throw new Error(`Room type "${type}" already exists in this property.`);
    }

    if (!file) {
      throw new Error('No file uploaded');
    }

    const buffer = await sharp(file.buffer).png().toBuffer();

    const parsedIsBreakfast = Boolean(isBreakfast);
    const parsedIsRefunable = Boolean(isRefunable);
    const parsedIsSmoking = Boolean(isSmoking);
    const parsedPrice = parseFloat(price as unknown as string);
    const parsedGuest = parseInt(String(guest), 10);

    const roomCategoryData: Prisma.RoomCategoryCreateInput = {
      property: { connect: { id: propertyId } },
      type,
      guest: parsedGuest,
      price: parsedPrice,
      isBreakfast: parsedIsBreakfast,
      isRefunable: parsedIsRefunable,
      isSmoking: parsedIsSmoking,
      bed,
      desc,
      pic: buffer,
    };
    if (peak_price !== undefined) {
      roomCategoryData.peak_price = parseFloat(peak_price as unknown as string);
    }
    if (start_date_peak !== undefined) {
      roomCategoryData.start_date_peak = new Date(start_date_peak);
    }
    if (end_date_peak !== undefined) {
      roomCategoryData.end_date_peak = new Date(end_date_peak);
    }

    const roomCategory = await prisma.roomCategory.create({
      data: roomCategoryData,
    });

    const roomCreationPromises = [];
    for (let i = 0; i < numberOfRooms; i++) {
      roomCreationPromises.push(
        prisma.room.create({
          data: {
            roomCategory: { connect: { id: roomCategory.id } },
            property: { connect: { id: propertyId } },
          },
        }),
      );
    }
    await Promise.all(roomCreationPromises);

    return roomCategory;
  }

  async updateRoomCategory(req: Request) {
    const userId = req.user?.id;
    const roomCategoryId = req.params.roomCategoryId;
    const {
      guest,
      price,
      peak_price,
      start_date_peak,
      end_date_peak,
      isBreakfast,
      isRefunable,
      isSmoking,
      bed,
      desc,
      numberOfRooms,
    } = req.body as Partial<TRoomCategory> & { numberOfRooms: number };
    const { file } = req;

    const roomCategory = await prisma.roomCategory.findFirst({
      where: {
        id: roomCategoryId,
      },
      include: {
        property: true,
      },
    });

    if (!roomCategory) {
      throw new Error('Room category not found.');
    }

    const propertyId = roomCategory.property_id;
    const property = roomCategory.property;

    if (property.tenant_id !== userId) {
      throw new Error(
        'You do not have permission to update rooms for this property.',
      );
    }

    let buffer;
    if (file) {
      buffer = await sharp(file.buffer).png().toBuffer();
    }

    const parsedIsBreakfast =
      isBreakfast !== undefined
        ? Boolean(isBreakfast)
        : roomCategory.isBreakfast;
    const parsedIsRefunable =
      isRefunable !== undefined
        ? Boolean(isRefunable)
        : roomCategory.isRefunable;
    const parsedIsSmoking =
      isSmoking !== undefined ? Boolean(isSmoking) : roomCategory.isSmoking;
    const parsedPrice =
      price !== undefined
        ? parseFloat(price as unknown as string)
        : roomCategory.price;
    const parsedGuest =
      guest !== undefined ? parseInt(String(guest), 10) : roomCategory.guest;

    const roomCategoryData: Prisma.RoomCategoryUpdateInput = {
      guest: parsedGuest,
      price: parsedPrice,
      isBreakfast: parsedIsBreakfast,
      isRefunable: parsedIsRefunable,
      isSmoking: parsedIsSmoking,
      bed: bed || roomCategory.bed,
      desc: desc || roomCategory.desc,
      pic: buffer || roomCategory.pic,
    };

    if (peak_price !== undefined) {
      roomCategoryData.peak_price = parseFloat(peak_price as unknown as string);
    }
    if (start_date_peak !== undefined) {
      roomCategoryData.start_date_peak = new Date(start_date_peak);
    }
    if (end_date_peak !== undefined) {
      roomCategoryData.end_date_peak = new Date(end_date_peak);
    }

    const updatedRoomCategory = await prisma.roomCategory.update({
      where: { id: roomCategoryId },
      data: roomCategoryData,
    });

    const currentRooms = await prisma.room.findMany({
      where: {
        roomCategory_id: roomCategoryId,
        property_id: propertyId,
      },
      include: {
        Order: true,
      },
    });

    const currentRoomCount = currentRooms.length;

    if (numberOfRooms !== undefined) {
      if (numberOfRooms > currentRoomCount) {
        const roomsToAdd = numberOfRooms - currentRoomCount;
        const roomCreationPromises = [];
        for (let i = 0; i < roomsToAdd; i++) {
          roomCreationPromises.push(
            prisma.room.create({
              data: {
                roomCategory: { connect: { id: roomCategoryId } },
                property: { connect: { id: propertyId } },
              },
            }),
          );
        }
        await Promise.all(roomCreationPromises);
      } else if (numberOfRooms < currentRoomCount) {
        const today = new Date();
        const roomsWithOrders = await prisma.room.findMany({
          where: {
            roomCategory_id: roomCategoryId,
            property_id: propertyId,
            Order: {
              some: {
                checkOut_date: {
                  gte: today,
                },
              },
            },
          },
        });

        const roomsToRemove = currentRoomCount - numberOfRooms;
        const roomsWithoutOrders = currentRooms.filter(
          (room) =>
            !roomsWithOrders.find((orderRoom) => orderRoom.id === room.id),
        );

        if (roomsToRemove > roomsWithoutOrders.length) {
          throw new Error(
            'Cannot delete the requested number of rooms because some rooms have ongoing or future orders.',
          );
        }

        for (const room of roomsWithoutOrders.slice(0, roomsToRemove)) {
          try {
            const roomOrders = await prisma.order.findMany({
              where: {
                room_id: room.id,
                checkOut_date: {
                  gte: today,
                },
              },
            });

            if (roomOrders.length > 0) {
              throw new Error(
                `Cannot delete room ${room.id} because it has ongoing orders.`,
              );
            }

            await prisma.room.delete({
              where: { id: room.id },
            });
          } catch (error) {
            console.error(`Failed to delete room ${room.id}:`, error);
            throw new Error(
              `Error deleting room ${room.id}. Please check if it has any related references.`,
            );
          }
        }
      }
      // if numberOfRooms == currentRoomCount, do nothing
    }

    return updatedRoomCategory;
  }

  //   async renderPicRoom(req: Request) {
  //     const data = await prisma.room.findUnique({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });
  //     return data?.pic;
  //   }
}

export default new RoomService();
