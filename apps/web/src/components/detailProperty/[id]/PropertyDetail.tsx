'use client';
import React from 'react';
import { Property } from '@/models/property.model';
import { RoomCategory } from '@/models/roomCategory.model';
import { imageSrc } from '@/utils/imagerender';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MapComponent from '@/components/map/ComponentMap';
import { axiosInstance } from '@/libs/axios.config';
import { root } from 'postcss';

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
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!name || !checkIn || !checkOut) return;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

      const url = `${baseUrl}/api/properties/detail/${name}?checkIn=${checkIn}&checkOut=${checkOut}`;

      console.log(`Fetching property details from: ${url}`);

      try {
        const response = await axiosInstance().get(url);
        const propertyData = response.data.data;

        console.log('Property data received:', propertyData);

        setProperty(propertyData);
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
  return (
    <div>
      <div className="w-full h-80 px-4 relative">
        {property && (
          <img
            src={`${imageSrc}${property.pic_name}`}
            alt="Property Image"
            className="object-cover w-full h-full rounded-xl"
          />
        )}
      </div>
      {property && (
        <div className="property-details p-4">
          <h1 className="text-2xl font-bold">{property.name}</h1>
          <p>{property.desc}</p>
          <p>{property.address}</p>
        </div>
      )}
      <div className="rooms p-4">
        <h2 className="text-xl font-bold">Room Categories</h2>
        {roomCategories.length > 0 ? (
          roomCategories.map((roomCategory) => (
            <div key={roomCategory.id} className="room-category p-2 border-b">
              <h3 className="text-lg">{roomCategory.type}</h3>
              <p>Price: ${getCurrentPrice(roomCategory)}</p>
              <p>{roomCategory.desc}</p>
              <p>Remaining Rooms: {roomCategory.remainingRooms}</p>
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
              </div>
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
                  Reserve
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No room categories available.</p>
        )}
      </div>
      {property && property.latitude && property.longitude && (
        <div className="p-4">
          <MapComponent
            latitude={property.latitude}
            longitude={property.longitude}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyDetail;
