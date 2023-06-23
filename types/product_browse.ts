

export type ProductBrowseDetail = {
    name: string,
    name_analyzed: string,
    brand_id: number,
    brand_name: string,
    instance_model_id: number,
    creation_date: string,
    last_updated: string,
    keywords: string,
    id: number,
    url: string,
    category: string,
    slug: string,
    picture_url: string
    specs: Record<string, string | number | string[]>
}

export type ProductBrowseResultEntry = {
    product: ProductBrowseDetail,
    metadata: {
        score: number,
        normal_price_usd: string,
        offer_price_usd: string,
        prices_per_currency: {
            currency: string,
            normal_price: string,
            offer_price: string
        }[]
    }
}

export type ProductBrowseResult = {
    bucket: string,
    product_entries: ProductBrowseResultEntry[]
}

export type ProductBrowseResults = {
    count: number,
    results: ProductBrowseResult[],
    price_ranges: {
        normal_price_usd: {
            min: number,
            max: number,
            ['80th']: number,
            avg: number
        },
        offer_price_usd: {
            min: number,
            max: number,
            ['80th']: number,
            avg: number
        },
        aggs: Record<string, {id: number, doc_count: number}[]>
    }
}