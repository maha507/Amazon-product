// Type definitions for Amazon API responses and tool calls

export interface ProductSearchResult {
    asin: string;
    product_title: string;
    product_price: string;
    product_original_price?: string | null;
    currency?: string;
    product_star_rating: string | null;
    product_num_ratings: number;
    product_url: string;
    product_photo: string;
    product_num_offers?: number;
    product_minimum_offer_price?: string;
    is_best_seller?: boolean;
    is_amazon_choice?: boolean;
    is_prime?: boolean;
    product_availability?: string;
    climate_pledge_friendly?: boolean;
    sales_volume?: string | null;
    delivery?: string | null;
    has_variations?: boolean;
    product_badge?: string;
}

export interface ProductDetails {
    asin: string;
    product_title: string;
    product_price: string;
    product_original_price?: string | null;
    product_star_rating: string | null;
    product_num_ratings: number;
    product_url: string;
    product_photos: string[];
    product_details?: Record<string, string>;
    about_product?: string[];
    product_description?: string;
    product_information?: Record<string, string>;
    product_dimensions?: string;
    available_quantity?: number;
    product_availability?: string;
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}

export interface ToolResult {
    tool_call_id: string;
    output: any;
}

export enum ToolName {
    SEARCH_PRODUCTS = 'search_products',
    GET_PRODUCT_DETAILS = 'get_product_details',
}

export interface SearchProductsArgs {
    query: string;
    page?: number;
    country?: string;
}

export interface GetProductDetailsArgs {
    asin: string;
    country?: string;
}