import { SalesController } from '@/controllers/sales.controller';
import { verifyUser } from '@/middlewares/auth.middleware';
import { verifyTenant } from '@/middlewares/role.middleware';
import { Router } from 'express';

export class SalesRouter {
  private router: Router;
  private salesController: SalesController;
  constructor() {
    this.salesController = new SalesController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/getSales', this.salesController.getSales);
    this.router.get(
      '/propertySales',
      verifyUser,
      verifyTenant,
      this.salesController.getSalesByPropertyId,
    );
    this.router.get(
      '/UserSales',
      verifyUser,
      verifyTenant,
      this.salesController.getSalesByUserId,
    );
    this.router.get(
      '/all',
      verifyUser,
      verifyTenant,
      this.salesController.getAllSales,
    );
    this.router.get(
      '/availabilityReport',
      verifyUser,
      verifyTenant,
      this.salesController.getAvailability,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
