import React from 'react';
import SearchPage from '@/components/property/SearchResult';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

const Search: React.FC = () => {
  return (
    <>
      <Header />
      <SearchPage />
      <Footer />
    </>
  );
};

export default Search;
