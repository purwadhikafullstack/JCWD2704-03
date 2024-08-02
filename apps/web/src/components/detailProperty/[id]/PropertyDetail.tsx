'use client';
import React from 'react';
import { Property } from '@/models/property.model';
import { RoomCategory } from '@/models/roomCategory.model';
import { imageSrc, imageSrcRoom, imageSrcUser } from '@/utils/imagerender';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MapComponent from '@/components/map/ComponentMap';
import { axiosInstance } from '@/libs/axios.config';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import dayjs from 'dayjs';
import Link from 'next/link';
import { IoBedOutline, IoPersonOutline, IoPersonSharp } from 'react-icons/io5';
import { PiForkKnife } from 'react-icons/pi';
import { TbSmoking } from 'react-icons/tb';
import { MdOutlinePayment } from 'react-icons/md';
import ChangeDateCalendar from '@/components/property/ChangeDateCalendar';
import { Review } from '@/models/review.modal';
import { FaStar } from 'react-icons/fa6';
import { Spinner } from 'react-bootstrap';

interface RoomPriceProps {
  roomCategory: RoomCategory;
  checkIn: string;
  checkOut: string;
}

function PropertyDetail() {
  const { name } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({});
  const [selectedRoomIds, setSelectedRoomIds] = useState<{
    [key: string]: string[];
  }>({});
  const [tenant, setTenant] = useState<{
    first_name: string;
    last_name: string;
    image_name: string;
    createdAt: string;
    id: string;
  } | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const toggleDescription = () => {
    setShowFullDesc(!showFullDesc);
  };

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!name || !checkIn || !checkOut) return;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/';

      const url = `${baseUrl}api/properties/detail/${name}?checkIn=${checkIn}&checkOut=${checkOut}`;

      console.log(`Fetching property details from: ${url}`);

      try {
        const response = await axiosInstance().get(
          `api/properties/detail/${name}?checkIn=${checkIn}&checkOut=${checkOut}`,
        );
        const propertyData = response.data.data;

        console.log('Property data received:', propertyData);

        setProperty(propertyData);
        setTenant(propertyData.tenant);

        const categories: RoomCategory[] = propertyData.RoomCategory || [];
        console.log('Room categories:', categories);
        setRoomCategories(categories);
        // Initialize room counts and selected room IDs
        const initialRoomCounts: { [key: string]: number } = {};
        const initialSelectedRoomIds: { [key: string]: string[] } = {};
        categories.forEach((category) => {
          initialRoomCounts[category.id] = 0;
          initialSelectedRoomIds[category.id] = [];
        });
        setRoomCounts(initialRoomCounts);
        setSelectedRoomIds(initialSelectedRoomIds);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [name, checkIn, checkOut]);

  const handleReserve = (
    roomCategoryId: string,
    totalPrice: number,
    roomIds: string[],
  ) => {
    const roomIdsParam = roomIds.join('-');
    router.push(
      `/reservation/${roomCategoryId}?checkIn=${checkIn}&checkOut=${checkOut}&total=${totalPrice}&Ids=${roomIdsParam}`,
    );
  };

  const handleIncrement = (roomCategory: RoomCategory) => {
    const categoryId = roomCategory.id;
    if (
      roomCategory.remainingRooms &&
      roomCounts[categoryId] < roomCategory.remainingRooms
    ) {
      const newRoomIds = roomCategory.Room.slice(
        0,
        roomCounts[categoryId] + 1,
      ).map((room) => room.id);
      setSelectedRoomIds({
        ...selectedRoomIds,
        [categoryId]: newRoomIds,
      });
      setRoomCounts({
        ...roomCounts,
        [categoryId]: roomCounts[categoryId] + 1,
      });
      console.log(
        `Incremented room count for category ${categoryId}:`,
        roomCounts[categoryId] + 1,
      );
      console.log('New selected room IDs:', newRoomIds);
    }
  };

  const handleDecrement = (roomCategory: RoomCategory) => {
    const categoryId = roomCategory.id;
    if (roomCounts[categoryId] > 1) {
      const newRoomIds = selectedRoomIds[categoryId].slice(
        0,
        roomCounts[categoryId] - 1,
      );
      setSelectedRoomIds({
        ...selectedRoomIds,
        [categoryId]: newRoomIds,
      });
      setRoomCounts({
        ...roomCounts,
        [categoryId]: roomCounts[categoryId] - 1,
      });
      console.log(
        `Decremented room count for category ${categoryId}:`,
        roomCounts[categoryId] - 1,
      );
      console.log('New selected room IDs:', newRoomIds);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_API_URL || `http://localhost:8000`;
      const url = `${baseUrl}api/reviews/getReviewByPropertyId/${property?.id}`;
      console.log(`Fetching property reviews from: ${url}`);

      try {
        const response = await axiosInstance().get(url);

        const data: Review[] = response.data.data;
        console.log('Logging response data:', data);

        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, [property?.id]);
  const isPeakPeriod = (start: string, end: string): boolean => {
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return today >= startDate && today <= endDate;
  };
  const getCurrentPrice = (roomCategory: RoomCategory) => {
    const today = new Date();
    const startDatePeak = roomCategory.start_date_peak
      ? new Date(roomCategory.start_date_peak)
      : null;
    const endDatePeak = roomCategory.end_date_peak
      ? new Date(roomCategory.end_date_peak)
      : null;

    if (
      startDatePeak &&
      endDatePeak &&
      today >= startDatePeak &&
      today <= endDatePeak
    ) {
      return roomCategory.peak_price;
    }
    return roomCategory.price;
  };
  const calculateTotalPrice = (
    roomCategory: RoomCategory,
    count: number,
  ): number => {
    const isPeak =
      roomCategory.start_date_peak && roomCategory.end_date_peak
        ? isPeakPeriod(roomCategory.start_date_peak, roomCategory.end_date_peak)
        : false;
    const peakPrice = roomCategory.peak_price ?? roomCategory.price;
    return isPeak ? count * peakPrice : count * roomCategory.price;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="tracking-tight max-w-screen-lg mx-auto">
        <div className="lg:p-10 p-4 flex flex-col gap-3">
          <div className="w-full lg:h-80 h-60  relative">
            {property && (
              <img
                src={`${imageSrc}${property.pic_name}`}
                alt="Property Image"
                className="object-cover w-full h-full rounded-xl"
              />
            )}
          </div>

          {property && (
            <div className="property-details">
              <h2 className="text-2xl font-semibold ">{property.name}</h2>

              {/* SECTION DESC */}
              <div className="flex flex-row justify-between gap-8">
                <div className="">
                  {/* SECTION HOST */}
                  <Link
                    href={`/show/${tenant?.id}`}
                    className="text-black no-underline"
                  >
                    <div className="flex flex-row items-center gap-2.5 py-2">
                      <div>
                        {tenant?.image_name ? (
                          <img
                            src={`${imageSrcUser}${tenant?.image_name}`}
                            alt=""
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            role="presentation"
                            focusable="false"
                            className="w-10 h-10"
                          >
                            <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
                          </svg>
                        )}
                      </div>
                      {/* NAMA & CREATEDAT */}
                      <div>
                        <div className="font-medium">
                          Hosted by{' '}
                          <span>
                            {tenant?.first_name} {tenant?.last_name}
                          </span>
                        </div>
                        <div className="text-zinc-400 ">
                          Hosting since{' '}
                          <span>
                            {dayjs(tenant?.createdAt).format('MMMM YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* SECTION DESCRIPTION */}
                  <hr />
                  <div className="text-xl font-medium pb-3">
                    About this property
                  </div>
                  <div className="">{property?.desc}</div>
                  <hr />
                </div>

                <div className="">
                  <div className="hidden lg:flex">
                    <ChangeDateCalendar />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION ROOM */}
          <div className="rooms flex flex-col gap-4">
            {roomCategories.length > 0 ? (
              roomCategories.map((roomCategory) => (
                <div
                  key={roomCategory.id}
                  className="room-category p-3 shadow-sm flex items-center gap-4 rounded-lg text-sm"
                >
                  <div className="">
                    <img
                      src={`${imageSrcRoom}${roomCategory?.pic_name}`}
                      alt="Room picture"
                      className="w-40 h-40  lg:w-80  lg:h-72 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">
                      {roomCategory.type} Room
                    </div>

                    {/* DESCRIPTION ROOM */}
                    <div className="w-full max-w-md overflow-hidden pb-3">
                      <div className="w-full">
                        {showFullDesc
                          ? roomCategory.desc
                          : `${roomCategory.desc.substring(0, 100)}...`}
                      </div>
                      <div>
                        {roomCategory.desc.length > 100 && (
                          <button
                            onClick={toggleDescription}
                            className="text-black font-semibold underline mt-2"
                          >
                            {showFullDesc ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 items-center">
                      <div>
                        <IoPersonOutline />
                      </div>
                      <div>{roomCategory.guest} guests</div>
                    </div>

                    <div className="flex gap-1 items-center">
                      <div>
                        <IoBedOutline />
                      </div>
                      <div>1 {roomCategory.bed} bed</div>
                    </div>

                    <div
                      className={`flex gap-1 items-center ${roomCategory.isBreakfast ? '' : 'text-zinc-400'}`}
                    >
                      <div>
                        <PiForkKnife />
                      </div>
                      <div>
                        {roomCategory.isBreakfast
                          ? 'Breakfast included'
                          : 'Breakfast is not included'}
                      </div>
                    </div>

                    <div
                      className={`flex gap-1 items-center ${roomCategory.isSmoking ? '' : 'text-zinc-400'}`}
                    >
                      <div>
                        <TbSmoking />
                      </div>
                      <div>
                        {roomCategory.isSmoking
                          ? 'Smoking allowed'
                          : 'Smoking is not allowed'}
                      </div>
                    </div>

                    <div
                      className={`flex gap-1 items-center ${roomCategory.isRefunable ? '' : 'text-zinc-400'}`}
                    >
                      <div>
                        <MdOutlinePayment />
                      </div>
                      <div>
                        {roomCategory.isRefunable
                          ? 'Refundable order'
                          : 'Non-refundable order'}
                      </div>
                    </div>

                    <div className="lg:flex justify-between gap-5">
                      <div className="py-3 font-medium text-lg">
                        Price: ${getCurrentPrice(roomCategory)} /room/night
                        <div className="text-[#ED777B] font-semibold text-xs">
                          {roomCategory.remainingRooms} room available
                        </div>
                      </div>

                      {/* SECTION BUTTON */}
                      <div className="flex justify-between gap-3">
                        <div className="flex flex-row items-center gap-3 text-lg">
                          <button
                            className="w-10 btn btn-dark"
                            onClick={() => handleDecrement(roomCategory)}
                            disabled={roomCounts[roomCategory.id] <= 1}
                          >
                            -
                          </button>
                          <div>{roomCounts[roomCategory.id]}</div>
                          <button
                            className="w-10 btn btn-dark"
                            onClick={() => handleIncrement(roomCategory)}
                            disabled={
                              !roomCategory.remainingRooms ||
                              roomCounts[roomCategory.id] >=
                                roomCategory.remainingRooms ||
                              roomCounts[roomCategory.id] >= 3
                            }
                          >
                            +
                          </button>
                          <p>
                            Total Price: $
                            {calculateTotalPrice(
                              roomCategory,
                              roomCounts[roomCategory.id],
                            )}
                          </p>
                          {/* <p>
                          Total Price: $
                          {roomCounts[roomCategory.id] * roomCategory.price}
                        </p> */}
                        </div>
                        <div className="flex gap-2 items-center">
                          {roomCategory.Room.length > 0 && (
                            <button
                              className="btn btn-dark"
                              onClick={() =>
                                handleReserve(
                                  roomCategory.id,
                                  calculateTotalPrice(
                                    roomCategory,
                                    roomCounts[roomCategory.id],
                                  ),
                                  selectedRoomIds[roomCategory.id],
                                )
                              }
                            >
                              Choose
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No room categories available.</p>
            )}
          </div>

          <hr />
          {/* SECTION MAPS */}
          <div>
            <div className="text-xl font-medium pb-3">Where you&apos;ll be</div>
            <div className="pb-3">{property?.address}</div>
            {property && property.latitude && property.longitude && (
              <div className="map-container py-3 rounded-xl overflow-hidden">
                <MapComponent
                  latitude={property.latitude}
                  longitude={property.longitude}
                />
              </div>
            )}
          </div>

          <hr />

          {/* SECTION REVIEW */}
          <div className="mb-3">
            <div className="text-xl font-medium pb-3">Reviews from guests</div>

            <div>
              {reviews.length === 0 ? (
                <p>No reviews available.</p>
              ) : (
                <div className="flex flex-wrap">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="w-80 border-2 rounded-xl shadow-md flex flex-col gap-2 p-3"
                    >
                      <div className="flex gap-2 items-center">
                        {/* IMAGE USERR */}
                        {review.user.image_name ? (
                          <div className=" w-10 h-10 object-cover rounded-full ">
                            <img
                              src={`${imageSrcUser}${review.user.image_name}`}
                              alt="User Avatar"
                              className="w-10 h-10 object-cover rounded-full "
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 object-cover rounded-full ">
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

                        <div className="flex flex-col">
                          <div className="font-semibold">
                            {review.user.first_name} {review.user.last_name}
                          </div>
                        </div>
                      </div>

                      {review.rating && (
                        <div className="flex gap-1 items-center text-sm">
                          <div className="flex text-xs">
                            {Array.from(
                              { length: review.rating },
                              (_, index) => (
                                <FaStar key={index} />
                              ),
                            )}
                          </div>
                          <div>•</div>
                          <div className="">
                            {dayjs(review.createdAt).format('DD MMMM YYYY')}
                          </div>
                        </div>
                      )}

                      <div>{review.review}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PropertyDetail;
