'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Sale } from '@/models/sale.model';
import React, { useState, useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import Spinner from 'react-bootstrap/Spinner';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [order, setOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [endDate, setEndDate] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const fetchSales = async () => {
    try {
      const response = await axiosInstance().get('/api/sales/all', {
        params: {
          order,
          startDate,
          endDate,
          page,
          limit,
        },
      });
      setSales(response.data.data.sales);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [order, startDate, endDate, page, limit]);
  const handleSortOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
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
        Search
      </button>
      <div className="overflow-x-auto">
        <table className=" min-w-full bg-white rounded-lg shadow-md mt-4">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Invoice ID</th>
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
                <td className="py-2 px-4 border text-center">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="py-2 px-4 border">
                  {sale.invoice_id.toUpperCase()}
                </td>
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          <IoIosArrowBack />
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Sales;
