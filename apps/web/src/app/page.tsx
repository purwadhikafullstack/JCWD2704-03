import React from 'react';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import HomeHero from '@/components/property/HomeHero';
import HomePromo from '@/components/property/HomePromo';
import HomePopularDestination from '@/components/property/HomePopularDestination';
import HomeFeaturedProperties from '@/components/property/HomeFeaturedProperties';

const HomePage = () => {
  return (
    <div className="mx-auto">
      <Header />
      <div className="mb-5">
        <HomeHero />
        <HomePromo />
        <HomePopularDestination />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
