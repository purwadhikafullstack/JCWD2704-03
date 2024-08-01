'use client';
import React, { useRef, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { BiCalendar } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch } from 'react-icons/fa';
import { Libraries, useLoadScript } from '@react-google-maps/api';
import Spinner from 'react-bootstrap/Spinner';
import { axiosInstance } from '@/libs/axios.config';

const libraries: Libraries = ['places'];

const SearchForm: React.FC = () => {
  const router = useRouter();
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<any>(null);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialValues = {
    city: '',
    checkIn: getTodayDate(),
    checkOut: getTomorrowDate(),
  };

  const validationSchema = Yup.object({
    city: Yup.string().required('City is required'),
    checkIn: Yup.string().required('Check-in date is required'),
    checkOut: Yup.string().required('Check-out date is required'),
  });

  const handleSearchSubmit = async (values: any) => {
    try {
      const response = await axiosInstance().get(`/api/properties/search`, {
        params: {
          city: values.city,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          page: 1, // Initial page
          limit: 10, // Default limit
        },
      });

      const properties = response.data;
      console.log('Properties:', properties);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && autocompleteInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ['(cities)'], componentRestrictions: { country: 'ID' } },
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components && formikRef.current) {
          formikRef.current.setValues({
            ...formikRef.current.values,
            city: place.formatted_address,
          });
        }
      });
    }
  }, [isLoaded]);

  if (!isLoaded) return <Spinner animation="border" />;

  if (loadError) return <div>Error loading Google Maps</div>;

  return (
    <>
      <div className="relative w-screen">
        <img
          src="https://i.ibb.co.com/5rcMxmc/Untitled-design-4.png"
          alt=""
          className="object-cover w-full h-[400px]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex justify-center">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                router.push(
                  `/search?city=${values.city}&checkIn=${values.checkIn}&checkOut=${values.checkOut}&page=1`,
                );
              }}
              innerRef={formikRef}
            >
              {({ isSubmitting, handleChange }) => (
                <Form className="shadow-xl border-zinc-800 rounded-xl m-4 p-4 text-zinc-800 lg:w-[800px] w-96 bg-white">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="font-semibold tracking-tighter">
                        Where to?
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-2.5 pointer-events-none">
                          <FaSearch className="text-sm" />
                        </div>
                        <Field
                          type="text"
                          name="city"
                          innerRef={autocompleteInputRef}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Search destination"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold tracking-tighter">
                        Check-in date
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <BiCalendar className="w-4 h-4" />
                        </div>
                        <Field
                          type="date"
                          name="checkIn"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2.5 "
                          placeholder="Select date start"
                          defaultValue={getTodayDate()}
                          min={getTodayDate()}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold tracking-tighter">
                        Check-out date
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <BiCalendar className="w-4 h-4" />
                        </div>
                        <Field
                          type="date"
                          name="checkOut"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2.5 "
                          placeholder="Select date end"
                          min={getTomorrowDate()}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-full justify-center items-center text-center flex mt-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner
                          animation="border"
                          role="status"
                          size="sm"
                          className="me-2"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        'Search now'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchForm;
