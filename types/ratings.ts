import { InLineProduct } from "./entity";
import { User } from "./user";

export type Rating = {
  creation_date: string;
  last_updated: string;
  id: number;
  ip: string;
  product: InLineProduct;
  product_comments: string;
  product_rating: number;
  purchase_proof: string;
  store: string;
  store_comments: string;
  store_rating: number;
  url: string;
  user: User;
  email_or_phone: string | null;
  status: number;
};

export const RatingStatusDict = {
  1: 'Pendiente',
  2: 'Aprobado',
  3: 'Rechazado',
  4: 'En investigación'
}