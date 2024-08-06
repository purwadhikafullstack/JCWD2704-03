import { prisma } from '@/libs/prisma';
import { Request } from 'express';

class ChartSalesReport {
  async getSales(req: Request) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    // Data penjualan per tahun
    const salesPerYear = await prisma.order.aggregate({
      _sum: {
        total_price: true,
      },
      where: {
        createdAt: {
          gte: startOfYear,
        },
        status: 'success',
      },
    });

    // Data penjualan per bulan
    const salesPerMonth = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total_price: true,
      },
      where: {
        createdAt: {
          gte: startOfYear,
          lte: now,
        },
        status: 'success',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    let customSales = { _sum: { total_price: 0 } };
    if (req.query.start && req.query.end) {
      const startDate = new Date(req.query.start as string);
      const endDate = new Date(req.query.end as string);
      const customSalesResult = await prisma.order.aggregate({
        _sum: {
          total_price: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'success',
        },
      });
      customSales = {
        _sum: {
          total_price: customSalesResult._sum.total_price ?? 0, // Default ke 0 jika null
        },
      };
    }
    // Mendefinisikan minggu dalam bulan ini
    const weeksInMonth = [];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let date = new Date(currentYear, currentMonth, 1);

    while (date.getMonth() === currentMonth) {
      const startOfWeek = new Date(date);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      weeksInMonth.push({ startOfWeek, endOfWeek });

      date.setDate(date.getDate() + 7);
    }
    // Mengolah data penjualan per minggu dalam bulan ini
    const weeklySales = await Promise.all(
      weeksInMonth.map(async (week) => {
        const sales = await prisma.order.aggregate({
          _sum: {
            total_price: true,
          },
          where: {
            createdAt: {
              gte: week.startOfWeek,
              lte: week.endOfWeek,
            },
            status: 'success',
          },
        });
        return {
          week: `${week.startOfWeek.toISOString().substring(0, 10)} - ${week.endOfWeek.toISOString().substring(0, 10)}`,
          total_price: sales._sum.total_price || 0,
        };
      }),
    );

    // Mengolah data penjualan per bulan
    const monthlySales = Array(12)
      .fill(0)
      .map((_, i) => {
        const month = new Date(now.getFullYear(), i, 1)
          .toISOString()
          .substring(0, 7);
        const monthData = salesPerMonth.find(
          (sale) => sale.createdAt.toISOString().substring(0, 7) === month,
        );
        return {
          month: i + 1,
          total_price: monthData?._sum.total_price || 0,
        };
      });

    return {
      year: salesPerYear._sum.total_price || 0,
      // month: salesPerMonth.reduce(
      //   (acc, curr) => acc + (curr._sum.total_price || 0),
      //   0,
      // ),
      // week: salesPerWeek._sum.total_price || 0,
      custom: customSales._sum.total_price || 0,
      monthly: monthlySales,
      weekly: weeklySales,
    };
  }
}

export default new ChartSalesReport();
