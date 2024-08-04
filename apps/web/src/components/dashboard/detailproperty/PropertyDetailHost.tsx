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
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoIosBed } from 'react-icons/io';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaSmoking } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { FaPerson } from 'react-icons/fa6';
import dayjs from 'dayjs';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

        const property = response.data.data;
        setProperty(property);
        // setProperty(response.data.data);
        console.log('dattaa proop', response.data.data);
        console.log('name', property?.name);
        console.log('pic name', property?.pic_name);
        console.log(imageSrc);
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
    return (
      <>
        {' '}
        <div className="flex justify-center items-center h-64">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the room category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance().patch(
          `/api/rooms/d/${categoryId}`,
        );

        if (response.status === 200) {
          Swal.fire(
            'Deleted!',
            'The room category has been deleted.',
            'success',
          );

          window.location.reload();
        } else {
          Swal.fire('Failed!', 'Failed to delete room category.', 'error');
        }
      } catch (error) {
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
    <div className="container flex flex-col  gap-4 tracking-tighter">
      <div className="bg-white p-6 rounded-lg flex flex-col gap-3">
        <div>
          {property && (
            <img
              src={`${imageSrc}${property.pic_name}`}
              alt="Property Image"
              className="sobject-cover w-full h-80 object-cover rounded-xl"
            />
          )}
        </div>

        <div className="text-2xl md:text-3xl font-bold ">{property.name}</div>
        <div className="text-gray-700">{property.desc}</div>
        <div className="">
          <div className="font-semibold">Address:</div>{' '}
          {property.address || 'N/A'}
        </div>
        <div className="">
          <div className="font-semibold">City:</div> {property.city || 'N/A'}
        </div>
        <div className="flex gap-5 mt-10">
          <p className="mb-2">
            <div className="font-semibold">Posted at:</div>{' '}
            {property.createdAt
              ? dayjs(property.createdAt).format('HH:mm DD MMMM YYYY ')
              : 'N/A'}
          </p>
          <p>
            <div className="font-semibold">Last updated at:</div>{' '}
            {property.updatedAt
              ? dayjs(property.updatedAt).format('HH:mm DD MMMM YYYY')
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-4">
        <button
          className="bg-gray-800 text-white py-2 px-4  w-52 rounded-lg hover:bg-gray-700"
          onClick={handleEditProperty}
        >
          Edit Property
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4  w-52 rounded-lg hover:bg-red-500"
          onClick={() => handleDeleteProperty(property.id)}
        >
          Delete Property
        </button>
        <button
          className="bg-blue-600 text-white py-2 px-4 w-52 rounded-lg hover:bg-blue-500"
          onClick={handleAddRoomCategory}
        >
          Add Room Category
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4  w-52 rounded-lg hover:bg-green-500"
          onClick={() => property?.id && handleReviewProperty(property.id)}
        >
          See Reviews
        </button>
      </div>

      <div className="rooms">
        {property.RoomCategory && property.RoomCategory.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex overflow-x-scroll space-x-4">
              {property.RoomCategory.map((category) => (
                <div
                  className="bg-zinc-100 rounded-2xl my-2 overflow-hidden flex-none w-96"
                  key={category.id}
                >
                  <img
                    src={
                      category.pic_name
                        ? `${imageSrcRoom}${category.pic_name}`
                        : 'https://ik.imagekit.io/tvlk/blog/2022/06/Hotel-di-Jakarta-dengan-Balkon-Somerset-Sudirman-Jakarta-2-1024x683.jpeg?tr=dpr-2,w-675'
                    }
                    alt={category.type || 'Room Category Image'}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="text-2xl md:text-xl font-bold mb-2">
                      {category.type} Room
                    </h5>

                    <div className="mb-2">{category.desc}</div>
                    <div className="flex flex-row gap-1 mb-2">
                      <IoIosBed className="mt-1" />
                      <div>
                        {' '}
                        {category.bed.charAt(0).toUpperCase() +
                          category.bed.slice(1).toLowerCase()}{' '}
                        Bed
                      </div>
                    </div>
                    <div className="flex flex-row gap-1 mb-2">
                      <FaPerson className="mt-1" />
                      <div>{category.guest} Guest </div>
                    </div>
                    <div className="flex flex-row gap-1 mb-2">
                      <PiForkKnifeFill className="mt-1" />
                      {category.isBreakfast ? (
                        <div>Breakfast included</div>
                      ) : (
                        <div>Breakfast not included</div>
                      )}
                    </div>
                    <div className="flex flex-row gap-1 mb-2">
                      <FaSmoking className="mt-1" />{' '}
                      {category.isSmoking ? (
                        <div>Smoking allowed</div>
                      ) : (
                        <div>Smoking not allowed</div>
                      )}
                    </div>
                    <div className="flex flex-row gap-1 mb-2">
                      <MdPayment className="mt-1" />
                      {category.isRefunable ? (
                        <div>Refundable order</div>
                      ) : (
                        <div>Non-refundable order</div>
                      )}
                    </div>

                    <div className="flex flex-col mt-4">
                      <div className="mb-2 font-semibold text-lg">
                        {' '}
                        Room Pricing
                      </div>
                      <div className="flex flex-row gap-1 mb-2">
                        <div>Price:</div>{' '}
                        <span className="font-bold">
                          Rp. {category.price.toLocaleString()}{' '}
                        </span>{' '}
                        <span>/room/night</span>
                      </div>

                      {category.peak_price && (
                        <div>
                          <div className="flex flex-row gap-1 mb-2">
                            <div>Peak Price:</div>
                            <span className="font-bold">
                              Rp. {category.peak_price.toLocaleString()}
                            </span>{' '}
                            <span>/room/night</span>
                          </div>
                          <div className="flex flex-row gap-1 mb-2">
                            <div>Start Date for Peak:</div>
                            {category.start_date_peak
                              ? new Date(
                                  category.start_date_peak,
                                ).toLocaleDateString()
                              : 'N/A'}
                          </div>
                          <div className="flex flex-row gap-1 mb-2">
                            <div>End Date for Peak:</div>
                            {category.end_date_peak
                              ? new Date(
                                  category.end_date_peak,
                                ).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col mt-4">
                      <div className="mb-2 font-semibold text-lg">
                        {' '}
                        Room Number
                      </div>
                      <div className="flex flex-row gap-1 mb-2">
                        <div className="">Total rooms: </div>
                        <div className="font-bold">{category.roomCount}</div>
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="">Available rooms: </div>
                        <div className="font-bold">
                          {category.remainingRooms}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-black text-white py-1 px-3 rounded-lg hover:bg-blue-500"
                        onClick={() => handleEditRoomCategory(category.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-500"
                        onClick={() => handleDeleteRoomCategory(category.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>No room categories available. Create now!</p>
          </div>
        )}
      </div>

      {property.latitude && property.longitude && (
        <>
          <div className="p-4">
            <div className="font-semibold text-xl pb-2">Location</div>
            <div className="text-zinc-500 mb-4">
              To change your location, you need to update your property address.
            </div>
            <MapComponent
              latitude={property.latitude}
              longitude={property.longitude}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyDetailHost;
