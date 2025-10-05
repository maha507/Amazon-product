import axios from 'axios';
import { ProductSearchResult, ProductDetails } from './types';

const API_KEY = '3546ecdacbmshb9e21e9776a227cp1ba013jsn3b0419e61763';
const API_HOST = 'real-time-amazon-data.p.rapidapi.com';

const apiClient = axios.create({
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
    },
});

export async function searchProducts(
    query: string,
    page: number = 1,
    country: string = 'IN'  // Changed to India
): Promise<ProductSearchResult[]> {
    try {
        console.log('🔍 Searching Amazon India for:', query);

        const response = await apiClient.get(
            `https://${API_HOST}/search`,
            {
                params: {
                    query: query,
                    page: page,
                    country: 'IN',  // India market
                    language: 'en_IN'  // English (India)
                },
            }
        );

        console.log('✅ Response from Amazon.in:', {
            status: response.data.status,
            domain: response.data.data?.domain,
            total_products: response.data.data?.total_products,
        });

        const products = response.data.data?.products || [];

        // Log first few products to verify
        if (products.length > 0) {
            console.log(`Found ${products.length} products from Amazon India`);
            console.log('Sample:', products[0].product_title);
        }

        return products;
    } catch (error: any) {
        console.error('Error searching Amazon India:', error.response?.data || error.message);
        throw new Error('Failed to search products');
    }
}

export async function getProductDetails(
    asin: string,
    country: string = 'IN'  // Changed to India
): Promise<ProductDetails> {
    try {
        const response = await apiClient.get(
            `https://${API_HOST}/product-details`,
            {
                params: {
                    asin: asin,
                    country: 'IN',  // India market
                },
            }
        );

        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching product details from Amazon India:', error.message);
        throw new Error('Failed to fetch product details');
    }
}