import { estimateTokenCount } from '../../utils/tokenUtils';
import { Prompt } from '../PromptLibrary';

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

  // List Preventer
  prevent_lists: boolean;

  
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

// Helper function to create default parameters
const createDefaultParams = (): Omit<UpgradeParameters, 'purpose' | 'tone' | 'detail_level' | 'complexity_level' | 'target_audience' | 'output_format' | 'response_style' | 'language_style' | 'vocabulary_level' | 'domain' | 'depth'> => ({
  include_examples: false,
  include_constraints: false,
  include_context: false,
  include_alternatives: false,
  include_reasoning: false,
  include_troubleshooting: false,
  include_best_practices: false,
  include_warnings: false,
  include_resources: false,
  include_validation: false,
  improve_clarity: false,
  enhance_specificity: false,
  boost_creativity: false,
  strengthen_structure: false,
  add_error_handling: false,
  improve_flow: false,
  enhance_readability: false,
  add_edge_cases: false,
  improve_coherence: false,
  add_context_awareness: false,
  enable_markdown: false,
  prevent_lists: true, // Default to TRUE to prevent lists
  add_chain_of_thought: false,
  include_self_reflection: false,
  add_multi_perspective: false,
  include_verification_steps: false,
  add_iterative_refinement: false,
  include_fallback_strategies: false,
  custom_instructions: '',
  priority_focus: [],
  avoid_patterns: []
});

export const UPGRADE_TEMPLATES: Record<string, UpgradeParameters> = {
  'Code Generation': {
    ...createDefaultParams(),
    purpose: 'code_generation',
    tone: 'technical',
    detail_level: 'detailed',
    complexity_level: 'intermediate',
    depth: 'moderate',
    target_audience: 'intermediate',
    output_format: 'code_blocks',
    response_style: 'tutorial',
    language_style: 'technical',
    vocabulary_level: 'moderate',
    domain: 'software_development',
    include_examples: true,
    include_constraints: true,
    include_best_practices: true,
    add_error_handling: true,
    improve_clarity: true,
    enhance_specificity: true,
    strengthen_structure: true,
    enhance_readability: true,
    include_validation: true,
    prevent_lists: true,
  },
  'Code Review': {
    ...createDefaultParams(),
    purpose: 'review',
    tone: 'professional',
    detail_level: 'comprehensive',
    complexity_level: 'advanced',
    depth: 'deep',
    target_audience: 'expert',
    output_format: 'structured',
    response_style: 'explanatory',
    language_style: 'technical',
    vocabulary_level: 'advanced',
    domain: 'software_development',
    include_reasoning: true,
    include_best_practices: true,
    include_alternatives: true,
    add_multi_perspective: true,
    improve_clarity: true,
    enhance_specificity: true,
    include_validation: true,
    add_edge_cases: true,
    include_warnings: true,
    prevent_lists: true,
  },
  'Documentation': {
    ...createDefaultParams(),
    purpose: 'documentation',
    tone: 'professional',
    detail_level: 'comprehensive',
    complexity_level: 'intermediate',
    depth: 'moderate',
    target_audience: 'mixed',
    output_format: 'structured',
    response_style: 'tutorial',
    language_style: 'natural',
    vocabulary_level: 'moderate',
    domain: 'general',
    include_examples: true,
    include_context: true,
    enhance_readability: true,
    strengthen_structure: true,
    improve_clarity: true,
    enhance_specificity: true,
    improve_flow: true,
    enable_markdown: true,
    prevent_lists: true,
  },
  'Creative Writing': {
    ...createDefaultParams(),
    purpose: 'creative',
    tone: 'friendly',
    detail_level: 'detailed',
    complexity_level: 'intermediate',
    depth: 'moderate',
    target_audience: 'general_public',
    output_format: 'narrative',
    response_style: 'interactive',
    language_style: 'creative',
    vocabulary_level: 'moderate',
    domain: 'general',
    boost_creativity: true,
    add_multi_perspective: true,
    include_alternatives: true,
    improve_flow: true,
    enhance_readability: true,
    add_context_awareness: true,
    include_self_reflection: true,
    prevent_lists: true,
  },
  'Debugging': {
    ...createDefaultParams(),
    purpose: 'debugging',
    tone: 'technical',
    detail_level: 'detailed',
    complexity_level: 'intermediate',
    depth: 'deep',
    target_audience: 'intermediate',
    output_format: 'step_by_step',
    response_style: 'tutorial',
    language_style: 'technical',
    vocabulary_level: 'moderate',
    domain: 'software_development',
    include_troubleshooting: true,
    add_error_handling: true,
    include_validation: true,
    add_chain_of_thought: true,
    include_verification_steps: true,
    improve_clarity: true,
    enhance_specificity: true,
    include_alternatives: true,
    add_edge_cases: true,
    prevent_lists: true,
  },
  'Analysis': {
    ...createDefaultParams(),
    purpose: 'analysis',
    tone: 'professional',
    detail_level: 'comprehensive',
    complexity_level: 'advanced',
    depth: 'deep',
    target_audience: 'expert',
    output_format: 'structured',
    response_style: 'explanatory',
    language_style: 'academic',
    vocabulary_level: 'advanced',
    domain: 'general',
    include_reasoning: true,
    include_alternatives: true,
    add_multi_perspective: true,
    include_validation: true,
    improve_clarity: true,
    enhance_specificity: true,
    add_chain_of_thought: true,
    include_verification_steps: true,
    prevent_lists: true,
  },
  'Research': {
    ...createDefaultParams(),
    purpose: 'research',
    tone: 'professional',
    detail_level: 'comprehensive',
    complexity_level: 'advanced',
    depth: 'comprehensive',
    target_audience: 'researchers',
    output_format: 'structured',
    response_style: 'reference',
    language_style: 'academic',
    vocabulary_level: 'specialized',
    domain: 'research',
    include_resources: true,
    include_validation: true,
    include_verification_steps: true,
    improve_clarity: true,
    enhance_specificity: true,
    strengthen_structure: true,
    include_context: true,
    enable_markdown: true,
    prevent_lists: true,
  },
  'Educational': {
    ...createDefaultParams(),
    purpose: 'explanation',
    tone: 'friendly',
    detail_level: 'detailed',
    complexity_level: 'beginner',
    depth: 'moderate',
    target_audience: 'students',
    output_format: 'step_by_step',
    response_style: 'tutorial',
    language_style: 'natural',
    vocabulary_level: 'simple',
    domain: 'education',
    include_examples: true,
    include_context: true,
    enhance_readability: true,
    improve_clarity: true,
    improve_flow: true,
    strengthen_structure: true,
    include_validation: true,
    prevent_lists: true,
  }
};

export const PRIORITY_FOCUSES = [
  'Accuracy', 'Clarity', 'Completeness', 'Creativity', 'Efficiency', 
  'Error Handling', 'Examples', 'Explanation', 'Flexibility', 'Performance',
  'Readability', 'Reliability', 'Scalability', 'Security', 'Usability'
];

// Template instruction mappings
export const TEMPLATE_INSTRUCTIONS: Record<string, string> = {
  'Code Generation': 'Focus on generating clean, well-documented code with proper error handling, best practices, and comprehensive examples. Include input validation and edge case handling.',
  'Code Review': 'Provide thorough analysis of code quality, security vulnerabilities, performance implications, maintainability issues, and adherence to best practices. Offer specific improvement suggestions.',
  'Documentation': 'Create comprehensive, well-structured documentation with clear examples, proper formatting, and logical flow. Make it accessible to the target audience.',
  'Creative Writing': 'Encourage creative thinking with multiple perspectives, innovative approaches, and rich contextual details. Foster imagination while maintaining coherence.',
  'Debugging': 'Use systematic debugging methodology with step-by-step troubleshooting, root cause analysis, and verification steps. Include prevention strategies.',
  'Analysis': 'Conduct thorough analysis with evidence-based reasoning, multiple perspectives, and validated conclusions. Support findings with clear logic.',
  'Research': 'Provide comprehensive research guidance with proper methodology, resource identification, and validation techniques. Maintain academic rigor.',
  'Educational': 'Create clear, engaging educational content with progressive difficulty, practical examples, and reinforcement opportunities. Ensure accessibility for learners.'
};

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
    detectedParams.domain = 'software_development';
  } else if (content.includes('debug') || content.includes('fix') || category.includes('debug')) {
    detectedParams.purpose = 'debugging';
    detectedParams.include_troubleshooting = true;
    detectedParams.add_chain_of_thought = true;
    detectedParams.domain = 'software_development';
  } else if (content.includes('review') || content.includes('analyze') || category.includes('review')) {
    detectedParams.purpose = 'analysis';
    detectedParams.include_reasoning = true;
    detectedParams.add_multi_perspective = true;
  } else if (content.includes('document') || content.includes('explain') || category.includes('document')) {
    detectedParams.purpose = 'documentation';
    detectedParams.enhance_readability = true;
    detectedParams.include_examples = true;
    detectedParams.enable_markdown = true;
  } else if (content.includes('creative') || content.includes('story') || content.includes('write')) {
    detectedParams.purpose = 'creative';
    detectedParams.boost_creativity = true;
    detectedParams.language_style = 'creative';
  }

  // Detect complexity level
  if (content.includes('beginner') || content.includes('basic') || content.includes('simple')) {
    detectedParams.complexity_level = 'beginner';
    detectedParams.vocabulary_level = 'simple';
    detectedParams.target_audience = 'beginner';
  } else if (content.includes('advanced') || content.includes('expert') || content.includes('complex')) {
    detectedParams.complexity_level = 'advanced';
    detectedParams.vocabulary_level = 'advanced';
    detectedParams.target_audience = 'expert';
  } else {
    detectedParams.complexity_level = 'intermediate';
    detectedParams.vocabulary_level = 'moderate';
    detectedParams.target_audience = 'intermediate';
  }

  // Detect tone
  if (content.includes('formal') || content.includes('professional')) {
    detectedParams.tone = 'professional';
  } else if (content.includes('casual') || content.includes('friendly')) {
    detectedParams.tone = 'friendly';
  } else if (content.includes('technical')) {
    detectedParams.tone = 'technical';
  }

  // Detect domain
  if (prompt.language && prompt.language !== 'General') {
    detectedParams.domain = 'software_development';
  }

  // Set reasonable defaults for common enhancements
  detectedParams.improve_clarity = true;
  detectedParams.enhance_specificity = true;
  detectedParams.strengthen_structure = true;

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
  "tokenCount": ${estimateTokenCount(prompt)},
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

Provide only the JSON response, no additional text.
`;
};

export const buildEnhancedUpgradePrompt = (
  originalPrompt: string, 
  analysis: PromptAnalysis, 
  params: UpgradeParameters
): string => {
  const enhancements = [];
  
  // Build dynamic enhancement instructions
  if (params.include_examples) enhancements.push("Include relevant, practical examples");
  if (params.include_constraints) enhancements.push("Add clear constraints and limitations");
  if (params.include_context) enhancements.push("Provide rich contextual information");
  if (params.include_alternatives) enhancements.push("Suggest alternative approaches or solutions");
  if (params.include_reasoning) enhancements.push("Include reasoning and explanation steps");
  if (params.include_troubleshooting) enhancements.push("Add troubleshooting guidance and common issues");
  if (params.include_best_practices) enhancements.push("Incorporate industry best practices");
  if (params.include_warnings) enhancements.push("Include relevant warnings and cautions");
  if (params.include_resources) enhancements.push("Add helpful resources and references");
  if (params.include_validation) enhancements.push("Include validation and verification methods");
  if (params.add_chain_of_thought) enhancements.push("Add chain-of-thought reasoning process");
  if (params.add_multi_perspective) enhancements.push("Include multiple perspectives and viewpoints");
  if (params.include_verification_steps) enhancements.push("Add verification and validation steps");
  if (params.include_self_reflection) enhancements.push("Include self-reflection and metacognitive elements");
  if (params.add_iterative_refinement) enhancements.push("Add iterative refinement suggestions");
  if (params.include_fallback_strategies) enhancements.push("Include fallback strategies for edge cases");

  const qualityImprovements = [];
  if (params.improve_clarity) qualityImprovements.push("Significantly improve clarity and precision");
  if (params.enhance_specificity) qualityImprovements.push("Make instructions more specific and actionable");
  if (params.boost_creativity) qualityImprovements.push("Enhance creative potential and innovative thinking");
  if (params.strengthen_structure) qualityImprovements.push("Improve logical structure and organization");
  if (params.enhance_readability) qualityImprovements.push("Enhance readability and comprehension");
  if (params.improve_coherence) qualityImprovements.push("Improve overall coherence and flow");
  if (params.add_error_handling) qualityImprovements.push("Add comprehensive error handling");
  if (params.improve_flow) qualityImprovements.push("Improve logical flow and transitions");
  if (params.add_edge_cases) qualityImprovements.push("Consider and address edge cases");
  if (params.add_context_awareness) qualityImprovements.push("Enhance context awareness and situational understanding");

  // Anti-list instructions - this is the key addition
  const listPreventionInstructions = params.prevent_lists
    ? `
🚫 CRITICAL FORMATTING REQUIREMENT - ABSOLUTELY NO LISTS:
═══════════════════════════════════════════════════════════════════════════════════════════

⚠️  STRICTLY FORBIDDEN FORMATTING:
• Do NOT use numbered lists (1., 2., 3., etc.) anywhere in the upgraded prompt
• Do NOT use bullet points (•, -, *, etc.) anywhere in the upgraded prompt  
• Do NOT create step-by-step numbered instructions
• Do NOT organize content into numbered sections or subsections
• Do NOT use any form of enumeration or itemization
• Do NOT create structured lists of any kind

✅ REQUIRED FORMATTING APPROACH:
• Write ONLY in natural, flowing paragraph format
• Use continuous narrative prose throughout
• Integrate multiple concepts naturally within sentences
• Use transitional phrases like "including," "such as," "additionally," "furthermore," "moreover," "in addition to," "along with," "while also," etc.
• Create seamless, cohesive text that reads like natural conversation
• Structure information through paragraph breaks, not lists

📝 FORMATTING EXAMPLES:

❌ WRONG (DO NOT DO THIS):
"Please follow these steps:
1. Analyze the requirements
2. Design the solution  
3. Implement the code
4. Test thoroughly"

✅ CORRECT (DO THIS INSTEAD):
"Begin by thoroughly analyzing the requirements to understand the scope and objectives, then proceed to design a comprehensive solution that addresses all specified needs, followed by implementing clean, well-documented code while ensuring robust testing throughout the development process."

❌ WRONG (DO NOT DO THIS):
"Consider the following factors:
• Performance optimization
• Security measures  
• User experience
• Maintainability"

✅ CORRECT (DO THIS INSTEAD):
"When developing your solution, carefully consider performance optimization to ensure efficient execution, while implementing comprehensive security measures to protect against vulnerabilities, all while maintaining an excellent user experience and ensuring the code remains maintainable for future development."

═══════════════════════════════════════════════════════════════════════════════════════════
THIS IS ABSOLUTELY CRITICAL - THE UPGRADED PROMPT MUST BE WRITTEN AS FLOWING, NATURAL TEXT WITHOUT ANY LISTS, NUMBERS, OR BULLET POINTS WHATSOEVER.
═══════════════════════════════════════════════════════════════════════════════════════════
`
    : '';

  // Add markdown formatting instructions
  const markdownInstructions = params.enable_markdown
    ? `
MARKDOWN FORMATTING REQUIREMENTS:
- Use proper markdown syntax for formatting (headers, code blocks, emphasis)
- Structure the prompt with clear sections using headers (##, ###)
- ${params.prevent_lists ? 'Do NOT use markdown lists - write in paragraph form instead' : 'Use bullet points and numbered lists where appropriate'}
- Format code examples with proper code blocks (\`\`\`)
- Use emphasis (*italics*, **bold**) for important points
- Include horizontal rules (---) to separate major sections
- Use tables for structured data when applicable
`
    : `
FORMATTING INSTRUCTIONS:
- Use plain text formatting only
- Do NOT use any markdown syntax (no #, *, \`, ---, etc.)
- Structure content with clear line breaks and spacing
- Use simple text formatting and indentation
- Avoid special characters for formatting
- Use consistent spacing and alignment
- ${params.prevent_lists ? 'Write in flowing paragraph format without any lists or enumeration' : 'Use clear structure with appropriate spacing'}
`;

  const templateInstructions = TEMPLATE_INSTRUCTIONS[getTemplateNameFromParams(params)] || '';

  return `
You are an expert AI prompt engineer with deep expertise in creating highly effective, natural-language prompts that generate superior results. Your task is to completely transform and upgrade the provided prompt into a significantly more powerful, comprehensive, and effective version.

${listPreventionInstructions}

ORIGINAL PROMPT TO UPGRADE:
"${originalPrompt}"

CURRENT ANALYSIS SCORES (Areas Needing Improvement):
- Clarity: ${analysis.clarity}/10
- Specificity: ${analysis.specificity}/10  
- Effectiveness: ${analysis.effectiveness}/10
- Structure: ${analysis.structure}/10
- Coherence: ${analysis.coherence}/10
- Readability: ${analysis.readability}/10

IDENTIFIED WEAKNESSES THAT MUST BE ADDRESSED:
${analysis.weaknesses.map(w => `• ${w}`).join('\n')}

UPGRADE SPECIFICATIONS:
- Primary Purpose: ${params.purpose.replace(/_/g, ' ')}
- Target Audience: ${params.target_audience.replace(/_/g, ' ')}
- Complexity Level: ${params.complexity_level}
- Communication Tone: ${params.tone}
- Detail Level: ${params.detail_level}
- Content Depth: ${params.depth}
- Output Format: ${params.output_format.replace(/_/g, ' ')}
- Response Style: ${params.response_style}
- Domain Focus: ${params.domain.replace(/_/g, ' ')}
- Language Style: ${params.language_style}
- Vocabulary Level: ${params.vocabulary_level}

${templateInstructions ? `TEMPLATE-SPECIFIC GUIDANCE:\n${templateInstructions}\n` : ''}

ENHANCEMENTS TO INCORPORATE:
${enhancements.length > 0 ? enhancements.map(e => `• ${e}`).join('\n') : '• Focus on core improvements'}

QUALITY IMPROVEMENTS TO IMPLEMENT:
${qualityImprovements.length > 0 ? qualityImprovements.map(q => `• ${q}`).join('\n') : '• Enhance overall quality and effectiveness'}

${markdownInstructions}

${params.priority_focus.length > 0 ? `PRIORITY FOCUS AREAS:\n${params.priority_focus.map(f => `• ${f}`).join('\n')}\n` : ''}

${params.avoid_patterns.length > 0 ? `PATTERNS TO AVOID:\n${params.avoid_patterns.map(p => `• ${p}`).join('\n')}\n` : ''}

${params.custom_instructions ? `CUSTOM INSTRUCTIONS:\n${params.custom_instructions}\n` : ''}

COMPREHENSIVE UPGRADE INSTRUCTIONS:

Transform the original prompt by completely rewriting it to address every identified weakness while implementing all specified enhancements and quality improvements. Follow the upgrade specifications precisely to create a prompt that is significantly more powerful, effective, and comprehensive than the original.

Ensure the upgraded prompt maintains the original intent while dramatically improving its effectiveness through enhanced clarity, specificity, and actionability. The result should be a well-structured, comprehensive prompt that generates consistent, high-quality responses from AI systems.

${params.enable_markdown ? 'Use proper markdown formatting throughout to enhance readability and structure.' : 'Use plain text formatting only with no markdown syntax.'}

${params.prevent_lists ? 
`CRITICAL: Write the upgraded prompt as flowing, natural text using paragraph format. Do not use any numbered lists, bullet points, or enumerated steps. Instead, integrate all instructions and requirements naturally within well-structured paragraphs that read like continuous, coherent prose.` 
: 'Structure the content appropriately using the specified output format.'}

Include clear, specific instructions for the AI on how to respond, add appropriate context and background information, and ensure the prompt will generate consistent, high-quality results that meet the specified requirements.

FINAL REQUIREMENTS:
- The upgraded prompt must be significantly better than the original
- Address each weakness identified in the analysis  
- Incorporate all specified enhancements naturally and seamlessly
- Maintain clarity while adding depth and specificity
- Ensure the prompt is actionable and produces measurable results
- Create a cohesive, professional prompt that flows naturally
${params.prevent_lists ? '- Write as flowing, natural text without any numbered points, bullet points, or list structures' : ''}

Provide ONLY the upgraded prompt text with no additional commentary, explanation, or meta-text. The response should be the complete, ready-to-use upgraded prompt that can be immediately implemented.
`;
};

// Helper function to determine template name from parameters
const getTemplateNameFromParams = (params: UpgradeParameters): string => {
  // Try to match parameters to existing templates
  for (const [templateName, template] of Object.entries(UPGRADE_TEMPLATES)) {
    if (template.purpose === params.purpose && 
        template.tone === params.tone && 
        template.detail_level === params.detail_level) {
      return templateName;
    }
  }
  return '';
};

// Enhanced response parsing
export const parseEnhancedAnalysisResponse = (response: any): PromptAnalysis => {
  try {
    // Handle different response formats
    let analysisData;
    
    if (typeof response === 'string') {
      // Try to parse JSON from string response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } else if (response.summary) {
      // Handle legacy format
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
    } else {
      analysisData = response;
    }
    
    // Validate and normalize the analysis data
    const analysis: PromptAnalysis = {
      clarity: Math.max(1, Math.min(10, analysisData.clarity || 5)),
      specificity: Math.max(1, Math.min(10, analysisData.specificity || 5)),
      effectiveness: Math.max(1, Math.min(10, analysisData.effectiveness || 5)),
      creativity: Math.max(1, Math.min(10, analysisData.creativity || 5)),
      structure: Math.max(1, Math.min(10, analysisData.structure || 5)),
      coherence: Math.max(1, Math.min(10, analysisData.coherence || 5)),
      readability: Math.max(1, Math.min(10, analysisData.readability || 5)),
      languageQuality: Math.max(1, Math.min(10, analysisData.languageQuality || 5)),
      contextualRichness: Math.max(1, Math.min(10, analysisData.contextualRichness || 5)),
      tokenCount: analysisData.tokenCount || 0,
      estimatedCost: analysisData.estimatedCost || 0,
      strengths: Array.isArray(analysisData.strengths) ? analysisData.strengths : ['Basic prompt structure'],
      weaknesses: Array.isArray(analysisData.weaknesses) ? analysisData.weaknesses : ['Needs improvement'],
      suggestions: Array.isArray(analysisData.suggestions) ? analysisData.suggestions : ['Add more specific instructions'],
      estimatedPerformance: ['poor', 'fair', 'good', 'excellent'].includes(analysisData.estimatedPerformance) 
        ? analysisData.estimatedPerformance 
        : 'fair',
      complexity: ['low', 'medium', 'high', 'very-high'].includes(analysisData.complexity) 
        ? analysisData.complexity 
        : 'medium'
    };
    
    return analysis;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    // Return fallback analysis
    return {
      clarity: 6, specificity: 6, effectiveness: 6, creativity: 5,
      structure: 6, coherence: 6, readability: 6, languageQuality: 6,
      contextualRichness: 5, tokenCount: 0, estimatedCost: 0,
      strengths: ['Basic prompt structure'],
      weaknesses: ['Needs improvement', 'Could be more specific'],
      suggestions: ['Add more specific instructions', 'Include examples', 'Clarify expected output'],
      estimatedPerformance: 'fair',
      complexity: 'medium'
    };
  }
};

// Utility functions
export const getScoreColor = (score: number, darkMode: boolean): string => {
  if (score >= 8) return darkMode ? 'text-green-400' : 'text-green-600';
  if (score >= 6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
  if (score >= 4) return darkMode ? 'text-orange-400' : 'text-orange-600';
  return darkMode ? 'text-red-400' : 'text-red-600';
};

export const getPerformanceColor = (performance: string, darkMode: boolean): string => {
  switch (performance) {
    case 'excellent': return darkMode ? 'text-green-400' : 'text-green-600';
    case 'good': return darkMode ? 'text-blue-400' : 'text-blue-600';
    case 'fair': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    case 'poor': return darkMode ? 'text-red-400' : 'text-red-600';
    default: return darkMode ? 'text-gray-400' : 'text-gray-600';
  }
};

export const getComplexityColor = (complexity: string, darkMode: boolean): string => {
  switch (complexity) {
    case 'low': return darkMode ? 'text-green-400' : 'text-green-600';
    case 'medium': return darkMode ? 'text-blue-400' : 'text-blue-600';
    case 'high': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    case 'very-high': return darkMode ? 'text-red-400' : 'text-red-600';
    default: return darkMode ? 'text-gray-400' : 'text-gray-600';
  }
};

// Template validation
export const validateTemplate = (template: any): boolean => {
  const requiredFields = [
    'purpose', 'tone', 'detail_level', 'complexity_level', 'target_audience',
    'output_format', 'response_style', 'language_style', 'vocabulary_level', 'domain'
  ];
  
  return requiredFields.every(field => template.hasOwnProperty(field) && template[field] !== undefined);
};

// Get template instructions
export const getTemplateInstructions = (templateName: string): string => {
  return TEMPLATE_INSTRUCTIONS[templateName] || '';
};

// Calculate improvement score
export const calculateImprovementScore = (original: PromptAnalysis, upgraded: PromptAnalysis): number => {
  const metrics = ['clarity', 'specificity', 'effectiveness', 'structure', 'coherence', 'readability'];
  const improvements = metrics.map(metric => 
    (upgraded[metric as keyof PromptAnalysis] as number) - (original[metric as keyof PromptAnalysis] as number)
  );
  
  const averageImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  return Math.round(averageImprovement * 10) / 10; // Round to 1 decimal place
};

// Export utility for creating new templates
export const createCustomTemplate = (
  _name: string, 
  baseTemplate: keyof typeof UPGRADE_TEMPLATES, 
  overrides: Partial<UpgradeParameters>
): UpgradeParameters => {
  const base = UPGRADE_TEMPLATES[baseTemplate];
  return {
    ...base,
    ...overrides
  };
};