import { prisma } from '../libs/prisma';
import { Request } from 'express';
class ReviewService {
  async addReview(req: Request) {
    const { property_id, review, rating, order_id } = req.body;
    const findReviewId = await prisma.review.findMany({
      where: {
        property_id: property_id,
        rating: { equals: 0 },
        review: { equals: '' },
      },
    });

    if (findReviewId.length > 0) {
      const updateReview = await prisma.review.update({
        where: { id: findReviewId[0].id },
        data: {
          review: review,
          rating: rating,
        },
      });
      return updateReview;
    } else {
      return 'Unable to add more review. You have added review for this event';
    }
  }
  async addReply(req: Request) {
    const { reply, reviewId } = req.body;
    const { property_id } = req.params;
    const findReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!findReview) {
      throw new Error('Review tidak ditemukan untuk property_id tersebut');
    }

    if (findReview.reply) {
      throw new Error(
        'Review ini sudah memiliki balasan. Anda tidak bisa menambahkan balasan lagi',
      );
    } else {
      const updateReview = await prisma.review.update({
        where: { id: findReview.id },
        data: { reply: reply },
      });
      return updateReview;
    }
  }
  async getReviewByPropertyId(req: Request) {
    const { propertyId } = req.params;
    const findReviewId = await prisma.review.findMany({
      where: {
        property_id: propertyId,
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            image_name: true,
          },
        },
      },
    });
    if (findReviewId) {
      return findReviewId;
    } else {
      return 'No one has bought the event so no review yet';
    }
  }
  async getReviewByUserId(req: Request) {
    const { userId } = req.params;
    const findReviewId = await prisma.review.findMany({
      where: { user_id: userId },
    });
    if (findReviewId) {
      return findReviewId;
    } else {
      return 'No one has bought the event so no review yet';
    }
  }
  async getReviewByOrderId(req: Request) {
    const { orderId } = req.params;
    const findReviewId = await prisma.review.findMany({
      where: { order_id: orderId },
    });
    if (findReviewId) {
      return findReviewId;
    } else {
      return 'No one has bought the event so no review yet';
    }
  }
  async getAllReviews(req: Request) {
    const { property_id } = req.params;

    const reviews = await prisma.review.findMany({
      where: { property_id },
      include: {
        user: true,
        order: true,
        property: true,
      },
    });

    const totalReviews = reviews.length;
    return { reviews: [reviews], totalReviews };
  }
  async getAverageRating(req: Request) {
    const { property_id } = req.params;

    const averageRating = await prisma.review.aggregate({
      where: { property_id },
      _avg: {
        rating: true,
      },
    });

    return averageRating._avg.rating;
  }
}

export default new ReviewService();
