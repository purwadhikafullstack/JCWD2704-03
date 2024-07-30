'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/libs/redux/store';
import { axiosInstance } from '@/libs/axios.config';
import { Header } from '../Header';
import Footer from '../Footer';
import { imageSrc } from '@/utils/imagerender';

export type SearchParams = {
  city: string;
  checkIn?: string;
  checkOut?: string;
};

async function fetchResults(searchParams: SearchParams) {
  const { city, checkIn, checkOut } = searchParams;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

  // Construct the URL using template literals
  const url = `${baseUrl}properties/${name}?checkIn=${checkIn}&checkOut=${checkOut}`;

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
  const { checkIn: reduxCheckIn, checkOut: reduxCheckOut } = useSelector(
    (state: RootState) => state.checkInOut,
  );

  const checkIn = searchParams.checkIn || reduxCheckIn;
  const checkOut = searchParams.checkOut || reduxCheckOut;

  useEffect(() => {
    const fetchResultsAndSetState = async () => {
      const finalSearchParams = {
        city: searchParams.city,
        checkIn,
        checkOut,
      };
      const fetchedResults = await fetchResults(finalSearchParams);
      setResults(fetchedResults || {});
    };

    fetchResultsAndSetState();
  }, [searchParams, checkIn, checkOut]);

  if (!searchParams.city || !checkIn || !checkOut) {
    return 'not found';
  }

  return (
    <>
      <Header />
      <section>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <h1 className="text-4xl font-bold pb-3">Search Results</h1>

          <h2 className="pb-3">
            Date:
            <span className="italic ml-2">
              {checkIn} to {checkOut}
            </span>
          </h2>

          <hr className="mb-5" />

          <div className="space-y-2 mt-5">
            {results.properties?.map((property: any, index: number) => (
              <div
                key={index}
                className="flex space-y-2 justify-between space-x-4 p-5 border rounded-lg"
              >
                <img
                  src={`${imageSrc}${property.id}` || '/placeholder.jpg'}
                  alt="Property Image"
                  className="h-44 w-44 rounded-lg"
                />

                <div className="flex flex-1 space-x-5 justify-between">
                  <div>
                    <Link
                      href={`/property/${property.name.replace(/\s+/g, '-').toLowerCase()}?checkIn=${checkIn}&checkOut=${checkOut}`}
                      className="font-bold text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {property.name}
                    </Link>
                    <p className="text-xs">{property.desc}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="flex items-start justify-end space-x-2 text-right">
                      <div>
                        <p className="font-bold">
                          Category: {property.category}
                        </p>
                        <p className="text-xs">Address: {property.address}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs">
                        Created At: {property.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchPage;
