export interface Property {
  name: string;
  id: string;
  tenant_id: string;
  category: string;
  city: string;
  pic: string | null;
  desc: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  pic_name: string;
  deleteedAt: string;
}
