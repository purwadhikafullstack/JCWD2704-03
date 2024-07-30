'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/libs/axios.config';
import { useParams, useSearchParams } from 'next/navigation';
import { imageSrc, imageSrcUser } from '@/utils/imagerender';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/libs/redux/store';

function UserShowProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const { checkIn: reduxCheckIn, checkOut: reduxCheckOut } = useSelector(
    (state: RootState) => state.checkInOut,
  );

  // Get checkIn and checkOut from searchParams
  const checkIn = searchParams.get('checkIn') || reduxCheckIn;
  const checkOut = searchParams.get('checkOut') || reduxCheckOut;

  // Function to generate the property link
  const generatePropertyLink = (propertyName: string) => {
    return `/property/${propertyName.replace(/\s+/g, '-').toLowerCase()}?checkIn=${checkIn}&checkOut=${checkOut}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance().get(`/api/users/pr/${id}`);
        console.log(response.data);

        setUser(response.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProperties = async () => {
      try {
        const response = await axiosInstance().get(
          `/api/properties/prop/${id}`,
        );
        console.log(response.data);

        setProperties(response.data.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserProfile();
    fetchUserProperties();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <>
      <div className="lg:p-20 p-10">
        <div className="flex lg:flex-row lg:justify-between flex-col tracking-tighter gap-4 lg:gap-10">
          {/* CARD PROFILE */}
          <div className="rounded-2xl shadow-lg p-4 flex flex-row lg:w-1/3 lg:h-80">
            <div className="flex flex-row w-full justify-between items-center px-10 lg:h-72">
              {/* IMAGE & NAME*/}
              <div className="flex flex-col items-center gap-3">
                <div>
                  {user.image_name ? (
                    <img
                      src={`${imageSrcUser}${user.image_name}`}
                      alt=""
                      className="w-28 h-28 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-28 h-28 object-cover rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        className="w-full h-full"
                      >
                        <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <div className="lg:text-xl text-lg  font-semibold flex items-center gap-2">
                    {user.first_name} {user.last_name}
                    {user.isVerified && (
                      <span className="text-[#ED777B]">
                        <RiVerifiedBadgeFill />
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold">
                    {user.role === 'tenant' ? 'Host' : 'Guest'}
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="flex flex-col gap-3">
                {user.role === 'tenant' && (
                  <div className="flex flex-col gap-3">
                    {/* REVIEWS */}
                    <div className="flex flex-col justify-end items-end">
                      <div className="text-lg font-bold">200</div>
                      <div className="text-xs font-medium">Reviews</div>
                    </div>

                    {/* RATING */}
                    <div className="flex flex-col justify-end items-end">
                      <div className="flex items-center text-lg font-bold gap-1">
                        4.5{' '}
                        <span className="text-xs">
                          <FaStar />
                        </span>
                      </div>
                      <div className="text-xs font-medium">Avg Rating</div>
                    </div>

                    {/* LISTING */}
                    <div className="flex flex-col justify-end items-end">
                      <div className="text-lg font-bold">200</div>
                      <div className="text-xs font-medium">Properties</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr />

          <div className="lg:w-2/3 flex flex-col gap-3">
            {/* TENANT'S REVIEWS */}
            <div>
              <div className="text-lg font-medium">
                {user.first_name} {user.last_name} {"'s Reviews"}
              </div>
              <div>map review</div>
            </div>

            <hr />

            {/* TENANT'S LISTING */}
            <div>
              <div className="text-lg font-medium">
                {user.first_name} {user.last_name} {"'s Listings"}
              </div>

              <div className="overflow-x-auto py-4">
                <div className="flex flex-nowrap gap-4">
                  {properties.map((property) => (
                    <Link
                      style={{ textDecoration: 'none' }}
                      href={generatePropertyLink(property.name)}
                      key={property.id}
                      passHref
                      className="text-black"
                    >
                      <div className="flex-none w-60 h-72 p-2 rounded-lg border border-gray-300 hover:shadow-lg cursor-pointer">
                        <img
                          src={`${imageSrc}${property.pic_name}`}
                          alt={property.name}
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <div className="flex flex-row justify-between items-center">
                          <div className="font-medium text-md mb-1 truncate">
                            {property.name}
                          </div>
                          <div className="flex gap-1 text-sm mb-1 items-center truncate">
                            <span>
                              <FaStar />
                            </span>{' '}
                            4.0
                          </div>
                        </div>
                        <div className="text-sm ">{property.category}</div>
                        <div className="text-sm text-gray-500">
                          {property.city}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserShowProfile;
