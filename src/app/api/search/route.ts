import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.RAPIDAPI_KEY || '3546ecdacbmshb9e21e9776a227cp1ba013jsn3b0419e61763';
const API_HOST = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, page = 1, country = 'US' } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const response = await axios.get(
            `https://${API_HOST}/search`,
            {
                params: { query, page, country },
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST,
                },
            }
        );

        return NextResponse.json({ data: response.data.data?.products || [] });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to search products' },
            { status: 500 }
        );
    }
}