'use client';
import { axiosInstance } from '@/libs/axios.config';
import React, { useState, useEffect } from 'react';
import { number } from 'yup';

interface AvailabilityData {
  [date: string]: {
    rooms: any[];
    properties: any[];
  };
}

const Calendar: React.FC = () => {
  const [year, setYear] = useState<number>(2024);
  const [month, setMonth] = useState<number>(7);
  const [availability, setAvailability] = useState<AvailabilityData>({});

  const fetchAvailability = async () => {
    try {
      const response = await axiosInstance().get(
        `/api/sales/availabilityReport`,
        {
          params: { year, month },
        },
      );
      console.log(response.data.data);
      setAvailability(response.data.data);
    } catch (error) {
      console.error('Error fetching availability data:', error);
    }
  };
  useEffect(() => {
    fetchAvailability();
  }, []);

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border p-2 mx-2"
          placeholder="Year"
        />
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="border p-2 mx-2"
          placeholder="Month"
        />
        <button
          onClick={fetchAvailability}
          className="bg-blue-500 text-white p-2 rounded mx-2"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = new Date(year, month - 1, day)
            .toISOString()
            .split('T')[0];
          const data = availability[date] || { rooms: [], properties: [] };

          return (
            <>
              <div className="">
                <div key={day} className="border p-4">
                  <div className="font-bold">{day}</div>
                  <div className="text-sm">
                    <div>Rooms: {data.rooms.length}</div>
                    <div>Properties: {data.properties.length}</div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
