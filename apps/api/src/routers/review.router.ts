import { ReviewController } from '@/controllers/review.controller';
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
    this.router.post('/reviewReply/:reviewId', this.reviewController.addReply);
    this.router.post('/addReview/', this.reviewController.addReview);
    this.router.get(
      '/review/:orderId',
      this.reviewController.getReviewByOrderId,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
