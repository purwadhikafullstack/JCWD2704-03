'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { RoomCategoryWithCount } from '@/models/roomCategory.model';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from '@/components/map/ComponentMap';
import { imageSrc, imageSrcRoom } from '@/utils/imagerender';
import Swal from 'sweetalert2';

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

  const handleDeleteProperty = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the property!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        console.log(`Attempting to delete property with ID: ${id}`);

        const response = await axiosInstance().patch(
          `/api/properties/del/${id}`,
        );

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.status === 200) {
          Swal.fire('Deleted!', 'The property has been deleted.', 'success');

          router.push(`/dashboard/my-property`);
        } else {
          Swal.fire('Failed!', 'Failed to delete the property.', 'error');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        Swal.fire(
          'Error!',
          'There was an error deleting the property.',
          'error',
        );
      }
    }
  };

  const handleAddRoomCategory = () => {
    router.push(`/dashboard/my-property/${id}/add-room`);
  };

  const handleEditRoomCategory = (categoryId: string) => {
    router.push(`/dashboard/my-property/${id}/edit-room/${categoryId}`);
  };

  const handleDeleteRoomCategory = async (categoryId: string) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the room category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // If the user confirmed
    if (result.isConfirmed) {
      try {
        // Send a PATCH request to perform a soft delete
        const response = await axiosInstance().patch(
          `/api/rooms/d/${categoryId}`,
        );

        if (response.status === 200) {
          // Successfully deleted, handle success
          Swal.fire(
            'Deleted!',
            'The room category has been deleted.',
            'success',
          );

          window.location.reload();
        } else {
          // Handle unexpected response status
          Swal.fire('Failed!', 'Failed to delete room category.', 'error');
        }
      } catch (error) {
        // Handle error
        console.error('Error deleting room category:', error);
        Swal.fire(
          'Error!',
          'There was an error deleting the room category.',
          'error',
        );
      }
    }
  };

  const handleReviewProperty = (propertyId: string) => {
    router.push(`/dashboard/my-property/review/${propertyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative mb-4">
        <img
          src={
            property.pic_name
              ? `${imageSrc}${property.pic_name}`
              : 'https://default-image-url.jpg'
          }
          alt={property.name || 'Property Image'}
          className="object-cover w-full h-64 md:h-80 rounded-lg"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.name}</h1>
        <p className="text-gray-700 mb-2">{property.desc}</p>
        <p className="mb-2">
          <strong>Address:</strong> {property.address || 'N/A'}
        </p>
        <p className="mb-2">
          <strong>City:</strong> {property.city || 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Posted at:</strong>{' '}
          {property.createdAt
            ? new Date(property.createdAt).toLocaleDateString()
            : 'N/A'}
        </p>
        <p>
          <strong>Last updated At:</strong>{' '}
          {property.updatedAt
            ? new Date(property.updatedAt).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          onClick={handleEditProperty}
        >
          Edit Property
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
          onClick={() => handleDeleteProperty(property.id)}
        >
          Delete Property
        </button>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
          onClick={handleAddRoomCategory}
        >
          Add Room Category
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500"
          onClick={() => property?.id && handleReviewProperty(property.id)}
        >
          See Reviews
        </button>
      </div>

      {property.RoomCategory && property.RoomCategory.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Room Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.RoomCategory.map((category: RoomCategoryWithCount) => (
              <div
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
                key={category.id}
              >
                <img
                  src={
                    category.pic_name
                      ? `${imageSrcRoom}${category.pic_name}`
                      : 'https://default-room-image-url.jpg'
                  }
                  alt={category.type || 'Room Category Image'}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h5 className="text-lg md:text-xl font-semibold mb-2">
                    {category.type}
                  </h5>
                  <p className="mb-2">
                    <strong>Description:</strong> {category.desc}
                  </p>
                  <p className="mb-2">
                    <strong>Price:</strong> ${category.price}
                  </p>
                  <p className="mb-2">
                    <strong>Peak Price:</strong> ${category.peak_price || 'N/A'}
                  </p>
                  <p className="mb-2">
                    <strong>Start Date for Peak:</strong>{' '}
                    {category.start_date_peak
                      ? new Date(category.start_date_peak).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="mb-2">
                    <strong>End Date for Peak:</strong>{' '}
                    {category.end_date_peak
                      ? new Date(category.end_date_peak).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="mb-2">
                    <strong>Guest Capacity:</strong> {category.guest}
                  </p>
                  <p className="mb-2">
                    <strong>Bed Type:</strong> {category.bed}
                  </p>
                  <p className="mb-2">
                    <strong>Breakfast Included:</strong>{' '}
                    {category.isBreakfast ? 'Yes' : 'No'}
                  </p>
                  <p className="mb-2">
                    <strong>Refundable:</strong>{' '}
                    {category.isRefunable ? 'Yes' : 'No'}
                  </p>
                  <p className="mb-2">
                    <strong>Smoking Allowed:</strong>{' '}
                    {category.isSmoking ? 'Yes' : 'No'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-500"
                      onClick={() => handleEditRoomCategory(category.id)}
                    >
                      Edit Room Category
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-500"
                      onClick={() => handleDeleteRoomCategory(category.id)}
                    >
                      Delete Room Category
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No room categories available.</p>
        </div>
      )}

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
