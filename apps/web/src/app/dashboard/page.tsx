import OrderTable from '@/components/dashboard/orderTabel';
import React from 'react';

function page() {
  return (
    <>
      <div className="flex flex-col gap-8 px-8">
        <div className="border-b" />
        <OrderTable />
      </div>
    </>
  );
}

export default page;
