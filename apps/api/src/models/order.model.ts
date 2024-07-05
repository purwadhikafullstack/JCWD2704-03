import { Status } from '@prisma/client';
import { TProperty } from './property.model';
import { TRoom } from './room.model';
import { TUser } from './user.model';

export type TOrder = {
  id: string;
  user_id: TUser;
  property: TProperty;
  room_id: TRoom;
  checkIn_date: Date;
  checkOut_date: Date;
  total_room: number;
  total_price: number;
  quest: number;
  payment_proof?: Buffer | null;
  status: Status;
  payment_date?: Date;
  invoice_id: string;
  createdAt?: Date;
  updatedAt?: Date;
};
