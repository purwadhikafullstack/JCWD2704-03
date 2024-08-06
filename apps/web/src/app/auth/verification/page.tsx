import React, { Suspense } from 'react';
import ResendEmail from '@/components/auth/verification/ResendEmail';
import { ToastContainer } from 'react-toastify';

function VerifyPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResendEmail />;
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default VerifyPage;
