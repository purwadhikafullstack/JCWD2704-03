'use client';

import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { imageSrc } from '@/utils/imagerender';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap

function MyProperty() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false); // State for button click loading
  const router = useRouter();
  const params = useParams();
  const { propertyId } = params;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance().get(
          '/api/properties/myProperty',
        );
        console.log('Response data:', response.data);
        setProperties(response.data.data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyDetail = async (id: string) => {
    setDetailLoading(true); // Set loading state to true when button is clicked
    try {
      // Simulate async action if needed, otherwise directly navigate
      router.push(`/dashboard/my-property/${id}`);
    } finally {
      setDetailLoading(false); // Set loading state to false after navigation
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <p className="p-6 font-bold text-lg">My Listing</p>
      </div>
      <div className="flex flex-col gap-4 pb-4">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id}>
              <div className="flex flex-col space-y-3 rounded-xl shadow-sm p-3 max-w-xs md:max-w-4xl mx-auto md:m-0 md:ml-6 border border-white bg-white">
                <div className="flex flex-row gap-5 justify-between md:justify-normal">
                  <div>
                    <img
                      src={
                        property.pic_name
                          ? `${imageSrc}${property.pic_name}`
                          : 'https://default-image-url.jpg'
                      } // Use imageSrc to construct the URL
                      alt={property.name || 'Property image'}
                      className="rounded-xl"
                      width={100}
                    />
                  </div>
                  <div className="font-bold">{property.name}</div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">{property.address}</div>
                </div>
                <div>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 relative"
                    onClick={() => handlePropertyDetail(property.id)}
                    disabled={detailLoading} // Disable button when loading
                  >
                    {detailLoading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="absolute inset-0 mx-auto my-auto"
                      />
                    ) : (
                      'Detail'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyProperty;
