import propertyServices from '@/services/property.services';
import { NextFunction, Request, Response } from 'express';

class PropertyController {
  async getAllRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertyServices.getAllRoom(req);
      return res.send({
        message: 'All room type',
        data,
      });
    } catch (error) {
      console.log('ga ada room');

      next(error);
    }
  }
  async getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertyServices.getRoomByRoomId(req);
      return res.send({
        message: 'All room type',
        data,
      });
    } catch (error) {
      console.log('ga ada room');
      next(error);
    }
  }
  async renderPicProp(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await propertyServices.renderPicProperty(req);

      if (!blob) {
        return res.status(404).send('Banner not found');
      }

      res.set('Content-Type', 'image/png');
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }
  async renderPicRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await propertyServices.renderPicRoom(req);
      if (!blob) {
        return res.status(404).send('Banner not found');
      }
      res.set('Content-Type', 'image/png');
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
