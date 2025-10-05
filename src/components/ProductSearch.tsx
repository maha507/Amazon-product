'use client';

import { useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetails';
import { ProductSearchResult, ProductDetails } from '@/lib/types';

export default function ProductSearch() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<ProductSearchResult[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/search', { query });
            setProducts(response.data.data || []);
        } catch (err) {
            setError('Failed to search products. Please try again.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (asin: string) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/product-details', { asin });
            setSelectedProduct(response.data.data);
        } catch (err) {
            setError('Failed to fetch product details.');
            console.error('Product details error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Amazon Product Search</h1>

            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-4 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="text-red-600 text-center mb-4">{error}</div>
            )}

            {products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.asin}
                            product={product}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailsModal
                    details={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}