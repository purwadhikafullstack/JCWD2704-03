'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ListingDetail() {
  const params = useParams();
  const { propertyId } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true); // Set loading to true before making the request
        const response = await axiosInstance().get(
          `/api/properties/detail/${propertyId}`,
        );
        const property: Property = response.data.data;
        setProperty(property);
        setLoading(false); // Set loading to false after the request is complete
      } catch (error) {
        console.error('Error fetching order data:', error);
        setError('Failed to fetch property details.');
        setLoading(false); // Set loading to false on error
      }
    };

    fetchOrderData();
  }, [propertyId]);
  const handleReviewProperty = (propertyId: string) => {
    router.push(`/dashboard/my-property/review/${propertyId}`);
  };

  if (loading)
    return (
      <>
        <div className="flex justify-center items-center h-64">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );
  if (error) return <p>{error}</p>;
  console.log(property?.name);

  return (
    <div className="tracking-tighter">
      <h1>Property Details</h1>
      {property ? (
        <div>
          <h2>{property.name}</h2>
          <p>{property.desc}</p>
          <p>{property.city}</p>
          <p>{property.address}</p>
          <p>Latitude: {property.latitude || 'Not Available'}</p>
          <p>Longitude: {property.longitude || 'Not Available'}</p>
        </div>
      ) : (
        <p>No property data available.</p>
      )}
      <button
        className="text-blue-500"
        onClick={() => property?.id && handleReviewProperty(property.id)}
      >
        See Reviews
      </button>
    </div>
  );
}

export default ListingDetail;
