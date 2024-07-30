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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import Swal from 'sweetalert2';
import { imageSrc, imageSrcRoom } from '@/utils/imagerender';

const libraries: Libraries = ['places'];
type City = {
  name: string;
  lat: number;
  lng: number;
};
function UpdateProperty() {
  const router = useRouter();
  const { id } = useParams();
  const formikRef = useRef<any>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [navigate, setNavigate] = useState(false);

  const [cityLatLng, setCityLatLng] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      category: Yup.string().required('Category is required'),
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

        if (values.pic) {
          formData.append('pic', values.pic);
        }

        if (values.category) {
          formData.append('category', values.category);
        }

        await axiosInstance().patch(`/api/properties/${id}`, formData);

        // setNavigate(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data.message || 'An error occurred',
          });
        }
      } finally {
        setLoading(false);
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
        router.push(`/dashboard/my-property/${id}`);
      }
    });
  };

  const handleUpdate = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update your property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        formik.handleSubmit();
        router.push('/dashboard/my-property');
      }
    });
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (isLoaded && cityInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        cityInputRef.current,
        { types: ['(cities)'], componentRestrictions: { country: 'ID' } },
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const city = place.formatted_address || '';
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          setCityLatLng({ latitude, longitude });
          formik.setFieldValue('city', city);
          formik.setFieldValue('latitude', latitude);
          formik.setFieldValue('longitude', longitude);
        }
      });
    }

    if (isLoaded && addressInputRef.current && cityLatLng) {
      const { latitude, longitude } = cityLatLng;
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(latitude - 0.1, longitude - 0.1),
        new window.google.maps.LatLng(latitude + 0.1, longitude + 0.1),
      );
      const addressAutocompleteService =
        new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          bounds,
          componentRestrictions: { country: 'ID' },
          strictBounds: true,
        });

      addressAutocompleteService.addListener('place_changed', () => {
        const place = addressAutocompleteService.getPlace();
        if (place.geometry && place.geometry.location) {
          formik.setFieldValue('address', place.formatted_address || '');
          formik.setFieldValue('latitude', place.geometry.location.lat());
          formik.setFieldValue('longitude', place.geometry.location.lng());
        }
      });
    }
  }, [isLoaded, cityLatLng]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance().get(
          `/api/properties/myDetail/${id}`,
        );
        const property: Property = response.data.data;

        console.log('Fetched property:', property);

        const imgSrc = `${imageSrc}${property.pic_name}`;

        if (property.id) {
          formik.setValues({
            pic: imgSrc,
            name: property.name,
            desc: property.desc,
            category: property.category,
            city: property.city,
            address: property.address,
            latitude: property.latitude || null,
            longitude: property.longitude || null,
          });
          setInitialCategory(property.category || '');
          setCityLatLng({
            latitude: property.latitude || 0,
            longitude: property.longitude || 0,
          });
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
      formik.setFieldValue('pic', file);
      const tempUrl = URL.createObjectURL(file);
      setImagePreview(tempUrl);
    }
  };

  useEffect(() => {
    if (initialCategory) {
      formik.setFieldValue('category', initialCategory);
    }
  }, [initialCategory]);

  return (
    <>
      <div className="tracking-tighter lg:px-10">
        <div className="flex justify-center items-center">
          <div className="w-full">
            <div className="py-4">
              <img
                src="https://i.ibb.co.com/brDL8tH/3.png"
                alt=""
                className="w-10"
              />
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
                    Update my property
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
                    {['Hotel', 'Apartment', 'Guesthouse'].map((cat) => (
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
                          {cat === 'Guesthouse' && <PiHouseLineBold />}
                        </div>
                        <div className="font-semibold">{cat}</div>
                      </div>
                    ))}
                  </div>
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
                      placeholder="Overall appeal and features of your property: the location, environment, view, amenities, ..."
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

                  {imagePreview && (
                    <div className="pb-2">
                      <img
                        src={imagePreview}
                        alt="Property picture"
                        className="rounded-xl w-full h-80 object-cover"
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
                    onClick={handleUpdate}
                  >
                    {formik.isSubmitting ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Update'
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
