'use client';

import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { imageSrc } from '@/utils/imagerender';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useAppSelector } from '@/app/hooks';
import { User } from '@/models/user.model';

function MyProperty() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { propertyId } = params;
  const user = useAppSelector((state) => state.auth) as User;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance().get(
          '/api/properties/myProperty',
        );
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
    setDetailLoading(true);
    try {
      if (!user.isVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Please verify your email first',
          showConfirmButton: true,
        });
        return;
      }
      router.push(`/dashboard/my-property/${id}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateProperty = () => {
    setHostLoading(true);
    try {
      if (!user.isVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Please verify your email first',
          showConfirmButton: true,
        });
        return;
      }
      router.push('/dashboard/becomehost/create');
    } finally {
      setHostLoading(false);
    }
  };

  return (
    <div className="tracking-tighter">
      <div className="font-semibold text-2xl mb-2 pt-4">
        Manage your listings
      </div>

      <div className="text-zinc-500 mb-2">
        Keep your property details up to date to attract more guests and provide
        the best experience for them.
      </div>

      <div className="flex flex-col gap-4 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : properties.length === 0 ? (
          <div className="mt-10 flex flex-col justify-center items-center min-h-[calc(100vh-64px)]">
            <p className="mb-4">
              No listings available. Start creating your first one now!
            </p>
            <button
              className="btn btn-dark"
              onClick={handleCreateProperty}
              disabled={hostLoading}
            >
              {hostLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Become a host'
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="py-3">
              <button className="btn btn-dark" onClick={handleCreateProperty}>
                Create new listing
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex flex-col rounded-xl shadow-sm p-3 w-80 md:m-0 border flex-shrink-0"
                >
                  <div className="flex flex-col gap-2">
                    {/* FOTO */}
                    <div>
                      <img
                        src={
                          property.pic_name
                            ? `${imageSrc}${property.pic_name}`
                            : 'https://default-image-url.jpg'
                        }
                        alt={property.name || 'Property image'}
                        className="rounded-xl h-60 w-80 object-cover"
                        width=""
                      />
                    </div>
                    {/* NAMA */}
                    <div className="font-bold">{property.name}</div>
                    <div className="text-zinc-400 truncate overflow-hidden w-72 text-sm">
                      {property.address}
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-2">
                    <div>
                      <button
                        type="button"
                        className="btn btn-dark "
                        onClick={() => handlePropertyDetail(property.id)}
                        disabled={detailLoading}
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
                          'Manage'
                        )}
                      </button>
                    </div>
                    {property.RoomCategory &&
                      property.RoomCategory.length === 0 && (
                        <div className="text-[#ED777B] font-semibold">
                          Add rooms now!
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyProperty;
