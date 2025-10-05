import { useState, useCallback } from 'react';
import { ToolCall, ToolResult } from '@/lib/types';
import { parseUserIntent, executeTool } from '@/lib/tools';

export function useToolCall() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ToolResult[]>([]);

    const executeToolCall = useCallback(async (input: string) => {
        setLoading(true);
        setError(null);

        try {
            // Parse user intent to tool call
            const toolCall = parseUserIntent(input);

            if (!toolCall) {
                throw new Error('Could not understand the request');
            }

            // Execute the tool call
            const result = await executeTool(toolCall);
            setResults(prev => [...prev, result]);

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    return {
        executeToolCall,
        loading,
        error,
        results,
        clearResults,
    };
}