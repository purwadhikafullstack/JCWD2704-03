'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeDateCalendar: React.FC = () => {
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

  const getInitialDate = (param: string, defaultValue: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || defaultValue;
  };

  const getDayAfter = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialValues = {
    checkIn: getInitialDate('checkIn', getTodayDate()),
    checkOut: getInitialDate('checkOut', getTomorrowDate()),
  };

  const validationSchema = Yup.object({
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

  const [checkInDate, setCheckInDate] = useState(initialValues.checkIn);
  const [checkOutDate, setCheckOutDate] = useState(initialValues.checkOut);

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { name, value } = e.target;
    if (name === 'checkIn') {
      setFieldValue(name, value);
      setCheckInDate(value);
      const newCheckOutDate = new Date(value);
      newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
      const formattedCheckOutDate = newCheckOutDate.toISOString().split('T')[0];
      setFieldValue('checkOut', formattedCheckOutDate);
      setCheckOutDate(formattedCheckOutDate);
    } else if (name === 'checkOut') {
      const checkIn = formikRef.current?.values.checkIn;
      if (new Date(value) < new Date(checkIn)) {
        toast.error('Check-out date cannot be before check-in date');
        setFieldValue(name, checkIn); // Reset to check-in date
      } else {
        setFieldValue(name, value);
        setCheckOutDate(value);
      }
    }
  };

  useEffect(() => {
    if (formikRef.current) {
      const { checkIn, checkOut } = formikRef.current.values;
      const updatedUrl = new URL(window.location.href);
      updatedUrl.searchParams.set('checkIn', checkIn);
      updatedUrl.searchParams.set('checkOut', checkOut);
      window.history.replaceState({}, '', updatedUrl.toString());
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkInFromUrl = urlParams.get('checkIn') || getTodayDate();
    const checkOutFromUrl = urlParams.get('checkOut') || getTomorrowDate();

    setCheckInDate(checkInFromUrl);
    setCheckOutDate(checkOutFromUrl);
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      window.location.href = window.location.href;
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="">
        <div className="inset-0 flex items-center justify-center font-medium tracking-tight">
          <div className="flex justify-center">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              innerRef={formikRef}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="rounded-xl text-zinc-800 bg-white py-4 px-4 w-80 border shadow-sm">
                  <div className="flex flex-col gap-2 items-center">
                    <div className="font-semibold text-sm px-2 text-black">
                      Check-in date
                    </div>
                    <div>
                      <div className="relative">
                        <Field
                          type="date"
                          name="checkIn"
                          className=" border-none text-gray-900 text-sm rounded-lg focus:ring-zinc-100 focus:border-zinc-100 focus:shadow-lg focus:bg-white block  py-2 w-full border-zinc-200 border"
                          placeholder="Select date start"
                          defaultValue={initialValues.checkIn}
                          min={getTodayDate()}
                          onChange={(e: any) =>
                            handleDateChange(e, setFieldValue)
                          }
                        />
                      </div>
                    </div>
                    <div className="font-semibold text-sm px-2 text-black">
                      Check-out date
                    </div>
                    <div>
                      <div className="relative">
                        <Field
                          type="date"
                          name="checkOut"
                          className="border-none text-gray-900 text-sm rounded-lg focus:ring-zinc-100 focus:border-zinc-100 focus:shadow-lg focus:bg-white block py-2 w-full border-zinc-200 border"
                          placeholder="Select date end"
                          value={checkOutDate}
                          min={
                            new Date(new Date(checkInDate).getTime() + 86400000)
                              .toISOString()
                              .split('T')[0]
                          }
                          onChange={(e: any) =>
                            handleDateChange(e, setFieldValue)
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-black p-3 hover:shadow-md rounded-xl w-full hover:bg-zinc-200 text-center flex items-center justify-center mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner animation="border" role="status" size="sm">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        <div className="text-white text-sm px-2 font-semibold ">
                          Change dates
                        </div>
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

export default ChangeDateCalendar;
