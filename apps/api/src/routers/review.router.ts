import { ReviewController } from '@/controllers/review.controller';
import { verifyUser } from '@/middlewares/auth.middleware';
import { verifyBuyer, verifyTenant } from '@/middlewares/role.middleware';
import { Router } from 'express';

export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;
  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get(
      '/getReviewByPropertyId/:propertyId',
      this.reviewController.getReviewByPropertyId,
    );
    this.router.get(
      '/getReviewByUserId/:userId',
      this.reviewController.getReviewByUserId,
    );
    this.router.post(
      '/reviewReply/:reviewId',
      verifyUser,
      verifyTenant,
      this.reviewController.addReply,
    );
    this.router.post(
      '/addReview/',
      verifyUser,
      verifyBuyer,
      this.reviewController.addReview,
    );
    this.router.get(
      '/review/:orderId',
      verifyUser,
      verifyBuyer,
      this.reviewController.getReviewByOrderId,
    );
    this.router.get(
      '/allReviews/:propertyId',
      this.reviewController.getAllReview,
    );
    this.router.get(
      '/aveReviews/:propertyId',
      this.reviewController.getAverageReview,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
