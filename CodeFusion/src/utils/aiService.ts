import OpenAI from 'openai';

interface AIAnalysisResult {
  summary: string;
  codeQuality: {
    score: number; // 1-10
    strengths: string[];
    improvements: string[];
  };
  architecture: {
    patterns: string[];
    suggestions: string[];
  };
  security: {
    issues: string[];
    recommendations: string[];
  };
  performance: {
    bottlenecks: string[];
    optimizations: string[];
  };
  bestPractices: {
    following: string[];
    violations: string[];
  };
  technologies: string[];
  complexity: 'low' | 'medium' | 'high';
  maintainability: number; // 1-10
}

class AIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize with user's API key when provided
  }

  initializeWithApiKey(apiKey: string) {
    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.openai !== null;
  }

  async analyzeCode(codeContent: string, fileStructure?: string): Promise<AIAnalysisResult> {
    if (!this.isReady()) {
      throw new Error('AI service not initialized. Please provide your OpenAI API key.');
    }

    const prompt = this.buildAnalysisPrompt(codeContent, fileStructure);

    try {
      const response = await this.openai!.chat.completions.create({
        model: "gpt-4", // Use GPT-4 for better code analysis
        messages: [
          {
            role: "system",
            content: `You are an expert code reviewer and software architect. Analyze the provided code and return a detailed JSON analysis following the specified format. Focus on code quality, architecture, security, performance, and best practices.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent analysis
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error('No analysis received from AI');
      }

      return JSON.parse(analysisText) as AIAnalysisResult;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw error;
    }
  }

  private buildAnalysisPrompt(codeContent: string, fileStructure?: string): string {
    return `
Please analyze this code and provide a comprehensive assessment in JSON format:

${fileStructure ? `FILE STRUCTURE:\n${fileStructure}\n\n` : ''}

CODE TO ANALYZE:
\`\`\`
${codeContent.substring(0, 8000)} ${codeContent.length > 8000 ? '... (truncated)' : ''}
\`\`\`

Return your analysis as a JSON object with this exact structure:
{
  "summary": "Brief overview of the codebase and its purpose",
  "codeQuality": {
    "score": number (1-10),
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"]
  },
  "architecture": {
    "patterns": ["pattern1", "pattern2"],
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "security": {
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
  },
  "performance": {
    "bottlenecks": ["bottleneck1", "bottleneck2"],
    "optimizations": ["opt1", "opt2"]
  },
  "bestPractices": {
    "following": ["practice1", "practice2"],
    "violations": ["violation1", "violation2"]
  },
  "technologies": ["tech1", "tech2"],
  "complexity": "low|medium|high",
  "maintainability": number (1-10)
}

Focus on:
- Code organization and structure
- Performance implications
- Security vulnerabilities
- Best practices adherence
- Technology stack identification
- Architectural patterns
- Maintainability factors
`;
  }

  async generateSuggestions(codeSnippet: string, context?: string): Promise<string[]> {
    if (!this.isReady()) {
      throw new Error('AI service not initialized');
    }

    const prompt = `
Given this code snippet${context ? ` in the context of: ${context}` : ''}:

\`\`\`
${codeSnippet}
\`\`\`

Provide 3-5 specific, actionable suggestions for improvement. Return as JSON array of strings:
{"suggestions": ["suggestion1", "suggestion2", ...]}
`;

    try {
      const response = await this.openai!.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a code optimization expert. Provide specific, actionable suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
export type { AIAnalysisResult };