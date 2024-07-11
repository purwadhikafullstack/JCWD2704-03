export interface Property {
  name: string;
  id: string;
  tenant_id: string;
  category: string;
  city_id: City;
  pic: string;
  desc: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updateAt: string;
}

interface City {
  id: string;
  city: string;
}
