import { prisma } from '@/libs/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { Request } from 'express';

class SalesService {
  async getSalesByProperty(req: Request) {
    const { sortBy = 'total_sales', order = 'asc' } = req.query;

    const sales = await prisma.order.groupBy({
      by: ['property_id', 'roomCategory_id'],
      where: {
        status: 'success',
        property: {
          tenant_id: req.user.id,
        },
      },
      _sum: {
        total_price: true,
      },
      _count: {
        id: true,
      },
    });

    const result = [];

    for (const sale of sales) {
      const property = await prisma.property.findUnique({
        where: { id: sale.property_id },
      });

      result.push({
        property_id: sale.property_id,
        property_name: property?.name || 'Unknown',
        roomCategory_id: sale.roomCategory_id,
        total_sales: sale._sum.total_price ?? 0,
        total_orders: sale._count.id,
      });
    }

    if (sortBy === 'total_sales') {
      result.sort((a, b) => {
        const totalSalesA = a.total_sales ?? 0;
        const totalSalesB = b.total_sales ?? 0;
        return order === 'asc'
          ? totalSalesA - totalSalesB
          : totalSalesB - totalSalesA;
      });
    }
    return result;
  }

  async getSalesByUser(req: Request) {
    const { order = 'asc' } = req.query;

    const sales = await prisma.order.groupBy({
      by: ['user_id', 'property_id', 'roomCategory_id'],
      where: {
        status: 'success',
        property: {
          tenant_id: req.user.id,
        },
      },
      _sum: {
        total_price: true,
      },
      _count: {
        id: true,
      },
    });

    const userSalesMap = new Map();

    for (const sale of sales) {
      const user = await prisma.user.findUnique({
        where: { id: sale.user_id },
      });
      const property = await prisma.property.findUnique({
        where: { id: sale.property_id },
      });

      const currentSales = userSalesMap.get(sale.user_id) || {
        user_name: user?.first_name || 'Unknown',
        user_id: sale.user_id,
        total_sales: 0,
        total_orders: 0,
        details: [],
      };

      currentSales.total_sales += sale._sum.total_price ?? 0;
      currentSales.total_orders += sale._count.id;
      currentSales.details.push({
        property_id: sale.property_id,
        property_name: property?.name || 'Unknown',
        roomCategory_id: sale.roomCategory_id,
        total_sales: sale._sum.total_price ?? 0,
        total_orders: sale._count.id,
      });

      userSalesMap.set(sale.user_id, currentSales);
    }

    const result = Array.from(userSalesMap.values());

    result.sort((a, b) => {
      const totalSalesA = a.total_sales ?? 0;
      const totalSalesB = b.total_sales ?? 0;
      return order === 'asc'
        ? totalSalesA - totalSalesB
        : totalSalesB - totalSalesA;
    });

    return result;
  }
  async getAllSales(req: Request) {
    const {
      order = 'asc',
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const totalSales = await prisma.order.count({
      where: {
        status: 'success',
        ...dateFilter,
        property: {
          tenant_id: req.user.id,
        },
      },
    });

    // Hitung nilai skip dan take
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const sales = await prisma.order.findMany({
      where: {
        status: 'success',
        ...dateFilter,
        property: {
          tenant_id: req.user.id,
        },
      },
      select: {
        user_id: true,
        property_id: true,
        invoice_id: true,
        user: {
          select: {
            first_name: true,
          },
        },
        property: {
          select: {
            name: true,
          },
        },
        total_price: true,
        createdAt: true,
      },
      orderBy: [
        {
          total_price: order as 'asc' | 'desc',
        },
        {
          createdAt: order as 'asc' | 'desc',
        },
      ],
      skip,
      take,
    });
    const result = sales.map((sale) => ({
      user_id: sale.user_id,
      user_firstname: sale.user?.first_name,
      property_id: sale.property_id,
      property_name: sale.property?.name,
      total_price: sale.total_price,
      createdAt: sale.createdAt,
      invoice_id: sale.invoice_id,
    }));

    return {
      totalPages: Math.ceil(totalSales / Number(limit)),
      currentPage: Number(page),
      sales: result,
    };
  }

  async roomAvailability(req: Request) {
    const { year, month } = req.query;

    // Validasi parameter year dan month
    if (!year || !month) {
      throw new Error('Year and month are required.');
    }

    const yearNumber = parseInt(year as string);
    const monthNumber = parseInt(month as string);

    const startDate = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(yearNumber, monthNumber, 0));
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    const orders = await prisma.order.findMany({
      where: {
        checkIn_date: {
          gte: startDate,
          lte: endDate,
        },
        checkOut_date: {
          gte: startDate,
        },
        property: {
          tenant_id: req.user.id,
        },
        status: 'success',
      },
      select: {
        id: true,
        user_id: true,
        property_id: true,
        roomCategory_id: true,
        checkIn_date: true,
        checkOut_date: true,
        total_price: true,
        invoice_id: true,
        property: {
          select: {
            name: true,
          },
        },
        RoomCategory: {
          select: {
            type: true,
          },
        },
      },
    });

    const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
    const calendar: { date: Date; orders: any[] }[] = [];
    console.log(daysInMonth);

    for (let day = 2; day <= daysInMonth + 1; day++) {
      const date = new Date(yearNumber, monthNumber - 1, day);
      const ordersForDate = orders.filter(
        (order) => date >= order.checkIn_date && date <= order.checkOut_date,
      );
      calendar.push({ date, orders: ordersForDate });
    }

    return calendar;
  }
}
export default new SalesService();
