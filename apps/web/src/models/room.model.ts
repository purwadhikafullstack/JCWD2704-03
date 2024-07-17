import { RoomCategory } from './roomCategory.model';

export interface Room {
  id: string;
  roomCategory_id: string;
  property_id: string;
  createdAt: string;
  updatedAt: string;
  roomCategory: RoomCategory;
  // Add other fields as necessary
}
