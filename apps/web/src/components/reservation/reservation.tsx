'use client';

import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import { User } from '@/models/user.model';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/hooks';
import { RoomCategory } from '@prisma/client';
import { Room } from '@/models/room.model';

function Reservation() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [rooms, setRooms] = useState<Room | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const total_room = roomCount;
  const buyer = useAppSelector((state) => state.auth) as User;
  const searchParams = useSearchParams();

  const buyerId = buyer.id;
  const checkInDate = searchParams.get('checkIn') || '';
  const checkOutDate = searchParams.get('checkOut') || '';
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/properties/room/${id}`,
        );
        const { data } = response.data;
        setRooms(data);
        console.log(data);
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

  // const handleCheckInDateChange = (date: string) => {
  //   const today = new Date();
  //   const selectedDate = new Date(date);
  //   if (selectedDate < today) {
  //     alert('Check-in date cannot be in the past');
  //     setCheckInDate('');
  //   } else {
  //     setCheckInDate(date);
  //   }
  // };

  // const handleCheckOutDateChange = (date: string) => {
  //   const selectedCheckInDate = new Date(checkInDate);
  //   const selectedCheckOutDate = new Date(date);
  //   if (selectedCheckOutDate.getTime() === selectedCheckInDate.getTime()) {
  //     alert('Check-out date cannot be the same as check-in date');
  //     setCheckOutDate('');
  //   } else if (selectedCheckOutDate.getTime() < selectedCheckInDate.getTime()) {
  //     alert('Check-out date cannot be earlier than check-in date');
  //     setCheckOutDate('');
  //   } else {
  //     setCheckOutDate(date);
  //   }
  // };

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
  const durationInDays = !isNaN(diff)
    ? Math.ceil(diff / (1000 * 3600 * 24))
    : 0;
  const price = rooms?.roomCategory.peak_price
    ? rooms.roomCategory.peak_price
    : rooms?.roomCategory.price;
  const totalPrice = (price || 0) * roomCount * durationInDays;
  console.log('hargaa', rooms);
  const handlePay = async () => {
    const data = {
      user_id: buyerId,
      property_id: rooms?.property.id,
      room_id: id,
      roomCategory_id: rooms?.roomCategory.id,
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
  const isPayDisabled = !checkInDate || !checkOutDate || !paymentMethod;

  return (
    <div className="max-w-7xl m-auto h-screen w-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold md:py-6 p-6">
          Detail Reservation
        </h1>
      </div>
      <div className="flex flex-col gap-3 md:justify-between md:flex-row">
        <div className="flex flex-col">
          <div>
            {/* <div className="relative flex flex-col md:flex-row space-y-3 md:space-y-0 rounded-xl shadow-sm p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
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
            </div> */}
          </div>
          <div className="flex flex-col pt-3 ">
            <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-sm p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
              <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                  src="https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="roomType"
                  className="rounded-xl"
                />
              </div>
              <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                  {rooms?.roomCategory.type} Room
                </h3>
                <p className="md:text-lg text-gray-500 text-base">
                  {rooms?.roomCategory.desc}
                </p>
                {/* <p>Select Room</p>
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
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="relative flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-sm p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="font-semibold text-xl">Order summary</div>
            <div className="flex justify-between">
              <div>Price Room</div>
              <div>Rp. {price?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="border-b my-2" />
            <div className="flex justify-between font-semibold"></div>
            <div className="flex justify-between text-[#ED777B]">
              <div>{!isNaN(durationInDays) ? durationInDays : 'N/A'} night</div>
              <div className="text-black font-semibold">
                Rp. {!isNaN(totalPrice) ? totalPrice.toLocaleString() : 'N/A'}
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <div>Subtotal</div>
              <div>
                Rp. {!isNaN(totalPrice) ? totalPrice.toLocaleString() : 'N/A'}
              </div>
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
                disabled={isPayDisabled}
                className={`w-full py-2 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 ${
                  isPayDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
