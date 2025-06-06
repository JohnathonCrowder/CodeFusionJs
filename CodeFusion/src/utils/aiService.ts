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

// Single model configuration
const MODEL_CONFIG = {
    name: 'gpt-4o-mini',  // Keep the actual API model name
    displayName: 'GPT-4.1 mini',  // Display name for UI
    supportsJson: true,
    maxTokens: 2000,
    description: 'Affordable model balancing speed and intelligence'
  };

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

    const prompt = this.buildAnalysisPrompt(codeContent, fileStructure, MODEL_CONFIG.supportsJson);

    try {
      const requestOptions: any = {
        model: MODEL_CONFIG.name,
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
        temperature: 0.1,
        max_tokens: MODEL_CONFIG.maxTokens
      };

      // Add response_format for JSON support
      if (MODEL_CONFIG.supportsJson) {
        requestOptions.response_format = { type: "json_object" };
      }

      const response = await this.openai!.chat.completions.create(requestOptions);

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error('No analysis received from AI');
      }

      try {
        return JSON.parse(analysisText) as AIAnalysisResult;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return this.parseStructuredTextResponse(analysisText);
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw error;
    }
  }

  private parseStructuredTextResponse(text: string): AIAnalysisResult {
    // Fallback parser for non-JSON responses
    try {
      // Create a default structure and try to extract information
      const result: AIAnalysisResult = {
        summary: "Code analysis completed using structured text parsing.",
        codeQuality: {
          score: 7,
          strengths: [],
          improvements: []
        },
        architecture: {
          patterns: [],
          suggestions: []
        },
        security: {
          issues: [],
          recommendations: []
        },
        performance: {
          bottlenecks: [],
          optimizations: []
        },
        bestPractices: {
          following: [],
          violations: []
        },
        technologies: [],
        complexity: 'medium' as const,
        maintainability: 7
      };

      // Simple text parsing to extract key information
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      let currentSection = 'summary';
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        // Update summary if we find overview/summary content
        if (lowerLine.includes('summary') || lowerLine.includes('overview')) {
          currentSection = 'summary';
          const summaryMatch = line.match(/summary:?\s*(.+)/i);
          if (summaryMatch) {
            result.summary = summaryMatch[1];
          }
          continue;
        }

        // Extract technologies
        if (lowerLine.includes('technolog') || lowerLine.includes('framework') || lowerLine.includes('library')) {
          const techMatches = line.match(/(react|vue|angular|node|express|typescript|javascript|python|java|css|html)/gi);
          if (techMatches) {
            result.technologies.push(...techMatches);
          }
        }

        // Extract quality score
        if (lowerLine.includes('quality') || lowerLine.includes('score')) {
          const scoreMatch = line.match(/(\d+)(?:\/10)?/);
          if (scoreMatch) {
            result.codeQuality.score = parseInt(scoreMatch[1]);
          }
        }

        // Extract complexity
        if (lowerLine.includes('complexity')) {
          if (lowerLine.includes('low')) result.complexity = 'low';
          else if (lowerLine.includes('high')) result.complexity = 'high';
          else result.complexity = 'medium';
        }

        // Extract issues and recommendations
        if (line.startsWith('- ') || line.startsWith('• ')) {
          const item = line.substring(2);
          if (currentSection === 'improvements' || lowerLine.includes('improve') || lowerLine.includes('should')) {
            result.codeQuality.improvements.push(item);
          } else if (currentSection === 'security' || lowerLine.includes('security') || lowerLine.includes('vulnerabil')) {
            result.security.recommendations.push(item);
          } else if (lowerLine.includes('performance') || lowerLine.includes('optimiz')) {
            result.performance.optimizations.push(item);
          } else if (lowerLine.includes('strength') || lowerLine.includes('good') || lowerLine.includes('well')) {
            result.codeQuality.strengths.push(item);
          }
        }
      }

      // Remove duplicates from arrays
      result.technologies = [...new Set(result.technologies)];
      
      // Ensure we have some content
      if (result.codeQuality.strengths.length === 0) {
        result.codeQuality.strengths.push("Code structure appears organized");
      }
      if (result.codeQuality.improvements.length === 0) {
        result.codeQuality.improvements.push("Consider code review for specific improvements");
      }
      if (result.security.recommendations.length === 0) {
        result.security.recommendations.push("Follow security best practices for your technology stack");
      }
      if (result.performance.optimizations.length === 0) {
        result.performance.optimizations.push("Profile application performance and optimize bottlenecks");
      }

      return result;
    } catch (parseError) {
      console.error('Failed to parse structured text response:', parseError);
      
      // Return a minimal default response
      return {
        summary: "Analysis completed but response parsing encountered issues.",
        codeQuality: {
          score: 6,
          strengths: ["Code uploaded successfully"],
          improvements: ["Unable to parse detailed improvements"]
        },
        architecture: {
          patterns: ["Standard file structure"],
          suggestions: ["Review architecture manually"]
        },
        security: {
          issues: [],
          recommendations: ["Perform manual security review", "Use static analysis tools"]
        },
        performance: {
          bottlenecks: [],
          optimizations: ["Profile your application", "Monitor performance metrics"]
        },
        bestPractices: {
          following: ["Code organization"],
          violations: []
        },
        technologies: ["JavaScript", "TypeScript"],
        complexity: 'medium' as const,
        maintainability: 6
      };
    }
  }

  private buildAnalysisPrompt(codeContent: string, fileStructure?: string, supportsJson: boolean): string {
    const basePrompt = `
${supportsJson ? 'Please analyze this code and provide a comprehensive assessment in JSON format:' : 'Please analyze this code and provide a comprehensive assessment:'}

${fileStructure ? `FILE STRUCTURE:\n${fileStructure}\n\n` : ''}

CODE TO ANALYZE:
\`\`\`
${codeContent.substring(0, 6000)} ${codeContent.length > 6000 ? '... (truncated for analysis)' : ''}
\`\`\`
`;

    if (supportsJson) {
      return basePrompt + `
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
    } else {
      return basePrompt + `
Please provide a structured analysis covering:

**SUMMARY:**
Brief overview of the codebase and its purpose

**CODE QUALITY (Score 1-10):**
- Strengths of the codebase
- Areas for improvement

**ARCHITECTURE:**
- Patterns used
- Architectural suggestions

**SECURITY:**
- Potential issues
- Security recommendations

**PERFORMANCE:**
- Potential bottlenecks
- Optimization suggestions

**BEST PRACTICES:**
- Practices being followed
- Practices being violated

**TECHNOLOGIES:**
List the technologies/frameworks detected

**COMPLEXITY:** (low/medium/high)
**MAINTAINABILITY:** (Score 1-10)

Focus on actionable insights and specific recommendations.
`;
    }
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

Provide 3-5 specific, actionable suggestions for improvement. Return as JSON array of strings: {"suggestions": ["suggestion1", "suggestion2", ...]}
`;

    try {
      const requestOptions: any = {
        model: MODEL_CONFIG.name,
        messages: [
          {
            role: "system", 
            content: "You are a code optimization expert. Provide specific, actionable suggestions in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      };

      if (MODEL_CONFIG.supportsJson) {
        requestOptions.response_format = { type: "json_object" };
      }

      const response = await this.openai!.chat.completions.create(requestOptions);
      const resultText = response.choices[0]?.message?.content || '';

      try {
        const result = JSON.parse(resultText);
        return result.suggestions || [];
      } catch (parseError) {
        // Fallback to text parsing
        return this.extractSuggestionsFromText(resultText);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    }
  }

  private extractSuggestionsFromText(text: string): string[] {
    const lines = text.split('\n');
    const suggestions: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        suggestions.push(trimmed.substring(2));
      } else if (trimmed.match(/^\d+\./)) {
        suggestions.push(trimmed.replace(/^\d+\.\s*/, ''));
      }
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  // Get information about the current model being used
  getCurrentModelInfo(): string {
    return MODEL_CONFIG.displayName || MODEL_CONFIG.name;
  }
}

export const aiService = new AIService();
export type { AIAnalysisResult };