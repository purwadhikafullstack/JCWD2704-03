import SignupHostForm from '@/components/auth/signup/SignupHostForm';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function page() {
  return (
    <>
      <ToastContainer />
      <SignupHostForm />
    </>
  );
}

export default page;
