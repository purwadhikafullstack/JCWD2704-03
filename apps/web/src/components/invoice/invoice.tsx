// 'use client';
import dayjs from 'dayjs';
import {
  IoTicketOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import FormPaymentProofComponent, { CountComponent } from './countDown';

const paymentMethodMap: { [key: string]: string } = {
  MANDIRI: 'MANDIRI Transfer',
  BCA: 'BCA Transfer',
};

async function Invoice({ id }: { id: string }) {
  const order: Order = await axiosInstance()
    .get(`/api/reservations/${id}`)
    .then((res) => res.data.data)
    .catch((e) => {
      if (e instanceof AxiosError) console.log(e.response?.data);
      return undefined;
    });

  //   const user = jwtDecode(cookies().get('access_token')?.value!) as TUser;
  //   if (order.buyer_id != user.id) redirect('/');
  const paymentMethodMap: {
    [key: string]: { method: string; va: string; imgSrc: string };
  } = {
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
  const paymentMethodDetails =
    paymentMethodMap[order?.payment_method as keyof typeof paymentMethodMap] ||
    order?.payment_method;

  return (
    <>
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:p-8 ">
        <div>
          {/* SECTION PEMBAYARAN */}
          <div className="relative flex flex-col md:flex-row md:max-w-3xl gap-4 space-y-3 rounded-xl shadow-lg p-3 max-w-xs  mx-auto border border-white bg-white">
            <div>
              <div className="flex flex-col border p-3 text-md gap-3 rounded-lg w-full">
                <div>
                  <CountComponent order={order} />
                </div>
                <div>
                  <div>Invoice number</div>
                  <div className="uppercase font-bold">{order?.invoice_id}</div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>
                    <div className=" font-normal">Number Virtual Account</div>
                    <div className="font-bold">{paymentMethodDetails.va}</div>
                  </div>
                  <div className="font-bold flex flex-row gap-2 items-center">
                    <span>
                      <img
                        src={paymentMethodDetails.imgSrc}
                        alt={order.payment_method}
                        width={50}
                        height={50}
                      />
                    </span>{' '}
                  </div>
                </div>
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
                Please attach your payment proof to confirm your payment.
              </div>
              {/* isi form */}
              <FormPaymentProofComponent order={order} />
            </div>
          </div>
        </div>
        {/* room section */}
        <div className="flex flex-col ">
          <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
              <img
                src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mble/tix-hotel/images-web/2023/09/18/e666f5a1-007f-4c91-aadb-6dd5c5303259-1695021190243-e64b70f31945ae0d80667797c5f8d09e.jpg"
                alt="Property Pic"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className="flex flex-row gap-2">
                <div>
                  <IoTicketOutline />
                </div>
                <div className="">
                  <div className="font-semibold">{order.property.name}</div>
                  <div className="text-zinc-600">
                    {order?.total_room}{' '}
                    {order?.total_room === 1 ? 'room' : 'rooms'}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center gap-2">
                  <IoCalendarOutline />{' '}
                  {dayjs(order?.checkIn_date).format('DD MMMM YYYY')} -{' '}
                  {dayjs(order?.checkOut_date).format('DD MMMM YYYY')}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <IoLocationOutline /> {order?.property.address},{' '}
                  {order?.property.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
