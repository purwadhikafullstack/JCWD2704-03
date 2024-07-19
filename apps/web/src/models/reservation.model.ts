import { Property } from './property.model';
import { RoomCategory } from './roomCategory.model';
import { User } from './user.model';

export interface Order {
  id: string;
  user_id: string;
  property_id: string;
  room_id: string;
  roomCategory_id: string;
  checkIn_date: string;
  checkOut_date: string;
  total_room: number;
  total_price: number;
  payment_method: string;
  payment_proof: string;
  payment_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  invoice_id: string;
  roomCategory: RoomCategory;
  property: Property;
  user: User;
}
