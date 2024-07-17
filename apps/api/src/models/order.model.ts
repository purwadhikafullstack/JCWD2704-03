import { Status, User } from '@prisma/client';
import { TProperty } from './property.model';
import { TRoomCategory } from './roomCat.model';
import { TUser } from './user.model';
import { TRoom } from './room.model';

export type TOrder = {
  id: string;
  user_id: TUser;
  property: TProperty;
  room_id: TRoom;
  checkIn_date: Date;
  checkOut_date: Date;
  total_room: number;
  total_price: number;
  payment_proof?: Buffer | null;
  status: Status;
  payment_date?: Date;
  invoice_id: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: User;
};
