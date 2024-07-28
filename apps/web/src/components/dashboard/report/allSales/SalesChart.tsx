'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, //x axis
  LinearScale, //Y axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface SalesData {
  custom: number;
  monthly: { month: number; total_price: number }[];
  weekly: { week: string; total_price: number }[];
}

interface SalesChartProps {
  data: SalesData;
  period: 'month' | 'week';
}

const SalesChart: React.FC<SalesChartProps> = ({ data, period }) => {
  let chartData;
  let labels;
  let title;

  if (period === 'month') {
    labels = data.monthly.map((item) => `Month ${item.month}`);
    chartData = data.monthly.map((item) => item.total_price);
    title = 'Monthly Sales';
  } else {
    labels = data.weekly.map((item) => {
      const [startDate, endDate] = item.week.split(' - ');
      const startFormatted = new Date(startDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
      });
      const endFormatted = new Date(endDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
      });
      return `${startFormatted} - ${endFormatted}`;
    });
    chartData = data.weekly.map((item) => item.total_price);
    title = 'Weekly Sales';
  }

  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Total Sales',
        data: chartData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className="m-0 md:w-full md:h-full">
        <Line data={chartConfig} />
      </div>
    </div>
  );
};

export default SalesChart;
