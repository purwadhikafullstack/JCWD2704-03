'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { RoomCategory } from '@/models/roomCategory.model';
import { imageSrc } from '@/utils/imagerender';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MapComponent from '@/components/map/ComponentMap';

function PropertyDetail() {
  const { name } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!name || !checkIn || !checkOut) return;

      const url = `http://localhost:8000/api/properties/${name}?checkIn=${checkIn}&checkOut=${checkOut}`;
      console.log(`Fetching property details from: ${url}`);

      try {
        const response = await axiosInstance().get(url);
        const propertyData = response.data.data;

        console.log('Property data received:', propertyData);

        setProperty(propertyData);
        const categories = propertyData.RoomCategory || [];
        console.log('Room categories:', categories);
        setRoomCategories(categories);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetail();
  }, [name, checkIn, checkOut]);

  const handleReserve = (roomCategoryId: string) => {
    router.push(
      `/reservation/${roomCategoryId}?checkIn=${checkIn}&checkOut=${checkOut}`,
    );
  };

  return (
    <div>
      <div className="w-full h-80 px-4 relative">
        {property && (
          <img
            src={`${imageSrc}${property.id}`}
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
              <p>Price: ${roomCategory.price}</p>
              <p>{roomCategory.desc}</p>
              <p>Remaining Rooms: {roomCategory.remainingRooms}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleReserve(roomCategory.id)}
              >
                Reserve
              </button>
            </div>
          ))
        ) : (
          <p>No room categories available.</p>
        )}
      </div>
      {property && property.latitude && property.longitude && (
        <div className="map-container p-4">
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
