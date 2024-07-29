import { RoomCategory } from './roomCategory.model';

export interface Property {
  id: string;
  tenant_id: string;
  name: string;
  category: string; // Assuming this is an enum or string in your schema
  pic?: string;
  desc: string;
  city?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string; // Adjust to Date if necessary
  updatedAt: string; // Adjust to Date if necessary
  deletedAt?: string; // Adjust to Date if necessary
  pic_name?: string;
  RoomCategory?: RoomCategoryWithCount[]; // Update this line
}

export interface RoomCategoryWithCount extends RoomCategory {
  roomCount: number; // Add this to include the count
}
