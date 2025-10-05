'use client';

import { ProductDetails } from '@/lib/types';
import { useState } from 'react';

interface ProductDetailsProps {
    details: ProductDetails;
    onClose: () => void;
}

export default function ProductDetailsModal({ details, onClose }: ProductDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Product Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-70px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                        {/* Image Gallery */}
                        <div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <img
                                    src={details.product_photos?.[selectedImage] || details.product_photos?.[0] || 'https://via.placeholder.com/400'}
                                    alt={details.product_title}
                                    className="w-full h-96 object-contain"
                                />
                            </div>
                            {details.product_photos && details.product_photos.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {details.product_photos.slice(0, 4).map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`border-2 rounded-lg overflow-hidden ${
                                                selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`${details.product_title} ${index + 1}`}
                                                className="w-full h-20 object-contain p-1"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-2xl font-semibold mb-3">{details.product_title}</h1>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {'★★★★★'.split('').map((star, i) => (
                                        <span key={i} className={i < Math.floor(parseFloat(details.product_star_rating)) ? '' : 'opacity-30'}>
                                            {star}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600">
                                    {details.product_star_rating} ({details.product_num_ratings.toLocaleString()} ratings)
                                </span>
                            </div>

                            <div className="border-t border-b py-4 mb-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {details.product_price}
                                    </span>
                                    {details.product_original_price && (
                                        <span className="text-lg text-gray-500 line-through">
                                            {details.product_original_price}
                                        </span>
                                    )}
                                </div>
                                {details.product_availability && (
                                    <p className="mt-2 text-green-600 font-medium">
                                        {details.product_availability}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-md transition-colors">
                                    Add to Cart
                                </button>
                                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition-colors">
                                    Buy Now
                                </button>
                            </div>

                            {details.about_product && details.about_product.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Highlights</h3>
                                    <ul className="space-y-2">
                                        {details.about_product.slice(0, 5).map((point, index) => (
                                            <li key={index} className="flex gap-2 text-sm text-gray-700">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {details.product_information && Object.keys(details.product_information).length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Specifications</h3>
                                    <dl className="space-y-2">
                                        {Object.entries(details.product_information).slice(0, 6).map(([key, value]) => (
                                            <div key={key} className="flex text-sm">
                                                <dt className="font-medium text-gray-600 w-1/2">{key}:</dt>
                                                <dd className="text-gray-900 w-1/2">{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}