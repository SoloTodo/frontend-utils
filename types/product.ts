import {User} from "./user";

export type Product = {
    id: number;
    name: string;
    url: string;
    permissions: string[];
    brand: string;
    category: string;
    creation_date: string;
    creator?: User;
    instance_model_id: number;
    keywords: string;
    last_updated: string;
    part_number: string;
    picture_url: string;
    slug: string;
    specs: Record<string, string | number | string[]>;
    description: string | null;
    meta_tag_description: string | null
};

export type Website = {
    external_url: string;
    id: number;
    name: string;
    permissions: string[];
    url: string;
};
