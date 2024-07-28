'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { RoomCategory } from '@/models/roomCategory.model';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from '@/components/map/ComponentMap';
import { imageSrc } from '@/utils/imagerender';

function PropertyDetailHost() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setError('Property ID is missing');
      setLoading(false);
      return;
    }

    const fetchPropertyDetail = async () => {
      try {
        const response = await axiosInstance().get(
          `/api/properties/myDetail/${id}`,
        );
        setProperty(response.data.data);
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const handleEditProperty = () => {
    router.push(`/dashboard/becomehost/edit/${id}`);
  };

  // TODO: edit this
  const handleDeleteProperty = () => {};

  const handleAddRoomCategory = () => {
    router.push(`/dashboard/my-property/${id}/add-room`);
  };

  return (
    <div>
      <div className="w-full h-80 px-4 relative">
        <div className="flex flex-row gap-3">
          <button className="btn btn-dark" onClick={handleEditProperty}>
            Edit property
          </button>
          <button className="btn btn-dark" onClick={handleDeleteProperty}>
            Delete property
          </button>
          <button className="btn btn-dark" onClick={handleAddRoomCategory}>
            Add room category
          </button>
        </div>

        <img
          src={
            property.pic_name
              ? `${imageSrc}${property.pic_name}`
              : 'https://default-image-url.jpg'
          }
          alt={property.name || 'Property Image'}
          className="object-cover w-full h-full rounded-xl"
        />
      </div>
      <div className="property-details p-4">
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <p>{property.desc}</p>
        <p>
          <strong>Address:</strong> {property.address || 'N/A'}
        </p>
        <p>
          <strong>City:</strong> {property.city || 'N/A'}
        </p>
        <p>
          <strong>Latitude:</strong>{' '}
          {property.latitude !== undefined ? property.latitude : 'N/A'}
        </p>
        <p>
          <strong>Longitude:</strong>{' '}
          {property.longitude !== undefined ? property.longitude : 'N/A'}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {property.createdAt
            ? new Date(property.createdAt).toLocaleDateString()
            : 'N/A'}
        </p>
        <p>
          <strong>Updated At:</strong>{' '}
          {property.updatedAt
            ? new Date(property.updatedAt).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>

      {property.latitude && property.longitude && (
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

export default PropertyDetailHost;
