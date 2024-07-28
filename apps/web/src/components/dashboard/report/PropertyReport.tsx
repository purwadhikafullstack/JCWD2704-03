'use client';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/libs/axios.config';

interface Sale {
  property_id: string;
  property_name: string;
  roomCategory_id: string;
  total_sales: number;
  total_orders: number;
}

const PropertyReport: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [sortBy, setSortBy] = useState<string>('total_sales');
  const [order, setOrder] = useState<string>('asc');

  useEffect(() => {
    fetchSales();
  }, [sortBy, order]);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance().get('/api/sales/propertySales', {
        params: { sortBy, order },
      });
      setSales(response.data.data);
    } catch (error) {
      console.error('Error fetching sales data', error);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
  };

  return (
    <div>
      <div className="text-lg font-bold">Property Report</div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
              Property Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Room Category ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Total Orders
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('total_sales')}
            >
              Total Sales
              {sortBy === 'total_sales' && (order === 'asc' ? ' ▲' : ' ▼')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.property_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sale.property_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sale.roomCategory_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sale.total_orders}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sale.total_sales}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyReport;
