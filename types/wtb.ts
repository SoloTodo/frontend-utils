import { InLineProduct } from "./entity";
import { Category } from "./store";

export type Brand = {
  id: number;
  name: string;
  permissions: string[];
  prefered_brand: string;
  stores: string[];
  storescraper_class: string;
  url: string;
  website: string;
};

export type Update = {
  brand: string;
  creation_date: string;
  id: number;
  last_updated: string;
  registry_file: string;
  status: 3;
  url: string;
};

export type WtbEntity = {
  brand: Brand;
  category: string;
  creation_date: string;
  external_url: string;
  id: number;
  is_active: boolean;
  is_visible: boolean;
  key: string;
  last_updated: string;
  model_name: string;
  name: string;
  picture_url: string;
  price: string | null;
  product: InLineProduct;
  section: string;
  url: string;
  full_category: Category;
  description: string;
};
