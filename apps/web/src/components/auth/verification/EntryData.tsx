'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios.config';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { AxiosError } from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { decode as jwtDecode } from 'jsonwebtoken';

interface DecodedToken {
  id: string;
}

const EntryData = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const verifyToken = async () => {
      if (token && !isVerified) {
        try {
          await axiosInstance().get(`/api/users/verification/${token}`);
          setIsVerified(true);
        } catch (error) {
          console.error('Error verifying email:', error);
        }
      }
    };

    verifyToken();
  }, [token, isVerified]);

  useEffect(() => {
    if (isVerified) {
      toast.success('Email verified successfully!');
    }
  }, [isVerified]);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login/user');
    }
  }, [token, router]);

  YupPassword(Yup);

  const initialValues = {
    first_name: '',
    last_name: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      first_name: Yup.string()
        .required('First name is required')
        .min(3, 'First name must have at least 3 characters'),
      last_name: Yup.string()
        .required('Last name is required')
        .min(3, 'Last name must have at least 3 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must have at least 6 characters')
        .minNumbers(1, 'Password must contain at least 1 number')
        .minUppercase(
          1,
          'Password must contain at least 1 letter in uppercase',
        ),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log('Entry data starts');

        const response = await axiosInstance().patch(
          '/api/users/v3',
          {
            token: Array.isArray(token) ? token[0] : token,
            first_name: values.first_name,
            last_name: values.last_name,
            password: values.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Response:', response.data); // Log the response

        const { updatedUser } = response.data; // Extract the updated user data
        const { role } = updatedUser; // Extract the role from the updated user data
        if (role) {
          if (role === 'user') {
            router.push(`/auth/login/user`);
          } else if (role === 'tenant') {
            router.push(`/auth/login/tenant`);
          }
        } else {
          throw new Error('Invalid role');
        }
      } catch (error) {
        console.log(error);

        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message ||
              'An error occurred while signing up.',
          );
        } else {
          toast.error('An unexpected error occurred.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="my-6 flex items-center justify-center flex-col">
            <Link href="/">
              <img
                src="https://i.ibb.co.com/QPvYKBk/1.png"
                alt=""
                className="w-24 "
              />
            </Link>
            <h2 className="font-bold text-center leading-snug">
              Last step to complete your registration
            </h2>
            <div className="text-zinc-400 text-center">
              Please input your name and make a password
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-60 lg:w-[500px]"
          >
            <div className="form-floating w-full">
              <input
                type="text"
                className="form-control mb-3"
                id="floatingFirstName"
                placeholder="First name"
                {...formik.getFieldProps('first_name')}
              />
              <label htmlFor="floatingFirstName">First Name</label>
            </div>
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="text-red-700 text-xs mb-3">
                {formik.errors.first_name}
              </div>
            ) : null}

            <div className="form-floating w-full">
              <input
                type="text"
                className="form-control mb-3"
                id="floatingLastName"
                placeholder="Last name"
                {...formik.getFieldProps('last_name')}
              />
              <label htmlFor="floatingLastName">Last Name</label>
            </div>
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className="text-red-700 text-xs mb-3">
                {formik.errors.last_name}
              </div>
            ) : null}

            <div className="form-floating w-full">
              <input
                type="password"
                className="form-control mb-3"
                id="floatingPassword"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-700 text-xs mb-3">
                {formik.errors.password}
              </div>
            ) : null}

            <button
              className="btn bsb-btn-xl btn-dark w-full my-3"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Submitting...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EntryData;
