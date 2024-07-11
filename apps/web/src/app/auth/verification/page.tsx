import React, { Suspense } from 'react';
import ResendEmail from '@/components/auth/verification/ResendEmail';

function VerifyPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResendEmail />;
      </Suspense>
    </>
  );
}

export default VerifyPage;
