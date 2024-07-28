'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalesChart from './SalesChart';
import { axiosInstance } from '@/libs/axios.config';

const SalesPage: React.FC = () => {
  const [salesData, setSalesData] = useState(null);
  const [period, setPeriod] = useState<'month' | 'week'>('month');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axiosInstance().get('/api/sales/getSales');
        setSalesData(response.data.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  if (!salesData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sales Data</h1>
      <div className="flex gap-3">
        <button onClick={() => setPeriod('month')}>Monthly</button>
        <button onClick={() => setPeriod('week')}>Weekly</button>
      </div>
      <div>
        <SalesChart data={salesData} period={period} />
      </div>
    </div>
  );
};

export default SalesPage;
