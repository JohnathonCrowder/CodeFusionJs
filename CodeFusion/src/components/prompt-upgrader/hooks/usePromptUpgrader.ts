import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { promptService } from '../../../services/promptService';
import { aiService } from '../../../utils/aiService';
import { estimateTokenCount, estimateCost } from '../../../utils/tokenUtils';
import { Prompt } from '../../PromptLibrary';
import { UPGRADE_TEMPLATES } from '../PromptUpgraderSupport';
import {
  PromptAnalysis,
  UpgradeParameters,
  UpgradeHistory,
  detectPromptParameters,
  buildEnhancedAnalysisPrompt,
  buildEnhancedUpgradePrompt,
  parseEnhancedAnalysisResponse
} from '../PromptUpgraderSupport';

export const usePromptUpgrader = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, userProfile } = useAuth();

  // State management
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [upgradedPrompt, setUpgradedPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [upgradeHistory, setUpgradeHistory] = useState<UpgradeHistory[]>([]);
  
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
    enable_markdown: false, // Disabled by default as requested
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState('');

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
      title: `${prompt.title} (Enhanced)`,
      description: `Enhanced version of: ${prompt.description || prompt.title}`,
      category: prompt.category,
      language: prompt.language || 'General',
      tags: [...(prompt.tags || []), 'enhanced', 'upgraded'],
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

      // Update save form with upgraded prompt details
      if (!saveForm.title || saveForm.title.includes('(Enhanced)')) {
        setSaveForm(prev => ({
          ...prev,
          title: selectedPrompt 
            ? `${selectedPrompt.title} (Enhanced)` 
            : 'Enhanced Prompt',
          description: prev.description || 
            (selectedPrompt 
              ? `Enhanced version of: ${selectedPrompt.description || selectedPrompt.title}`
              : 'AI-enhanced prompt with improved clarity and effectiveness')
        }));
      }
      
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

  // Save upgraded prompt - Fixed version
  const saveUpgradedPrompt = async () => {
    if (!currentUser) {
      setError('You must be logged in to save prompts');
      return;
    }

    if (!upgradedPrompt.trim()) {
      setError('No upgraded prompt to save');
      return;
    }

    if (!saveForm.title.trim()) {
      setError('Please enter a title for your prompt');
      return;
    }

    try {
      const promptData = {
        title: saveForm.title.trim(),
        content: upgradedPrompt,
        description: saveForm.description.trim() || undefined,
        category: saveForm.category,
        language: saveForm.language,
        tags: saveForm.tags.length > 0 ? saveForm.tags : undefined,
        userId: currentUser.uid,
        userDisplayName: userProfile?.displayName || currentUser.email || 'Anonymous',
        isPublic: saveForm.isPublic,
        isFavorite: false,
        usageCount: 0,
        version: 1,
        parentId: selectedPrompt?.id || undefined,
        metadata: {
          enhanced: true,
          originalLength: inputPrompt.length,
          enhancedLength: upgradedPrompt.length,
          enhancementDate: new Date().toISOString(),
          enhancementParams: upgradeParams
        }
      };

      await promptService.createPrompt(promptData);

      // Close modal and show success
      setShowSaveModal(false);
      setSuccess('Enhanced prompt saved successfully to your library!');
      
      // Reload user prompts
      await loadUserPrompts();

      // Reset save form for next use
      setSaveForm({
        title: '',
        description: '',
        category: 'General',
        language: 'General',
        tags: [],
        isPublic: false
      });

    } catch (error: any) {
      console.error('Error saving prompt:', error);
      setError(error.message || 'Failed to save prompt. Please try again.');
    }
  };

  // Apply template
  const applyTemplate = (templateName: string) => {
    const template = UPGRADE_TEMPLATES[templateName as keyof typeof UPGRADE_TEMPLATES];
    
    if (template) {
      // Apply the template's upgrade parameters
      setUpgradeParams(prev => ({
        ...prev,
        ...template,
        custom_instructions: prev.custom_instructions // Preserve custom instructions
      }));
      
      // Update custom instructions if the template has specific guidance
      const templateInstructions = getTemplateInstructions(templateName);
      if (templateInstructions) {
        setCustomInstructions(prev => 
          prev ? `${prev}\n\n${templateInstructions}` : templateInstructions
        );
      }
      
      setSelectedTemplate(templateName);
      setShowTemplates(false);
      setSuccess(`Applied ${templateName} template successfully!`);
    } else {
      setError(`Template "${templateName}" not found`);
    }
  };
  
  // Helper function to get template-specific instructions
  const getTemplateInstructions = (templateName: string): string => {
    const instructions: Record<string, string> = {
      'Code Generation': 'Focus on generating clean, well-documented code with proper error handling and best practices.',
      'Code Review': 'Provide thorough analysis of code quality, security, performance, and maintainability.',
      'Documentation': 'Create comprehensive documentation with clear examples and proper formatting.',
      'Creative Writing': 'Encourage creative thinking with multiple perspectives and innovative approaches.',
      'Debugging': 'Use systematic debugging approach with step-by-step troubleshooting methodology.'
    };
    
    return instructions[templateName] || '';
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

  // Handler functions for modal callbacks
  const handleHistoryLoad = (entry: UpgradeHistory) => {
    setInputPrompt(entry.originalPrompt);
    setUpgradedPrompt(entry.upgradedPrompt);
    setUpgradeParams(entry.parameters);
    setAnalysis(entry.analysis);
    setShowHistoryModal(false);
    
    // Update save form when loading from history
    setSave
Form({
      title: 'Loaded from History',
      description: `Prompt loaded from history (${entry.timestamp.toLocaleDateString()})`,
      category: 'General',
      language: 'General', 
      tags: ['history', 'loaded'],
      isPublic: false
    });
  };

  const handleHistoryCompare = (entry: UpgradeHistory) => {
    setComparisonPrompts({
      original: entry.originalPrompt,
      upgraded: entry.upgradedPrompt,
      analysis: entry.analysis || undefined
    });
    setShowComparisonModal(true);
    setShowHistoryModal(false);
  };

  const handleSaveFormChange = (field: string, value: any) => {
    setSaveForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpgradeParamsChange = (params: Partial<UpgradeParameters>) => {
    setUpgradeParams(prev => ({ ...prev, ...params }));
  };

  const handleCustomInstructionsChange = (instructions: string) => {
    setCustomInstructions(instructions);
    setUpgradeParams(prev => ({ ...prev, custom_instructions: instructions }));
  };

  return {
    // Context and user
    darkMode,
    currentUser,
    
    // State
    error,
    success,
    setError,
    setSuccess,
    
    // Prompt state
    inputPrompt,
    setInputPrompt,
    upgradedPrompt,
    analysis,
    upgradeParams,
    setUpgradeParams,
    
    // UI state
    isAnalyzing,
    isUpgrading,
    
    // Modal state
    showApiKeyModal,
    setShowApiKeyModal,
    showTokenConfirmation,
    setShowTokenConfirmation,
    showSaveModal,
    setShowSaveModal,
    showHistoryModal,
    setShowHistoryModal,
    showComparisonModal,
    setShowComparisonModal,
    showTemplates,
    setShowTemplates,
    showPromptLibrary,
    setShowPromptLibrary,
    
    // Data
    userPrompts,
    selectedPrompt,
    upgradeHistory,
    comparisonPrompts,
    saveForm,
    searchTerm,
    setSearchTerm,
    selectedTemplate,
    tokenCount,
    estimatedCost,
    selectedModel,
    apiKey,
    customInstructions,
    
    // Handlers
    handleApiKeySave,
    analyzePrompt,
    confirmAnalysis,
    upgradePrompt,
    handlePromptSelect,
    saveUpgradedPrompt,
    handleHistoryLoad,
    handleHistoryCompare,
    handleSaveFormChange,
    handleUpgradeParamsChange,
    handleCustomInstructionsChange,
    applyTemplate,
    exportHistory,
    clearHistory
  };
};