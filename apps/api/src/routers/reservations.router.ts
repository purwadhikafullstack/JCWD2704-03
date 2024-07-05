import reservationController from '../controllers/reservation.controller';
import { Router } from 'express';
class ReservationRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }
  initializedRoutes() {
    this.router.get('/', reservationController.getAll);
    this.router.get('/test/:userId', reservationController.getOrderByUserId);
    this.router.post('/', reservationController.createOrder);
  }
  getRouter() {
    return this.router;
  }
}

export default new ReservationRouter();
