'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PiBuildingApartmentBold, PiHouseLineBold } from 'react-icons/pi';
import { RiHotelLine } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { axiosInstance } from '@/libs/axios.config';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Libraries, useLoadScript } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

function CreateProperty() {
  const router = useRouter();
  const formikRef = useRef<any>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    pic: null,
    name: '',
    desc: '',
    category: '',
    city: '',
    address: '',
    latitude: null,
    longitude: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      pic: Yup.mixed().required('Picture is required'),
      name: Yup.string()
        .required('Name is required')
        .min(5, 'Name must have at least 5 characters'),
      desc: Yup.string(),
      city: Yup.string().required('City is required'),
      address: Yup.string().required('Address is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Form values:', values);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('desc', values.desc);
        formData.append('city', values.city);
        formData.append('address', values.address);
        formData.append('latitude', values.latitude || '');
        formData.append('longitude', values.longitude || '');
        formData.append('category', values.category);

        if (values.pic) {
          formData.append('pic', values.pic);
        }
        console.log('Try creating listing:', formData);

        await axiosInstance().post('/api/properties', formData);
        router.push('/dashboard/my-listing');
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      }
    },
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
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
        if (place.geometry && place.geometry.location) {
          const city = place.formatted_address || '';
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          formik.setFieldValue('city', city);
          formik.setFieldValue('latitude', latitude);
          formik.setFieldValue('longitude', longitude);
        }
      });
    }
  }, [isLoaded]);

  return (
    <>
      <div className="w-screen tracking-tighter px-10">
        <div className="flex justify-center items-center">
          <div className="lg:max-w-[1000px]">
            {/* HEADER */}
            <div>
              <div className="py-4">
                <img
                  src="https://i.ibb.co.com/brDL8tH/3.png"
                  alt=""
                  className="w-10"
                />
              </div>
              <div></div>
            </div>

            <form onSubmit={formik.handleSubmit} className="lg:max-w-[1000px]">
              <div className="flex justify-center flex-col gap-6">
                {/* NAME */}
                <div className="flex flex-col">
                  <div className="font-semibold text-2xl mb-2">
                    Create a new listing
                  </div>
                  <div className="form-floating w-full">
                    <input
                      type="name"
                      name="name"
                      className="form-control mb-2"
                      id="floatingInput"
                      placeholder="Name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    <label htmlFor="floatingInput">Property name</label>
                  </div>
                  {formik.errors.name && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.name}
                    </div>
                  )}
                </div>

                {/* CATEGORY */}
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-xl">
                    Which of these best describes your place?
                  </div>

                  <div className="flex flex-row gap-2 text-sm">
                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.category === 'Hotel'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() => formik.setFieldValue('category', 'Hotel')}
                    >
                      <div className="text-3xl">
                        <RiHotelLine />
                      </div>
                      <div className="font-semibold">Hotel</div>
                    </div>

                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.category === 'Apartment'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() =>
                        formik.setFieldValue('category', 'Apartment')
                      }
                    >
                      <div className="text-3xl">
                        <PiBuildingApartmentBold />
                      </div>
                      <div className="font-semibold">Apartment</div>
                    </div>

                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.category === 'Guest House'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() =>
                        formik.setFieldValue('category', 'Guest House')
                      }
                    >
                      <div className="text-3xl">
                        <PiHouseLineBold />
                      </div>
                      <div className="font-semibold">Guest House</div>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex flex-col">
                  <div className="font-semibold text-xl">Location details</div>
                  <div className="text-zinc-500 mb-2">
                    Please detailed address of your property
                  </div>
                  <div className="form-floating w-full">
                    <input
                      type="text"
                      name="city"
                      className="form-control mb-2"
                      id="floatingInput"
                      placeholder="City"
                      ref={autocompleteInputRef}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                    />
                    <label htmlFor="floatingInput">City</label>
                  </div>
                  {formik.errors.city && (
                    <div className="text-red-600 text-xs mb-3">
                      {formik.errors.city}
                    </div>
                  )}

                  <div className="form-floating w-full">
                    <input
                      type="text"
                      className="form-control mb-2"
                      id="floatingInput"
                      name="address"
                      placeholder="address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                    />
                    <label htmlFor="floatingInput">Address details</label>
                  </div>
                  {formik.errors.address && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col">
                  <div className="font-semibold text-xl">
                    Tell guests what your place has to offer
                  </div>
                  <div className="text-zinc-500 mb-2">
                    More about amenities your place offers
                  </div>
                  <div className="w-full">
                    <textarea
                      className="form-control mb-2"
                      id="exampleFormControlTextarea1"
                      name="desc"
                      placeholder="Bedrooms, breakfast included, ..."
                      rows={3}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.desc}
                    />
                  </div>
                </div>

                {/* PICTURE */}
                <div className="flex flex-col">
                  <div className="font-semibold text-xl">
                    Add a photo of your property
                  </div>
                  <div className="text-zinc-500 mb-2">
                    You can make changes later
                  </div>

                  <div className="pb-2">
                    <img
                      src={
                        formik.values.pic
                          ? URL.createObjectURL(formik.values.pic)
                          : 'https://assets.loket.com/images/banner-event.jpg'
                      }
                      alt=""
                      className="rounded-xl w-full"
                      onClick={() => imageRef.current?.click()}
                    />
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={imageRef}
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.currentTarget.files) {
                          formik.setFieldValue('pic', e.currentTarget.files[0]);
                        }
                      }}
                    />

                    {formik.errors.pic && (
                      <div className="text-red-600 text-xs">
                        {formik.errors.pic}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row gap-2 justify-center mb-5">
                  <button
                    type="submit"
                    className="btn btn-dark text-white w-32"
                  >
                    Post my listing
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProperty;
