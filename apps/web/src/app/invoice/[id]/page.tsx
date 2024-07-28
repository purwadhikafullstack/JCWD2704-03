import Invoice from '@/components/invoice/invoice';
import React from 'react';

interface PageProps {
  params: {
    id: string;
  };
}
function page({ params: { id } }: PageProps) {
  return (
    <>
      <Invoice id={id} />
    </>
  );
}
export default page;
