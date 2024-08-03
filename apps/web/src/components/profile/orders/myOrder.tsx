'use client';

import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import { imageSrcRoom } from '@/utils/imagerender';
function MyOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const router = useRouter();
  const renderStatus = (status: string, orderId: string) => {
    switch (status) {
      case 'pending_payment':
        return (
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 md:w-60 font-normal rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:focus:ring-blue-800"
            type="button"
            onClick={() => handleOrderDetail(orderId)}
          >
            PENDING PAYMENT
          </button>
        );
      case 'success':
        return (
          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 md:w-60 font-normal rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-green-900"
            type="button"
            onClick={() => handleOrderDetail(orderId)}
          >
            SEE BOOKED ROOM
          </button>
        );
      case 'cancelled':
        return <span className="text-red-500 font-semibold">CANCELLED</span>;
      case 'awaiting_confirmation':
        return (
          <span className="text-yellow-400 font-semibold">
            AWAITING CONFIRMATION
          </span>
        );
      default:
        return status.replace('_', ' ');
    }
  };
  const handleOrderDetail = (orderId: string) => {
    router.push(`/profile/my-order/${orderId}`);
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance().get(
        '/api/reservations/user/myOrder',
        {
          params: {
            checkInDate,
            invoiceId,
          },
        },
      );
      console.log('Response data:', response.data.data);
      const orders: Order[] = response.data.data;
      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateDurationInDays = (
    checkInDate: Date,
    checkOutDate: Date,
  ): number => {
    const diff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
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
    <>
      <div className="max-w-screen-xl">
        <div>
          <p className="p-4 font-bold text-lg">Your Orders</p>
          <div className="flex flex-col md:flex-row gap-3 p-4">
            <div>
              <div className="font-bold">Check-In Date</div>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <div className="font-bold">Invoice</div>
              <input
                type="text"
                placeholder="Invoice ID"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:mt-6">
              <button
                onClick={handleSearch}
                className=" bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-4 mt-10">
          {orders.map((order) => (
            <div key={order.id}>
              <div>
                <div className="flex flex-col space-y-3 rounded-xl shadow-sm p-3 max-w-xs md:max-w-full border border-white bg-white">
                  <div className="flex flex-row gap-5 justify-between">
                    <div>
                      <img
                        src={
                          order.property.pic_name
                            ? `${imageSrcRoom}${order.RoomCategory.pic_name}`
                            : 'https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                        }
                        alt="hotel" // Use room.type for the alt text
                        className="rounded-xl"
                        width={100}
                      />
                    </div>
                    <div className="font-bold md:text-2xl">
                      {order.property.name}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">
                      {order.RoomCategory?.type || 'Unknown Room Type'} Room
                    </div>
                    {/* <div className="font-normal">
                      {order.roomCategory?.type}
                    </div> */}
                  </div>
                  {order.status !== 'cancelled' && (
                    <div className="flex flex-row gap-6 font-semibold">
                      <div>
                        {dayjs(order?.checkIn_date).format('DD MMMM YYYY')} -{' '}
                        {dayjs(order?.checkOut_date).format('DD MMMM YYYY')}
                      </div>
                      <div className="">
                        <div className="flex gap-3 font-semibold text-[#ED777B]">
                          {' '}
                          {calculateDurationInDays(
                            new Date(order.checkIn_date),
                            new Date(order.checkOut_date),
                          )}{' '}
                          <span className="hidden md:block font-semibold text-[#ED777B]">
                            {order.total_room > 1 ? 'Nights' : 'Night'}
                          </span>
                          <FaMoon className="mt-1 md:hidden" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="border"></div>
                  {renderStatus(order.status, order.id)}
                  <div className="flex flex-col md:flex-row">
                    <div className="font-bold">Invoice Id:</div>
                    <div>{order.invoice_id} </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyOrder;
