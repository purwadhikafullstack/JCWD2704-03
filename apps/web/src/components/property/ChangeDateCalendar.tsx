'use client';
import React, { useRef, useState } from 'react';
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeDateCalendar: React.FC = () => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<any>>(null);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [checkInDate, setCheckInDate] = useState(getTodayDate());

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialValues = {
    checkIn: getTodayDate(),
    checkOut: getTomorrowDate(),
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

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { name, value } = e.target;
    if (name === 'checkIn') {
      setFieldValue(name, value);
      setCheckInDate(value);
      formikRef.current?.setFieldValue(
        'checkOut',
        value > formikRef.current.values.checkOut
          ? value
          : formikRef.current.values.checkOut,
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

    // Update URL parameters dynamically
    const updatedUrl = new URL(window.location.href);
    updatedUrl.searchParams.set(
      'checkIn',
      formikRef.current?.values.checkIn || '',
    );
    updatedUrl.searchParams.set(
      'checkOut',
      formikRef.current?.values.checkOut || '',
    );
    window.history.replaceState({}, '', updatedUrl.toString());
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Optionally perform a search or other operations here
      console.log('Search with:', values);
      // Refresh the page with updated URL
      window.location.href = window.location.href; // Reload the page with the new URL
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
                <Form className="rounded-full text-zinc-800 bg-zinc-100 py-2 px-10 border shadow-sm">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="font-medium text-sm px-2 text-zinc-500">
                      Check-in
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
                      Check-out
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

export default ChangeDateCalendar;
