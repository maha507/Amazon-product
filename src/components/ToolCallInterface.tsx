'use client';

import { useState, useEffect } from 'react';
import { useToolCall } from '@/hooks/useToolCall';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetails';
import { ProductSearchResult, ProductDetails } from '@/lib/types';

export default function ToolCallInterface() {
    const [input, setInput] = useState('');
    const [products, setProducts] = useState<ProductSearchResult[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { executeToolCall, loading, error } = useToolCall();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setShowResults(false);
        try {
            const result = await executeToolCall(input);

            if (result.output && !result.output.error) {
                if (Array.isArray(result.output)) {
                    setProducts(result.output);
                    setTimeout(() => setShowResults(true), 100);
                } else if (result.output.asin) {
                    setSelectedProduct(result.output);
                }
            }
        } catch (err) {
            console.error('Tool call failed:', err);
        }
    };

    const handleViewDetails = async (asin: string) => {
        try {
            const result = await executeToolCall(`details ${asin}`);
            if (result.output && !result.output.error) {
                setSelectedProduct(result.output);
            }
        } catch (err) {
            console.error('Failed to fetch product details:', err);
        }
    };

    // Popular searches
    const popularSearches = [
        "iPhone under 80000",
        "Samsung Galaxy S24",
        "Laptops under 50000",
        "Realme phones",
        "Wireless earbuds"
    ];

    return (
        <>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-out;
                }

                .slide-in {
                    animation: slideIn 0.3s ease-out;
                }

                .pulse {
                    animation: pulse 2s infinite;
                }

                .shimmer {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }

                .bounce {
                    animation: bounce 1s infinite;
                }

                .gradient-bg {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .search-input:focus {
                    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
                }

                .card-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card-hover:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }
            `}</style>

            <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)' }}>
                {/* Animated Header */}
                <div className="gradient-bg" style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    padding: '1.5rem 1rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h1 className="fade-in" style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px'
                            }}>
                                ShopAI ✨
                            </h1>
                            <span style={{
                                background: 'rgba(251, 191, 36, 0.2)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                border: '1px solid rgba(251, 191, 36, 0.3)'
                            }}>
                                Powered by AI
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="fade-in" style={{
                            display: 'flex',
                            gap: '0.5rem',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        setIsTyping(true);
                                        setTimeout(() => setIsTyping(false), 1000);
                                    }}
                                    placeholder='Try "iPhone under 80000" or "Latest Samsung phones"'
                                    disabled={loading}
                                    className="search-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        paddingLeft: '3rem',
                                        borderRadius: '50px',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        color: '#111827',
                                        background: 'white',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '1.25rem'
                                }}>
                                    🔍
                                </span>
                                {isTyping && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9ca3af'
                                    }}>
                                        ✨
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={loading ? '' : 'pulse'}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                    color: loading ? 'white' : '#111827',
                                    fontWeight: '600',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: loading ? 'none' : '0 4px 15px rgba(251, 191, 36, 0.4)',
                                    minWidth: '120px'
                                }}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="bounce">⏳</span>
                                        Searching
                                    </span>
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Animated Categories */}
                <div style={{
                    background: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '1rem 0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                            {['🎯 All', '📱 Electronics', '📞 Phones', '💻 Laptops', '🎧 Audio', '⌚ Accessories'].map((category, index) => (
                                <button
                                    key={category}
                                    className="slide-in"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s',
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
                    {error && (
                        <div className="fade-in" style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                            border: '1px solid #fecaca',
                            borderRadius: '12px',
                            color: '#b91c1c',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="shimmer" style={{
                                    height: '300px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                    backgroundSize: '1000px 100%',
                                }}></div>
                            ))}
                        </div>
                    )}

                    {!loading && products.length > 0 ? (
                        <>
                            <div className="fade-in" style={{
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <p style={{ color: '#374151', fontSize: '1.1rem' }}>
                                    Found <strong style={{ color: '#f59e0b' }}>{products.length}</strong> amazing products
                                </p>
                                <button style={{
                                    padding: '0.5rem 1rem',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    🎯 Filter & Sort
                                </button>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {products.map((product, index) => (
                                    <div
                                        key={product.asin}
                                        className="card-hover fade-in"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <ProductCard
                                            product={product}
                                            onViewDetails={handleViewDetails}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : !loading && (
                        <div className="fade-in" style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <div className="bounce" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                🛍️
                            </div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#111827',
                                marginBottom: '0.5rem'
                            }}>
                                Discover Amazing Products
                            </h3>
                            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                                Search for products with price filters like "iPhone under ₹80,000"
                            </p>

                            {/* Popular Searches */}
                            <div style={{ marginTop: '2rem' }}>
                                <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                    POPULAR SEARCHES
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                    {popularSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInput(search)}
                                            className="slide-in"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.3s',
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7, #fed7aa)';
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb, #f3f4f6)';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            {search} →
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedProduct && (
                        <ProductDetailsModal
                            details={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}