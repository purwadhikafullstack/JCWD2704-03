'use client';
import React, { useState, useEffect } from 'react';
import SalesChart from './SalesChart';
import { axiosInstance } from '@/libs/axios.config';
import Spinner from 'react-bootstrap/Spinner';
const SalesPage: React.FC = () => {
  const [salesData, setSalesData] = useState(null);
  const [period, setPeriod] = useState<'month' | 'week'>('month');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axiosInstance().get('/api/sales/getSales');
        setSalesData(response.data.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (!salesData) {
    return <div>Data No Found</div>;
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  return (
    <div>
      <h1>Sales Data</h1>
      <div>
        <SalesChart data={salesData} period={period} />
      </div>
    </div>
  );
};

export default SalesPage;
