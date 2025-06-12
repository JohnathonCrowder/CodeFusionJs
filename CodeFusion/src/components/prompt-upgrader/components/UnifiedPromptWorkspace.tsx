import React, { useState } from 'react';
import { 
  FaCode, FaTimes, FaCopy, FaBrain, FaRocket, FaSpinner, 
  FaCog, FaSave, FaChartLine, FaChevronDown, FaChevronUp,
  FaExpand, FaCompress
} from 'react-icons/fa';
import { estimateTokenCount, estimateCost } from '../../../utils/tokenUtils';
import { Prompt } from '../../PromptLibrary';
import { UpgradeParameters } from '../PromptUpgraderSupport';
import SmartConfiguration from './SmartConfiguration';

interface UnifiedPromptWorkspaceProps {
  inputPrompt: string;
  setInputPrompt: (prompt: string) => void;
  upgradedPrompt: string;
  selectedPrompt: Prompt | null;
  isAnalyzing: boolean;
  isUpgrading: boolean;
  upgradeParams: UpgradeParameters;
  onParamsChange: (params: Partial<UpgradeParameters>) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  darkMode: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  selectedTemplate: string;
  onApplyTemplate: (templateName: string) => void;
  selectedModel: string;
  onShowPromptLibrary: () => void;
  onAnalyze: () => void;
  onUpgrade: () => void;
  onShowComparison: () => void;
  onShowSave: () => void;
}

const UnifiedPromptWorkspace: React.FC<UnifiedPromptWorkspaceProps> = ({
  inputPrompt,
  setInputPrompt,
  upgradedPrompt,
  selectedPrompt,
  isAnalyzing,
  isUpgrading,
  upgradeParams,
  onParamsChange,
  customInstructions,
  onCustomInstructionsChange,
  darkMode,
  showAdvanced,
  onToggleAdvanced,
  selectedTemplate,
  onApplyTemplate,
  selectedModel,
  onShowPromptLibrary,
  onAnalyze,
  onUpgrade,
  onShowComparison,
  onShowSave
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [expandedInput, setExpandedInput] = useState(false);
  const [expandedOutput, setExpandedOutput] = useState(false);

  return (
    <div className={`rounded-2xl border shadow-lg transition-all duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600 shadow-black/20' 
                     : 'bg-white border-gray-200 shadow-gray-500/10'}`}>
      
      {/* Header */}
      <div className={`px-6 py-4 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
              <FaRocket className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Prompt Workspace
              </h2>
              <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Create, configure, and upgrade your prompts in one unified interface
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedPrompt && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                                ${darkMode 
                                  ? 'bg-blue-600/20 text-blue-400' 
                                  : 'bg-blue-100 text-blue-700'}`}>
                {selectedPrompt.title}
              </span>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${showSettings
                          ? darkMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-500 text-white'
                          : darkMode
                            ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
            >
              <FaCog className={showSettings ? 'animate-spin' : ''} />
              <span>Settings</span>
              {showSettings ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className={`grid gap-6 transition-all duration-300 ${upgradedPrompt ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  Input Prompt
                </h3>
                <span className={`text-sm px-2 py-1 rounded-full
                                ${darkMode ? 'bg-dark-700 text-dark-400' : 'bg-gray-100 text-gray-600'}`}>
                  {estimateTokenCount(inputPrompt)} tokens
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExpandedInput(!expandedInput)}
                  className={`p-2 rounded-lg transition-colors duration-200
                            ${darkMode ? 'hover:bg-dark-600 text-dark-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title={expandedInput ? "Collapse" : "Expand"}
                >
                  {expandedInput ? <FaCompress /> : <FaExpand />}
                </button>
                
                <button
                  onClick={onShowPromptLibrary}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                            font-medium transition-colors duration-200
                            ${darkMode
                              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  <FaCode />
                  <span>Library</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                rows={expandedInput ? 20 : 10}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2 resize-none font-mono text-sm
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Enter your prompt here or select one from your library..."
              />
              
              {/* Input Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setInputPrompt('')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-sm
                              transition-colors duration-200
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <FaTimes size={12} />
                    <span>Clear</span>
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(inputPrompt)}
                    disabled={!inputPrompt}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-sm
                              transition-colors duration-200
                              ${inputPrompt
                                ? darkMode
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'
                                : 'opacity-50 cursor-not-allowed'
                              }`}
                  >
                    <FaCopy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onAnalyze}
                    disabled={!inputPrompt.trim() || isAnalyzing}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                              transition-all duration-200 hover:scale-105 disabled:opacity-50
                              ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {isAnalyzing ? (
                      <>
                        <FaSpinner className="animate-spin" size={14} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <FaBrain size={14} />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onUpgrade}
                    disabled={!inputPrompt.trim() || isUpgrading}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                              transition-all duration-200 hover:scale-105 disabled:opacity-50
                              ${darkMode
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'}`}
                  >
                    {isUpgrading ? (
                      <>
                        <FaSpinner className="animate-spin" size={14} />
                        <span>Upgrading...</span>
                      </>
                    ) : (
                      <>
                        <FaRocket size={14} />
                        <span>Upgrade</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          {upgradedPrompt && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Upgraded Prompt
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full
                                  ${darkMode ? 'bg-dark-700 text-dark-400' : 'bg-gray-100 text-gray-600'}`}>
                    {estimateTokenCount(upgradedPrompt)} tokens
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedOutput(!expandedOutput)}
                    className={`p-2 rounded-lg transition-colors duration-200
                              ${darkMode ? 'hover:bg-dark-600 text-dark-300' : 'hover:bg-gray-100 text-gray-600'}`}
                    title={expandedOutput ? "Collapse" : "Expand"}
                  >
                    {expandedOutput ? <FaCompress /> : <FaExpand />}
                  </button>
                  
                  <button
                    onClick={onShowComparison}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium
                              transition-all duration-200 hover:scale-105
                              ${darkMode
                                ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                    <FaChartLine size={12} />
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
                    onClick={onShowSave}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium
                              transition-all duration-200 hover:scale-105
                              ${darkMode
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    <FaSave size={12} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap overflow-y-auto
                             ${expandedOutput ? 'max-h-96' : 'max-h-64'}
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600 text-dark-200' 
                               : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                {upgradedPrompt}
              </div>
              
              {/* Improvement Metrics */}
              {inputPrompt && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className={`font-medium text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Length Change
                    </div>
                    <div className={`text-sm font-bold ${
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
                    <div className={`font-medium text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Token Count
                    </div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      {estimateTokenCount(upgradedPrompt)}
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className={`font-medium text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Est. Cost
                    </div>
                    <div className={`text-sm font-bold text-green-500`}>
                      ${estimateCost(estimateTokenCount(upgradedPrompt), selectedModel).toFixed(4)}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className={`font-medium text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Quality
                    </div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Enhanced
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <SmartConfiguration
              upgradeParams={upgradeParams}
              onParamsChange={onParamsChange}
              customInstructions={customInstructions}
              onCustomInstructionsChange={onCustomInstructionsChange}
              darkMode={darkMode}
              showAdvanced={showAdvanced}
              onToggleAdvanced={onToggleAdvanced}
              selectedTemplate={selectedTemplate}
              onApplyTemplate={onApplyTemplate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPromptWorkspace;