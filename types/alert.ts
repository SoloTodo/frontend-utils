import { InLineProduct } from "./entity";
import { User } from "./user";

export type Alert = {
  creation_date: string;
  email: string | null;
  id: number;
  product: InLineProduct;
  stores: string[];
  url: string;
  user: User;
};
