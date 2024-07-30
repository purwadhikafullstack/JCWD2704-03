'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export function CountComponent({ order }: { order: Order }) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState<string | null>(null);

  const calculateExpiration = () => {
    if (!order) return '';
    const creationDate = dayjs(order.createdAt);
    const expirationDate = creationDate.add(60, 'minute');
    return expirationDate.format('h:mm A [on] DD MMMM YYYY');
  };

  const expirationTime = order ? calculateExpiration() : '';

  // COUNTDOWN SECTION
  useEffect(() => {
    if (order) {
      const createdAt = dayjs(order.createdAt);
      const expirationTime = createdAt.add(60, 'minute');
      const interval = setInterval(() => {
        const now = dayjs();
        const remainingTime = expirationTime.diff(now);
        if (remainingTime <= 0) {
          clearInterval(interval);
          setCountdown('Expired');
          setMessage(
            'Your order has been cancelled. You have exceeded the payment deadline.',
          );
        } else {
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setMinutes(minutes);
          setSeconds(seconds);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order]);
  return (
    <>
      {dayjs(order.createdAt).add(60, 'minute').diff(dayjs()) > 0 ? (
        <>
          <div>
            Complete your payment before{' '}
            <span className="font-semibold">{expirationTime}</span>
          </div>
          <div className="flex flex-row justify-center pt-2">
            <div className="flex flex-col border px-4 py-2 rounded-xl gap-1">
              <div className="countdown font-bold text-2xl flex flex-row gap-2 text-[#666699]">
                <span
                  style={{ '--value': minutes } as React.CSSProperties}
                ></span>
                :{' '}
                <span
                  style={{ '--value': seconds } as React.CSSProperties}
                ></span>
              </div>
              <div className="flex flex-row justify-center gap-4 text-xs">
                <div className="">menit</div>
                <div className="">detik</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify center items-center">
          <div className="py-4">
            <img
              src="https://www.loket.com/assets-v2/img/spot-hero-wrong-pin-attempts.svg"
              alt=""
            />
          </div>
          <span className="text-lg font-bold">
            Your order has been cancelled.
          </span>
          <div>You have exceeded the payment deadline.</div>
        </div>
      )}
    </>
  );
}
