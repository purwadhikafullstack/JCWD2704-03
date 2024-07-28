import React from 'react';
import SearchPage from '@/components/property/SearchResult';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

type SearchParams = {
  city: string;
  checkIn: string;
  checkOut: string;
};

interface Props {
  searchParams: SearchParams;
}

const Search: React.FC<Props> = ({ searchParams }) => {
  if (!searchParams.city || !searchParams.checkIn || !searchParams.checkOut) {
    return <div>No results</div>;
  }

  return (
    <>
      <SearchPage searchParams={searchParams} />
    </>
  );
};

export default Search;
