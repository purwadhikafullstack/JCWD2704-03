import { Property } from './property.model';
import { Order } from './reservation.model';
import { RoomCategory } from './roomCategory.model';

export interface Room {
  id: string;
  property_id: string;
  roomCategory_id: string;
  createdAt: string;
  updatedAt: string;
  roomCategory: RoomCategory;
  reservation: Order;
  property: Property;
}
