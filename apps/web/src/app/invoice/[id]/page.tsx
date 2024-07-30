import Invoice from '@/components/invoice/invoice';
import React from 'react';

interface PageProps {
  params: {
    id: string;
  };
}
function page() {
  return (
    <>
      <Invoice />
    </>
  );
}
export default page;
