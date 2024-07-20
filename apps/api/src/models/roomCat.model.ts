// import { Type } from '@prisma/client';
import { TProperty } from './property.model';
import { Type, Bed } from '@prisma/client';

// export type TRoomCategory = {
//   id: string;
//   property_id: TProperty;
//   type: Type;
//   price: number | null;
//   peak_price?: number;
//   start_date_peak?: Date;
//   end_date_peak?: Date;
//   desc: string;
//   pic?: Buffer;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

export type TRoomCategory = {
  id: string;
  property_id: string;
  type: Type;
  guest: number;
  price: number;
  peak_price?: number;
  start_date_peak?: Date;
  end_date_peak?: Date;
  isBreakfast: boolean;
  isRefunable: boolean;
  isSmoking: boolean;
  bed: Bed;
  desc: string;
  pic?: Buffer;
  createdAt: Date;
  updatedAt: Date;
  property: {
    id: string;
    name: string;
  };
  Order: {
    id: string;
    checkIn_date: Date;
    checkOut_date: Date;
  }[];
  Room: {
    id: string;
    roomNumber: string;
  }[];
};
