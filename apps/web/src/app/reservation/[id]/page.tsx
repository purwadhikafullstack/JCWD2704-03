import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import Reservation from '@/components/reservation/reservation';
import React from 'react';

function page() {
  return (
    <>
      <Header />
      <Reservation />
      <Footer />
    </>
  );
}
export default page;
