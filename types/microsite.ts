import { Brand } from "./banner";
import { InLineProduct } from "./entity";

export type Entry = {
  brand: string;
  brand_url: string | null;
  custom_attr_1_str: string;
  custom_attr_2_str: string;
  custom_attr_3_str: string;
  custom_attr_4_str: string;
  custom_attr_5_str: string;
  description: string | null;
  home_ordering: string | null;
  id: number;
  ordering: number | null;
  product: InLineProduct & { category: string };
  reference_price: number | null;
  sku: string;
  subtitle: string | null;
  title: string;
  url: string;
};

export type Microsite = {
  brand: Brand;
  entries: Entry[];
  fields: string;
  id: number;
  name: string;
  url: string;
};
