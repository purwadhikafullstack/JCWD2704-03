import { prisma } from '@/libs/prisma';
import { Request } from 'express';

class SalesService {
  async getSalesByProperty(req: Request) {
    const salesByProp = await prisma.order.groupBy({
      by: ['property_id'],
      _sum: {
        total_price: true,
      },
      orderBy: {
        _sum: { total_price: 'desc' },
      },
      take: 1,
    });
    if (salesByProp.length === 0) return null;

    const highestSalesPropertyId = salesByProp[0].property_id;
    const property = await prisma.property.findUnique({
      where: { id: highestSalesPropertyId },
    });

    return {
      property,
      totalSales: salesByProp[0]._sum.total_price,
    };
  }
}
