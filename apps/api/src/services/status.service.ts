import { Request } from 'express';
import { prisma } from '../libs/prisma';
import sendBookingReminders from '@/libs/reminder';
class StatusService {
  async changeStatusOrderByTenant(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'pending_payment',
        cancel_date: new Date(),
      },
    });
    return updateStatus;
  }
  async cancelOrderByTenant(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
      },
    });
    return updateStatus;
  }
  async confirmOrder(req: Request) {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'success',
      },
    });
    if (updateStatus) await sendBookingReminders(orderId);
    return updateStatus;
  }
  async renderPaymentProof(req: Request) {
    const data = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });
    return data?.payment_proof;
  }
}

export default new StatusService();
