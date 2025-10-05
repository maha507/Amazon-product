import { z } from 'zod';
import { searchProducts, getProductDetails } from './amazon-api';
import { ToolName, ToolCall, ToolResult } from './types';

// Define tool schemas using Zod for validation
const searchProductsSchema = z.object({
    query: z.string().min(1, 'Query is required'),
    page: z.number().optional().default(1),
    country: z.string().optional().default('US'),
});

const getProductDetailsSchema = z.object({
    asin: z.string().min(1, 'ASIN is required'),
    country: z.string().optional().default('US'),
});

// Tool definitions
export const tools = [
    {
        type: 'function',
        function: {
            name: ToolName.SEARCH_PRODUCTS,
            description: 'Search for products on Amazon',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The search query for products',
                    },
                    page: {
                        type: 'number',
                        description: 'Page number for pagination (default: 1)',
                    },
                    country: {
                        type: 'string',
                        description: 'Country code (default: US)',
                    },
                },
                required: ['query'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: ToolName.GET_PRODUCT_DETAILS,
            description: 'Get detailed information about a specific product',
            parameters: {
                type: 'object',
                properties: {
                    asin: {
                        type: 'string',
                        description: 'Amazon Standard Identification Number',
                    },
                    country: {
                        type: 'string',
                        description: 'Country code (default: US)',
                    },
                },
                required: ['asin'],
            },
        },
    },
];

// Tool executor
export async function executeTool(toolCall: ToolCall): Promise<ToolResult> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    try {
        let output;

        switch (name) {
            case ToolName.SEARCH_PRODUCTS: {
                const validatedArgs = searchProductsSchema.parse(parsedArgs);
                output = await searchProducts(
                    validatedArgs.query,
                    validatedArgs.page,
                    validatedArgs.country
                );
                break;
            }

            case ToolName.GET_PRODUCT_DETAILS: {
                const validatedArgs = getProductDetailsSchema.parse(parsedArgs);
                output = await getProductDetails(
                    validatedArgs.asin,
                    validatedArgs.country
                );
                break;
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }

        return {
            tool_call_id: toolCall.id,
            output,
        };
    } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
            tool_call_id: toolCall.id,
            output: {
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
        };
    }
}

// Parse natural language to tool calls
export function parseUserIntent(userInput: string): ToolCall | null {
    const input = userInput.toLowerCase();

    // Check for product details intent
    const asinMatch = input.match(/\b([A-Z0-9]{10})\b/);
    if (asinMatch || input.includes('details') || input.includes('more about')) {
        return {
            id: `call_${Date.now()}`,
            type: 'function',
            function: {
                name: ToolName.GET_PRODUCT_DETAILS,
                arguments: JSON.stringify({
                    asin: asinMatch ? asinMatch[1] : '',
                    country: 'US',
                }),
            },
        };
    }

    // Default to search
    if (input.trim()) {
        return {
            id: `call_${Date.now()}`,
            type: 'function',
            function: {
                name: ToolName.SEARCH_PRODUCTS,
                arguments: JSON.stringify({
                    query: userInput,
                    page: 1,
                    country: 'US',
                }),
            },
        };
    }

    return null;
}