import { InLineProduct } from "./entity";
import { Category } from "./store";
import { User } from "./user";

export type BrandComparison = {
  brand_1: InLineProduct;
  brand_2: InLineProduct;
  category: Category;
  id: number;
  manual_products: InLineProduct[];
  name: string;
  price_type: "offer" | "normal";
  stores: string[];
  url: string;
  user: User;
};
