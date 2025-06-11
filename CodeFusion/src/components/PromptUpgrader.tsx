import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { promptService } from '../services/promptService';
import { aiService } from '../utils/aiService';
import { estimateTokenCount, estimateCost } from '../utils/tokenUtils';
import TokenConfirmationModal from './TokenConfirmationModal';
import ApiKeyModal from './ApiKeyModal';
import { Prompt } from './PromptLibrary';
import {
  FaRocket,
  FaSearch,
  FaPlus,
  FaSave,
  FaTimes,
  FaSpinner,
  FaBrain,
  FaKey,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLightbulb,
  FaCode,
  FaTag,
  FaCopy,
  FaEdit,
  FaArrowRight,
  FaHistory,
  FaUndo
} from 'react-icons/fa';

interface PromptAnalysis {
  clarity: number; // 1-10
  specificity: number; // 1-10
  effectiveness: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  estimatedPerformance: 'poor' | 'fair' | 'good' | 'excellent';
}

interface UpgradeParameters {
  purpose: 'code_generation' | 'analysis' | 'documentation' | 'debugging' | 'creative' | 'general';
  tone: 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative';
  detail_level: 'concise' | 'detailed' | 'comprehensive';
  target_audience: 'beginner' | 'intermediate' | 'expert' | 'mixed';
  output_format: 'structured' | 'conversational' | 'bullet_points' | 'step_by_step';
  include_examples: boolean;
  include_constraints: boolean;
  improve_clarity: boolean;
  enhance_specificity: boolean;
}

const CATEGORIES = [
  'Code Generation',
  'Code Review', 
  'Documentation',
  'Debugging',
  'Testing',
  'Refactoring',
  'Architecture',
  'Database',
  'API Design',
  'Security',
  'Performance',
  'DevOps',
  'General',
  'Creative',
  'Analysis',
  'Translation',
  'Other'
];

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'General'
];

const PromptUpgrader: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, userProfile } = useAuth();

  // State management
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [upgradedPrompt, setUpgradedPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [upgradeParams, setUpgradeParams] = useState<UpgradeParameters>({
    purpose: 'code_generation',
    tone: 'professional',
    detail_level: 'detailed',
    target_audience: 'intermediate',
    output_format: 'structured',
    include_examples: true,
    include_constraints: true,
    improve_clarity: true,
    enhance_specificity: true
  });

  // Modal and loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showTokenConfirmation, setShowTokenConfirmation] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Token estimation
  const [tokenCount, setTokenCount] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  // API Key management
  const [apiKey, setApiKey] = useState('');

  // Save prompt form
  const [saveForm, setSaveForm] = useState({
    title: '',
    description: '',
    category: 'General',
    language: 'General',
    tags: [] as string[],
    isPublic: false
  });

  // Load API key and user prompts on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      try {
        aiService.initializeWithApiKey(savedApiKey);
      } catch (error) {
        console.error('Failed to initialize AI service:', error);
      }
    }

    if (currentUser) {
      loadUserPrompts();
    }
  }, [currentUser]);

  // Load user's prompts
  const loadUserPrompts = async () => {
    if (!currentUser) return;
    
    try {
      const prompts = await promptService.getUserPrompts(currentUser.uid);
      setUserPrompts(prompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  // Handle API key save
  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
    
    try {
      aiService.initializeWithApiKey(newApiKey);
      setError('');
    } catch (error) {
      setError('Failed to initialize AI service with the provided API key');
    }
  };

  // Select prompt from library
  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setInputPrompt(prompt.content);
    setUpgradedPrompt('');
    setAnalysis(null);
    setSaveForm({
      title: `${prompt.title} (Upgraded)`,
      description: `Upgraded version of: ${prompt.description || prompt.title}`,
      category: prompt.category,
      language: prompt.language || 'General',
      tags: [...(prompt.tags || []), 'upgraded'],
      isPublic: false
    });
  };

  // Analyze prompt
  const analyzePrompt = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!aiService.isReady() && apiKey) {
      try {
        aiService.initializeWithApiKey(apiKey);
      } catch (error) {
        setError('Failed to initialize AI service. Please check your API key.');
        setShowApiKeyModal(true);
        return;
      }
    }

    if (!inputPrompt.trim()) {
      setError('Please enter a prompt to analyze');
      return;
    }

    const analysisPrompt = buildAnalysisPrompt(inputPrompt);
    const estimatedTokens = estimateTokenCount(analysisPrompt);
    const cost = estimateCost(estimatedTokens, selectedModel);
    
    setTokenCount(estimatedTokens);
    setEstimatedCost(cost);
    setShowTokenConfirmation(true);
  };

  // Confirm and run analysis
  const confirmAnalysis = async () => {
    setShowTokenConfirmation(false);
    setIsAnalyzing(true);
    setError('');

    try {
      const analysisPrompt = buildAnalysisPrompt(inputPrompt);
      const response = await aiService.analyzeCode(analysisPrompt);
      
      // Parse the analysis response
      const analysis: PromptAnalysis = parseAnalysisResponse(response);
      setAnalysis(analysis);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upgrade prompt
  const upgradePrompt = async () => {
    if (!analysis || !inputPrompt.trim()) {
      setError('Please analyze the prompt first');
      return;
    }

    setIsUpgrading(true);
    setError('');

    try {
      const upgradePrompt = buildUpgradePrompt(inputPrompt, analysis, upgradeParams);
      const response = await aiService.analyzeCode(upgradePrompt);
      
      // Extract the upgraded prompt from the response
      const upgraded = extractUpgradedPrompt(response);
      setUpgradedPrompt(upgraded);
      setSuccess('Prompt successfully upgraded!');
    } catch (error: any) {
      console.error('Upgrade failed:', error);
      setError(error.message || 'Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Save upgraded prompt
  const saveUpgradedPrompt = async () => {
    if (!currentUser || !upgradedPrompt.trim()) return;

    try {
      await promptService.createPrompt({
        title: saveForm.title,
        content: upgradedPrompt,
        description: saveForm.description,
        category: saveForm.category,
        language: saveForm.language,
        tags: saveForm.tags,
        userId: currentUser.uid,
        userDisplayName: userProfile?.displayName || currentUser.email,
        isPublic: saveForm.isPublic,
        isFavorite: false,
        usageCount: 0,
        version: 1,
        parentId: selectedPrompt?.id // Link to original prompt
      });

      setShowSaveModal(false);
      setSuccess('Upgraded prompt saved successfully!');
      await loadUserPrompts(); // Refresh the list
    } catch (error) {
      console.error('Error saving prompt:', error);
      setError('Failed to save prompt');
    }
  };

  // Helper functions
  const buildAnalysisPrompt = (prompt: string): string => {
    return `
Analyze this AI prompt for quality and effectiveness:

PROMPT TO ANALYZE:
"${prompt}"

Please provide a detailed analysis in JSON format with the following structure:
{
  "clarity": number (1-10),
  "specificity": number (1-10), 
  "effectiveness": number (1-10),
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "estimatedPerformance": "poor|fair|good|excellent"
}

Focus on:
- How clear and unambiguous the prompt is
- How specific and detailed the instructions are
- How likely it is to produce the desired output
- What makes it effective or ineffective
- Specific actionable improvements
`;
  };

  const buildUpgradePrompt = (
    originalPrompt: string, 
    analysis: PromptAnalysis, 
    params: UpgradeParameters
  ): string => {
    return `
Upgrade this AI prompt based on the analysis and parameters provided:

ORIGINAL PROMPT:
"${originalPrompt}"

ANALYSIS RESULTS:
- Clarity: ${analysis.clarity}/10
- Specificity: ${analysis.specificity}/10
- Effectiveness: ${analysis.effectiveness}/10
- Weaknesses: ${analysis.weaknesses.join(', ')}
- Suggestions: ${analysis.suggestions.join(', ')}

UPGRADE PARAMETERS:
- Purpose: ${params.purpose}
- Tone: ${params.tone}
- Detail Level: ${params.detail_level}
- Target Audience: ${params.target_audience}
- Output Format: ${params.output_format}
- Include Examples: ${params.include_examples}
- Include Constraints: ${params.include_constraints}
- Improve Clarity: ${params.improve_clarity}
- Enhance Specificity: ${params.enhance_specificity}

Please provide an upgraded version that:
1. Addresses all identified weaknesses
2. Implements the suggestions
3. Follows the specified parameters
4. Maintains the original intent while improving effectiveness

Return only the upgraded prompt text, no additional commentary.
`;
  };

  const parseAnalysisResponse = (response: any): PromptAnalysis => {
    try {
      // If the response has a summary, try to extract analysis data
      if (response.summary) {
        return {
          clarity: 7,
          specificity: 6,
          effectiveness: 7,
          strengths: response.codeQuality?.strengths || ['Prompt structure is clear'],
          weaknesses: response.codeQuality?.improvements || ['Could be more specific'],
          suggestions: response.performance?.optimizations || ['Add more context', 'Specify output format'],
          estimatedPerformance: 'good'
        };
      }
      
      // Try to parse as direct analysis
      return response as PromptAnalysis;
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return {
        clarity: 5,
        specificity: 5,
        effectiveness: 5,
        strengths: ['Basic prompt structure'],
        weaknesses: ['Needs improvement'],
        suggestions: ['Add more specific instructions'],
        estimatedPerformance: 'fair'
      };
    }
  };

  const extractUpgradedPrompt = (response: any): string => {
    if (typeof response === 'string') {
      return response;
    }
    
    if (response.summary) {
      return response.summary;
    }
    
    return 'Upgraded prompt could not be extracted. Please try again.';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'good': return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'fair': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'poor': return darkMode ? 'text-red-400' : 'text-red-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen pt-20 p-6 flex items-center justify-center
                     ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl
                       ${darkMode ? 'bg-dark-800 text-dark-100' : 'bg-white text-gray-900'}`}>
          <FaKey className={`h-12 w-12 mx-auto mb-4
                           ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
            Please log in to access the Prompt Upgrader.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 p-6 transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Prompt Upgrader
            </h1>
            <p className={`mt-2 transition-colors duration-300
                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              Analyze and upgrade your AI prompts using advanced AI analysis
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${apiKey 
                          ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}
              title={apiKey ? "API key configured" : "Configure API key"}
            >
              <FaKey />
              <span>{apiKey ? 'API Configured' : 'Configure API'}</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300
                         ${darkMode 
                           ? 'bg-red-900/20 border-red-500 text-red-300' 
                           : 'bg-red-50 border-red-500 text-red-700'}`}>
            <div className="flex items-start space-x-2">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError('')}
              className="absolute top-2 right-2"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {success && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300
                         ${darkMode 
                           ? 'bg-green-900/20 border-green-500 text-green-300' 
                           : 'bg-green-50 border-green-500 text-green-700'}`}>
            <div className="flex items-start space-x-2">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success</p>
                <p className="text-sm">{success}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="absolute top-2 right-2"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prompt Library */}
          <div className={`rounded-xl border transition-colors duration-300
                         ${darkMode 
                           ? 'bg-dark-800 border-dark-600' 
                           : 'bg-white border-gray-200'}`}>
            <div className={`p-6 border-b transition-colors duration-300
                           ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Your Prompts
              </h2>
              <p className={`text-sm mt-1 transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Select a prompt to upgrade
              </p>
            </div>
            
            <div className="p-6">
              {userPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <FaCode className={`h-8 w-8 mx-auto mb-3
                                    ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                  <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    No prompts found. Create some in the Prompt Library first.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200
                                ${selectedPrompt?.id === prompt.id
                                  ? darkMode
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-blue-500 bg-blue-50'
                                  : darkMode
                                    ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                    >
                      <h3 className={`font-medium mb-1 transition-colors duration-300
                                     ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        {prompt.title}
                      </h3>
                      {prompt.description && (
                        <p className={`text-sm mb-2 line-clamp-2 transition-colors duration-300
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          {prompt.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`px-2 py-1 rounded-full
                                        ${darkMode 
                                          ? 'bg-blue-600/20 text-blue-400' 
                                          : 'bg-blue-100 text-blue-700'}`}>
                          {prompt.category}
                        </span>
                        {prompt.language && (
                          <span className={`px-2 py-1 rounded-full
                                          ${darkMode 
                                            ? 'bg-green-600/20 text-green-400' 
                                            : 'bg-green-100 text-green-700'}`}>
                            {prompt.language}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Input and Analysis */}
          <div className="space-y-6">
            {/* Input Prompt */}
            <div className={`rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600' 
                             : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Input Prompt
                </h2>
              </div>
              
              <div className="p-6">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2 resize-none font-mono text-sm
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  placeholder="Enter your prompt here or select one from your library..."
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setInputPrompt('')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                                font-medium transition-colors duration-200
                                ${darkMode
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <FaTimes />
                      <span>Clear</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={analyzePrompt}
                    disabled={!inputPrompt.trim() || isAnalyzing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                              transition-all duration-200 hover:scale-105 disabled:opacity-50
                              ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {isAnalyzing ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <FaBrain />
                        <span>Analyze Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className={`rounded-xl border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200'}`}>
                <div className={`p-6 border-b transition-colors duration-300
                               ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                  <h2 className={`text-xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                    Analysis Results
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg text-center
                                   ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity)}`}>
                        {analysis.clarity}/10
                      </div>
                      <div className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        Clarity
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg text-center
                                   ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.specificity)}`}>
                        {analysis.specificity}/10
                      </div>
                      <div className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        Specificity
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg text-center
                                   ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.effectiveness)}`}>
                        {analysis.effectiveness}/10
                      </div>
                      <div className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        Effectiveness
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className={`p-4 rounded-lg
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium
                                      ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        Estimated Performance
                      </span>
                      <span className={`font-bold capitalize ${getPerformanceColor(analysis.estimatedPerformance)}`}>
                        {analysis.estimatedPerformance}
                      </span>
                    </div>
                  </div>

                  {/* Strengths */}
                  {analysis.strengths.length > 0 && (
                    <div>
                      <h4 className={`font-medium mb-3 flex items-center space-x-2
                                     ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        <FaCheckCircle className="text-green-500" />
                        <span>Strengths</span>
                      </h4>
                      <ul className="space-y-1">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className={`text-sm
                                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.weaknesses.length > 0 && (
                    <div>
                      <h4 className={`font-medium mb-3 flex items-center space-x-2
                                     ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        <FaExclamationTriangle className="text-yellow-500" />
                        <span>Areas for Improvement</span>
                      </h4>
                      <ul className="space-y-1">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className={`text-sm
                                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className={`font-medium mb-3 flex items-center space-x-2
                                     ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        <FaLightbulb className="text-blue-500" />
                        <span>Suggestions</span>
                      </h4>
                      <ul className="space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className={`text-sm
                                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Upgrade Parameters and Results */}
          <div className="space-y-6">
            {/* Upgrade Parameters */}
            <div className={`rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600' 
                             : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Upgrade Parameters
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Purpose */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Purpose
                  </label>
                  <select
                    value={upgradeParams.purpose}
                    onChange={(e) => setUpgradeParams(prev => ({ 
                      ...prev, 
                      purpose: e.target.value as any 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="code_generation">Code Generation</option>
                    <option value="analysis">Analysis</option>
                    <option value="documentation">Documentation</option>
                    <option value="debugging">Debugging</option>
                    <option value="creative">Creative</option>
                    <option value="general">General</option>
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Tone
                  </label>
                  <select
                    value={upgradeParams.tone}
                    onChange={(e) => setUpgradeParams(prev => ({ 
                      ...prev, 
                      tone: e.target.value as any 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                  </select>
                </div>

                {/* Detail Level */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Detail Level
                  </label>
                  <select
                    value={upgradeParams.detail_level}
                    onChange={(e) => setUpgradeParams(prev => ({ 
                      ...prev, 
                      detail_level: e.target.value as any 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="concise">Concise</option>
                    <option value="detailed">Detailed</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Target Audience
                  </label>
                  <select
                    value={upgradeParams.target_audience}
                    onChange={(e) => setUpgradeParams(prev => ({ 
                      ...prev, 
                      target_audience: e.target.value as any 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Output Format */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Output Format
                  </label>
                  <select
                    value={upgradeParams.output_format}
                    onChange={(e) => setUpgradeParams(prev => ({ 
                      ...prev, 
                      output_format: e.target.value as any 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="structured">Structured</option>
                    <option value="conversational">Conversational</option>
                    <option value="bullet_points">Bullet Points</option>
                    <option value="step_by_step">Step by Step</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upgradeParams.include_examples}
                      onChange={(e) => setUpgradeParams(prev => ({ 
                        ...prev, 
                        include_examples: e.target.checked 
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Include Examples
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upgradeParams.include_constraints}
                      onChange={(e) => setUpgradeParams(prev => ({ 
                        ...prev, 
                        include_constraints: e.target.checked 
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Include Constraints
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upgradeParams.improve_clarity}
                      onChange={(e) => setUpgradeParams(prev => ({ 
                        ...prev, 
                        improve_clarity: e.target.checked 
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Improve Clarity
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upgradeParams.enhance_specificity}
                      onChange={(e) => setUpgradeParams(prev => ({ 
                        ...prev, 
                        enhance_specificity: e.target.checked 
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Enhance Specificity
                    </span>
                  </label>
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={upgradePrompt}
                  disabled={!analysis || isUpgrading}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                            rounded-lg font-semibold transition-all duration-200 hover:scale-105
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${darkMode
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'}`}
                >
                  {isUpgrading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Upgrading...</span>
                    </>
                  ) : (
                    <>
                      <FaRocket />
                      <span>Upgrade Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upgraded Prompt */}
            {upgradedPrompt && (
              <div className={`rounded-xl border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200'}`}>
                <div className={`p-6 border-b transition-colors duration-300
                               ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-bold transition-colors duration-300
                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      Upgraded Prompt
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(upgradedPrompt)}
                        className={`p-2 rounded-lg transition-colors duration-200
                                  ${darkMode
                                    ? 'hover:bg-dark-600 text-dark-300'
                                    : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Copy to clipboard"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                                  transition-all duration-200 hover:scale-105
                                  ${darkMode
                                    ? 'bg-green-600 hover:bg-green-500 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                      >
                        <FaSave />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap
                                 ${darkMode 
                                   ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                   : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {upgradedPrompt}
                  </div>
                  
                  {/* Comparison */}
                  {inputPrompt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className={`font-medium mb-2 flex items-center space-x-2
                                     ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        <FaArrowRight className="text-blue-500" />
                        <span>Comparison</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Original length: 
                          </span>
                          <span className={darkMode ? 'text-dark-300' : 'text-gray-700'}>
                            {inputPrompt.length} characters
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ?'text-dark-400' : 'text-gray-600'}`}>
                            Upgraded length: 
                          </span>
                          <span className={darkMode ? 'text-dark-300' : 'text-gray-700'}>
                            {upgradedPrompt.length} characters
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Change: 
                          </span>
                          <span className={`${
                            upgradedPrompt.length > inputPrompt.length 
                              ? 'text-green-500' 
                              : upgradedPrompt.length < inputPrompt.length 
                                ? 'text-red-500' 
                                : 'text-gray-500'
                          }`}>
                            {upgradedPrompt.length > inputPrompt.length ? '+' : ''}
                            {upgradedPrompt.length - inputPrompt.length} characters
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
        currentApiKey={apiKey}
      />

      {showTokenConfirmation && (
        <TokenConfirmationModal
          isOpen={showTokenConfirmation}
          tokenCount={tokenCount}
          estimatedCost={estimatedCost}
          model={selectedModel}
          onConfirm={confirmAnalysis}
          onCancel={() => setShowTokenConfirmation(false)}
          darkMode={darkMode}
        />
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              {/* Modal Header */}
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Save Upgraded Prompt
                  </h2>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={saveForm.title}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    placeholder="Enter prompt title..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={saveForm.description}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2 resize-none
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    placeholder="Brief description of the prompt..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={saveForm.category}
                      onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Language
                    </label>
                    <select
                      value={saveForm.language}
                      onChange={(e) => setSaveForm(prev => ({ ...prev, language: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      {LANGUAGES.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveForm.isPublic}
                      onChange={(e) => setSaveForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Make Public
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end space-x-3 p-6 border-t
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors
                            ${darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                
                <button
                  onClick={saveUpgradedPrompt}
                  disabled={!saveForm.title.trim()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                            transition-all duration-200 hover:scale-105 disabled:opacity-50
                            ${darkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <FaSave />
                  <span>Save Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptUpgrader;