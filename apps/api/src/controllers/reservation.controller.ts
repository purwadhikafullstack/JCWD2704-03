import e, { NextFunction, Request, Response } from 'express';
import reservationsServices from '../services/reservation.services';
import statusService from '@/services/status.service';
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
  async getOrderByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationsServices.getOrderByOrderId(req);
      return res.send({
        message: 'fetch order detail of 1 buyer',
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
  async getOrderBySellerId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationsServices.getOrderBySellerId(req);
      return res.send({
        message: 'fetch order detail of 1 seller',
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
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await reservationsServices.updateOrder(req);
      return res.send({
        message: 'success upload payment proof',
      });
    } catch (error) {
      next(error);
    }
  }
  async changeStatusOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await statusService.changeStatusOrderByTenant(req);
      return res.send({
        message: 'the status of the order is pending_payment now',
      });
    } catch (error) {
      next(error);
    }
  }
  async cancelByTenant(req: Request, res: Response, next: NextFunction) {
    try {
      await statusService.cancelOrderByTenant(req);
      return res.send({
        message: 'the user order has been cancelled',
      });
    } catch (error) {
      next(error);
    }
  }
  async cancelByUser(req: Request, res: Response, next: NextFunction) {
    try {
      await statusService.cancelOrderByUser(req);
      return res.send({
        message: 'the user order has been cancelled',
      });
    } catch (error) {
      next(error);
    }
  }
  async orderSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      await statusService.confirmOrder(req);
      return res.send({
        message: 'the user order has been succes',
      });
    } catch (error) {
      next(error);
    }
  }
  async renderPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await statusService.renderPaymentProof(req);
      if (!blob) {
        return res.status(404).send('Proofment not found');
      }
      res.set('Content-Type', 'image/png');
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReservationController();
