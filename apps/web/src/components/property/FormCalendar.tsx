'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiCalendar } from 'react-icons/bi';
import { Libraries, useLoadScript } from '@react-google-maps/api';
import Spinner from 'react-bootstrap/Spinner';
import { axiosInstance } from '@/libs/axios.config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const libraries: Libraries = ['places'];

const FormCalendar: React.FC = () => {
  const router = useRouter();
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<FormikProps<any>>(null);
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

  const [checkInDate, setCheckInDate] = useState(getTodayDate());
  const [checkOutDate, setCheckOutDate] = useState(getTomorrowDate());

  const initialValues = {
    city: '',
    checkIn: getTodayDate(),
    checkOut: getTomorrowDate(),
  };

  const validationSchema = Yup.object({
    city: Yup.string().required('City is required'),
    checkIn: Yup.string().required('Check-in date is required'),
    checkOut: Yup.string()
      .required('Check-out date is required')
      .test(
        'check-out-date',
        'Check-out date cannot be before check-in date',
        function (value) {
          const { checkIn } = this.parent;
          return new Date(value!) >= new Date(checkIn);
        },
      ),
  });

  const handleSearchSubmit = async (values: any) => {
    try {
      const response = await axiosInstance().get(`/api/properties/search`, {
        params: {
          city: values.city,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          page: 1,
        },
      });

      const properties = response.data;
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
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'id' }, // Restrict to Indonesia
        },
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          const cityComponent = place.address_components.find((component) =>
            component.types.includes('locality'),
          );
          if (cityComponent) {
            formikRef.current?.setFieldValue('city', cityComponent.long_name);
          }
        }
      });
    }
  }, [isLoaded]);

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { name, value } = e.target;
    if (name === 'checkIn') {
      setFieldValue(name, value);
      setCheckInDate(value);
      // Update the checkOut date to be the day after tomorrow
      const newCheckOutDate = new Date(value);
      newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
      setCheckOutDate(newCheckOutDate.toISOString().split('T')[0]);
      formikRef.current?.setFieldValue(
        'checkOut',
        newCheckOutDate.toISOString().split('T')[0],
      );
    } else if (name === 'checkOut') {
      const checkIn = formikRef.current?.values.checkIn;
      if (new Date(value) < new Date(checkIn)) {
        toast.error('Check-out date cannot be before check-in date');
        setFieldValue(name, checkIn); // Reset to check-in date
      } else {
        setFieldValue(name, value);
      }
    }
  };

  if (!isLoaded) return <Spinner animation="border" />;

  if (loadError) return <div>Error loading Google Maps</div>;

  return (
    <>
      <ToastContainer />
      <div className="">
        <div className="inset-0 flex items-center justify-center font-medium tracking-tight">
          <div className="flex justify-center">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await handleSearchSubmit(values);
                  router.push(
                    `/search?city=${values.city}&checkIn=${values.checkIn}&checkOut=${values.checkOut}&page=1`,
                  );
                } catch (error) {
                  console.error('Submission error:', error);
                } finally {
                  setSubmitting(false); // Ensure isSubmitting is reset after handling
                }
              }}
              innerRef={formikRef}
            >
              {({ isSubmitting, handleChange, setFieldValue }) => (
                <Form className="rounded-full text-zinc-800 bg-zinc-100 py-2 px-10 border shadow-sm">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="font-bold text-sm px-2">
                      Find properties in
                    </div>

                    <div>
                      <div className="relative">
                        <Field
                          type="text"
                          name="city"
                          innerRef={autocompleteInputRef}
                          className="bg-zinc-100 border-none text-gray-900 text-sm rounded-full focus:ring-zinc-100 focus:border-zinc-100 focus:shadow-lg focus:bg-white block w-48 ps-10 px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40"
                          placeholder="Search destination"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="font-medium text-sm px-2 text-zinc-500">
                      on
                    </div>
                    <div>
                      <div className="relative">
                        <Field
                          type="date"
                          name="checkIn"
                          className="bg-zinc-100 border-none text-gray-900 text-sm rounded-full focus:ring-zinc-100 focus:border-zinc-100 focus:shadow-lg focus:bg-white block py-3 w-30"
                          placeholder="Select date start"
                          defaultValue={getTodayDate()}
                          min={getTodayDate()}
                          onChange={(e: any) =>
                            handleDateChange(e, setFieldValue)
                          }
                        />
                      </div>
                    </div>

                    <div className="font-medium text-sm px-2 text-zinc-500">
                      to
                    </div>

                    <div>
                      <div className="relative">
                        <Field
                          type="date"
                          name="checkOut"
                          className="bg-zinc-100 border-none text-gray-900 text-sm rounded-full focus:ring-zinc-100 focus:border-zinc-100 focus:shadow-lg focus:bg-white block py-3 w-30"
                          placeholder="Select date end"
                          min={checkInDate}
                          onChange={(e: any) =>
                            handleDateChange(e, setFieldValue)
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-black p-3 hover:shadow-md rounded-full hover:bg-zinc-200 text-center flex"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner animation="border" role="status" size="sm">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        <FaSearch className="text-white" />
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

export default FormCalendar;
