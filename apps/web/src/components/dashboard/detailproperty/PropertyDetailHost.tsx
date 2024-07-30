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
    <div>
      <div className="w-full h-80 px-4 relative">
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

      <div className="flex flex-row gap-3">
        <button className="btn btn-dark" onClick={handleEditProperty}>
          Edit property
        </button>
        <button
          className="btn btn-dark"
          onClick={() => handleDeleteProperty(property.id)}
        >
          Delete property
        </button>
        <button className="btn btn-dark" onClick={handleAddRoomCategory}>
          Add room category
        </button>
        <button
          className="text-blue-500"
          onClick={() => property?.id && handleReviewProperty(property.id)}
        >
          See Reviews
        </button>
      </div>
      {property.RoomCategory && property.RoomCategory.length > 0 ? (
        <div className="room-categories p-4">
          <h2 className="text-xl font-bold">Room Categories</h2>
          <div className="row">
            {property.RoomCategory.map((category: RoomCategoryWithCount) => (
              <div className="col-md-4 mb-4" key={category.id}>
                <div className="card w-full">
                  <h5 className="card-title">{category.type}</h5>
                  <img
                    src={
                      category.pic_name
                        ? `${imageSrcRoom}${category.pic_name}`
                        : 'https://default-room-image-url.jpg'
                    }
                    alt={category.type || 'Room Category Image'}
                    className="card-img-top h-32 object-cover"
                  />
                  <div className="card-body">
                    <p className="card-text">
                      <strong>Description:</strong> {category.desc}
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ${category.price}
                    </p>
                    <p className="card-text">
                      <strong>Peak Price:</strong> $
                      {category.peak_price || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Start Date for Peak:</strong>{' '}
                      {category.start_date_peak
                        ? new Date(
                            category.start_date_peak,
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>End Date for Peak:</strong>{' '}
                      {category.end_date_peak
                        ? new Date(category.end_date_peak).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Guest Capacity:</strong> {category.guest}
                    </p>
                    <p className="card-text">
                      <strong>Bed Type:</strong> {category.bed}
                    </p>
                    <p className="card-text">
                      <strong>Breakfast Included:</strong>{' '}
                      {category.isBreakfast ? 'Yes' : 'No'}
                    </p>
                    <p className="card-text">
                      <strong>Refundable:</strong>{' '}
                      {category.isRefunable ? 'Yes' : 'No'}
                    </p>
                    <p className="card-text">
                      <strong>Smoking Allowed:</strong>{' '}
                      {category.isSmoking ? 'Yes' : 'No'}
                    </p>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEditRoomCategory(category.id)}
                    >
                      Edit Room Category
                    </button>
                    <button
                      className="btn btn-danger"
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
        <div className="no-rooms p-4 text-center">
          <h2 className="text-xl font-bold">No Room Categories</h2>
          <p>You have no rooms! Make a room category and add rooms now.</p>
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
