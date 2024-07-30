import reviewService from '@/services/review.service';
import { NextFunction, Request, Response } from 'express';

export class ReviewController {
  async getReviewByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getReviewByUserId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.addReply(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.addReview(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getReviewByOrderId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByPropertyId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getReviewByPropertyId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
