import { Room } from './room.model';

export interface RoomCategory {
  id: string;
  property_id: string;
  type: 'Standard' | 'Deluxe'; // Enum values from the schema
  guest: number;
  price: number;
  peak_price?: number; // Optional
  start_date_peak?: string; // Optional, DateTime as string
  end_date_peak?: string; // Optional, DateTime as string
  isBreakfast: boolean;
  isRefunable: boolean;
  isSmoking: boolean;
  bed: 'king' | 'twin' | 'single'; // Enum values from the schema
  desc: string;
  pic?: string | null; // Optional
  createdAt: string; // DateTime as string
  updatedAt: string; // DateTime as string
  remainingRooms?: number;
  Room: Room[];
}
