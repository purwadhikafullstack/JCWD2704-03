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
        total_sales: sale._sum.total_price ?? 0, // Default to 0 if null
        total_orders: sale._count.id,
      });
    }

    if (sortBy === 'total_sales') {
      result.sort((a, b) => {
        const totalSalesA = a.total_sales ?? 0; // Default to 0 if null
        const totalSalesB = b.total_sales ?? 0; // Default to 0 if null
        return order === 'asc'
          ? totalSalesA - totalSalesB
          : totalSalesB - totalSalesA;
      });
    } else if (sortBy === 'date') {
      // This block is omitted since we don't have date information
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
    const { order = 'asc', startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

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
    });

    const result = sales.map((sale) => ({
      user_id: sale.user_id,
      user_firstname: sale.user?.first_name,
      property_id: sale.property_id,
      property_name: sale.property?.name,
      total_price: sale.total_price,
      createdAt: sale.createdAt,
    }));

    return result;
  }
  async roomAvailability(req: Request) {
    const { year, month } = req.query;

    if (!year || !month) {
      console.log('Year and month are required');
    }

    const yearInt = parseInt(year as string);
    const monthInt = parseInt(month as string);

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0);

    const orders = await prisma.order.findMany({
      where: {
        status: 'success',
        OR: [
          {
            checkIn_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            checkOut_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            AND: [
              {
                checkIn_date: {
                  lte: startDate,
                },
              },
              {
                checkOut_date: {
                  gte: endDate,
                },
              },
            ],
          },
        ],
      },
      include: {
        RoomCategory: true,
        property: true,
        OrderRoom: {
          include: {
            room: true,
          },
        },
      },
    });

    const availability: {
      [date: string]: { rooms: any[]; properties: any[] };
    } = {};

    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(yearInt, monthInt - 1, day);
      const dateString = date.toISOString().split('T')[0];

      availability[dateString] = {
        rooms: [],
        properties: [],
      };

      for (const order of orders) {
        if (order.checkIn_date <= date && order.checkOut_date >= date) {
          availability[dateString].rooms.push(order.RoomCategory);
          availability[dateString].properties.push(order.property);
        }
      }
    }

    return availability;
  }
}
export default new SalesService();
