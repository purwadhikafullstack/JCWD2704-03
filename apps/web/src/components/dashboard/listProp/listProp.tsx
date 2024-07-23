'use client';

import { axiosInstance } from '@/libs/axios.config';
import { Property } from '@/models/property.model';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function MyProperty() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { propertyId } = params;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/properties`,
        );
        console.log('Response data:', response.data);
        const properties: Property[] = response.data.data;
        setProperties(properties);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchOrders();
  }, []);
  const handlePropertyDetail = () => {
    router.push(`/dashboard/my-property/detail/${propertyId}`);
  };

  return (
    <>
      <div>
        <div>
          <p className="p-6 font-bold text-lg">Your Orders</p>
        </div>
        <div className="flex flex-col gap-4 pb-4">
          {properties.map((property) => (
            <div key={property.id}>
              <div>
                <div className="flex flex-col space-y-3 rounded-xl shadow-sm p-3 max-w-xs md:max-w-4xl mx-auto md:m-0 md:ml-6  border border-white bg-white">
                  <div className="flex flex-row gap-5 justify-between md:justify-normal">
                    <div>
                      <img
                        src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mobile/tix-hotel/images-web/2020/10/28/0ddd6698-87b8-41c5-8732-0a6992564443-1603891614072-8cf982cb8d7d912e29d615edd0a503f5.jpg" // Use room.pic for the image source
                        alt="hotel" // Use room.type for the alt text
                        className="rounded-xl"
                        width={100}
                      />
                    </div>
                    <div className="font-bold">{property.name}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">{property.address}</div>
                    {/* <div className="font-normal">
                      {order.roomCategory?.type}
                    </div> */}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      onClick={handlePropertyDetail}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyProperty;
