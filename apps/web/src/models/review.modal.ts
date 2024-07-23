import { Order } from './reservation.model';
import { User } from './user.model';

export interface Review {
  id: string;
  user: User;
  user_id: string;
  order_id: string;
  order: Order;
  review: string;
  rating: number;
  reply: string;
  event_id: string;
  createdAt: string;
  updatedAt: string;
}
