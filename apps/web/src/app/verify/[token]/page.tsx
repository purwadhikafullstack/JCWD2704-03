import EntryData from '@/components/auth/verification/EntryData';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function page() {
  return (
    <div>
      <EntryData />
      <ToastContainer />
    </div>
  );
}

export default page;
