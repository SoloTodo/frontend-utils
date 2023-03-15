import { endpoint } from "../endpoint";

export const apiSettings = {
  endpoint,
  apiResourceEndpoints: {
    stores: endpoint + "stores/",
    languages: endpoint + "languages/",
    store_types: endpoint + "store_types/",
    number_formats: endpoint + "number_formats/",
    currencies: endpoint + "currencies/",
    countries: endpoint + "countries/",
    categories: endpoint + "categories/",
    bundles: endpoint + "bundles/",
    store_update_logs: endpoint + "store_update_logs/",
    entities: endpoint + "entities/",
    entity_histories: endpoint + "entity_histories/",
    entity_section_positions: endpoint + "entity_section_positions/",
    users: endpoint + "users/",
    users_with_staff_actions: endpoint + "users/with_staff_actions/",
    products: endpoint + "products/",
    category_templates: endpoint + "category_templates/",
    leads: endpoint + "leads/",
    visits: endpoint + "visits/",
    reports: endpoint + "reports/",
    websites: endpoint + "websites/",
    category_specs_form_layouts: endpoint + "category_specs_form_layouts/",
    wtb_brands: endpoint + "wtb/brands/",
    wtb_brand_update_logs: endpoint + "wtb/brand_update_logs/",
    wtb_entities: endpoint + "wtb/entities/",
    microsite_brands: endpoint + "microsite/brands/",
    microsite_entries: endpoint + "microsite/entries/",
    category_columns: endpoint + "category_columns/",
    budgets: endpoint + "budgets/",
    ratings: endpoint + "ratings/",
    alerts: endpoint + "alerts/",
    banners: endpoint + "banners/",
    banner_assets: endpoint + "banner_assets/",
    banner_updates: endpoint + "banner_updates/",
    banner_sections: endpoint + "banner_sections/",
    banner_subsection_types: endpoint + "banner_subsection_types/",
    brands: endpoint + "brands/",
    anonymous_alerts: endpoint + "anonymous_alerts/",
    user_alerts: endpoint + "user_alerts/",
    product_lists: endpoint + "product_lists/",
    brand_comparisons: endpoint + "brand_comparisons/",
    brand_comparisons_alerts: endpoint + "brand_comparison_alerts/",
    brand_comparisons_segments: endpoint + "brand_comparison_segments/",
    keyword_searches: endpoint + "keyword_searches/",
    keyword_search_updates: endpoint + "keyword_search_updates/",
    keyword_search_entity_positions:
      endpoint + "keyword_search_entity_positions/",
    metamodel_meta_models: endpoint + "metamodels/meta_models/",
    metamodel_meta_fields: endpoint + "metamodels/meta_fields/",
    metamodel_instance_models: endpoint + "metamodels/instance_models/",
  },
  ownUserUrl: endpoint + "users/me/",
  linioStoreId: 76,
  linioAffiliateId: 2900,
  abcdinStoreId: 30,
  parisStoreId: 11,
  ripleyStoreId: 18,
  mercadoRipleyStoreId: 222,
  falabellaStoreId: 9,
  sodimacStoreId: 67,
  laPolarStoreId: 5,
  hitesStoreId: 87,
  lenovoChileStoreId: 199,
  hpOnlineStoreId: 27,
  huaweiShopStoreId: 281,
  tottusStoreId: 170,
  entelStoreId: 38,
  tiendaEntelStoreId: 181,
  womStoreId: 85,
  tiendaClaroStoreId: 176,
  reuseStoreId: 2471,
  fensaStoreId: 4616,
  tiendaOficialLgId: 3032,
  easyId: 88,
  cellPhoneCategoryId: 6,
  technicalSpecificationsPurposeId: 1,
  categoryBrowseResultPurposeUrl: endpoint + "category_template_purposes/3/",
  shortDescriptionPurposeUrl: endpoint + "category_template_purposes/2/",
  detailPurposeUrl: endpoint + "category_template_purposes/1/",
  usdCurrencyId: 4,
  clpCurrencyId: 1,
  mobileNetworkOperatorId: 3,
  backendUrl: "https://backend.solotodo.com/",
  solotodoUrl: "https://www.solotodo.cl/",
};
