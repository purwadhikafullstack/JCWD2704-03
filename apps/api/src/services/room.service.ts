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

    // Check for property and permission
    const property = await prisma.property.findFirst({
      where: { id: propertyId, tenant_id: userId },
    });

    if (!property) {
      throw new Error(
        'Property not found or you do not have permission to add rooms to this property.',
      );
    }

    // Check for existing room category
    const existingRoomCategory = await prisma.roomCategory.findFirst({
      where: {
        property_id: propertyId,
        type,
      },
    });

    if (existingRoomCategory) {
      throw new Error(
        `Room type "${type}" already exists in this property. You can delete the type before making a new one or update the room category.`,
      );
    }

    // Validate file
    if (!file) {
      throw new Error('No file uploaded');
    }

    const buffer = await sharp(file.buffer).png().toBuffer();

    // Parse fields
    const parsedIsBreakfast = Boolean(isBreakfast);
    const parsedIsRefunable = Boolean(isRefunable);
    const parsedIsSmoking = Boolean(isSmoking);
    const parsedPrice = parseFloat(price as unknown as string);
    const parsedGuest = parseInt(String(guest), 10);

    // Validate parsed fields
    if (isNaN(parsedPrice)) {
      throw new Error('Invalid price format');
    }
    if (isNaN(parsedGuest)) {
      throw new Error('Invalid guest count format');
    }

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

    // Optionally add peak price and dates if they are provided
    if (peak_price !== undefined) {
      roomCategoryData.peak_price = parseFloat(peak_price as unknown as string);
    }
    if (start_date_peak !== undefined) {
      roomCategoryData.start_date_peak = new Date(start_date_peak);
    }
    if (end_date_peak !== undefined) {
      roomCategoryData.end_date_peak = new Date(end_date_peak);
    }

    // Create room category
    const roomCategory = await prisma.roomCategory.create({
      data: roomCategoryData,
    });

    // Create rooms
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
      guest: parsedGuest, // Ensure this is an integer
      price: parsedPrice,
      isBreakfast: parsedIsBreakfast,
      isRefunable: parsedIsRefunable,
      isSmoking: parsedIsSmoking,
      bed: bed ?? roomCategory.bed,
      desc: desc ?? roomCategory.desc,
      pic: buffer ?? roomCategory.pic,
      peak_price:
        peak_price !== undefined
          ? parseFloat(peak_price as unknown as string)
          : roomCategory.peak_price,
      start_date_peak:
        start_date_peak !== undefined
          ? new Date(start_date_peak)
          : roomCategory.start_date_peak,
      end_date_peak:
        end_date_peak !== undefined
          ? new Date(end_date_peak)
          : roomCategory.end_date_peak,
    };

    console.log('Room category data to be updated:', roomCategoryData);

    const updatedRoomCategory = await prisma.roomCategory.update({
      where: { id: roomCategoryId },
      data: roomCategoryData,
    });

    const currentRooms = await prisma.room.findMany({
      where: {
        roomCategory_id: roomCategoryId,
        property_id: propertyId,
        deletedAt: null,
      },
      include: {
        OrderRoom: {
          include: {
            order: true,
          },
        },
      },
    });

    console.log('Current rooms:', currentRooms);

    const today = new Date();
    const availableRooms = currentRooms.filter((room) => {
      const hasFutureOrders = room.OrderRoom.some(
        (orderRoom) => orderRoom.order.checkOut_date >= today,
      );
      console.log(`Room ${room.id} has future orders: ${hasFutureOrders}`);
      return !hasFutureOrders;
    });

    console.log('Available rooms:', availableRooms);

    const currentRoomCount = availableRooms.length;
    console.log('Current room count:', currentRoomCount);

    if (numberOfRooms !== undefined) {
      const roomsToRemove = currentRoomCount - numberOfRooms;
      console.log('Rooms to remove:', roomsToRemove);

      if (roomsToRemove > 0) {
        const roomsWithoutOrders = availableRooms.filter(
          (room) =>
            !room.OrderRoom.some(
              (orderRoom) => orderRoom.order.checkOut_date >= today,
            ),
        );

        console.log('Rooms without orders:', roomsWithoutOrders);

        if (roomsToRemove > roomsWithoutOrders.length) {
          console.error(
            'Cannot delete the requested number of rooms because some rooms have ongoing or future orders.',
          );
          throw new Error(
            'Cannot delete the requested number of rooms because some rooms have ongoing or future orders.',
          );
        }

        const roomsToSoftDelete = roomsWithoutOrders.slice(0, roomsToRemove);
        console.log('Rooms to soft delete:', roomsToSoftDelete);

        for (const room of roomsToSoftDelete) {
          try {
            await prisma.room.update({
              where: { id: room.id },
              data: { deletedAt: new Date() }, // Soft delete by setting deletedAt
            });
          } catch (error) {
            console.error(`Failed to soft delete room ${room.id}:`, error);
            throw new Error(
              `Error soft deleting room ${room.id}. Please check if it has any related references.`,
            );
          }
        }
      }
    }

    return updatedRoomCategory;
  }

  async deleteRoomCategory(req: Request) {
    const roomCategoryId = req.params.roomCategoryId;

    // Fetch the room category and associated rooms
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: roomCategoryId },
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
    });

    if (!roomCategory) {
      throw new Error('Room category not found.');
    }

    const today = new Date();

    // Check if any associated rooms have future or ongoing orders
    const hasFutureOrders = roomCategory.Room.some((room) =>
      room.OrderRoom.some(
        (orderRoom) => orderRoom.order.checkOut_date >= today,
      ),
    );

    if (hasFutureOrders) {
      throw new Error(
        'Cannot delete the room category because it has rooms with future or ongoing orders.',
      );
    }

    // Soft delete all rooms associated with the room category
    await prisma.room.updateMany({
      where: {
        roomCategory_id: roomCategoryId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Delete the room category
    await prisma.roomCategory.delete({
      where: { id: roomCategoryId },
    });

    return {
      message: 'Room category and associated rooms successfully deleted.',
    };
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
