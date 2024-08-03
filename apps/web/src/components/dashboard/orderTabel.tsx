'use client';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Order } from '@/models/reservation.model';
import { axiosInstance } from '@/libs/axios.config';
import { useRouter, useSearchParams } from 'next/navigation';

function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchOrderData = async (page = 1) => {
    try {
      const response = await axiosInstance().get(
        `/api/reservations/tenant/order?page=${page}&limit=${limit}`,
      );
      const { data, totalPages, currentPage } = response.data.data;
      setOrders(data);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
      console.log(data);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    fetchOrderData(page);
  }, [searchParams, limit]);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      router.replace(`/dashboard/?page=${newPage}`, undefined);
    }
  };
  const handleCancelled = (orderId: string) => {
    router.push(`/dashboard/order/cancel/${orderId}`);
  };
  const handleDenied = (orderId: string) => {
    router.push(`/dashboard/order/denied/${orderId}`);
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YY');
  };
  const renderStatus = (status: string, orderId: string) => {
    switch (status) {
      case 'awaiting_confirmation':
        return (
          <button
            className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 md:w-60 font-normal rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-yellow-900"
            type="button"
            onClick={() => handleDenied(orderId)}
          >
            AWAITING CONFIRMATION
          </button>
        );
      case 'pending_payment':
        return (
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 md:w-60 font-normal rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:focus:ring-blue-800"
            type="button"
            onClick={() => handleCancelled(orderId)}
          >
            PENDING PAYMENT
          </button>
        );
      case 'success':
        return <span className="text-green-500">SUCCESS</span>;
      case 'cancelled':
        return <span className="text-red-500">CANCELLED</span>;
      default:
        return status.replace('_', ' ');
    }
  };
  const headers = [
    'Invoice',
    'Name',
    'Property',
    'Room Type',
    'Room',
    'Reservation Date',
    'CheckIn',
    'CheckOut',
    'Status',
  ];

  return (
    <div className="flex flex-col gap-6 max-w-screen-xl">
      <div className=" text-3xl font-semibold pb-3 text-[#263C94] mt-10">
        All Transaction
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-center text-gray-700  bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 uppercase text-md"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-blue-50 dark:bg-gray-700'
                } border-b dark:border-gray-700`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {order.invoice_id.toLocaleUpperCase()}
                </td>
                <td className="px-6 py-4 text-center">
                  {order.user.first_name}
                </td>
                <td className="px-6 py-4 text-center">{order.property.name}</td>
                <td className="px-6 py-4 text-center">
                  {order.RoomCategory.type.toUpperCase()}
                </td>
                <td className="px-6 py-4 text-center">{order.total_room}</td>
                <td className="px-6 py-4 text-center">
                  {formatDate(order.payment_date)}
                </td>
                <td className="px-6 py-4 text-center">
                  {formatDate(order.checkIn_date)}
                </td>
                <td className="px-6 py-4 text-center">
                  {formatDate(order.checkOut_date)}
                </td>
                <td className="p-4 text-sm uppercase">
                  {renderStatus(order.status, order.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center py-4">
        <button
          className="px-4 py-2 text-white bg-black rounded-lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 text-white bg-black rounded-lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrderTable;
