import OrderTable from '@/components/dashboard/orderTabel';
import React from 'react';

function page() {
  return (
    <>
      <div className="flex flex-col w-full overflow-x-hidden">
        <OrderTable />
      </div>
    </>
  );
}

export default page;
