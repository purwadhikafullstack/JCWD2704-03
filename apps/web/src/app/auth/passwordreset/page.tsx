import React from 'react';
import PasswordResetForm from '@/components/auth/passwordreset/PasswordReset';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PasswordResetPage() {
  return (
    <>
      <PasswordResetForm />
      <ToastContainer />
    </>
  );
}
