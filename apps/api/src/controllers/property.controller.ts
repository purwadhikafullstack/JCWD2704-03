import { NextFunction, Response, Request } from 'express';
import propertyServices from '@/services/property.services';

export class PropertyController {
  async getRoomAvailability(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.query; // Assuming roomId is passed as a query parameter
    const { checkIn, checkOut } = req.query; // Assuming checkIn and checkOut are also passed as query parameters

    try {
      if (!checkIn || !checkOut) {
        throw new Error('Both checkIn and checkOut dates are required.');
      }

      const remainingAvailability = await propertyServices.getRoomAvailability(
        roomId as string,
        new Date(checkIn as string),
        new Date(checkOut as string),
      );

      res.status(200).json({ remainingAvailability });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  }

  async searchProperties(req: Request, res: Response, next: NextFunction) {
    const { location, checkIn, checkOut } = req.query;

    try {
      if (!location || !checkIn || !checkOut) {
        throw new Error('Location, checkIn, and checkOut are required.');
      }

      const properties = await propertyServices.searchProperties(
        location as string,
        new Date(checkIn as string),
        new Date(checkOut as string),
      );

      res.status(200).json({ properties });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  }
}
