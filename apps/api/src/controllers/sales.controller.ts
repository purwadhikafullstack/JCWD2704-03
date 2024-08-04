import { prisma } from '@/libs/prisma';
import salesService from '@/services/sales.service';
import salesChartCalendarServices from '@/services/salesChartCalendar.services';
import { NextFunction, Request, Response } from 'express';

export class SalesController {
  async getSalesByPropertyId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await salesService.getSalesByProperty(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await salesChartCalendarServices.getSales(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSalesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await salesService.getSalesByUser(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllSales(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await salesService.getAllSales(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await salesService.roomAvailability(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
