import { Entity, InLineProduct } from "./entity";
import { Category } from "./store";
import { User } from "./user";

export type Row = {
  id: number;
  is_product_1_highlighted: boolean;
  is_product_2_highlighted: boolean;
  ordering: number;
  product_1: InLineProduct | null;
  product_2: InLineProduct | null;
  segment: string;
};

export type Segment = {
  comparison: string;
  id: number;
  name: string;
  ordering: number;
  rows: Row[];
  url: string;
};

export type BrandComparison = {
  brand_1: InLineProduct;
  brand_2: InLineProduct;
  category: Category;
  id: number;
  manual_products: InLineProduct[];
  name: string;
  price_type: "offer" | "normal";
  segments: Segment[];
  stores: string[];
  url: string;
  user: User;
};

export type BrandRowData = {
  entities: Entity[];
  product: InLineProduct;
  rowIds: number[];
};