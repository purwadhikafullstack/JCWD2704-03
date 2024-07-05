import { Type } from '@prisma/client';
import { TProperty } from './properties.model';

export type TRoom = {
  id: string;
  property_id: TProperty;
  type: Type;
  price: number | null;
  peak_price?: number;
  start_date_peak?: Date;
  end_date_peak?: Date;
  desc: string;
  pic?: Buffer;
  availability: number;
  createdAt?: Date;
  updatedAt?: Date;
};
