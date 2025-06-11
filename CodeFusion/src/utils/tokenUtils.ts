export function estimateTokenCount(text: string): number {
  // OpenAI tokenizes roughly 4 chars per token for English text
  // This is a rough estimation - actual tokenization is more complex
  return Math.ceil(text.length / 4);
}

export function estimateCost(tokenCount: number, _model: string): number {
  // GPT-4.1 mini pricing
  // Input: $0.40 per 1M tokens = $0.0004 per 1K tokens
  // Output: $1.60 per 1M tokens = $0.0016 per 1K tokens
  
  // For code analysis, we're mainly concerned with input tokens (the code we send)
  // The output (analysis) is typically much smaller than the input
  const inputPricePerThousand = 0.0004; // $0.40 per 1M = $0.0004 per 1K
  const outputPricePerThousand = 0.0016; // $1.60 per 1M = $0.0016 per 1K
  
  // Estimate output tokens as roughly 20% of input tokens for analysis responses
  const outputTokenEstimate = tokenCount * 0.2;
  
  const inputCost = (tokenCount / 1000) * inputPricePerThousand;
  const outputCost = (outputTokenEstimate / 1000) * outputPricePerThousand;
  
  return inputCost + outputCost;
}

// Optional: Export a more detailed cost breakdown
export function getDetailedCostEstimate(tokenCount: number): {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
} {
  const inputPricePerThousand = 0.0004;
  const outputPricePerThousand = 0.0016;
  
  // Estimate output tokens as roughly 20% of input tokens
  const outputTokens = Math.ceil(tokenCount * 0.2);
  
  const inputCost = (tokenCount / 1000) * inputPricePerThousand;
  const outputCost = (outputTokens / 1000) * outputPricePerThousand;
  
  return {
    inputTokens: tokenCount,
    outputTokens: outputTokens,
    inputCost: inputCost,
    outputCost: outputCost,
    totalCost: inputCost + outputCost
  };
}