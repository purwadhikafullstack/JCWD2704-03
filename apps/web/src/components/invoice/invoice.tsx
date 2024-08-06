'use client';
import dayjs from 'dayjs';
import {
  IoTicketOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import { CountComponent } from './countDown';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { imageSrc } from '@/utils/imagerender';
import PaymentInstruction from './paymentInstructions';
import { LuMapPin } from 'react-icons/lu';
import { FaHotel } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
interface PaymentMethodDetails {
  method: string;
  va: string;
  imgSrc: string;
}

const Invoice = () => {
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [isShowedSnap, setIsShowedSnap] = useState(false);
  const [loading, setLoading] = useState(true);
  const search = useSearchParams();
  const id = search.get('order_id');
  const router = useRouter();
  const statusCode = search.get('status_code');
  const paymentMethodMap: { [key: string]: PaymentMethodDetails } = {
    MANDIRI: {
      method: 'MANDIRI Transfer',
      va: '8708950875882',
      imgSrc:
        'https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/494671cedab89e8b66621451cfb2dcba',
    },
    BCA: {
      method: 'BCA Transfer',
      va: '8900850875882',
      imgSrc:
        'https://cdn.iconscout.com/icon/free/png-256/free-bca-225544.png?f=webp',
    },
  };
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = snapScript;
    if (clientKey) {
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
    axiosInstance()
      .get(`/api/reservations/${id}`)
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((e) => {
        if (e instanceof AxiosError) console.log(e.response?.data);
        return undefined;
      });
    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  const handleLinkPayment = () => {
    const token = order?.token_midTrans;
    if (token) window.snap.pay(token);
  };
  const handleMyOrder = () => {
    router.push('/profile');
  };

  if (order === undefined)
    return (
      <>
        {' '}
        <div className="flex justify-center items-center h-64">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );
  const paymentMethodDetails = order
    ? paymentMethodMap[order.payment_method]
    : undefined;
  return (
    <>
      <div className="tracking-tighter">
        <div className="font-bold text-xl ml-20 my-6 md:text-3xl md:mt-3 md:mb-0 text-black">
          Reservation Detail
        </div>
        <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-16 w-screen md:justify-center md:p-8 ">
          <div>
            {/* SECTION PEMBAYARAN */}
            <div className="relative flex flex-col md:max-w-3xl gap-4 space-y-3 rounded-xl shadow-md p-3 max-w-xs  mx-auto border border-white bg-white">
              <div>
                <div className="flex flex-col border p-3 text-md gap-3 rounded-lg w-full">
                  {order.status === 'success' ? null : (
                    <div>{order && <CountComponent order={order} />}</div>
                  )}
                  <div>
                    <div>Invoice number</div>
                    <div className="uppercase font-bold">
                      {order?.invoice_id}
                    </div>
                  </div>
                  {order.payment_method !== 'GOPAY' &&
                    order.payment_method !== 'SHOPEE' && (
                      <div className="flex flex-row justify-between">
                        <div>
                          <div className="font-normal">
                            Number Virtual Account
                          </div>
                          <div className="font-bold">
                            {paymentMethodDetails
                              ? paymentMethodDetails.va
                              : 'N/A'}
                          </div>
                        </div>
                        <div className="font-bold flex flex-row gap-2 items-center">
                          <span>
                            {paymentMethodDetails && (
                              <img
                                src={paymentMethodDetails.imgSrc}
                                alt={paymentMethodDetails.method}
                                width={50}
                                height={50}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  <div className="border" />
                  <div>
                    <div className="flex-row flex justify-between">
                      <div>Merchant name</div>
                      <div className="font-semibold">atCasa</div>
                    </div>
                    <div className="flex-row flex justify-between">
                      <div className="">Amount to pay</div>
                      <div className="font-semibold">
                        Rp {order?.total_price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 pt-4 text-center">
                <div>
                  {order.payment_method === 'GOPAY' ||
                  order.payment_method === 'SHOPEE' ? (
                    <div className="font-semibold text-blue-700">
                      Please click here to pay your order.{' '}
                    </div>
                  ) : (
                    <div>
                      Please attach your payment proof to confirm your payment.
                      You can attach it on your dashboard.
                    </div>
                  )}
                </div>
                {/* isi form */}
                {order.status !== 'success' &&
                (order.payment_method === 'GOPAY' ||
                  order.payment_method === 'SHOPEE') ? (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={handleLinkPayment}
                  >
                    Link Payment
                  </button>
                ) : null}
                {order.status !== 'success' &&
                (order.payment_method === 'MANDIRI' ||
                  order.payment_method === 'BCA') ? (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={handleMyOrder}
                  >
                    My Orders
                  </button>
                ) : null}
              </div>
              {(order.payment_method === 'MANDIRI' ||
                order.payment_method === 'BCA') && (
                <div className="mt-8">
                  <PaymentInstruction paymentMethod={order.payment_method} />
                </div>
              )}
            </div>
          </div>
          {/* room section */}
          <div className="flex flex-col ">
            <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-md p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
              <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                  src={
                    order.property.pic_name
                      ? `${imageSrc}${order.property.pic_name}`
                      : 'https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                  }
                  alt="Property Pic"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
              <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                <div className="flex flex-row gap-2">
                  <div>
                    <FaHotel />
                  </div>
                  <div className="">
                    <div className="font-semibold">{order?.property.name}</div>
                    <div className="text-zinc-600">
                      {order.RoomCategory.type} Room
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-row items-center gap-2">
                    <IoCalendarOutline />{' '}
                    {dayjs(order?.checkIn_date).format('DD MMMM YYYY')} -{' '}
                    {dayjs(order?.checkOut_date).format('DD MMMM YYYY')}
                  </div>
                  <div className="flex">
                    <div>
                      <LuMapPin />
                    </div>
                    {order?.property.address}, {order?.property.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isShowedSnap && (
          <div id="snap-container" style={{ zIndex: '10' }}></div>
        )}
      </div>
    </>
  );
};

export default Invoice;
