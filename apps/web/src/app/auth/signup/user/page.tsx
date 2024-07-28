import React from 'react';
import SignupUserForm from '@/components/auth/signup/SignupUserForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function page() {
  return (
    <>
      <SignupUserForm />
      <ToastContainer />
    </>
  );
}
export default page;
