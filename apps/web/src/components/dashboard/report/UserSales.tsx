'use client';
import { axiosInstance } from '@/libs/axios.config';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

type SaleDetail = {
  property_id: string;
  property_name: string;
  roomCategory_id: string;
  total_sales: number;
  total_orders: number;
};

type UserSaleData = {
  user_name: string;
  user_id: string;
  total_sales: number;
  total_orders: number;
  details: SaleDetail[];
};

const UserReport: React.FC = () => {
  const [sales, setSales] = useState<UserSaleData[]>([]);
  const [sortBy, setSortBy] = useState<'total_sales' | 'total_orders'>(
    'total_sales',
  );
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axiosInstance().get('/api/sales/UserSales', {
          params: { sortBy, order },
        });
        setSales(response.data.data);
      } catch (error) {
        console.error('Error fetching sales data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [sortBy, order]);

  const requestSort = (key: 'total_sales' | 'total_orders') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortBy === key && order === 'asc') {
      direction = 'desc';
    }
    setSortBy(key);
    setOrder(direction);
  };
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
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">User Report</h1>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-4 border">No</th>
            <th className="py-3 px-6 text-left">User Name</th>
            <th className="py-3 px-6 text-left">Property Name</th>
            <th className="py-3 px-6 text-left">Property ID</th>
            <th
              className="py-3 px-6 text-left cursor-pointer"
              onClick={() => requestSort('total_sales')}
            >
              Total Sales
              {sortBy === 'total_sales' && (order === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left cursor-pointer"
              onClick={() => requestSort('total_orders')}
            >
              Total Orders
              {sortBy === 'total_orders' && (order === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sales.map((sale) =>
            sale.details.map((detail, index) => (
              <tr
                key={`${sale.user_id}-${detail.property_id}`}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-3 px-6 text-left">
                  {index === 0 ? sale.user_name : ''}
                </td>
                <td className="py-3 px-6 text-left">
                  {index === 0
                    ? detail.property_name
                    : `- ${detail.property_name}`}
                </td>
                <td className="py-3 px-6 text-left">{detail.property_id}</td>
                <td className="py-3 px-6 text-left">{detail.total_sales}</td>
                <td className="py-3 px-6 text-left">{detail.total_orders}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserReport;
