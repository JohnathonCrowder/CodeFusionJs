export function estimateTokenCount(text: string): number {
    // OpenAI tokenizes roughly 4 chars per token for English text
    // This is a rough estimation - actual tokenization is more complex
    return Math.ceil(text.length / 4);
  }
  
  export function estimateCost(tokenCount: number, model: string): number {
    // Pricing in USD per 1K tokens (as of 2023)
    const pricingPerThousandTokens: { [key: string]: number } = {
      'gpt-4': 0.03,  // $0.03 per 1K tokens
      'gpt-4-turbo-preview': 0.01, // $0.01 per 1K tokens
      'gpt-3.5-turbo': 0.0015,  // $0.0015 per 1K tokens
      'gpt-4o-mini': 0.0015,  // $0.0015 per 1K tokens
    };
    
    const rate = pricingPerThousandTokens[model] || 0.03; // Default to GPT-4 pricing if unknown
    return (tokenCount / 1000) * rate;
  }