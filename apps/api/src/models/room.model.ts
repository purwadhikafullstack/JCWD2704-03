import { TProperty } from './property.model';
import { TRoomCategory } from './roomCat.model';

export type TRoom = {
  id: string;
  property_id: TProperty;
  roomCategory_id: TRoomCategory;
  createdAt?: Date;
  updatedAt?: Date;
};
