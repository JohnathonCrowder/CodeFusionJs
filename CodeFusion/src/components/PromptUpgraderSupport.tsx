import { estimateTokenCount, estimateCost } from '../utils/tokenUtils';
import { Prompt } from 'PromptLibrary';

export interface PromptAnalysis {
  clarity: number; // 1-10
  specificity: number; // 1-10
  effectiveness: number; // 1-10
  creativity: number; // 1-10
  structure: number; // 1-10
  coherence: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  estimatedPerformance: 'poor' | 'fair' | 'good' | 'excellent';
  complexity: 'low' | 'medium' | 'high' | 'very-high';
  readability: number; // 1-10
  tokenCount: number;
  estimatedCost: number;
  languageQuality: number; // 1-10
  contextualRichness: number; // 1-10
}

export interface UpgradeParameters {
  // Primary purpose
  purpose: 'code_generation' | 'analysis' | 'documentation' | 'debugging' | 
           'creative' | 'general' | 'testing' | 'refactoring' | 'optimization' | 
           'explanation' | 'translation' | 'research' | 'planning' | 'review';
  
  // Communication style
  tone: 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative' | 
        'conversational' | 'formal' | 'encouraging' | 'direct' | 'diplomatic';
  
  // Detail and depth
  detail_level: 'concise' | 'detailed' | 'comprehensive' | 'minimal' | 'exhaustive';
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'mixed';
  depth: 'surface' | 'moderate' | 'deep' | 'comprehensive';
  
  // Target audience
  target_audience: 'beginner' | 'intermediate' | 'expert' | 'mixed' | 'students' | 
                  'professionals' | 'researchers' | 'general_public';
  
  // Output format and structure
  output_format: 'structured' | 'conversational' | 'bullet_points' | 'step_by_step' | 
                'narrative' | 'qa_format' | 'outline' | 'code_blocks' | 'mixed';
  response_style: 'direct' | 'explanatory' | 'interactive' | 'tutorial' | 'reference';
  
  // Enhancement options
  include_examples: boolean;
  include_constraints: boolean;
  include_context: boolean;
  include_alternatives: boolean;
  include_reasoning: boolean;
  include_troubleshooting: boolean;
  include_best_practices: boolean;
  include_warnings: boolean;
  include_resources: boolean;
  include_validation: boolean;
  
  // Quality improvements
  improve_clarity: boolean;
  enhance_specificity: boolean;
  boost_creativity: boolean;
  strengthen_structure: boolean;
  add_error_handling: boolean;
  improve_flow: boolean;
  enhance_readability: boolean;
  add_edge_cases: boolean;
  improve_coherence: boolean;
  add_context_awareness: boolean;
  enable_markdown: boolean;
  
  // Advanced features
  add_chain_of_thought: boolean;
  include_self_reflection: boolean;
  add_multi_perspective: boolean;
  include_verification_steps: boolean;
  add_iterative_refinement: boolean;
  include_fallback_strategies: boolean;
  
  // Language and style
  language_style: 'natural' | 'technical' | 'academic' | 'business' | 'creative';
  vocabulary_level: 'simple' | 'moderate' | 'advanced' | 'specialized';
  
  // Domain-specific enhancements
  domain: 'general' | 'software_development' | 'data_science' | 'web_development' | 
          'mobile_development' | 'devops' | 'ai_ml' | 'cybersecurity' | 'design' | 
          'business' | 'education' | 'research' | 'healthcare' | 'finance';
  
  // Customization
  custom_instructions: string;
  priority_focus: string[];
  avoid_patterns: string[];
}

export interface UpgradeHistory {
  id: string;
  originalPrompt: string;
  upgradedPrompt: string;
  parameters: UpgradeParameters;
  analysis: PromptAnalysis | null;
  timestamp: Date;
  rating?: number;
  notes?: string;
}

export interface PromptVersion {
  id: string;
  content: string;
  parameters: UpgradeParameters;
  analysis: PromptAnalysis | null;
  timestamp: Date;
  isActive: boolean;
}

export const CATEGORIES = [
  'Code Generation', 'Code Review', 'Documentation', 'Debugging', 'Testing',
  'Refactoring', 'Architecture', 'Database', 'API Design', 'Security',
  'Performance', 'DevOps', 'General', 'Creative', 'Analysis', 'Translation',
  'Research', 'Planning', 'Education', 'Business', 'Other'
];

export const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'HTML', 'CSS', 'SQL', 'Shell', 'General'
];

export const UPGRADE_TEMPLATES = {
  'Code Generation': {
    purpose: 'code_generation',
    tone: 'technical',
    detail_level: 'detailed',
    include_examples: true,
    include_constraints: true,
    include_best_practices: true,
    add_error_handling: true,
    domain: 'software_development',
    enable_markdown: false 
  },
  'Code Review': {
    purpose: 'review',
    tone: 'professional',
    detail_level: 'comprehensive',
    include_reasoning: true,
    include_best_practices: true,
    include_alternatives: true,
    add_multi_perspective: true,
    enable_markdown: false 
  },
  'Documentation': {
    purpose: 'documentation',
    tone: 'professional',
    detail_level: 'comprehensive',
    include_examples: true,
    include_context: true,
    enhance_readability: true,
    improve_structure: true,
    enable_markdown: false 
  },
  'Creative Writing': {
    purpose: 'creative',
    tone: 'creative',
    boost_creativity: true,
    add_multi_perspective: true,
    include_alternatives: true,
    language_style: 'creative',
    enable_markdown: false 
  },
  'Debugging': {
    purpose: 'debugging',
    tone: 'technical',
    include_troubleshooting: true,
    add_error_handling: true,
    include_validation: true,
    add_chain_of_thought: true,
    enable_markdown: false 
  }
} as const;

export const PRIORITY_FOCUSES = [
  'Accuracy', 'Clarity', 'Completeness', 'Creativity', 'Efficiency', 
  'Error Handling', 'Examples', 'Explanation', 'Flexibility', 'Performance',
  'Readability', 'Reliability', 'Scalability', 'Security', 'Usability'
];

// Auto-detect prompt parameters
export const detectPromptParameters = (prompt: Prompt): Partial<UpgradeParameters> => {
  const content = prompt.content.toLowerCase();
  const category = prompt.category.toLowerCase();
  
  let detectedParams: Partial<UpgradeParameters> = {};

  // Detect purpose based on content keywords
  if (content.includes('generate code') || content.includes('write code') || category.includes('generation')) {
    detectedParams.purpose = 'code_generation';
    detectedParams.include_examples = true;
    detectedParams.add_error_handling = true;
  } else if (content.includes('debug') || content.includes('fix') || category.includes('debug')) {
    detectedParams.purpose = 'debugging';
    detectedParams.include_troubleshooting = true;
    detectedParams.add_chain_of_thought = true;
  } else if (content.includes('review') || content.includes('analyze') || category.includes('review')) {
    detectedParams.purpose = 'analysis';
    detectedParams.include_reasoning = true;
    detectedParams.add_multi_perspective = true;
  } else if (content.includes('document') || content.includes('explain') || category.includes('document')) {
    detectedParams.purpose = 'documentation';
    detectedParams.enhance_readability = true;
    detectedParams.include_examples = true;
  }

  // Detect complexity level
  if (content.includes('beginner') || content.includes('basic') || content.includes('simple')) {
    detectedParams.complexity_level = 'beginner';
    detectedParams.vocabulary_level = 'simple';
  } else if (content.includes('advanced') || content.includes('expert') || content.includes('complex')) {
    detectedParams.complexity_level = 'advanced';
    detectedParams.vocabulary_level = 'advanced';
  }

  // Detect domain
  if (prompt.language && prompt.language !== 'General') {
    detectedParams.domain = 'software_development';
  }

  return detectedParams;
};

// Enhanced prompt building functions
export const buildEnhancedAnalysisPrompt = (prompt: string): string => {
  return `
Analyze this AI prompt comprehensively and provide detailed metrics:

PROMPT TO ANALYZE:
"${prompt}"

Please provide a detailed analysis in JSON format with the following structure:
{
  "clarity": number (1-10),
  "specificity": number (1-10), 
  "effectiveness": number (1-10),
  "creativity": number (1-10),
  "structure": number (1-10),
  "coherence": number (1-10),
  "readability": number (1-10),
  "languageQuality": number (1-10),
  "contextualRichness": number (1-10),
  "tokenCount": number,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "estimatedPerformance": "poor|fair|good|excellent",
  "complexity": "low|medium|high|very-high"
}

Focus on:
- How clear and unambiguous the prompt is
- How specific and detailed the instructions are
- Creative potential and flexibility
- Structural organization and flow
- Language quality and readability
- Context richness and completeness
- Potential for generating high-quality outputs
- Areas for improvement with specific recommendations
`;
};

export const buildEnhancedUpgradePrompt = (
  originalPrompt: string, 
  analysis: PromptAnalysis, 
  params: UpgradeParameters
): string => {
  const enhancements = [];
  
  // Build dynamic enhancement instructions
  if (params.include_examples) enhancements.push("Include relevant examples");
  if (params.include_constraints) enhancements.push("Add clear constraints and limitations");
  if (params.include_context) enhancements.push("Provide rich contextual information");
  if (params.include_alternatives) enhancements.push("Suggest alternative approaches");
  if (params.include_reasoning) enhancements.push("Include reasoning and explanation steps");
  if (params.include_troubleshooting) enhancements.push("Add troubleshooting guidance");
  if (params.include_best_practices) enhancements.push("Incorporate industry best practices");
  if (params.include_warnings) enhancements.push("Include relevant warnings and cautions");
  if (params.add_chain_of_thought) enhancements.push("Add chain-of-thought reasoning");
  if (params.add_multi_perspective) enhancements.push("Include multiple perspectives");
  if (params.include_verification_steps) enhancements.push("Add verification and validation steps");

  const qualityImprovements = [];
  if (params.improve_clarity) qualityImprovements.push("Significantly improve clarity and precision");
  if (params.enhance_specificity) qualityImprovements.push("Make instructions more specific and actionable");
  if (params.boost_creativity) qualityImprovements.push("Enhance creative potential");
  if (params.strengthen_structure) qualityImprovements.push("Improve logical structure and flow");
  if (params.enhance_readability) qualityImprovements.push("Enhance readability and comprehension");
  if (params.improve_coherence) qualityImprovements.push("Improve overall coherence");

  // Add markdown formatting instructions
  const markdownInstructions = params.enable_markdown
    ? `
MARKDOWN FORMATTING:
- Use proper markdown syntax for formatting (headers, lists, code blocks, emphasis)
- Structure the prompt with clear sections using headers (##, ###)
- Use bullet points and numbered lists where appropriate
- Format code examples with proper code blocks (\`\`\`)
- Use emphasis (*italics*, **bold**) for important points
- Include horizontal rules (---) to separate major sections
`
    : `
FORMATTING INSTRUCTIONS:
- Use plain text formatting only
- Do NOT use any markdown syntax (no #, *, \`, ---, etc.)
- Structure content with clear line breaks and spacing
- Use simple text formatting and indentation
- Avoid special characters for formatting
`;

  return `
You are an expert prompt engineer with deep expertise in AI interaction design. Your task is to significantly upgrade this prompt to make it more effective, comprehensive, and powerful.

ORIGINAL PROMPT:
"${originalPrompt}"

CURRENT ANALYSIS:
- Clarity: ${analysis.clarity}/10
- Specificity: ${analysis.specificity}/10  
- Effectiveness: ${analysis.effectiveness}/10
- Structure: ${analysis.structure}/10

IDENTIFIED ISSUES:
${analysis.weaknesses.map(w => `• ${w}`).join('\n')}

UPGRADE SPECIFICATIONS:
- Purpose: ${params.purpose.replace(/_/g, ' ')}
- Target Audience: ${params.target_audience}
- Complexity Level: ${params.complexity_level}
- Tone: ${params.tone}
- Detail Level: ${params.detail_level}
- Output Format: ${params.output_format.replace(/_/g, ' ')}
- Response Style: ${params.response_style}
- Domain: ${params.domain.replace(/_/g, ' ')}
- Language Style: ${params.language_style}
- Vocabulary Level: ${params.vocabulary_level}

ENHANCEMENTS TO INCLUDE:
${enhancements.map(e => `• ${e}`).join('\n')}

QUALITY IMPROVEMENTS:
${qualityImprovements.map(q => `• ${q}`).join('\n')}

${markdownInstructions}

${params.priority_focus.length > 0 ? `PRIORITY FOCUS AREAS:\n${params.priority_focus.map(f => `• ${f}`).join('\n')}` : ''}

${params.avoid_patterns.length > 0 ? `PATTERNS TO AVOID:\n${params.avoid_patterns.map(p => `• ${p}`).join('\n')}` : ''}

${params.custom_instructions ? `CUSTOM INSTRUCTIONS:\n${params.custom_instructions}` : ''}

INSTRUCTIONS:
1. Completely rewrite the original prompt to address all identified weaknesses
2. Implement ALL specified enhancements and quality improvements
3. Follow the upgrade specifications precisely
4. Make the prompt significantly more powerful and effective
5. Ensure the upgraded prompt is well-structured, comprehensive, and actionable
6. Maintain the original intent while dramatically improving effectiveness
7. ${params.enable_markdown ? 'Use proper markdown formatting throughout' : 'Use plain text formatting only - NO markdown syntax'}
8. Include clear instructions for the AI on how to respond

Please provide ONLY the upgraded prompt text, with no additional commentary or explanation.
`;
};

// Enhanced response parsing
export const parseEnhancedAnalysisResponse = (response: any): PromptAnalysis => {
  try {
    if (response.summary) {
      return {
        clarity: response.codeQuality?.clarity || 7,
        specificity: response.codeQuality?.specificity || 6,
        effectiveness: response.codeQuality?.effectiveness || 7,
        creativity: 6,
        structure: 7,
        coherence: 7,
        readability: 7,
        languageQuality: 7,
        contextualRichness: 6,
        tokenCount: estimateTokenCount(response.summary),
        estimatedCost: 0,
        strengths: response.codeQuality?.strengths || ['Well-structured prompt'],
        weaknesses: response.codeQuality?.improvements || ['Could be more specific'],
        suggestions: response.performance?.optimizations || ['Add more context', 'Specify output format'],
        estimatedPerformance: 'good',
        complexity: 'medium'
      };
    }
    
    return response as PromptAnalysis;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return {
      clarity: 6, specificity: 6, effectiveness: 6, creativity: 5,
      structure: 6, coherence: 6, readability: 6, languageQuality: 6,
      contextualRichness: 5, tokenCount: 0, estimatedCost: 0,
      strengths: ['Basic prompt structure'],
      weaknesses: ['Needs improvement'],
      suggestions: ['Add more specific instructions'],
      estimatedPerformance: 'fair',
      complexity: 'medium'
    };
  }
};

// Utility functions
export const getScoreColor = (score: number, darkMode: boolean) => {
  if (score >= 8) return darkMode ? 'text-green-400' : 'text-green-600';
  if (score >= 6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
  return darkMode ? 'text-red-400' : 'text-red-600';
};

export const getPerformanceColor = (performance: string, darkMode: boolean) => {
  switch (performance) {
    case 'excellent': return darkMode ? 'text-green-400' : 'text-green-600';
    case 'good': return darkMode ? 'text-blue-400' : 'text-blue-600';
    case 'fair': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    case 'poor': return darkMode ? 'text-red-400' : 'text-red-600';
    default: return darkMode ? 'text-gray-400' : 'text-gray-600';
  }
};