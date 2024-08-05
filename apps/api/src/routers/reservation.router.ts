import { blobUploader } from '@/libs/multer';
import reservationController from '../controllers/reservation.controller';
import { Router } from 'express';
import { verifyUser } from '@/middlewares/auth.middleware';
import { verifyBuyer, verifyTenant } from '@/middlewares/role.middleware';
import { verify } from 'jsonwebtoken';
class ReservationRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }
  initializedRoutes() {
    this.router.get('/', reservationController.getAll);
    this.router.get('/:orderId', reservationController.getOrderByOrderId);
    this.router.get(
      '/user/myOrder',

      reservationController.getOrderByUserId,
    );
    this.router.get(
      '/tenant/order',
      verifyUser,
      verifyTenant,
      reservationController.getOrderBySellerId,
    );
    this.router.post(
      '/',
      verifyUser,
      verifyBuyer,
      reservationController.createOrder,
    );
    this.router.patch(
      '/:orderId',
      blobUploader().single('payment_proof'),
      reservationController.updateOrder,
    );
    this.router.patch(
      '/tenant/order/denied/:orderId',
      verifyUser,
      verifyTenant,
      reservationController.changeStatusOrder,
    );
    this.router.patch(
      '/tenant/order/cancelled/:orderId',
      verifyUser,
      verifyTenant,
      reservationController.cancelByTenant,
    );
    this.router.patch(
      '/user/order/cancelled/:orderId',
      verifyUser,
      verifyBuyer,
      reservationController.cancelByUser,
    );
    this.router.patch(
      '/tenant/order/confirmed/:orderId',
      verifyUser,
      verifyTenant,
      reservationController.orderSuccess,
    );
    this.router.get(
      '/payment/image/:id',
      reservationController.renderPaymentProof,
    );
    this.router.post(
      '/createSnapMidtrans',
      verifyUser,
      verifyBuyer,
      reservationController.creatingSnapMidtrans,
    );
    this.router.post('/updateTransaction', reservationController.transferNotif);
  }
  getRouter() {
    return this.router;
  }
}

export default new ReservationRouter();
