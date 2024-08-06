import { Property } from './property.model';
import { Review } from './review.modal';
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
  token_midTrans: string;
  cancel_date: string;
  createdAt: string;
  updatedAt: string;
  invoice_id: string;
  RoomCategory: RoomCategory;
  property: Property;
  user: User;
  review?: Review;
}
