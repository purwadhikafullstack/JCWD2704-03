import React, { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import SearchForm from '@/components/property/SearchForm';

const HomeHero = () => {
  return (
    <div className="relative w-full min-h-[55vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1537823286324-7d070255022e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* White Background for Bottom Section */}
      <div
        className="absolute bottom-0 left-0 w-full bg-white z-10"
        style={{ height: '30%' }}
      />
      {/* Overlay for Search Form */}
      <div className="absolute top-5 left-0 w-full h-full flex flex-col justify-center items-center z-20 px-4">
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <Spinner animation="border" />
            </div>
          }
        >
          <SearchForm />
        </Suspense>
      </div>
    </div>
  );
};

export default HomeHero;
