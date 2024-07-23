'use client';

import { axiosInstance } from '@/libs/axios.config';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeftLong } from 'react-icons/fa6';

const PasswordResetForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await axiosInstance().post(
          '/api/users/sendChangePassword',
          {
            email: values.email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        formik.resetForm();
        toast.success('Email has been sent. Please check your inbox.');
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        {/* HEADER SECTION */}
        <div className="mb-3 flex items-center justify-center flex-col">
          <Link href="/">
            <img
              src="https://i.ibb.co.com/QPvYKBk/1.png"
              alt=""
              className="w-24 "
            />
          </Link>
          <h2 className="font-bold">Forgot password?</h2>
          <div className="text-zinc-400">
            No worries, we'll send you reset instructions!
          </div>
        </div>
        {/* FORM SUBMIT EMAIL */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-60 lg:w-[500px]"
        >
          <div className="form-floating w-full">
            <input
              type="email"
              className="form-control mb-3"
              id="floatingInput"
              placeholder="name@example.com"
              {...formik.getFieldProps('email')}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-700 text-xs mb-3">
              {formik.errors.email}
            </div>
          ) : null}

          <button
            className="btn bsb-btn-xl btn-dark w-full my-3"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="me-2"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              'Reset password'
            )}
          </button>
        </form>

        {/* <button className="my-2 flex justify-center items-center gap-2 text-zinc-500 hover:text-[#263C94] hover:font-semibold">
          <div>
            <FaArrowLeftLong />
          </div>
          <Link
            href="/auth/login/user"
            className="no-underline  text-zinc-500 hover:text-[#263C94] hover:font-semibold"
          >
            <div> Back to sign in</div>
          </Link>
        </button> */}
      </div>
    </>
  );
};

export default PasswordResetForm;
