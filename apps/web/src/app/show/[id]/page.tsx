import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import UserShowProfile from '@/components/profile/show/UserShowProfile';
import React from 'react';

function page() {
  return (
    <div>
      <Header />
      <UserShowProfile />
      <Footer />
    </div>
  );
}

export default page;
