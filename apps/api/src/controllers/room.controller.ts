import { NextFunction, Response, Request } from 'express';
import propertyServices from '@/services/property.services';
import roomService from '@/services/room.service';

export class RoomController {
  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      await roomService.createRoomCategory(req);
      return res.send({
        message: 'New room category and rooms have been added',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      await roomService.updateRoomCategory(req);
      return res.send({
        message: 'Room category has been updated',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RoomController();
