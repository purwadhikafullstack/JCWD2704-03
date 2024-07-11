'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Room } from '@/models/room.model';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DetailProduct() {
  const { propertyId } = useParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/properties/${propertyId}`,
        );
        const { data } = response.data;
        setRooms(data);
        console.log(data); // Assuming data is an array of Room objects
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRoom();
  }, [propertyId]);
  const handleReserve = (roomId: string) => {
    router.push(`http://localhost:3000/reservation/${roomId}`);
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="flex flex-col justify-center">
            <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
              <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                  src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mobile/tix-hotel/images-web/2020/10/28/0ddd6698-87b8-41c5-8732-0a6992564443-1603891614072-8cf982cb8d7d912e29d615edd0a503f5.jpg" // Use room.pic for the image source
                  alt={room.type} // Use room.type for the alt text
                  className="rounded-xl"
                />
              </div>
              <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                <div className="flex justify-between item-center"></div>
                <div>
                  <h3 className="font-black text-gray-800 md:text-3xl text-medium">
                    {room.type} room
                  </h3>
                  <div className="border-t border-gray-300 my-4">
                    {room.desc}
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#ED777B]">
                    Rp.{' '}
                    {room.peak_price
                      ? room.peak_price.toLocaleString()
                      : room.price.toLocaleString()}
                    <span className="font-normal text-black text-base">
                      /night
                    </span>
                  </p>

                  <button
                    className="btn bsb-btn-xl btn-dark w-full my-3"
                    type="submit"
                    onClick={() => handleReserve(room.id)}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DetailProduct;
