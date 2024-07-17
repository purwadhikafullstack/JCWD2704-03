// import { blobUploader } from '@/libs/multer';
// import reservationController from '../controllers/reservation.controller';
// import { Router } from 'express';
// class ReservationRouter {
//   private router: Router;
//   constructor() {
//     this.router = Router();
//     this.initializedRoutes();
//   }
//   initializedRoutes() {
//     this.router.get('/', reservationController.getAll);
//     this.router.get('/:orderId', reservationController.getOrderByOrderId);
//     this.router.get('/user/myOrder', reservationController.getOrderByUserId);
//     this.router.get('/tenant/order', reservationController.getOrderBySellerId);
//     this.router.post('/', reservationController.createOrder);
//     this.router.patch(
//       '/:orderId',
//       blobUploader().single('payment_proof'),
//       reservationController.updateOrder,
//     );
//   }
//   getRouter() {
//     return this.router;
//   }
// }

// export default new ReservationRouter();
