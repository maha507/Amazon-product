import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface SearchIntent {
    keywords: string[];
    category?: string;
    priceRange?: { min: number; max: number };
    features?: string[];
    intent: string;
}

export async function analyzeSearchQuery(query: string): Promise<SearchIntent> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this product search query and extract structured information:
Query: "${query}"

Provide a JSON response with:
- keywords: array of important search terms
- category: product category if identifiable
- priceRange: {min, max} if price mentioned
- features: array of desired features
- intent: brief description of what user is looking for

Return only valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
        return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
        return {
            keywords: [query],
            intent: query,
        };
    }
}

export async function rankProductsByRelevance(
    query: string,
    products: any[]
): Promise<any[]> {
    if (products.length === 0) return products;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const productsInfo = products.map((p, idx) => ({
        index: idx,
        title: p.product_title,
        price: p.product_price,
        rating: p.product_star_rating,
    }));

    const prompt = `Given this search query: "${query}"

Rank these products by relevance (0-100 score):
${JSON.stringify(productsInfo, null, 2)}

Return JSON array with format: [{"index": 0, "score": 95, "reason": "..."}, ...]
Return only valid JSON, no markdown.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const rankings = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

        // Sort products by AI relevance score
        const rankedProducts = rankings
            .sort((a: any, b: any) => b.score - a.score)
            .map((rank: any) => ({
                ...products[rank.index],
                relevanceScore: rank.score,
                relevanceReason: rank.reason,
            }));

        return rankedProducts;
    } catch (error) {
        console.error('Gemini ranking error:', error);
        return products;
    }
}