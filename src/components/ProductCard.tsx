'use client';

import { ProductSearchResult } from '@/lib/types';

interface ProductCardProps {
    product: ProductSearchResult;
    onViewDetails: (asin: string) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
             }}
        >
            <div style={{
                aspectRatio: '1',
                backgroundColor: '#f9fafb',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img
                    src={product.product_photo || 'https://via.placeholder.com/200'}
                    alt={product.product_title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxHeight: '150px'
                    }}
                />
            </div>

            <div style={{ padding: '1rem' }}>
                <h3 style={{
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.5rem'
                }}>
                    {product.product_title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#fbbf24' }}>★★★★★</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {product.product_star_rating} ({product.product_num_ratings})
                    </span>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                        {product.product_price}
                    </div>
                    {product.product_original_price && (
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'line-through' }}>
                            {product.product_original_price}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => onViewDetails(product.asin)}
                    style={{
                        width: '100%',
                        backgroundColor: '#fbbf24',
                        color: '#111827',
                        fontWeight: '500',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f59e0b';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fbbf24';
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}