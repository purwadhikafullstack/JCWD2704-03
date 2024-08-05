'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function FormPaymentProofComponent({ order }: { order: Order }) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const router = useRouter();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 1048576) {
        // 1MB = 1048576 bytes
        toast.error('File size exceeds 1MB. Please select a smaller file.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };
  const [message, setMessage] = useState('');

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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, upload it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          router.push('/success');
        } catch (error) {
          setMessage('Failed to upload payment proof. Please try again.');
          Swal.fire({
            title: 'Failed!',
            text: 'Failed to upload payment proof. Please try again.',
            icon: 'error',
          });
        }
      }
    });
  };

  const statusExpired =
    order.status === 'cancelled' ||
    order.status === 'success' ||
    order.status === 'awaiting_confirmation';
  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full max-w-xs mt-4 p-4 border border-gray-300 rounded-lg">
        {filePreview ? (
          <img src={filePreview} alt="File Preview" className="w-full" />
        ) : (
          <p className="text-center text-gray-500">
            Image preview will be shown here
          </p>
        )}
      </div>
      <ToastContainer />
      <div className="flex flex-col gap-4 md:flex-row">
        <div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            disabled={statusExpired}
            onChange={handleFileChange}
          />
        </div>

        <div>
          <button className="btn btn-dark" disabled={statusExpired}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormPaymentProofComponent;
