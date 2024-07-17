'use client';
import React, { useRef, useEffect, useState } from 'react';
import { PiBuildingApartmentBold, PiHouseLineBold } from 'react-icons/pi';
import { RiHotelLine } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { axiosInstance } from '@/libs/axios.config';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Libraries, useLoadScript } from '@react-google-maps/api';
import { Property } from '@/models/property.model';

const libraries: Libraries = ['places'];

function UpdateProperty() {
  const router = useRouter();
  const { id } = useParams();
  const formikRef = useRef<any>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    pic: '',
    name: '',
    desc: '',
    category: initialCategory || '',
    city: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
        .min(5, 'Name must have at least 5 characters'),
      desc: Yup.string(),
      city: Yup.string().required('City is required'),
      address: Yup.string().required('Address is required'),
      category: Yup.string().required('Category is required'), // Add validation for category
      //   pic: Yup.mixed().required('Picture is required'), // Add validation for pic
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('desc', values.desc);
        formData.append('city', values.city);
        formData.append('address', values.address);
        formData.append('latitude', values.latitude?.toString() || '');
        formData.append('longitude', values.longitude?.toString() || '');
        // formData.append('category', values.category);

        if (values.pic) {
          formData.append('pic', values.pic);
        }

        if (values.category) {
          formData.append('category', values.category);
        }

        await axiosInstance().patch(`/api/properties/${id}`, formData);
        router.push('/dashboard/my-listing');
      } catch (error) {
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const { isLoaded } = useLoadScript({
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance().get(`/api/properties/${id}`);
        const property: Property = response.data.data;

        console.log('Fetched property:', property);

        const imgSrc = `http://localhost:8000/api/properties/image/${property.id}`;

        if (property.id) {
          formik.setValues({
            pic: imgSrc, // Start as null
            name: property.name,
            desc: property.desc,
            category: property.category,
            city: property.city,
            address: property.address,
            latitude: property.latitude || null,
            longitude: property.longitude || null,
          });
          setInitialCategory(property.category || '');
        }

        setImagePreview(imgSrc);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('pic', file); // Update Formik state
      const tempUrl = URL.createObjectURL(file);
      setImagePreview(tempUrl); // Update image preview
    }
  };

  useEffect(() => {
    if (initialCategory) {
      formik.setFieldValue('category', initialCategory); // Pre-fill category if available
    }
  }, [initialCategory]);

  return (
    <>
      <div className="w-screen tracking-tighter px-10">
        <div className="flex justify-center items-center">
          <div className="lg:max-w-[1000px]">
            <div className="py-4">
              <img
                src="https://i.ibb.co.com/brDL8tH/3.png"
                alt=""
                className="w-10"
              />
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
                      type="text"
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
                    {['Hotel', 'Apartment', 'Guest House'].map((cat) => (
                      <div
                        key={cat}
                        className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                          formik.values.category === cat ||
                          initialCategory === cat
                            ? 'border-2 border-zinc-600 bg-zinc-200'
                            : ''
                        }`}
                        onClick={() => {
                          formik.setFieldValue('category', cat);
                          setInitialCategory(cat); // Update initial category state
                        }}
                      >
                        <div className="text-3xl">
                          {cat === 'Hotel' && <RiHotelLine />}
                          {cat === 'Apartment' && <PiBuildingApartmentBold />}
                          {cat === 'Guest House' && <PiHouseLineBold />}
                        </div>
                        <div className="font-semibold">{cat}</div>
                      </div>
                    ))}
                  </div>
                  {formik.errors.category && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.category}
                    </div>
                  )}
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
                      placeholder="Address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                    />
                    <label htmlFor="floatingInput">Address</label>
                  </div>
                  {formik.errors.address && (
                    <div className="text-red-600 text-xs mb-3">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col ">
                  <div className="font-semibold text-xl mb-2">Description</div>
                  <div className="form-floating w-full">
                    <textarea
                      className="form-control"
                      id="floatingInput"
                      name="desc"
                      placeholder="Description"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.desc}
                    />
                    <label htmlFor="floatingInput">
                      Describe your property
                    </label>
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

                  {imagePreview && (
                    <div className="pb-2">
                      <img
                        src={imagePreview}
                        alt="Property picture"
                        className="rounded-xl w-full"
                        onClick={() => imageRef.current?.click()}
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      ref={imageRef}
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {formik.errors.pic && (
                      <div className="text-red-600 text-xs">
                        {formik.errors.pic}
                      </div>
                    )}
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="mb-5">
                  <button
                    type="submit"
                    className="btn btn-dark w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      'Update my listing'
                    )}
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

export default UpdateProperty;
