'use client';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import React from 'react';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { axiosInstance } from '@/libs/axios.config';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { PiForkKnife } from 'react-icons/pi';
import { LiaSmokingSolid } from 'react-icons/lia';
import { LuBedDouble, LuBedSingle } from 'react-icons/lu';
import { AiOutlineCalendar } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCalendarOutline } from 'react-icons/io5';

interface FormValues {
  pic: File | null;
  type: string;
  guest: number;
  price: number;
  peak_price?: number;
  start_date_peak?: Date | null;
  end_date_peak?: Date | null;
  isBreakfast: boolean;
  isRefunable: boolean;
  isSmoking: boolean;
  bed: string;
  desc: string;
  numberOfRooms: number;
}

function CreateRoom() {
  const router = useRouter();
  const { id } = useParams();
  const imageRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<any>(null);

  const formatNumberWithCommas = (number: any) => {
    if (!number) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const removeCommas = (number: any) => {
    if (!number) return '';
    return number.toString().replace(/,/g, '');
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { name, value } = e.target;
    const rawValue = removeCommas(value);
    const noLeadingZeroValue = rawValue.replace(/^0+/, ''); // Remove leading zeros
    const formattedValue = formatNumberWithCommas(noLeadingZeroValue);

    setFieldValue(name, noLeadingZeroValue); // Store the raw value in the state
    e.target.value = formattedValue; // Display the formatted value
  };

  const initialValues: FormValues = {
    pic: null,
    type: '',
    guest: 2,
    price: formatNumberWithCommas('200000'),
    peak_price: undefined,
    start_date_peak: null,
    end_date_peak: null,
    isBreakfast: false,
    isRefunable: false,
    isSmoking: false,
    bed: '',
    desc: '',
    numberOfRooms: 1,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      pic: Yup.mixed().required('Picture is required'),
      type: Yup.string().required('Room type is required'),
      guest: Yup.number().required('Guest number is required'),
      price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
      peak_price: Yup.number().positive('Peak price must be positive'),
      start_date_peak: Yup.date().nullable(),
      end_date_peak: Yup.date().nullable(),
      bed: Yup.string().required('Bed type is required'),
      desc: Yup.string().required('Description is required'),
      numberOfRooms: Yup.number()
        .typeError('Number of rooms must be a number')
        .required('Number of rooms is required')
        .positive('Must be greater than 0')
        .integer('Must be an integer'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('pic', values.pic as File);
        formData.append('type', values.type);
        formData.append('guest', values.guest.toString());
        formData.append('price', removeCommas(values.price.toString()));
        if (values.peak_price !== undefined)
          formData.append('peak_price', values.peak_price.toString());
        if (values.start_date_peak)
          formData.append(
            'start_date_peak',
            new Date(values.start_date_peak).toISOString(),
          );
        if (values.end_date_peak)
          formData.append(
            'end_date_peak',
            new Date(values.end_date_peak).toISOString(),
          );
        formData.append('isBreakfast', values.isBreakfast.toString());
        formData.append('isRefunable', values.isRefunable.toString());
        formData.append('isSmoking', values.isSmoking.toString());
        formData.append('bed', values.bed);
        formData.append('desc', values.desc);
        formData.append('numberOfRooms', values.numberOfRooms.toString());

        await axiosInstance().post(`/api/rooms/create/${id}`, formData);

        console.log(formData);

        Swal.fire({
          title: 'Room Created',
          text: 'Your room has been created successfully!',
          icon: 'success',
        }).then(() => {
          router.push(`/dashboard/my-property/${id}`);
        });
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          Swal.fire({
            title: 'Error',
            text: error.response?.data.message || 'Something went wrong',
            icon: 'error',
          });
        }
      }
    },
  });

  const incrementGuest = () => {
    if (formik.values.guest < 4) {
      formik.setFieldValue('guest', formik.values.guest + 1);
    }
  };

  const decrementGuest = () => {
    if (formik.values.guest > 1) {
      formik.setFieldValue('guest', formik.values.guest - 1);
    }
  };

  const handleDateChange = (
    date: Date | null,
    field: keyof FormValues,
    event?: React.SyntheticEvent,
  ) => {
    formik.setFieldValue(field, date);
  };

  return (
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

          {/* FORM */}
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
              <div className="flex flex-col">
                <div className="font-semibold text-2xl mb-2">
                  Create a room category
                </div>

                {/* TYPE */}
                <div className="form w-full mb-3 flex flex-col">
                  <div className="dropdown-dark">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {formik.values.type || 'Select Room Type'}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() =>
                            formik.setFieldValue('type', 'Standard')
                          }
                        >
                          Standard
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => formik.setFieldValue('type', 'Deluxe')}
                        >
                          Deluxe
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {formik.errors.type && (
                  <div className="text-red-600 text-xs">
                    {formik.errors.type}
                  </div>
                )}
              </div>

              {/* NUMBER OF ROOMS */}
              <div className="flex flex-col">
                <div className="font-semibold text-xl">
                  How many rooms are there?
                </div>
                <div className="text-zinc-500 mb-2">
                  You can always add more rooms or reduce the number of rooms
                  later
                </div>
                <input
                  id="numberOfRooms"
                  name="numberOfRooms"
                  type="string"
                  className={`form-control ${formik.touched.numberOfRooms && formik.errors.numberOfRooms ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.numberOfRooms}
                />
                {formik.touched.numberOfRooms && formik.errors.numberOfRooms ? (
                  <div className="invalid-feedback">
                    {formik.errors.numberOfRooms}
                  </div>
                ) : null}
              </div>

              {/* GUEST */}
              <div className="form-group flex-col">
                <div className="font-semibold text-xl">Guests</div>
                <div className="text-zinc-500 mb-2">Maximum guests allowed</div>
                <div className="flex flex-row gap-3 items-center">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={decrementGuest}
                    disabled={formik.values.guest <= 1}
                  >
                    -
                  </button>

                  <div id="guest">{formik.values.guest}</div>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={incrementGuest}
                    disabled={formik.values.guest >= 3}
                  >
                    +
                  </button>
                </div>

                {formik.touched.guest && formik.errors.guest ? (
                  <div className="invalid-feedback">{formik.errors.guest}</div>
                ) : null}
              </div>

              {/* PICTURE */}
              <div className="flex flex-col">
                <div className="font-semibold text-xl">
                  How does the room look?
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
                    className="rounded-xl w-full md:h-80 h-40 object-cover"
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

              <hr />

              {/* AMENITIES */}
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-2xl">
                  Tell guests what this room has to offer
                </div>
                <div className="text-zinc-500 mb-4 text-xl">
                  You can write more on description box
                </div>

                {/* BED */}
                <div className="mb-4">
                  <div className="font-semibold text-lg">
                    What bed does this room have?
                  </div>

                  <div className="flex flex-row gap-2 text-sm">
                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.bed === 'king'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() => formik.setFieldValue('bed', 'king')}
                    >
                      <div className="text-3xl">
                        <LuBedDouble />
                      </div>
                      <div className="font-semibold">King Bed</div>
                    </div>

                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.bed === 'twin'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() => formik.setFieldValue('bed', 'twin')}
                    >
                      <div className="text-3xl">
                        <LuBedSingle />
                      </div>
                      <div className="font-semibold">Twin Bed</div>
                    </div>

                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.bed === 'single'
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() => formik.setFieldValue('bed', 'single')}
                    >
                      <div className="text-3xl">
                        {' '}
                        <LuBedSingle />
                      </div>
                      <div className="font-semibold">Single Bed</div>
                    </div>
                  </div>
                  {formik.errors.bed && (
                    <div className="text-red-600 text-xs">
                      {formik.errors.bed}
                    </div>
                  )}
                </div>

                {/* BREAKFAST & SMOKING */}
                <div>
                  <div className="font-semibold text-lg">More amenities?</div>

                  <div className="flex flex-row gap-2 text-sm">
                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.isBreakfast
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() =>
                        formik.setFieldValue(
                          'isBreakfast',
                          !formik.values.isBreakfast,
                        )
                      }
                    >
                      <div className="text-3xl">
                        <PiForkKnife />
                      </div>
                      <div className="font-semibold">Breakfast included</div>
                    </div>

                    <div
                      className={`rounded-xl h-18 border cursor-pointer border-zinc-400 p-2 flex justify-center flex-col w-28 hover:border-zinc-600 hover:bg-zinc-200 hover:border-2 ${
                        formik.values.isSmoking
                          ? 'border-2 border-zinc-600 bg-zinc-200'
                          : ''
                      }`}
                      onClick={() =>
                        formik.setFieldValue(
                          'isSmoking',
                          !formik.values.isSmoking,
                        )
                      }
                    >
                      <div className="text-3xl">
                        <LiaSmokingSolid />
                      </div>
                      <div className="font-semibold">Smoking allowed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col">
                <div className="font-semibold text-lg">Room description</div>
                <div className="text-zinc-500 mb-2">
                  Share what makes this room special
                </div>
                <div className="w-full">
                  <textarea
                    className="form-control mb-2"
                    id="exampleFormControlTextarea1"
                    name="desc"
                    placeholder="Enjoy the glamour of this stylish, upscale place"
                    rows={3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.desc}
                  />
                </div>
              </div>

              <hr />

              {/* PRICINGS */}

              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-semibold text-2xl">Finish up!</div>
                  <div className="text-zinc-500 mb-4 text-lg">
                    Choose booking settings, set up pricing, and publish your
                    listing
                  </div>
                </div>

                {/* NORMAL PRICE */}
                <div className="flex flex-col">
                  <div className="font-semibold text-lg">
                    Now, set your price per night
                  </div>
                  <div className="text-zinc-500 mb-2">
                    You can change it anytime
                  </div>

                  <div className="flex flex-row items-center gap-3">
                    <div className="font-semibold text-lg">IDR</div>
                    <input
                      id="price"
                      name="price"
                      type="string"
                      className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                      onChange={(e) =>
                        handlePriceChange(e, formik.setFieldValue)
                      }
                      onBlur={formik.handleBlur}
                      value={formatNumberWithCommas(formik.values.price)}
                    />
                  </div>

                  {formik.touched.price && formik.errors.price ? (
                    <div className="invalid-feedback">
                      {formik.errors.price}
                    </div>
                  ) : null}
                </div>

                {/* REFUNDABLE */}
                <div className="">
                  <div className="font-semibold text-lg mb-2">
                    Is this booking refundable if cancelled?
                  </div>

                  <div className="flex flex-row gap-2 text-sm ">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isRefunable"
                        id="isRefunableYes"
                        value="true"
                        checked={formik.values.isRefunable === true}
                        onChange={() =>
                          formik.setFieldValue('isRefunable', true)
                        }
                        onBlur={formik.handleBlur}
                      />
                      <label
                        className="form-check-label font-semibold"
                        htmlFor="isRefunableYes"
                      >
                        Yes
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isRefunable"
                        id="isRefunableNo"
                        value="false"
                        checked={formik.values.isRefunable === false}
                        onChange={() =>
                          formik.setFieldValue('isRefunable', false)
                        }
                        onBlur={formik.handleBlur}
                      />
                      <label
                        className="form-check-label font-semibold"
                        htmlFor="isRefunableNo"
                      >
                        No
                      </label>
                    </div>
                  </div>

                  {formik.touched.isRefunable && formik.errors.isRefunable ? (
                    <div className="text-red-600 text-xs">
                      {formik.errors.isRefunable}
                    </div>
                  ) : null}
                </div>
              </div>

              <hr />

              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-semibold text-2xl">
                    Set your room pricing for peak season
                  </div>
                  <div className="text-zinc-500 mb-4 text-lg">
                    This section is optional, but you can set special rates for
                    holidays and other peak times!
                  </div>

                  <div className="flex flex-col">
                    <div className="font-semibold text-lg">
                      Price per night during peak season
                    </div>
                    <div className="text-zinc-500 mb-2">
                      You can change it anytime
                    </div>

                    <div className="flex flex-row items-center gap-3">
                      <div className="font-semibold text-lg">IDR</div>
                      <input
                        id="peak_price"
                        name="peak_price"
                        type="string"
                        className={`form-control ${formik.touched.peak_price && formik.errors.peak_price ? 'is-invalid' : ''}`}
                        onChange={(e) =>
                          handlePriceChange(e, formik.setFieldValue)
                        }
                        onBlur={formik.handleBlur}
                        value={formatNumberWithCommas(formik.values.peak_price)}
                      />
                    </div>

                    {formik.touched.peak_price && formik.errors.peak_price ? (
                      <div className="invalid-feedback">
                        {formik.errors.peak_price}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* PEAK SEASON DATE */}
              <div className="flex flex-col">
                <div>
                  <div className="font-semibold text-lg">
                    When is the peak season?
                  </div>
                  <div className="text-zinc-500 mb-2">
                    Select the start and end dates for when the peak season
                    pricing will be applied
                  </div>

                  <div id="date-range-picker" className="flex items-center">
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-5">
                        <IoCalendarOutline />
                      </div>
                      <DatePicker
                        id="datepicker-range-start"
                        name="start_date_peak"
                        selected={formik.values.start_date_peak}
                        onChange={(date, event) =>
                          handleDateChange(date, 'start_date_peak', event)
                        }
                        minDate={new Date()}
                        onBlur={formik.handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholderText="Select start date"
                      />
                    </div>
                    <span className="mx-4 text-gray-500">to</span>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-5">
                        <IoCalendarOutline />
                      </div>
                      <DatePicker
                        id="datepicker-range-end"
                        name="end_date_peak"
                        selected={formik.values.end_date_peak}
                        onChange={(date) =>
                          handleDateChange(date, 'end_date_peak')
                        }
                        minDate={formik.values.start_date_peak || new Date()}
                        onBlur={formik.handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholderText="Select end date"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <button type="submit" className="btn btn-primary">
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
