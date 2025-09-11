import {User} from "./user";

export type InLineProduct = {
    id: number;
    name: string;
    url: string;
};

export type Bundle = {
    id: number;
    name: string;
    url: string;
};

export type CellPlan = {
    id: number;
    name: string;
    url: string;
};

export type BestCoupon = {
    amount: string;
    amount_type: 1 | 2;
    amount_type_text: string;
    code: string;
    max_discount_amount: string | null;
}

export type Entity = {
    active_registry?: {
        id: number;
        url: string;
        normal_price: string;
        offer_price: string;
        is_available: boolean;
        cell_monthly_payment: string | null,
    };
    bundle: Bundle | null;
    category: string;
    cell_plan: CellPlan | null;
    cell_plan_name?: string;
    condition: string;
    creation_date: string;
    currency: string;
    description?: string;
    ean?: string;
    external_url: string;
    id: number;
    is_visible: boolean;
    key: string;
    last_pricing_update: string;
    last_updated: string;
    name: string;
    part_number?: string;
    picture_urls: string[] | null;
    product?: InLineProduct;
    scraped_condition: string;
    seller?: string;
    sku?: string;
    store: string;
    url: string;
    best_coupon: BestCoupon | null;
};

export type StaffInfo = {
    discovery_url: string;
    last_association: string | null;
    last_association_user: string | null;
    last_staff_access: string | null;
    last_staff_access_user: User | null;
    scraped_category: string;
};

export type EntityEvent = {
    timestamp: string;
    user: { full_name: string; id: number; url: string };
    changes: {
        field: string;
        new_value: { id: number; name: string } | null;
        old_value: { id: number; name: string } | null;
    }[];
};

export type EntitySecInfo = {
    code: string,
    sec_url: string,
    brands: string,
    models: string,
}