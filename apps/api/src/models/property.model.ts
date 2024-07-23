import { Category } from '@prisma/client';
import { TUser } from './user.model';
import { Room, Property as PrismaProperty } from '@prisma/client';

export type TProperty = {
  name: string;
  city: string;
  id: string;
  name: string;
  tenant_id: TUser;
  category: Category;
  pic: Buffer | null;
  desc: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface Property extends PrismaProperty {
  Room: Room[];
}
