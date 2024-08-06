'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const PendingContent: React.FC = () => {
  const router = useRouter();

  const handleMyOrder = () => {
    router.push('/profile/my-order');
  };

  return (
    <div className="  w-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div>
          <img
            src="https://i.ibb.co.com/QPvYKBk/1.png"
            alt="verification"
            className="w-[500px]"
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="font-bold text-xl md:text-4xl text-center text-[#ED777B]">
            Have you made your payment?
          </div>
          <div className="text-zinc-600 text-xl font-bold">
            See your booking invoice here!
          </div>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
            onClick={handleMyOrder}
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingContent;
