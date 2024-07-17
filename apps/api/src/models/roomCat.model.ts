import { Type } from '@prisma/client';
import { TProperty } from './property.model';

export type TRoomCategory = {
  id: string;
  property_id: TProperty;
  type: Type;
  price: number | null;
  peak_price?: number;
  start_date_peak?: Date;
  end_date_peak?: Date;
  desc: string;
  pic?: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
};
