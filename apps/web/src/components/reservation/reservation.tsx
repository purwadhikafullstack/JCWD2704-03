'use client';

import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import { User } from '@/models/user.model';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/hooks';
import { RoomCategory } from '@prisma/client';
import { FaSmoking } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { PiForkKnifeFill } from 'react-icons/pi';
import { IoPersonOutline } from 'react-icons/io5';
import { imageSrcRoom } from '@/utils/imagerender';
function Reservation() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [rooms, setRooms] = useState<RoomCategory | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const total_room = roomCount;
  const buyer = useAppSelector((state) => state.auth) as User;
  const searchParams = useSearchParams();
  const buyerId = buyer.id;
  const checkInDate = searchParams.get('checkIn') || '';
  const checkOutDate = searchParams.get('checkOut') || '';
  const roomIds = searchParams.get('Ids')?.replace(/-/g, ',').split(',') || [];
  const total_price = parseFloat(searchParams.get('total') || '0');

  console.log(checkInDate, checkOutDate);

  console.log('ini roomIds', roomIds);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        console.log(id);

        const response = await axiosInstance().get(
          `/api/properties/room/${id}`,
        );
        const { data } = response.data;

        console.log('Response:', response.data);

        setRooms(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRoom();
  }, [id]);

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
  const durationInDays = !isNaN(diff)
    ? Math.ceil(diff / (1000 * 3600 * 24))
    : 0;

  console.log('ini roomss', rooms);
  const today = new Date();
  const isPeak =
    rooms?.start_date_peak &&
    rooms?.end_date_peak &&
    today >= new Date(rooms.start_date_peak) &&
    today <= new Date(rooms.end_date_peak);
  const price = isPeak ? rooms?.peak_price : rooms?.price;
  const totalPrice = (total_price || 0) * durationInDays;
  console.log('total_price', totalPrice);
  console.log('hargaa', rooms);

  const handlePay = async () => {
    const data = {
      user_id: buyerId,
      property_id: rooms?.property_id,
      room_ids: roomIds,
      roomCategory_id: rooms?.id,
      checkIn_date: checkInDate,
      checkOut_date: checkOutDate,
      payment_method: paymentMethod || null,
      total_price: totalPrice,
    };

    console.log('data to be sent:', data);
    try {
      console.log(buyerId);

      const response = await axiosInstance().post('/api/reservations', data);
      console.log('order successful', response);
      const orderData = response.data.data;
      if (!orderData || !orderData.id) {
        throw new Error('id is undefined');
      }
      setOrder(orderData);
      const orderId = orderData.id;
      console.log('ID from recent order:', orderId);
      const dataMidtrans = {
        order_id: orderId,
        total_price: totalPrice,
      };
      const createMidtrans = await axiosInstance()
        .post(`/api/reservations/createSnapMidtrans`, dataMidtrans)
        .then((res) => res.data)
        .catch((error) => console.log(error));
      console.log(createMidtrans);
      router.push(`/invoice?order_id=${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'Gopay' || selectedValue === 'Qris') {
      setPaymentMethod(null);
    } else {
      setPaymentMethod(selectedValue);
    }
  };
  const isPayDisabled = !checkInDate || !checkOutDate || !paymentMethod;

  return (
    <div className="max-w-screen-xl m-auto h-screen w-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold md:py-6 p-6">
          Detail Reservation
        </h1>
      </div>
      <div className="flex flex-col gap-3 md:justify-between md:flex-row">
        <div className="flex flex-col">
          <div></div>
          <div className="flex flex-col pt-3 ">
            <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 sm:space-y-0 rounded-xl shadow-sm p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
              <div className="w-full h-full md:max-w-lg bg-white grid place-items-center">
                <img
                  src={
                    rooms?.pic_name
                      ? `${imageSrcRoom}${rooms.pic_name}`
                      : 'https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                  }
                  alt="roomType"
                  className="rounded-xl"
                />
              </div>
              <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                  {rooms?.type} Room
                </h3>
                <div className="flex gap-2">
                  <IoPersonOutline className="mt-1" />
                  <div className="flex flex-row  text-blue-900">
                    {rooms?.guest} Guest
                  </div>
                </div>
                <div>
                  <div className="flex flex-row">
                    {rooms?.isBreakfast === true ? (
                      <div className="flex gap-2">
                        <PiForkKnifeFill className="mt-1" />
                        <div className=" text-blue-900">Breakfast included</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold">No Breakfast</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex flex-row">
                    {rooms?.isSmoking === true ? (
                      <div className="flex gap-2 flex-row">
                        <FaSmoking className="mt-1" />
                        <div className=" text-blue-900">Smoking</div>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-row">
                        <div className="font-semibold">Non-smoking</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex flex-row">
                    {rooms?.isRefunable === true ? (
                      <div className="flex gap-2">
                        <MdOutlinePayment className="mt-1" />
                        <div className="font-semibold text-blue-900">
                          Refunable
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold">Non-refunable</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <div className="relative flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-sm p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="font-semibold text-xl">Order summary</div>
            <div className="flex flex-col gap-5 pt-5">
              <div className="flex justify-between ">
                <div>Price Room</div>
                <div>Rp. {price?.toLocaleString() || 'N/A'}</div>
              </div>
              <div className="border-b my-2" />
              <div className="flex justify-between text-[#ED777B]">
                <div className="">
                  {!isNaN(durationInDays) ? durationInDays : 'N/A'} night
                </div>
                <div className="text-black font-semibold">
                  Rp. {!isNaN(totalPrice) ? totalPrice.toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="flex justify-between font-semibold">
                <div className="">Subtotal</div>
                <div className="">
                  Rp. {!isNaN(totalPrice) ? totalPrice.toLocaleString() : 'N/A'}
                </div>
              </div>
              <div>
                <label htmlFor="paymentMethod" className="block font-medium">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod ?? ''}
                  onChange={handlePaymentMethodChange}
                  className="w-full mt-2 mb-4 p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>
                    Select a payment method*
                  </option>
                  <option value="BCA">BCA</option>
                  <option value="MANDIRI">MANDIRI</option>
                  <option value={'gopay'}>E-Wallet (Gopay / Qris)</option>
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
    </div>
  );
}

export default Reservation;
