import React from 'react';
import SearchPage from '@/components/property/SearchResult';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

type SearchParams = {
  city: string;
  checkIn: string;
  checkOut: string;
  page?: number;
  limit?: number;
};

interface Props {
  searchParams: SearchParams;
}

const Search: React.FC<Props> = ({ searchParams }) => {
  const defaultParams = {
    page: 1,
    limit: 10,
  };
  const combinedParams = { ...defaultParams, ...searchParams };

  if (
    !combinedParams.city ||
    !combinedParams.checkIn ||
    !combinedParams.checkOut
  ) {
    return <div>No results</div>;
  }

  return (
    <>
      <SearchPage searchParams={combinedParams} />
    </>
  );
};

export default Search;
