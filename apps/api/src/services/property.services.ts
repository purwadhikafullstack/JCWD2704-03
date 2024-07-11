import { prisma } from '@/libs/prisma';
import { Request } from 'express';

class PropertyService {
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
