'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
function FormPaymentProofComponent({ order }: { order: Order }) {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const [message, setMessage] = useState('');
  console.log('iddddd', order.id);
  console.log('test', order.payment_method);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a file to upload',
      });
      return;
    }
    const formData = new FormData();
    formData.append('payment_proof', file);
    try {
      const response = await axiosInstance().patch(
        `/api/reservations/${order.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setMessage(response.data.message);
      router.push('/success');
    } catch (error) {
      setMessage('Failed to upload payment proof. Please try again.');
    }
  };

  const statusExpired = order.status === 'cancelled';
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 md:flex-row">
        <div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            disabled={dayjs(order.createdAt).add(5, 'minute').diff(dayjs()) < 0}
            onChange={handleFileChange}
          />
        </div>

        <div>
          <button
            className="btn btn-dark"
            disabled={
              dayjs(order.createdAt).add(5, 'minute').diff(dayjs()) < 0 &&
              statusExpired
            }
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormPaymentProofComponent;
