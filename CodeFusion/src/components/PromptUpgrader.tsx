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
  PromptAnalysis,
  UpgradeParameters,
  UpgradeHistory,
  PromptVersion,
  CATEGORIES,
  LANGUAGES,
  UPGRADE_TEMPLATES,
  PRIORITY_FOCUSES,
  detectPromptParameters,
  buildEnhancedAnalysisPrompt,
  buildEnhancedUpgradePrompt,
  parseEnhancedAnalysisResponse,
  getScoreColor,
  getPerformanceColor
} from './PromptUpgraderSupport';
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
  FaUndo,
  FaRandom,
  FaChartLine,
  FaUsers,
  FaGlobe,
  FaShieldAlt,
  FaFlask,
  FaFileAlt,
  FaDownload,
  FaUpload,
  FaCog,
  FaBookOpen,
  FaLayerGroup,
  FaBalanceScale,
  FaFilter,
  FaSort,
  FaExpand,
  FaCompress,
  FaBolt,
  FaEye,
  FaEyeSlash,
  FaClone,
  FaSync,
  FaQuestionCircle,
  FaInfoCircle
} from 'react-icons/fa';

const PromptUpgrader: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, userProfile } = useAuth();

  // State management
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [upgradedPrompt, setUpgradedPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [upgradeHistory, setUpgradeHistory] = useState<UpgradeHistory[]>([]);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  
  // Enhanced upgrade parameters with more options
  const [upgradeParams, setUpgradeParams] = useState<UpgradeParameters>({
    purpose: 'code_generation',
    tone: 'professional',
    detail_level: 'detailed',
    complexity_level: 'intermediate',
    depth: 'moderate',
    target_audience: 'intermediate',
    output_format: 'structured',
    response_style: 'explanatory',
    include_examples: true,
    include_constraints: true,
    include_context: true,
    include_alternatives: false,
    include_reasoning: true,
    include_troubleshooting: false,
    include_best_practices: true,
    include_warnings: false,
    include_resources: false,
    include_validation: false,
    improve_clarity: true,
    enhance_specificity: true,
    boost_creativity: false,
    strengthen_structure: true,
    add_error_handling: false,
    improve_flow: true,
    enhance_readability: true,
    add_edge_cases: false,
    improve_coherence: true,
    add_context_awareness: false,
    add_chain_of_thought: false,
    include_self_reflection: false,
    add_multi_perspective: false,
    include_verification_steps: false,
    add_iterative_refinement: false,
    include_fallback_strategies: false,
    language_style: 'natural',
    vocabulary_level: 'moderate',
    domain: 'software_development',
    custom_instructions: '',
    priority_focus: [],
    avoid_patterns: []
  });

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showTokenConfirmation, setShowTokenConfirmation] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [priorityFocus, setPriorityFocus] = useState<string[]>([]);
  const [avoidPatterns, setAvoidPatterns] = useState<string[]>([]);

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

  // Comparison state
  const [comparisonPrompts, setComparisonPrompts] = useState<{
    original: string;
    upgraded: string;
    analysis?: PromptAnalysis;
  }>({
    original: '',
    upgraded: ''
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
      loadUpgradeHistory();
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

  // Load upgrade history from localStorage
  const loadUpgradeHistory = () => {
    try {
      const savedHistory = localStorage.getItem(`upgrade_history_${currentUser?.uid}`);
      if (savedHistory) {
        const history = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setUpgradeHistory(history);
      }
    } catch (error) {
      console.error('Error loading upgrade history:', error);
    }
  };

  // Save upgrade history to localStorage
  const saveUpgradeHistory = (history: UpgradeHistory[]) => {
    try {
      localStorage.setItem(`upgrade_history_${currentUser?.uid}`, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving upgrade history:', error);
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

  // Apply template
  const applyTemplate = (templateName: string) => {
    const template = UPGRADE_TEMPLATES[templateName as keyof typeof UPGRADE_TEMPLATES];
    if (template) {
      setUpgradeParams(prev => ({
        ...prev,
        ...template
      }));
      setSelectedTemplate(templateName);
      setShowTemplates(false);
    }
  };

  // Select prompt from library
  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setInputPrompt(prompt.content);
    setUpgradedPrompt('');
    setAnalysis(null);
    setShowPromptLibrary(false);
    
    // Auto-detect and set appropriate parameters based on prompt content and category
    const detectedParams = detectPromptParameters(prompt);
    setUpgradeParams(prev => ({
      ...prev,
      ...detectedParams
    }));

    setSaveForm({
      title: `${prompt.title} (Upgraded)`,
      description: `Upgraded version of: ${prompt.description || prompt.title}`,
      category: prompt.category,
      language: prompt.language || 'General',
      tags: [...(prompt.tags || []), 'upgraded'],
      isPublic: false
    });
  };

  // Analyze prompt with enhanced analysis
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

    const analysisPrompt = buildEnhancedAnalysisPrompt(inputPrompt);
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
      const analysisPrompt = buildEnhancedAnalysisPrompt(inputPrompt);
      const response = await aiService.analyzeCode(analysisPrompt);
      
      const analysis: PromptAnalysis = parseEnhancedAnalysisResponse(response);
      setAnalysis(analysis);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upgrade prompt with enhanced parameters
  const upgradePrompt = async () => {
    if (!inputPrompt.trim()) {
      setError('Please enter a prompt to upgrade');
      return;
    }
  
    setIsUpgrading(true);
    setError('');
  
    try {
      const analysisToUse = analysis || await generateQuickAnalysis(inputPrompt);
      const upgradePromptText = buildEnhancedUpgradePrompt(inputPrompt, analysisToUse, upgradeParams);
      const response = await aiService.upgradePrompt(upgradePromptText);
      
      setUpgradedPrompt(response);
      setSuccess('Prompt successfully upgraded!');

      // Add to history
      const historyEntry: UpgradeHistory = {
        id: Date.now().toString(),
        originalPrompt: inputPrompt,
        upgradedPrompt: response,
        parameters: { ...upgradeParams },
        analysis: analysisToUse,
        timestamp: new Date()
      };

      const newHistory = [historyEntry, ...upgradeHistory].slice(0, 50); // Keep last 50
      setUpgradeHistory(newHistory);
      saveUpgradeHistory(newHistory);

      // Set up comparison
      setComparisonPrompts({
        original: inputPrompt,
        upgraded: response,
        analysis: analysisToUse
      });
      
    } catch (error: any) {
      console.error('Upgrade failed:', error);
      setError(error.message || 'Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Generate quick analysis for prompts without full analysis
  const generateQuickAnalysis = async (prompt: string): Promise<PromptAnalysis> => {
    return {
      clarity: 6,
      specificity: 5,
      effectiveness: 6,
      creativity: 5,
      structure: 6,
      coherence: 6,
      strengths: ['Basic prompt structure'],
      weaknesses: ['Could be more specific', 'Needs clearer instructions'],
      suggestions: ['Add more context', 'Specify desired output format', 'Include examples'],
      estimatedPerformance: 'fair',
      complexity: 'medium',
      readability: 7,
      tokenCount: estimateTokenCount(prompt),
      estimatedCost: estimateCost(estimateTokenCount(prompt), selectedModel),
      languageQuality: 6,
      contextualRichness: 5
    };
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
        parentId: selectedPrompt?.id
      });

      setShowSaveModal(false);
      setSuccess('Upgraded prompt saved successfully!');
      await loadUserPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      setError('Failed to save prompt');
    }
  };

  // Batch upgrade multiple prompts
  const batchUpgradePrompts = async (prompts: Prompt[]) => {
    setIsUpgrading(true);
    const results = [];

    for (const prompt of prompts) {
      try {
        const analysis = await generateQuickAnalysis(prompt.content);
        const upgradePromptText = buildEnhancedUpgradePrompt(prompt.content, analysis, upgradeParams);
        const upgraded = await aiService.upgradePrompt(upgradePromptText);
        
        results.push({
          original: prompt,
          upgraded,
          analysis
        });
      } catch (error) {
        console.error(`Failed to upgrade prompt: ${prompt.title}`, error);
      }
    }

    setIsUpgrading(false);
    // Handle batch results...
  };

  // Export upgrade history
  const exportHistory = () => {
    const dataStr = JSON.stringify(upgradeHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `prompt-upgrade-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Clear upgrade history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all upgrade history?')) {
      setUpgradeHistory([]);
      localStorage.removeItem(`upgrade_history_${currentUser?.uid}`);
    }
  };

  const addPriorityFocus = (focus: string) => {
    if (focus && !priorityFocus.includes(focus)) {
      const newFocus = [...priorityFocus, focus];
      setPriorityFocus(newFocus);
      setUpgradeParams(prev => ({ ...prev, priority_focus: newFocus }));
    }
  };

  const removePriorityFocus = (focus: string) => {
    const newFocus = priorityFocus.filter(f => f !== focus);
    setPriorityFocus(newFocus);
    setUpgradeParams(prev => ({ ...prev, priority_focus: newFocus }));
  };

  const addAvoidPattern = (pattern: string) => {
    if (pattern && !avoidPatterns.includes(pattern)) {
      const newPatterns = [...avoidPatterns, pattern];
      setAvoidPatterns(newPatterns);
      setUpgradeParams(prev => ({ ...prev, avoid_patterns: newPatterns }));
    }
  };

  const removeAvoidPattern = (pattern: string) => {
    const newPatterns = avoidPatterns.filter(p => p !== pattern);
    setAvoidPatterns(newPatterns);
    setUpgradeParams(prev => ({ ...prev, avoid_patterns: newPatterns }));
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
      
      <div className="max-w-6xl mx-auto">
        {/* Unified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Advanced Prompt Upgrader
              </h1>
              <p className={`mt-2 transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Transform your AI prompts with advanced analysis and intelligent upgrades
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPromptLibrary(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                          transition-all duration-200 hover:scale-105
                          ${darkMode
                            ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                <FaCode />
                <span>Library ({userPrompts.length})</span>
              </button>

              <button
                onClick={() => setShowHistoryModal(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                          transition-all duration-200 hover:scale-105
                          ${darkMode
                            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                <FaHistory />
                <span>History ({upgradeHistory.length})</span>
              </button>
              
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
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-current hover:opacity-70"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-green-900/20 border-green-500 text-green-300' 
                             : 'bg-green-50 border-green-500 text-green-700'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Success</p>
                    <p className="text-sm">{success}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="text-current hover:opacity-70"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Workbench */}
        <div className="space-y-8">
          {/* Input Section */}
          <div className={`rounded-xl border transition-colors duration-300
                         ${darkMode 
                           ? 'bg-dark-800 border-dark-600' 
                           : 'bg-white border-gray-200'}`}>
            <div className={`p-6 border-b transition-colors duration-300
                           ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Prompt Input & Configuration
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    {estimateTokenCount(inputPrompt)} tokens
                  </span>
                  {selectedPrompt && (
                    <span className={`px-2 py-1 rounded-full text-xs
                                      ${darkMode 
                                        ? 'bg-blue-600/20 text-blue-400' 
                                        : 'bg-blue-100 text-blue-700'}`}>
                      {selectedPrompt.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prompt Input */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Your Prompt
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPromptLibrary(true)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                                  font-medium transition-colors duration-200
                                  ${darkMode
                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        <FaCode />
                        <span>Select from Library</span>
                      </button>
                      <button
                        onClick={() => setShowTemplates(true)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                                  font-medium transition-colors duration-200
                                  ${darkMode
                                    ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                      >
                        <FaLayerGroup />
                        <span>Templates</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    rows={12}
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
                      
                      <button
                        onClick={() => navigator.clipboard.writeText(inputPrompt)}
                        disabled={!inputPrompt}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                                  font-medium transition-colors duration-200
                                  ${inputPrompt
                                    ? darkMode
                                      ? 'hover:bg-dark-600 text-dark-300'
                                      : 'hover:bg-gray-100 text-gray-600'
                                    : 'opacity-50 cursor-not-allowed'
                                  }`}
                      >
                        <FaCopy />
                        <span>Copy</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
                            <span>Analyze</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={upgradePrompt}
                        disabled={!inputPrompt.trim() || isUpgrading}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                                  transition-all duration-200 hover:scale-105 disabled:opacity-50
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
                            <span>Upgrade</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Configuration Panel */}
                <div className="space-y-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Quick Configuration
                  </h3>
                  
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
                                focus:outline-none focus:ring-2 text-sm
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      <option value="code_generation">Code Generation</option>
                      <option value="analysis">Analysis & Review</option>
                      <option value="documentation">Documentation</option>
                      <option value="debugging">Debugging</option>
                      <option value="creative">Creative Writing</option>
                      <option value="general">General Purpose</option>
                    </select>
                  </div>

                  {/* Tone & Audience */}
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="technical">Technical</option>
                        <option value="friendly">Friendly</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        Audience
                      </label>
                      <select
                        value={upgradeParams.target_audience}
                        onChange={(e) => setUpgradeParams(prev => ({ 
                          ...prev, 
                          target_audience: e.target.value as any 
                        }))}
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Enhancements */}
                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Quick Enhancements
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'include_examples', label: 'Add Examples' },
                        { key: 'include_constraints', label: 'Add Constraints' },
                        { key: 'include_best_practices', label: 'Best Practices' },
                        { key: 'improve_clarity', label: 'Improve Clarity' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                            onChange={(e) => setUpgradeParams(prev => ({ 
                              ...prev, 
                              [key]: e.target.checked 
                            }))}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAdvancedOptions(true)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-3 
                              rounded-lg font-medium transition-all duration-200
                              ${darkMode
                                ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaCog />
                    <span>Advanced Options</span>
                  </button>
                </div>
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
                  Comprehensive Analysis
                </h2>
              </div>
              
              <div className="p-6">
                {/* Scores Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                  {[
                    { key: 'clarity', label: 'Clarity', value: analysis.clarity },
                    { key: 'specificity', label: 'Specificity', value: analysis.specificity },
                    { key: 'effectiveness', label: 'Effectiveness', value: analysis.effectiveness },
                    { key: 'structure', label: 'Structure', value: analysis.structure },
                    { key: 'readability', label: 'Readability', value: analysis.readability },
                    { key: 'coherence', label: 'Coherence', value: analysis.coherence }
                  ].map(({ key, label, value }) => (
                    <div key={key} className={`p-4 rounded-lg text-center
                                             ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(value, darkMode)}`}>
                        {value}/10
                      </div>
                      <div className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analysis Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          )}

          {/* Upgraded Prompt Results */}
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
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      {estimateTokenCount(upgradedPrompt)} tokens
                    </span>
                    <button
                      onClick={() => setShowComparisonModal(true)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                                transition-all duration-200 hover:scale-105
                                ${darkMode
                                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      <FaRocket />
                      <span>Compare</span>
                    </button>
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
                <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                 : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  {upgradedPrompt}
                </div>
                
                {/* Improvement Metrics */}
                {inputPrompt && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className={`font-medium mb-3 flex items-center space-x-2
                                   ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      <FaChartLine className="text-blue-500" />
                      <span>Improvement Metrics</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                        <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          Length Change
                        </div>
                        <div className={`text-lg font-bold ${
                          upgradedPrompt.length > inputPrompt.length 
                            ? 'text-green-500' 
                            : upgradedPrompt.length < inputPrompt.length 
                              ? 'text-red-500' 
                              : 'text-gray-500'
                        }`}>
                          {upgradedPrompt.length > inputPrompt.length ? '+' : ''}
                          {((upgradedPrompt.length - inputPrompt.length) / inputPrompt.length * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                        <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          Token Count
                        </div>
                        <div className={`text-lg font-bold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                          {estimateTokenCount(upgradedPrompt)}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                        <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          Est. Cost
                        </div>
                        <div className={`text-lg font-bold text-green-500`}>
                          ${estimateCost(estimateTokenCount(upgradedPrompt), selectedModel).toFixed(4)}
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                        <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          Quality
                        </div>
                        <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          Enhanced
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All the existing modals remain the same */}
      
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

      {/* Prompt Library Modal */}
      {showPromptLibrary && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh]
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Your Prompt Library
                  </h2>
                  <button
                    onClick={() => setShowPromptLibrary(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="mt-3 relative">
                  <FaSearch className={`absolute left-3 top-3 h-4 w-4
                                       ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {userPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCode className={`h-8 w-8 mx-auto mb-3
                                      ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      No prompts found. Create some in the Prompt Library first.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userPrompts
                      .filter(prompt => 
                        !searchTerm || 
                        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((prompt) => (
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
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
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
                          <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                            {estimateTokenCount(prompt.content)} tokens
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh]
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Upgrade History
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={exportHistory}
                      disabled={upgradeHistory.length === 0}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                                transition-all duration-200 disabled:opacity-50
                                ${darkMode
                                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      <FaDownload />
                      <span>Export</span>
                    </button>
                    
                    <button
                      onClick={clearHistory}
                      disabled={upgradeHistory.length === 0}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                                transition-all duration-200 disabled:opacity-50
                                ${darkMode
                                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                      <FaTimes />
                      <span>Clear</span>
                    </button>
                    
                    <button
                      onClick={() => setShowHistoryModal(false)}
                      className={`p-2 rounded-lg transition-colors
                                ${darkMode
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {upgradeHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHistory className={`h-12 w-12 mx-auto mb-4
                                         ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    <p className={`text-lg font-medium mb-2
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      No upgrade history yet
                    </p>
                    <p className={darkMode ? 'text-dark-400' : 'text-gray-600'}>
                      Start upgrading prompts to see your history here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upgradeHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg border transition-colors duration-300
                                   ${darkMode 
                                     ? 'bg-dark-700 border-dark-600' 
                                     : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className={`font-medium mb-1
                                           ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                              Upgrade from {entry.timestamp.toLocaleDateString()}
                            </h4>
                            <p className={`text-sm
                                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                              {entry.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setInputPrompt(entry.originalPrompt);
                                setUpgradedPrompt(entry.upgradedPrompt);
                                setUpgradeParams(entry.parameters);
                                setAnalysis(entry.analysis);
                                setShowHistoryModal(false);
                              }}
                              className={`p-2 rounded-lg transition-colors
                                        ${darkMode
                                          ? 'hover:bg-dark-600 text-dark-300'
                                          : 'hover:bg-gray-200 text-gray-600'}`}
                              title="Load this upgrade"
                            >
                              <FaUndo />
                            </button>
                            
                            <button
                              onClick={() => {
                                setComparisonPrompts({
                                  original: entry.originalPrompt,
                                  upgraded: entry.upgradedPrompt,
                                  analysis: entry.analysis || undefined
                                });
                                setShowComparisonModal(true);
                                setShowHistoryModal(false);
                              }}
                              className={`p-2 rounded-lg transition-colors
                                        ${darkMode
                                          ? 'hover:bg-dark-600 text-dark-300'
                                          : 'hover:bg-gray-200 text-gray-600'}`}
                              title="Compare prompts"
                            >
                              <FaRocket />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className={`text-sm font-medium mb-2
                                           ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              Original ({entry.originalPrompt.length} chars)
                            </h5>
                            <div className={`p-3 rounded-lg text-sm font-mono max-h-32 overflow-y-auto
                                           ${darkMode 
                                             ? 'bg-dark-600 text-dark-200' 
                                             : 'bg-white text-gray-700'}`}>
                              {entry.originalPrompt.substring(0, 200)}
                              {entry.originalPrompt.length > 200 && '...'}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className={`text-sm font-medium mb-2
                                           ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              Upgraded ({entry.upgradedPrompt.length} chars)
                            </h5>
                            <div className={`p-3 rounded-lg text-sm font-mono max-h-32 overflow-y-auto
                                           ${darkMode 
                                             ? 'bg-dark-600 text-dark-200' 
                                             : 'bg-white text-gray-700'}`}>
                              {entry.upgradedPrompt.substring(0, 200)}
                              {entry.upgradedPrompt.length > 200 && '...'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-4">
                            <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                              Purpose: {entry.parameters.purpose.replace(/_/g, ' ')}
                            </span>
                            <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                              Tone: {entry.parameters.tone}
                            </span>
                          </div>
                          <span className={`font-medium
                                          ${entry.upgradedPrompt.length > entry.originalPrompt.length 
                                            ? 'text-green-500' 
                                            : 'text-blue-500'}`}>
                            {entry.upgradedPrompt.length > entry.originalPrompt.length ? '+' : ''}
                            {((entry.upgradedPrompt.length - entry.originalPrompt.length) / entry.originalPrompt.length * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh]
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Prompt Comparison
                  </h2>
                  <button
                    onClick={() => setShowComparisonModal(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Metrics Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className={`p-4 rounded-lg text-center
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2
                                   ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      Length Change
                    </h4>
                    <div className={`text-2xl font-bold ${
                      comparisonPrompts.upgraded.length > comparisonPrompts.original.length 
                        ? 'text-green-500' 
                        : comparisonPrompts.upgraded.length < comparisonPrompts.original.length 
                          ? 'text-red-500' 
                          : 'text-gray-500'
                    }`}>
                      {comparisonPrompts.upgraded.length > comparisonPrompts.original.length ? '+' : ''}
                      {((comparisonPrompts.upgraded.length - comparisonPrompts.original.length) / comparisonPrompts.original.length * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg text-center
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2
                                   ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      Token Difference
                    </h4>
                    <div className={`text-2xl font-bold text-blue-500`}>
                      +{estimateTokenCount(comparisonPrompts.upgraded) - estimateTokenCount(comparisonPrompts.original)}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg text-center
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2
                                   ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      Estimated Quality
                    </h4>
                    <div className={`text-2xl font-bold text-green-500`}>
                      Improved
                    </div>
                  </div>
                </div>

                {/* Side-by-side Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2
                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      <span className={`w-3 h-3 rounded-full bg-red-500`}></span>
                      <span>Original Prompt</span>
                      <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        ({comparisonPrompts.original.length} chars, {estimateTokenCount(comparisonPrompts.original)} tokens)
                      </span>
                    </h3>
                    <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto
                                   ${darkMode 
                                     ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                     : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                      {comparisonPrompts.original}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2
                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      <span className={`w-3 h-3 rounded-full bg-green-500`}></span>
                      <span>Upgraded Prompt</span>
                      <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        ({comparisonPrompts.upgraded.length} chars, {estimateTokenCount(comparisonPrompts.upgraded)} tokens)
                      </span>
                    </h3>
                    <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto
                                   ${darkMode 
                                     ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                     : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                      {comparisonPrompts.upgraded}
                    </div>
                  </div>
                </div>

                {/* Analysis Comparison */}
                {comparisonPrompts.analysis && (
                  <div className="mt-6">
                    <h3 className={`text-lg font-bold mb-4
                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      Quality Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: 'clarity', label: 'Clarity' },
                        { key: 'specificity', label: 'Specificity' },
                        { key: 'effectiveness', label: 'Effectiveness' },
                        { key: 'structure', label: 'Structure' }
                      ].map(({ key, label }) => (
                        <div key={key} className={`p-3 rounded-lg text-center
                                                   ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                          <div className={`text-lg font-bold ${getScoreColor(comparisonPrompts.analysis![key as keyof PromptAnalysis] as number, darkMode)}`}>
                            {comparisonPrompts.analysis![key as keyof PromptAnalysis]}/10
                          </div>
                          <div className={`text-sm font-medium
                                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex justify-end space-x-3 p-6 border-t
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => navigator.clipboard.writeText(comparisonPrompts.original)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                            transition-all duration-200
                            ${darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  <FaCopy />
                  <span>Copy Original</span>
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(comparisonPrompts.upgraded)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                            transition-all duration-200
                            ${darkMode
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  <FaCopy />
                  <span>Copy Upgraded</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Upgrade Templates
                  </h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(UPGRADE_TEMPLATES).map(([name, template]) => (
                    <div
                      key={name}
                      onClick={() => applyTemplate(name)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200
                                ${selectedTemplate === name
                                  ? darkMode
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-blue-500 bg-blue-50'
                                  : darkMode
                                    ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                    >
                      <h3 className={`font-medium mb-2
                                     ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        {name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Purpose:
                          </span>
                          <span className={darkMode ? 'text-dark-300' : 'text-gray-700'}>
                            {template.purpose.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Tone:
                          </span>
                          <span className={darkMode ? 'text-dark-300' : 'text-gray-700'}>
                            {template.tone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Features:
                          </span>
                          <span className={darkMode ? 'text-dark-300' : 'text-gray-700'}>
                            {Object.entries(template).filter(([k, v]) => typeof v === 'boolean' && v).length} enhancements
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options Modal */}
      {showAdvancedOptions && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh]
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Advanced Configuration
                  </h2>
                  <button
                    onClick={() => setShowAdvancedOptions(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Core Parameters */}
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        Core Parameters
                      </h3>
                      
                      <div className="space-y-4">
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
                            className={`w-full px-3 py-2 rounded-lg border text-sm
                                      ${darkMode
                                        ? 'bg-dark-700 border-dark-500 text-dark-100'
                                        : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="minimal">Minimal</option>
                            <option value="concise">Concise</option>
                            <option value="detailed">Detailed</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="exhaustive">Exhaustive</option>
                          </select>
                        </div>

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
                            className={`w-full px-3 py-2 rounded-lg border text-sm
                                      ${darkMode
                                        ? 'bg-dark-700 border-dark-500 text-dark-100'
                                        : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="structured">Structured</option>
                            <option value="conversational">Conversational</option>
                            <option value="bullet_points">Bullet Points</option>
                            <option value="step_by_step">Step by Step</option>
                            <option value="narrative">Narrative</option>
                            <option value="qa_format">Q&A Format</option>
                            <option value="outline">Outline</option>
                            <option value="code_blocks">Code Blocks</option>
                            <option value="mixed">Mixed Format</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2
                                           ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            Domain
                          </label>
                          <select
                            value={upgradeParams.domain}
                            onChange={(e) => setUpgradeParams(prev => ({ 
                              ...prev, 
                              domain: e.target.value as any 
                            }))}
                            className={`w-full px-3 py-2 rounded-lg border text-sm
                                      ${darkMode
                                        ? 'bg-dark-700 border-dark-500 text-dark-100'
                                        : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="general">General</option>
                            <option value="software_development">Software Development</option>
                            <option value="data_science">Data Science</option>
                            <option value="web_development">Web Development</option>
                            <option value="mobile_development">Mobile Development</option>
                            <option value="devops">DevOps</option>
                            <option value="ai_ml">AI/ML</option>
                            <option value="cybersecurity">Cybersecurity</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                            <option value="education">Education</option>
                            <option value="research">Research</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Custom Instructions */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        Custom Instructions
                      </h3>
                      <textarea
                        value={customInstructions}
                        onChange={(e) => {
                          setCustomInstructions(e.target.value);
                          setUpgradeParams(prev => ({ ...prev, custom_instructions: e.target.value }));
                        }}
                        rows={4}
                        className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                                  focus:outline-none focus:ring-2 resize-none text-sm
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                        placeholder="Add specific instructions for the upgrade..."
                      />
                    </div>
                  </div>

                  {/* Right Column - Enhancement Options */}
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        Enhancement Options
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            Content Enhancements
                          </h4>
                          <div className="space-y-2">
                            {[
                              { key: 'include_alternatives', label: 'Include Alternatives', icon: FaRandom },
                              { key: 'include_reasoning', label: 'Include Reasoning', icon: FaBrain },
                              { key: 'include_troubleshooting', label: 'Troubleshooting', icon: FaRocket },
                              { key: 'include_warnings', label: 'Include Warnings', icon: FaExclamationTriangle },
                              { key: 'include_resources', label: 'Include Resources', icon: FaBookOpen },
                              { key: 'include_validation', label: 'Include Validation', icon: FaCheckCircle }
                            ].map(({ key, label, icon: Icon }) => (
                              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                                  onChange={(e) => setUpgradeParams(prev => ({ 
                                    ...prev, 
                                    [key]: e.target.checked 
                                  }))}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <Icon className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            Advanced Features
                          </h4>
                          <div className="space-y-2">
                            {[
                              { key: 'add_chain_of_thought', label: 'Chain of Thought', icon: FaBrain },
                              { key: 'add_multi_perspective', label: 'Multi-Perspective', icon: FaUsers },
                              { key: 'include_verification_steps', label: 'Verification Steps', icon: FaCheckCircle },
                              { key: 'boost_creativity', label: 'Boost Creativity', icon: FaFlask },
                              { key: 'add_error_handling', label: 'Error Handling', icon: FaShieldAlt },
                              { key: 'add_context_awareness', label: 'Context Awareness', icon: FaGlobe }
                            ].map(({ key, label, icon: Icon }) => (
                              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                                  onChange={(e) => setUpgradeParams(prev => ({ 
                                    ...prev, 
                                    [key]: e.target.checked 
                                  }))}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <Icon className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                            Quality Improvements
                          </h4>
                          <div className="space-y-2">
                            {[
                              { key: 'strengthen_structure', label: 'Strengthen Structure', icon: FaLayerGroup },
                              { key: 'enhance_readability', label: 'Enhance Readability', icon: FaFileAlt },
                              { key: 'improve_coherence', label: 'Improve Coherence', icon: FaBalanceScale },
                              { key: 'improve_flow', label: 'Improve Flow', icon: FaArrowRight },
                              { key: 'add_edge_cases', label: 'Add Edge Cases', icon: FaFlask }
                            ].map(({ key, label, icon: Icon }) => (
                              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                                  onChange={(e) => setUpgradeParams(prev => ({ 
                                    ...prev, 
                                    [key]: e.target.checked 
                                  }))}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <Icon className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex justify-end space-x-3 p-6 border-t
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowAdvancedOptions(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors
                            ${darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => setShowAdvancedOptions(false)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                            transition-all duration-200 hover:scale-105
                            ${darkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <FaSave />
                  <span>Apply Configuration</span>
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