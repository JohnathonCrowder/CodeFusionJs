import React, { useState, useEffect, useMemo, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { aiService, AIAnalysisResult } from "../utils/aiService";
import ApiKeyModal from "./ApiKeyModal";
import {
  FaBrain,
  FaSpinner,
  FaTimes,
  FaKey,
  FaChartBar,
  FaShieldAlt,
  FaRocket,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLightbulb,
  FaCode
} from "react-icons/fa";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface SmartCodeAnalyzerProps {
  fileData: FileData[];
  isVisible: boolean;
  onToggle: () => void;
}

const SmartCodeAnalyzer: React.FC<SmartCodeAnalyzerProps> = ({
  fileData,
  isVisible,
  onToggle,
}) => {
  const { darkMode } = useContext(ThemeContext);
  
  // State management
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'security' | 'performance'>('overview');

  // Load API key from localStorage on mount
useEffect(() => {
  const savedApiKey = localStorage.getItem('openai_api_key');
  if (savedApiKey) {
    setApiKey(savedApiKey);
    try {
      aiService.initializeWithApiKey(savedApiKey);
    } catch (error) {
      console.error('Failed to initialize AI service with saved key:', error);
      // Don't automatically show modal here, wait for user to trigger analysis
    }
  }
}, []);

  // Get all visible file content and structure
  const { combinedContent, fileStructure } = useMemo(() => {
    let content = "";
    let structure = "";
    
    const processFiles = (files: FileData[], level = 0): void => {
      files.forEach(file => {
        const indent = "  ".repeat(level);
        
        if (file.visible) {
          if (file.content) {
            // Add to structure
            structure += `${indent}${file.name}\n`;
            
            // Add to content with separator
            content += `\n// === ${file.path || file.name} ===\n`;
            content += file.content + "\n";
          }
          
          if (file.children) {
            structure += `${indent}${file.name}/\n`;
            processFiles(file.children, level + 1);
          }
        }
      });
    };

    processFiles(fileData);
    
    return {
      combinedContent: content.trim(),
      fileStructure: structure.trim()
    };
  }, [fileData]);

  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
    
    try {
      aiService.initializeWithApiKey(newApiKey);
      setError("");
    } catch (error) {
      setError("Failed to initialize AI service with the provided API key");
    }
  };

  const runAnalysis = async () => {
    // Check if we have an API key first
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
  
    // Try to initialize if not ready but we have a key
    if (!aiService.isReady() && apiKey) {
      try {
        aiService.initializeWithApiKey(apiKey);
      } catch (error) {
        setError("Failed to initialize AI service. Please check your API key.");
        setShowApiKeyModal(true);
        return;
      }
    }
  
    // Final check - if still not ready, something is wrong with the key
    if (!aiService.isReady()) {
      setError("AI service not properly initialized. Please reconfigure your API key.");
      setShowApiKeyModal(true);
      return;
    }
  
    if (!combinedContent) {
      setError("No code content available for analysis");
      return;
    }
  
    setIsAnalyzing(true);
    setError("");
    
    try {
      const result = await aiService.analyzeCode(combinedContent, fileStructure);
      setAnalysis(result);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      // Check for specific error types
      if (error.message?.includes('401') || error.message?.includes('authentication') || 
          error.message?.includes('invalid') || error.message?.includes('api key')) {
        setError("Invalid API key. Please check your OpenAI API key.");
        setShowApiKeyModal(true);
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        setError("API quota exceeded. Please check your OpenAI account billing and usage limits.");
      } else if (error.message?.includes('rate limit')) {
        setError("Rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message?.includes('No compatible models available')) {
        setError("No compatible AI models found. Please ensure your OpenAI account has access to at least GPT-3.5-turbo and has billing enabled.");
      } else if (error.message?.includes('does not exist') || error.message?.includes('do not have access')) {
        setError("Model access issue detected. The system will automatically try alternative models. Please try again.");
      } else {
        setError(error.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'medium': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'high': return darkMode ? 'text-red-400' : 'text-red-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`w-96 border-l flex flex-col h-full transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors duration-300
                           ${darkMode 
                             ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30' 
                             : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200'}`}>
              <FaBrain className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                AI Analysis
              </h2>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                Powered by OpenAI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`p-2 rounded-lg transition-all duration-200
                        ${apiKey 
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
              title={apiKey ? "API key configured" : "Configure API key"}
            >
              <FaKey className="text-sm" />
            </button>
            <button
              onClick={onToggle}
              className={`p-2 rounded-lg transition-all duration-200
                        ${darkMode
                          ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={`p-4 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || !combinedContent}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200 disabled:opacity-50
                    ${darkMode
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md'}`}
        >
          {isAnalyzing ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <FaBrain />
              <span>Analyze with AI</span>
            </>
          )}
        </button>

        {error && (
          <div className={`mt-3 p-3 rounded-lg border-l-4 transition-colors duration-300
                         ${darkMode 
                           ? 'bg-red-900/20 border-red-500 text-red-300' 
                           : 'bg-red-50 border-red-500 text-red-700'}`}>
            <div className="flex items-start space-x-2">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Analysis Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
      {!analysis && !isAnalyzing ? (
  // Empty state
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className={`p-4 rounded-full mb-4 transition-colors duration-300
                   ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
      <FaBrain className={`text-3xl transition-colors duration-300
                         ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
    </div>
    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300
                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
      AI-Powered Code Analysis
    </h3>
    <p className={`text-sm mb-4 transition-colors duration-300
                 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
      Upload code files and run AI analysis to get insights about code quality, 
      architecture, security, and performance.
    </p>
    <p className={`text-xs mb-4 transition-colors duration-300
                 ${darkMode ? 'text-dark-500' : 'text-gray-500'}`}>
      Powered by OpenAI • Usage-based pricing applies
    </p>
    {!apiKey && (
      <button
        onClick={() => setShowApiKeyModal(true)}
        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200
                  ${darkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        Configure OpenAI API Key
      </button>
    )}
  </div>
) : analysis ? (
          // Analysis results
          <div className="p-4 space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 rounded-lg p-1 bg-opacity-20">
              {[
                { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
                { id: 'quality', label: 'Quality', icon: <FaCheckCircle /> },
                { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
                { id: 'performance', label: 'Performance', icon: <FaRocket /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 
                            rounded-md text-sm font-medium transition-all duration-200
                            ${activeTab === tab.id
                              ? darkMode
                                ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                              : darkMode
                                ? 'text-dark-300 hover:text-dark-100'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                    Project Summary
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg transition-colors duration-300
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold ${getQualityColor(analysis.codeQuality.score)}`}>
                      {analysis.codeQuality.score}/10
                    </div>
                    <div className={`text-xs font-medium transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Code Quality
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg transition-colors duration-300
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold ${getComplexityColor(analysis.complexity)}`}>
                      {analysis.complexity.toUpperCase()}
                    </div>
                    <div className={`text-xs font-medium transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Complexity
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Technologies Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-300
                                  ${darkMode 
                                    ? 'bg-blue-600/20 text-blue-400' 
                                    : 'bg-blue-100 text-blue-700'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 flex items-center space-x-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    <FaCheckCircle className="text-green-500" />
                    <span>Strengths</span>
                  </h4>
                  <ul className="space-y-1">
                    {analysis.codeQuality.strengths.map((strength, index) => (
                      <li key={index} className={`text-sm transition-colors duration-300
                                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 flex items-center space-x-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    <FaLightbulb className="text-yellow-500" />
                    <span>Improvements</span>
                  </h4>
                  <ul className="space-y-1">
                    {analysis.codeQuality.improvements.map((improvement, index) => (
                      <li key={index} className={`text-sm transition-colors duration-300
                                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Best Practices
                  </h4>
                  <div className="space-y-2">
                    {analysis.bestPractices.following.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium mb-1 text-green-500`}>Following:</p>
                        <ul className="space-y-1">
                          {analysis.bestPractices.following.map((practice, index) => (
                            <li key={index} className={`text-sm transition-colors duration-300
                                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              ✓ {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.bestPractices.violations.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium mb-1 text-red-500`}>Violations:</p>
                        <ul className="space-y-1">
                          {analysis.bestPractices.violations.map((violation, index) => (
                            <li key={index} className={`text-sm transition-colors duration-300
                                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              ✗ {violation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                {analysis.security.issues.length > 0 ? (
                  <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                                 ${darkMode 
                                   ? 'bg-red-900/20 border-red-500 text-red-300' 
                                   : 'bg-red-50 border-red-500 text-red-700'}`}>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <FaExclamationTriangle />
                      <span>Security Issues</span>
                    </h4>
                    <ul className="space-y-1">
                      {analysis.security.issues.map((issue, index) => (
                        <li key={index} className="text-sm">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                                 ${darkMode 
                                   ? 'bg-green-900/20 border-green-500 text-green-300' 
                                   : 'bg-green-50 border-green-500 text-green-700'}`}>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <FaCheckCircle />
                      <span>No Security Issues Found</span>
                    </h4>
                    <p className="text-sm">The analysis didn't identify any obvious security vulnerabilities.</p>
                  </div>
                )}

                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Security Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {analysis.security.recommendations.map((rec, index) => (
                      <li key={index} className={`text-sm transition-colors duration-300
                                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                {analysis.performance.bottlenecks.length > 0 && (
                  <div className={`p-4 rounded-lg transition-colors duration-300
                                 ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-3 flex items-center space-x-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      <FaExclamationTriangle className="text-yellow-500" />
                      <span>Performance Bottlenecks</span>
                    </h4>
                    <ul className="space-y-1">
                      {analysis.performance.bottlenecks.map((bottleneck, index) => (
                        <li key={index} className={`text-sm transition-colors duration-300
                                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          • {bottleneck}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 flex items-center space-x-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    <FaRocket className="text-green-500" />
                    <span>Optimizations</span>
                  </h4>
                  <ul className="space-y-1">
                    {analysis.performance.optimizations.map((opt, index) => (
                      <li key={index} className={`text-sm transition-colors duration-300
                                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        • {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Loading state
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <FaSpinner className={`animate-spin text-2xl mx-auto mb-2 transition-colors duration-300
                                   ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`transition-colors duration-300
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                AI is analyzing your code...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
        currentApiKey={apiKey}
      />
    </div>
  );
};

export default SmartCodeAnalyzer;