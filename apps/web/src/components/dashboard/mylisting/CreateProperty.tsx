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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import Swal from 'sweetalert2';

const libraries: Libraries = ['places'];

type City = {
  name: string;
  lat: number;
  lng: number;
};

interface FormValues {
  pic: File | null;
  name: string;
  desc: string;
  category: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

function CreateProperty() {
  const router = useRouter();
  const formikRef = useRef<any>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [addressAutocomplete, setAddressAutocomplete] = useState<any>(null);

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

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: Yup.object().shape({
      pic: Yup.mixed().required('Picture is required'),
      name: Yup.string()
        .required('Name is required')
        .min(5, 'Name must have at least 5 characters'),
      desc: Yup.string(),
      city: Yup.string().required('City is required'),
      address: Yup.string().required('Address is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values) => {
      try {
        await handleUpdate(values);
      } catch (error) {
        setLoading(false);
        let errorMessage = 'An unexpected error occurred';

        if (error instanceof AxiosError) {
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      }
    },
  });

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to discard your changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discard it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        formik.resetForm();
        router.push('/dashboard/my-property');
      }
    });
  };

  const handleUpdate = async (values: FormValues) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to post this property to your listing?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, post it!',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (!values.latitude || !values.longitude) {
            if (selectedCity) {
              values.latitude = selectedCity.lat;
              values.longitude = selectedCity.lng;
            }
          }

          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('desc', values.desc);
          formData.append('city', values.city);
          formData.append('address', values.address);
          formData.append('latitude', values.latitude?.toString() || '');
          formData.append('longitude', values.longitude?.toString() || '');
          formData.append('category', values.category);

          if (values.pic) {
            formData.append('pic', values.pic);
          }

          await axiosInstance().post('/api/properties', formData);

          router.push('/dashboard/my-property');
        } catch (error) {
          console.error('Error during submission:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while creating the property.',
          });
        }
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const selectedFile = e.currentTarget.files[0];

      // Check file size
      if (selectedFile.size > 1048576) {
        // 1MB = 1048576 bytes
        toast.error('File size exceeds 1MB. Please select a smaller file.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      formik.setFieldValue('pic', selectedFile);
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (isLoaded && cityInputRef.current) {
      const cityAutocomplete = new window.google.maps.places.Autocomplete(
        cityInputRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'ID' },
        },
      );

      cityAutocomplete.addListener('place_changed', () => {
        const place = cityAutocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const cityName = place.formatted_address || '';
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          formik.setFieldValue('city', cityName);
          setSelectedCity({ name: cityName, lat: latitude, lng: longitude });

          // Initialize address autocomplete with city bounds
          if (addressInputRef.current) {
            const bounds = new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(latitude - 0.1, longitude - 0.1),
              new window.google.maps.LatLng(latitude + 0.1, longitude + 0.1),
            );
            const addressAutocompleteService =
              new window.google.maps.places.Autocomplete(
                addressInputRef.current,
                {
                  types: ['address'],
                  bounds,
                  componentRestrictions: { country: 'ID' },
                  strictBounds: true,
                },
              );
            setAddressAutocomplete(addressAutocompleteService);

            addressAutocompleteService.addListener('place_changed', () => {
              const place = addressAutocompleteService.getPlace();
              if (place.geometry && place.geometry.location) {
                formik.setFieldValue('address', place.formatted_address || '');
                formik.setFieldValue('latitude', place.geometry.location.lat());
                formik.setFieldValue(
                  'longitude',
                  place.geometry.location.lng(),
                );
              }
            });
          }
        }
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (selectedCity && addressAutocomplete && addressInputRef.current) {
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(
          selectedCity.lat - 0.1,
          selectedCity.lng - 0.1,
        ),
        new window.google.maps.LatLng(
          selectedCity.lat + 0.1,
          selectedCity.lng + 0.1,
        ),
      );
      addressAutocomplete.setBounds(bounds);
      addressAutocomplete.setComponentRestrictions({ country: 'ID' });
      addressAutocomplete.setOptions({ strictBounds: true });
    }
  }, [selectedCity, addressAutocomplete]);

  return (
    <>
      <ToastContainer />
      <div className="tracking-tighter lg:px-10">
        <div className="flex justify-center items-center">
          <div className="w-full">
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

            <form
              onSubmit={formik.handleSubmit}
              className="w-full"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
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
                        formik.values.category === 'Guesthouse'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() =>
                        formik.setFieldValue('category', 'Guesthouse')
                      }
                    >
                      <div className="text-3xl">
                        <PiHouseLineBold />
                      </div>
                      <div className="font-semibold">Guest House</div>
                    </div>
                  </div>
                  {formik.errors.category && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.category}
                    </div>
                  )}
                </div>

                {/* CITY */}
                <div className="flex flex-col">
                  <div className="font-semibold text-xl">
                    Where is your property located?
                  </div>
                  <div className="text-zinc-500 mb-2">
                    More about the area of your property
                  </div>

                  <div className="form-floating w-full">
                    <input
                      type="text"
                      name="city"
                      className="form-control mb-2"
                      id="floatingCityInput"
                      placeholder="City"
                      ref={cityInputRef}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setSelectedCity(null); // Clear selected city when city input changes
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                    />
                    <label htmlFor="floatingCityInput">City</label>
                  </div>
                  {formik.errors.city && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.city}
                    </div>
                  )}
                </div>

                {/* ADDRESS */}
                <div className="flex flex-col">
                  <div className="font-semibold text-xl">
                    Where exactly in the city?
                  </div>
                  <div className="text-zinc-500 mb-2">
                    Address details within the city
                  </div>
                  <div className="form-floating w-full mt-2">
                    <input
                      type="text"
                      name="address"
                      className="form-control mb-2"
                      id="floatingAddressInput"
                      placeholder="Address"
                      ref={addressInputRef}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                    />
                    <label htmlFor="floatingAddressInput">
                      Address details
                    </label>
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
                      placeholder="Overall appeal and features of yourr property: the location, environment, view, amenities, ..."
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
                          : 'https://i.ibb.co.com/xh2fRNL/New-Project-3.png'
                      }
                      alt=""
                      className="rounded-xl w-full h-80 object-cover"
                      onClick={() => imageRef.current?.click()}
                    />
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={imageRef}
                      hidden
                      accept="image/*"
                      // className="w-full h-10"
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
                <div className="flex flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-danger w-28"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark w-28"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Create'
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

export default CreateProperty;
