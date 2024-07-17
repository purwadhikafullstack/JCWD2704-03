import { blobUploader } from '@/libs/multer';
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
    this.router.get('/:orderId', reservationController.getOrderByOrderId);
    this.router.get('/user/myOrder', reservationController.getOrderByUserId);
    this.router.get('/tenant/order', reservationController.getOrderBySellerId);
    this.router.post('/', reservationController.createOrder);
    this.router.patch(
      '/:orderId',
      blobUploader().single('payment_proof'),
      reservationController.updateOrder,
    );
    this.router.patch(
      '/tenant/order/denied/:orderId',
      reservationController.changeStatusOrder,
    );
    this.router.patch(
      '/tenant/order/cancelled/:orderId',
      reservationController.cancelByTenant,
    );
    this.router.patch(
      '/tenant/order/confirmed/:orderId',
      reservationController.orderSuccess,
    );
    this.router.get(
      '/payment/image/:id',
      reservationController.renderPaymentProof,
    );
  }
  getRouter() {
    return this.router;
  }
}

export default new ReservationRouter();
