'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMoon, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

function CancelOrder() {
  const [order, setOrders] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { orderId } = params;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/reservations/${orderId}`,
        );
        const order: Order = response.data.data;
        setOrders(order);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchOrders();
  }, [orderId]);
  const handleCancelOrder = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance().patch(
            `http://localhost:8000/api/reservations/tenant/order/cancelled/${orderId}`,
          );
          console.log(response.data);

          Swal.fire({
            title: 'Cancelled',
            text: 'The order has been cancelled.',
            icon: 'success',
          }).then(() => {
            router.push('/dashboard');
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'There was an error cancelling the order.',
            icon: 'error',
          });
          console.error('Error cancelling order:', error);
        }
      }
    });
  };
  if (!order) return <div>No order found</div>;
  return (
    <>
      <div className=" flex flex-col gap-3">
        <div className="font-bold text-xl">Reservation Detail</div>{' '}
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-3 rounded-xl shadow-md border p-2 bg-white ">
            <div className=" bg-white grid place-items-center">
              <img
                src="https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt="vacation"
                className="rounded-xl"
                width={200}
                height={200}
              />
            </div>
            <div className=" md:w-2/3 bg-white flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm font-semibold">
                  <FaStar className="mr-2" />
                  4.96
                </div>
              </div>
              <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                {order.property.name}
              </h3>
            </div>
          </div>
        </div>
        <div
          key={order.id}
          className="flex flex-col gap-3 space-y-4 rounded-xl shadow-md border p-4 bg-white "
        >
          <div>
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col text-right">
                  <div>Order ID: </div>
                  <div className="text-gray-200 text-sm">
                    {order.id.toUpperCase()}
                  </div>
                </div>
                {/* checkIn checkOut */}
                <div className="flex flex-row gap-6  justify-between  text-gray-400">
                  <div className="flex flex-col">
                    <div>CheckIn</div>
                    <div>
                      {dayjs(order.checkIn_date).format('DD MMMM YYYY')}
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <span className=" md:block font-semibold">{}</span>
                    <FaMoon className="mt-1 md:hidden" />
                  </div>
                  <div className="flex flex-col text-right">
                    <div>CheckOut</div>
                    <div>
                      {dayjs(order.checkOut_date).format('DD MMMM YYYY')}
                    </div>
                  </div>
                </div>
                <div className="border"></div>
                {/* detail tamu */}
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  <div>
                    <div className="font-bold">Guest Detail</div>
                    <div className=" text-gray-400">
                      Mr/Ms. {order.user.first_name}
                    </div>
                  </div>
                  <div className="border border-dashed"></div>
                  <div className="">
                    <div className="font-bold">Room</div>
                    <div className="flex text-gray-400">
                      <div>{order.total_room}</div>
                      <div> {order.RoomCategory.type} Room</div>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                      <div>Total Price:</div>
                      <div>Rp. {order.total_price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="border border-dashed"></div>
                  <div>
                    <div className="font-bold">Facilities</div>
                    <div className=" text-gray-400">
                      {order.RoomCategory.desc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </>
  );
}
export default CancelOrder;
