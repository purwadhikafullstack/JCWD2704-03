import { Request } from 'express';
import { prisma } from '../libs/prisma';
import sendBookingReminders from '@/cron/reminder';
import { startExpireDenyOrdersCron } from '@/cron/denyOrder';
import { transporter } from '@/libs/nodemailer';
import fs from 'fs';
import path from 'path';
import { render } from 'mustache';
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
    let cronStarted = false;
    if (!cronStarted) {
      startExpireDenyOrdersCron();
      cronStarted = true;
    }
    const templatePath = path.join(__dirname, '../templates/deny.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    const orderDetails = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, RoomCategory: true, property: true },
    });
    if (orderDetails) {
      const userEmail = orderDetails.user.email;
      const propertyName = orderDetails.property.name;
      const roomType = orderDetails.RoomCategory?.type || 'Unknown Room Type';
      const checkInDate = orderDetails.checkIn_date.toLocaleDateString();
      const checkOutDate = orderDetails.checkOut_date.toLocaleDateString();
      const html = htmlTemplate
        .replace(/{propertyName}/g, propertyName)
        .replace(/{checkInDate}/g, checkInDate)
        .replace(/{checkOutDate}/g, checkOutDate)
        .replace(/{roomType}/g, roomType);
      const krimEmail = transporter.sendMail({
        from: 'purwadhika2704@gmail.com',
        to: userEmail,
        subject: 'Booking Denied',
        html,
      });
      console.log('kiiriim email', krimEmail);
    }

    return updateStatus;
  }
  async cancelOrderByTenant(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        checkIn_date: new Date('1970-01-01T00:00:00Z'),
        checkOut_date: new Date('1970-01-01T00:00:00Z'),
      },
    });
    const orderDetails = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        property: true,
        RoomCategory: true,
      },
    });
    const templatePath = path.join(__dirname, '../templates/cancelled.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    if (orderDetails) {
      const userEmail = orderDetails.user.email;
      const propertyName = orderDetails.property.name;
      const roomType = orderDetails.RoomCategory?.type || 'Unknown Room Type';
      const html = htmlTemplate
        .replace(/{propertyName}/g, propertyName)
        .replace(/{roomType}/g, roomType);

      transporter.sendMail({
        from: 'purwadhika2704@gmail.com',
        to: userEmail,
        subject: 'Booking Cancelled',
        html,
      });
      console.log('kiiriim email', userEmail);
    }
    return updateStatus;
  }
  async cancelOrderByUser(req: Request) {
    const { orderId } = req.params;
    const updateStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        checkIn_date: new Date('1970-01-01T00:00:00Z'),
        checkOut_date: new Date('1970-01-01T00:00:00Z'),
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
    const isDataReviewExist = await prisma.review.findFirst({
      where: { order_id: order.id, property_id: order.property_id },
    });

    if (!isDataReviewExist) {
      await prisma.review.create({
        data: {
          property_id: order.property_id,
          user_id: order.user_id,
          order_id: orderId,
          review: '',
          rating: 0,
        },
      });
    }
    const templatePath = path.join(__dirname, '../templates/confirm.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    const orderDetails = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        property: true,
        RoomCategory: true,
      },
    });
    if (orderDetails) {
      const userEmail = orderDetails.user.email;
      const propertyName = orderDetails.property.name;
      const roomType = orderDetails.RoomCategory?.type || 'Unknown Room Type';
      const checkInDate = orderDetails.checkIn_date.toLocaleDateString();
      const checkOutDate = orderDetails.checkOut_date.toLocaleDateString();
      const html = htmlTemplate
        .replace(/{propertyName}/g, propertyName)
        .replace(/{checkInDate}/g, checkInDate)
        .replace(/{checkOutDate}/g, checkOutDate)
        .replace(/{roomType}/g, roomType);

      const krimEmail = transporter.sendMail({
        from: 'purwadhika2704@gmail.com',
        to: userEmail,
        subject: 'Booking Confirmation',
        html,
      });
      console.log('kiiriim email', krimEmail);
    }
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
