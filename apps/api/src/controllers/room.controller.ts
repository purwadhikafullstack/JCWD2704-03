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
      const data = await roomService.updateRoomCategory(req);
      return res.send({
        message: 'Room category has been updated',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      await roomService.deleteRoomCategory(req);
      return res.send({
        message: 'Room category has been deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  async renderPicRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await roomService.renderPicRoom(req);

      if (!blob) {
        return res.status(404).send('Banner not found');
      }

      res.set('Content-Type', 'image/png');
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }

  async getRoomCatByRoomCatId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await roomService.getRoomCatByRoomCatId(req);
      return res.send({
        message: 'Fetching room category by id',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RoomController();
