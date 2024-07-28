'use client';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Order } from '@/models/reservation.model';
import { axiosInstance } from '@/libs/axios.config';

function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const fetchOrderData = async () => {
    try {
      const response = await axiosInstance().get(
        '/api/reservations/tenant/order',
      );
      const ordersData: Order[] = response.data.data;

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };
  useEffect(() => {
    fetchOrderData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YY');
  };
  const renderStatus = (status: string) => {
    switch (status) {
      case 'awaiting_confirmation':
        return (
          <button
            className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-normal rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
            type="button"
          >
            AWAITING CONFIRMATION
          </button>
        );
      case 'pending_payment':
        return <span className="text-blue-500">PENDING PAYMENT</span>;
      case 'success':
        return <span className="text-green-500">SUCCESS</span>;
      case 'cancelled':
        return <span className="text-red-500">CANCELLED</span>;
      default:
        return status.replace('_', ' ');
    }
  };

  return (
    <div className="overflow-x-auto md:overflow-x-auto-hidden">
      <div className=" text-3xl font-semibold pb-3">All Transaction</div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm text-center text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Invoice
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Property
            </th>
            <th scope="col" className="px-6 py-3">
              Room Type
            </th>
            <th scope="col" className="px-6 py-3">
              Room
            </th>
            <th scope="col" className="px-6 py-3">
              Reservation Date
            </th>
            <th scope="col" className="px-6 py-3">
              CheckIn
            </th>
            <th scope="col" className="px-6 py-3">
              CheckOut
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {order.invoice_id.toLocaleUpperCase()}
              </td>
              <td className="px-6 py-4 text-center">{order.user.first_name}</td>
              <td className="px-6 py-4 text-center">{order.property.name}</td>
              <td className="px-6 py-4 text-center">
                {order.room.type.toUpperCase()}
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
                {renderStatus(order.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
