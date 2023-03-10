import { InLineProduct } from "./entity";
import { User } from "./user";

export type BrandComparison = {
  brand_1: InLineProduct;
  brand_2: InLineProduct;
  category: string;
  id: number;
  manual_products: InLineProduct[];
  name: string;
  price_type: "offer" | "normal";
  stores: string[];
  url: string;
  user: User;
};
