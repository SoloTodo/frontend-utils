export type Store = {
  url: string;
  id: number;
  name: string;
  country: string;
  last_activation: string | null;
  type: string;
  storescraper_class: string;
  logo: string;
  permissions: string[];
  preferred_payment_method?: string;
};

export const STATUS = {
  1: "Pendiente",
  2: "En proceso",
  3: "Exitosa",
  4: "Error",
}

export type Update = {
  available_products_count: number | null;
  categories?: any;
  creation_date: string;
  discovery_url_concurrency: number | null;
  discovery_urls_without_products_count: number | null;
  id: number;
  last_updated: string;
  products_for_url_concurrency: number | null;
  registry_file: string;
  status: number | null;
  store: string;
  unavailable_products_count: number | null;
  url: string;
  use_async: boolean;
};

export type Category = {
  budget_ordering: string | null;
  id: number;
  name: string;
  permissions: string[];
  slug: string;
  url: string;
  short_description_template: string | null;
  browse_result_template: string | null;
  detail_template: string | null;
  picture?: string;
};

export type StoreScrapingOptions = {
  categories: Category[];
  prefer_async: boolean;
  discover_urls_concurrency?: number;
  products_for_url_concurrency?: number;
};

type filter = {
  choices: {
    id: number;
    name: string;
    value: string | null;
  }[];
  continuous_range_step: string | null;
  continuous_range_unit: string | null;
  country: string | null;
  id: number;
  label: string;
  name: string;
  type: string;
};

export type CategorySpecsFormLayoutProps = {
  category: string;
  fieldsets: {
    id: number;
    label: string;
    filters: filter[];
  }[];
  id: number;
  name: string | null;
  orders: any[];
  url: string;
  website: string;
};