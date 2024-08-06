'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { axiosInstance } from '@/libs/axios.config';
import { useDispatch } from 'react-redux';
import { login } from '@/libs/redux/slices/user.slice';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reverify: FC = () => {
  const router = useRouter();
  const { token } = useParams();
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login/user');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axiosInstance().get(
          `/api/users/verifyTokenUser/${token}`,
        );

        const { isVerified, message, user } = response.data;

        if (user === null) {
          router.push('/');
        } else if (isVerified === false) {
          setIsVerified(false);
          console.log('Token is valid but user is not verified:', message);
        } else if (isVerified === true) {
          toast.success(
            'Your account is already verified. Redirecting to home page...',
          );
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        router.push('/');
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axiosInstance().get(
            `/api/users/reverify/${token}`,
          );
          if (response.status === 200) {
            const { user, role } = response.data;
            dispatch(login(user));

            if (role === 'user') {
              router.push('/profile/settings?refreshed=true');
            } else if (role === 'tenant') {
              router.push('/dashboard/settings?refreshed=true');
            } else {
              console.error('Unknown user role:', role);
            }
          } else {
            console.error('Email verification failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error verifying email:', error);
        }
      }
    };

    verifyToken();
  }, [token, router, dispatch]);

  if (!token) {
    return <div>Invalid or missing token.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen flex-col">
        <Spinner animation="border" role="status" className="me-2"></Spinner>
        <div className="text-center p-4">
          <span className="visually-hidden">Loading...</span>
          <p className="mt-2 font-semibold">
            Verifying your email and you will be redirected shortly...
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Reverify;
