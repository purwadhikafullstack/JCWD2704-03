'use client';
import React, { useState } from 'react';
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

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const [period, setPeriod] = useState<'month' | 'week'>('month');
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
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 mx-2 font-semibold text-sm text-white rounded-full ${
            period === 'month' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 mx-2 font-semibold text-sm text-white rounded-full ${
            period === 'week' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          Weekly
        </button>
      </div>
      <div className="m-0 md:w-full md:h-full">
        <Line data={chartConfig} />
      </div>
    </div>
  );
};

export default SalesChart;
