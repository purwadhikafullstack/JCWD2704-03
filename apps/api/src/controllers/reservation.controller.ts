import { NextFunction, Request, Response } from 'express';
import reservationsServices from '../services/reservation.services';
class ReservationController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationsServices.getAllOrder(req);
      return res.send({
        message: 'fetch all orders',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getOrderByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationsServices.getOrderByUserId(req);
      return res.send({
        message: 'fetch order detail of 1 buyer',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationsServices.createOrder(req);
      return res.send({
        message: 'a user successfully made a reservation',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReservationController();
