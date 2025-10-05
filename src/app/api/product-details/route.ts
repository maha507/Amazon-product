import { NextRequest, NextResponse } from 'next/server';
import { getProductDetails } from '@/lib/amazon-api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { asin, country = 'US' } = body;

        if (!asin) {
            return NextResponse.json(
                { error: 'ASIN is required' },
                { status: 400 }
            );
        }

        const details = await getProductDetails(asin, country);

        return NextResponse.json({ data: details });
    } catch (error) {
        console.error('Product details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}