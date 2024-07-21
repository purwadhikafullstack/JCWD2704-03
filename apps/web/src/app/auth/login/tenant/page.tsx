import LoginForm from '@/components/auth/signin/LoginHostForm';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function page() {
  return (
    <>
      <ToastContainer />
      <LoginForm />
    </>
  );
}

export default page;
