import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { axiosInstance } from '@/libs/axios.config';
import { AxiosError } from 'axios';

function CreateRoom() {
  const router = useRouter();
  const initialValues = {
    pic: null,
    type: '',
    price: 0,
    peak_price: 0,
    start_date_peak: null,
    end_date_peak: null,
    isBreakfast: false,
    isRefunable: false,
    isSmoking: false,
    bed: '',
    desc: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      pic: Yup.mixed().required('Picture is required'),
      price: Yup.number().required('Price is required'),
      peak_price: Yup.number(),
      start_date_peak: Yup.date(),
      end_date_peak: Yup.date(),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Form values:', values);
        const formData = new FormData();
        formData.append('type', values.type);
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      }
    },
  });
  return <></>;
}

export default CreateRoom;
