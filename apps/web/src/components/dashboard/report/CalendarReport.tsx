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
    <div className="">
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
            className="bg-blue-500 text-white p-2 "
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-7 grid-cols-3">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = new Date(year, month - 1, day)
            .toISOString()
            .split('T')[0];
          const data = availability[date] || { rooms: [], properties: [] };
          return (
            <>
              <div className="">
                <div key={day} className="border md:p-4">
                  <div className="font-bold">{day}</div>
                  <div className="text-xs md:text-sm">
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
