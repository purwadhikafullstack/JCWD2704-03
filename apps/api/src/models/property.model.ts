import { Category } from '@prisma/client';
import { TUser } from './user.model';
import { Room, Property as PrismaProperty } from '@prisma/client';

export type TProperty = {
  city: string;
  id: string;
  name: string;
  tenant_id: TUser;
  category: Category;
  pic: Buffer | null;
  desc: string;
  pic_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface Property extends PrismaProperty {
  Room: Room[];
}
