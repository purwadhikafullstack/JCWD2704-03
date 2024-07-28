'use client';
import { axiosInstance } from '@/libs/axios.config';
import React, { useState, useEffect } from 'react';
interface Sale {
  user_id: string;
  user_firstname: string;
  property_id: string;
  property_name: string;
  total_price: number;
  createdAt: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [order, setOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSales = async () => {
    try {
      const response = await axiosInstance().get('/api/sales/all', {
        params: {
          order,
          startDate,
          endDate,
        },
      });
      setSales(response.data.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [order, startDate, endDate]);
  const handleSortOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
      <div className="mb-4">
        <label className="mr-2">Order:</label>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        onClick={fetchSales}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Fetch Sales
      </button>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border">No</th>
            <th className="py-2 px-4 border">User ID</th>
            <th className="py-2 px-4 border">User First Name</th>
            <th className="py-2 px-4 border">Property ID</th>
            <th className="py-2 px-4 border">Property Name</th>
            <th className="py-2 px-4 border" onClick={handleSortOrder}>
              Total Price{order === 'asc' ? '↑' : '↓'}
            </th>
            <th className="py-2 px-4 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border text-center">{index + 1}</td>
              <td className="py-2 px-4 border">{sale.user_id}</td>
              <td className="py-2 px-4 border">{sale.user_firstname}</td>
              <td className="py-2 px-4 border">{sale.property_id}</td>
              <td className="py-2 px-4 border">{sale.property_name}</td>
              <td className="py-2 px-4 border">{sale.total_price}</td>
              <td className="py-2 px-4 border">
                {new Date(sale.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
