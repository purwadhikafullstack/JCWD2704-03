'use client';
import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import React, { useState, useEffect } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface AvailabilityData {
  [date: string]: {
    orders: Order[];
  };
}

const Calendar: React.FC = () => {
  const [year, setYear] = useState<number>(2024);
  const [month, setMonth] = useState<number>(8);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const fetchAvailability = async () => {
    try {
      const response = await axiosInstance().get(
        `/api/sales/availabilityReport`,
        {
          params: { year, month },
        },
      );
      const dataArray = response.data.data;
      const dataObject: AvailabilityData = dataArray.reduce(
        (acc: AvailabilityData, curr: any) => {
          const date = new Date(curr.date).toISOString().split('T')[0];
          acc[date] = { orders: curr.orders };
          return acc;
        },
        {},
      );
      setAvailability(dataObject);
    } catch (error) {
      console.error('Error fetching availability data:', error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [year, month]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedOrders(availability[date]?.orders || []);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedOrders([]);
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row mb-4">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">Year</div>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border"
            placeholder="Year"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">Month</div>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border"
            placeholder="Month"
          />
        </div>
        <div className="md:mt-6">
          <button
            onClick={fetchAvailability}
            className="bg-blue-500 text-white p-2"
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-7 grid-cols-3 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = new Date(Date.UTC(year, month - 1, day))
            .toISOString()
            .split('T')[0];
          const data = availability[date] || { orders: [] };
          const hasOrders = data.orders.length > 0;
          return (
            <div
              key={day}
              className={`border md:p-4 cursor-pointer ${hasOrders ? 'bg-green-400' : 'bg-gray-200'}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="font-bold">{day}</div>
              <div className="text-xs md:text-sm">
                <div>Orders: {data.orders.length}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Orders on {selectedDate}
              </h2>
              <button onClick={handleCloseModal} className="text-red-500">
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {selectedOrders.length > 0 ? (
                <ul>
                  {selectedOrders.map((order) => (
                    <li key={order.id} className="mb-2">
                      <div className="flex flex-col">
                        <div className="font-bold">Invoice ID:</div>
                        <div>{order.invoice_id?.toUpperCase()}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold">Property Name </div>
                        <div>{order.property.name}</div>
                      </div>
                      <div>
                        <div className="font-bold">Room Type </div>
                        <div>{order.RoomCategory.type}</div>
                      </div>
                      <div className="flex flex-row">
                        <div className="font-bold">Check-In: </div>
                        <div>
                          {new Date(order.checkIn_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div className="font-bold">Check-Out: </div>
                        <div>
                          {new Date(order.checkOut_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div className="font-bold">Total Price: </div>
                        <div>{order.total_price}</div>
                      </div>
                      <div className="flex flex-row">
                        <div className="font-bold">Status: </div>
                        <div>{order.status}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No orders found for this date.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
