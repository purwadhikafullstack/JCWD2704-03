'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import { Room } from '@/models/room.model';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Reservation() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [rooms, setRooms] = useState<Room | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const total_room = roomCount;
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/properties/room/${id}`,
        );
        const { data } = response.data;
        setRooms(data);
        console.log(data); // Assuming data is an array of Room objects
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRoom();
  }, [id]);
  const handleIncrement = () => {
    if (roomCount < 3) {
      setRoomCount(roomCount + 1);
    }
  };

  const handleDecrement = () => {
    if (roomCount > 1) {
      setRoomCount(roomCount - 1);
    }
  };
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaymentMethod(e.target.value);
  };
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
  // Calculate the duration in days
  const durationInDays = Math.ceil(diff / (1000 * 3600 * 24));
  const price = rooms?.peak_price ? rooms.peak_price : rooms?.price;
  const totalPrice = (price || 0) * roomCount * durationInDays;
  const handlePay = async () => {
    const data = {
      user_id: 'cly9wnpqn0008zgag7m5r2b3i',
      property_id: rooms?.property_id,
      room_id: id,
      checkIn_date: checkInDate,
      checkOut_date: checkOutDate,
      total_room,
      payment_method: paymentMethod,
      total_price: totalPrice,
    };
    console.log('data to be sent:', data);
    try {
      const response = await axiosInstance().post('/api/reservations', data);
      console.log('order successful', response);
      const orderData = response.data.data;
      if (!orderData || !orderData.id) {
        throw new Error('id is undefined');
      }
      setOrder(orderData);
      const orderId = orderData.id;
      console.log('ID from recent order:', orderId);
      router.push(`/invoice/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  const handleCheckInDateChange = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      // Prevent selecting past dates
      alert('Check-in date cannot be in the past');
      setCheckInDate('');
    } else {
      setCheckInDate(date);
    }
  };

  const handleCheckOutDateChange = (date: string) => {
    const selectedCheckInDate = new Date(checkInDate);
    const selectedCheckOutDate = new Date(date);
    if (selectedCheckOutDate.getTime() === selectedCheckInDate.getTime()) {
      alert('Check-out date cannot be the same as check-in date');
      setCheckOutDate('');
    } else if (selectedCheckOutDate.getTime() < selectedCheckInDate.getTime()) {
      alert('Check-out date cannot be earlier than check-in date');
      setCheckOutDate('');
    } else {
      setCheckOutDate(date);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Detail Reservation</h1>
      </div>
      <div className="flex flex-col gap-3 md:justify-between md:flex-row">
        <div className="flex flex-col">
          {/* checkin checkOut */}
          <div>
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl shadow">
              <div className="flex flex-col w-[320px]">
                <div className="relative">
                  <label className="py-2 text-sm font-bold">Check In</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={checkInDate}
                    onChange={(e) => handleCheckInDateChange(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                  />
                  <div className="text-red-600 text-xs"></div>
                </div>
              </div>
              <div className="flex flex-col w-[320px]">
                <label className="py-2 text-sm font-bold">Check Out</label>
                <div className="relative">
                  <input
                    type="date"
                    name="checkOut"
                    value={checkOutDate}
                    onChange={(e) => handleCheckOutDateChange(e.target.value)}
                    className="bg.white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block "
                  />
                  <div className="text-red-600 text-xs"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Room and prop detail */}
          <div className="flex flex-col pt-3 ">
            <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
              <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                  src="https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="roomType"
                  className="rounded-xl"
                />
              </div>
              <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                  {rooms?.type} Room
                </h3>
                <p className="md:text-lg text-gray-500 text-base">
                  {rooms?.desc}
                </p>
                <p>Select Room</p>
                <div className="flex flex-row items-center gap-3 text-lg">
                  <button
                    className="w-10 btn btn-dark"
                    onClick={handleDecrement}
                    disabled={roomCount <= 1}
                  >
                    -
                  </button>
                  <div>{roomCount}</div>
                  <button
                    className="w-10 btn btn-dark"
                    onClick={handleIncrement}
                    disabled={roomCount >= 3}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* order summary */}
        <div className="md:w-1/3">
          <div className="relative flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="font-semibold text-xl">Order summary</div>
            <div className="flex justify-between">
              <div>Price Room</div>
              <div>Rp. {price?.toLocaleString()}</div>
            </div>
            <div className="border-b my-2" />
            <div className="flex justify-between font-semibold">
              <div>Total {total_room} room</div>
            </div>
            <div className="flex justify-between text-[#ED777B]">
              <div>{durationInDays} night</div>
              <div className="text-black font-semibold">
                Rp. {totalPrice.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <div>Subtotal</div>
              <div>Rp. {totalPrice.toLocaleString()}</div>
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block font-medium">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="w-full mt-2 mb-4 p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select a payment method*
                </option>
                <option value="BCA">BCA</option>
                <option value="MANDIRI">MANDIRI</option>
              </select>
            </div>
            <div>
              <button
                onClick={handlePay}
                className="w-full py-2 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
