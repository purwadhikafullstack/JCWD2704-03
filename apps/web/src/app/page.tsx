import React from 'react';
import { AppProps } from 'next/app';
import './globals.css';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import SearchForm from '@/components/property/SearchForm';
import { Suspense } from 'react';
import HomeHero from '@/components/property/HomeHero';

const HomePage = () => {
  return (
    <div>
      <Header />
      <HomeHero />
      <Suspense fallback={<div>Loading search form...</div>}>
        <SearchForm />
      </Suspense>
      <Footer />
    </div>
  );
};

export default HomePage;
