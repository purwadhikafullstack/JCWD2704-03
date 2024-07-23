import { NextFunction, Response, Request } from 'express';
import propertyServices from '@/services/property.services';
import reviewService from '@/services/review.service';

export class PropertyController {
  // async getRoomAvailability(req: Request, res: Response, next: NextFunction) {
  //   const { roomId } = req.query; // Assuming roomId is passed as a query parameter
  //   const { checkIn, checkOut } = req.query; // Assuming checkIn and checkOut are also passed as query parameters

  //   try {
  //     if (!checkIn || !checkOut) {
  //       throw new Error('Both checkIn and checkOut dates are required.');
  //     }

  //     const remainingAvailability = await propertyServices.getRoomAvailability(
  //       roomId as string,
  //       new Date(checkIn as string),
  //       new Date(checkOut as string),
  //     );

  //     res.status(200).json({ remainingAvailability });
  //   } catch (error) {
  //     next(error); // Pass any errors to the error handling middleware
  //   }
  // }

  async searchProperties(req: Request, res: Response, next: NextFunction) {
    const { city, checkIn, checkOut } = req.query;

    try {
      if (!city || !checkIn || !checkOut) {
        throw new Error('City, checkIn, and checkOut are required.');
      }

      const properties = await propertyServices.searchProperties(
        city as string,
        new Date(checkIn as string),
        new Date(checkOut as string),
      );

      res.status(200).json({ properties });
    } catch (error) {
      next(error);
    }
  }

  async getPropertyDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertyServices.getPropertyDetail(req);
      return res.send({
        message: 'Fetching property detail',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // async getAllRoom(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const data = await propertyServices.getAllRoom(req);
  //     return res.send({
  //       message: 'All room type',
  //       data,
  //     });
  //   } catch (error) {
  //     console.log('ga ada room');

  //     next(error);
  //   }
  // }
  async getAllPropertyByTenantId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await propertyServices.getAllPropByTenantId(req);
      return res.send({
        message: 'All Property',
        data,
      });
    } catch (error) {
      console.log('ga ada room');

      next(error);
    }
  }
  async getPropertyDetailHost(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertyServices.getPropertyDetailHost(req);
      return res.send({
        message: 'Fetching property detail',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // async getAllRoom(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const data = await propertyServices.getAllRoom(req);
  //     return res.send({
  //       message: 'All room type',
  //       data,
  //     });
  //   } catch (error) {
  //     console.log('ga ada room');

  //     next(error);
  //   }
  // }

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

  // async renderPicRoom(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const blob = await propertyServices.renderPicRoom(req);
  //     if (!blob) {
  //       return res.status(404).send('Banner not found');
  //     }
  //     res.set('Content-Type', 'image/png');
  //     res.send(blob);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      await propertyServices.createProperty(req);
      return res.send({
        message: 'New listing has been posted',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      await propertyServices.updateProperty(req);
      return res.send({
        message: 'Your listing has been updated',
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getReviewByEventId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getReviewByUserId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.addReply(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new PropertyController();
