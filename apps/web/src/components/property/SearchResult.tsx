'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router'; // Import useRouter
import Link from 'next/link'; // Import Link
import { RootState } from '@/libs/redux/store';
import { axiosInstance } from '@/libs/axios.config';
import { Header } from '../Header';
import Footer from '../Footer';
import { imageSrc } from '@/utils/imagerender';
import { FaStar } from 'react-icons/fa';
import FormCalendar from './FormCalendar';
import { IoSadOutline } from 'react-icons/io5';
import { FaHouse } from 'react-icons/fa6';
import dayjs from 'dayjs';
import { RoomCategory } from '@/models/roomCategory.model';

export type SearchParams = {
  city: string;
  checkIn?: string;
  checkOut?: string;
  page?: number;
};

async function fetchResults(searchParams: SearchParams) {
  const { city, checkIn, checkOut, page = 1 } = searchParams;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/';

  const url = `${baseUrl}/api/properties/search?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}&page=${page}`;

  try {
    const response = await axiosInstance().get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
}

function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const [results, setResults] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [loading, setLoading] = useState(true);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  const { checkIn: reduxCheckIn, checkOut: reduxCheckOut } = useSelector(
    (state: RootState) => state.checkInOut,
  );

  const checkIn = searchParams.checkIn || reduxCheckIn;
  const checkOut = searchParams.checkOut || reduxCheckOut;

  useEffect(() => {
    const fetchResultsAndSetState = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      const finalSearchParams = {
        city: searchParams.city,
        checkIn,
        checkOut,
        page: currentPage,
      };
      const fetchedResults = await fetchResults(finalSearchParams);
      console.log('Fetched results:', fetchedResults); //
      setResults(fetchedResults || {});

      setLoading(false);
    };

    fetchResultsAndSetState();
  }, [searchParams, checkIn, checkOut, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (!searchParams.city || !checkIn || !checkOut) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Header />
      <section className="flex flex-col min-h-screen">
        <div className="mx-auto max-w-7xl lg:px-4 tracking-tight flex-1">
          <div className="hidden lg:flex py-5">
            <FormCalendar />
          </div>

          {loading ? (
            <div className="py-4 font-medium flex justify-center items-center">
              <div className="text-xl">{''}</div>
            </div>
          ) : (
            <div>
              {results.properties && results.properties.length > 0 ? (
                <div className="pb-4 pt-4 lg:pt-0 px-3 font-medium">
                  {results.properties.length} properties available to rent
                </div>
              ) : results.properties === undefined ||
                results.properties.length === 0 ? (
                <div className="py-4 font-medium">
                  <div className="flex flex-col gap-4 justify-center items-center text-center">
                    <div className="text-6xl">
                      <IoSadOutline />
                    </div>
                    <div className="text-xl text-zinc-400">
                      No properties available
                    </div>
                    <div>Try searching for other destination or date!</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap lg:gap-8 gap-4 justify-center lg:justify-start">
            {results?.properties?.map((property: any) => (
              <Link
                key={property.id}
                href={`/property/${property.name.replace(/\s+/g, '-').toLowerCase()}?checkIn=${checkIn}&checkOut=${checkOut}`}
                className="text-black no-underline"
              >
                <div className="flex lg:flex-col gap-2.5 rounded-lg hover:shadow-lg cursor-pointer p-3 shadow-md w-90">
                  <img
                    src={`${imageSrc}${property.pic_name}`}
                    alt={property.name}
                    className="lg:w-80 lg:h-60 w-28 h-28 object-cover rounded-md lg:mb-2"
                  />

                  <div className="lg:w-full flex flex-col justify-center gap-1">
                    {/* NAME AND RATING */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="lg:font-medium font-bold text-sm lg:text-lg truncate lg:w-52 w-40">
                        {property.name}
                      </div>

                      {/* <div className="flex gap-1 items-center text-sm lg:text-lg truncate">
                        <FaStar /> 4.0
                        <span>(50)</span>
                      </div> */}
                    </div>

                    <div className="lg:text-md text-sm flex gap-1 items-center">
                      {/* <div className="bg-black rounded-full p-1">
                        <FaHouse className="text-white text-xs" />
                      </div> */}
                      <div>{property.category}</div>
                    </div>

                    <div className="lg:text-md text-sm truncate lg:w-80 w-40">
                      {property.desc}
                    </div>
                    <div className="lg:text-md text-sm text-gray-500 truncate">
                      {property.city}
                    </div>

                    <div className="text-sm lg:mt-2">
                      <span className="font-semibold">
                        {property.lowestPrice
                          ? new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(property.lowestPrice)
                          : 'Harga tidak tersedia'}{' '}
                      </span>
                      night
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Pagination
          totalPages={results.totalPages || 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </section>
      <Footer />
    </>
  );
}

const Pagination = ({ totalPages, currentPage, onPageChange }: any) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mb-10">
      {pages.map((page) => (
        <button
          key={page}
          disabled={page === currentPage}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-2 rounded-full ${page === currentPage ? 'bg-black text-white' : 'bg-zinc-500 text-white'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPage;
