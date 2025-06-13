import React, { useState } from 'react';
import { 
  FaCode, FaTimes, FaCopy, FaBrain, FaRocket, FaSpinner, 
  FaCog, FaSave, FaChartLine, FaChevronDown, FaChevronUp,
  FaExpand, FaCompress, FaMagic, FaGlobe,
  FaChartBar, FaLayerGroup, FaGraduationCap, FaBookOpen,
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
  const [focusedSection, setFocusedSection] = useState<'input' | 'output' | null>(null);

  // Enhanced gradient backgrounds
  const getGradientBackground = (type: 'primary' | 'secondary' | 'accent') => {
    if (darkMode) {
      switch (type) {
        case 'primary':
          return 'bg-gradient-to-br from-dark-800 via-dark-800 to-blue-900/20';
        case 'secondary':
          return 'bg-gradient-to-br from-dark-700 via-dark-700 to-purple-900/20';
        case 'accent':
          return 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20';
      }
    } else {
      switch (type) {
        case 'primary':
          return 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40';
        case 'secondary':
          return 'bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40';
        case 'accent':
          return 'bg-gradient-to-r from-blue-100/60 via-purple-100/60 to-indigo-100/60';
      }
    }
  };

  const getTokenCountColor = (count: number) => {
    if (count > 3000) return darkMode ? 'text-red-400' : 'text-red-600';
    if (count > 2000) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (count > 1000) return darkMode ? 'text-blue-400' : 'text-blue-600';
    return darkMode ? 'text-green-400' : 'text-green-600';
  };

  return (
    <div className={`rounded-3xl border-2 shadow-2xl transition-all duration-500 transform hover:scale-[1.002] min-h-[70vh]
                   ${getGradientBackground('primary')}
                   ${darkMode 
                     ? 'border-dark-600/50 shadow-black/30' 
                     : 'border-indigo-200/50 shadow-indigo-500/10'}`}>
      
      {/* Enhanced Header with Animated Elements */}
      <div className={`px-8 py-6 border-b-2 transition-all duration-500 ${getGradientBackground('accent')}
                     ${darkMode ? 'border-dark-600/50' : 'border-indigo-200/50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110
                             ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                <FaRocket className="text-white text-2xl" />
              </div>
              {/* Animated ring effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 opacity-20 animate-pulse
                             ${darkMode ? 'border-blue-400' : 'border-blue-500'}`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                               ${darkMode 
                                 ? 'from-blue-400 via-purple-400 to-indigo-400' 
                                 : 'from-blue-600 via-purple-600 to-indigo-600'}`}>
                  Prompt Workspace
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold animate-pulse
                               ${darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  AI POWERED
                </div>
              </div>
              <p className={`text-base font-medium ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                Transform your prompts with intelligent analysis and advanced enhancement
              </p>
            </div>
          </div>

          <button
  onClick={() => onParamsChange({ prevent_lists: !upgradeParams.prevent_lists })}
  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold
            transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm
            ${upgradeParams.prevent_lists
              ? darkMode
                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30'
                : 'bg-red-100/80 text-red-700 hover:bg-red-200/80 border border-red-200'
              : darkMode
                ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 border border-gray-500/30'
                : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 border border-gray-200'
            }`}
  title={upgradeParams.prevent_lists ? "Lists are prevented" : "Lists are allowed"}
>
  <FaRocket />
  <span>{upgradeParams.prevent_lists ? 'No Lists' : 'Allow Lists'}</span>
</button>
          
          <div className="flex items-center space-x-4">
            {selectedPrompt && (
              <div className={`px-4 py-2 rounded-full font-medium shadow-lg backdrop-blur-sm
                             ${darkMode 
                               ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                               : 'bg-blue-100/80 text-blue-800 border border-blue-200'}`}>
                <div className="flex items-center space-x-2">
                  <FaBookOpen className="text-sm" />
                  <span className="text-sm font-semibold">{selectedPrompt.title}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold
                        transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm
                        ${showSettings
                          ? darkMode
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/30'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-purple-500/30'
                          : darkMode
                            ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30'
                            : 'bg-purple-100/80 text-purple-700 hover:bg-purple-200/80 border border-purple-200'
                        }`}
            >
              <FaCog className={`transition-transform duration-500 ${showSettings ? 'animate-spin' : ''}`} />
              <span>Configuration</span>
              <div className="transition-transform duration-300">
                {showSettings ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className={`grid gap-8 transition-all duration-500 ${upgradedPrompt ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          
          {/* Enhanced Input Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                  <FaCode className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                    Input Prompt
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full
                                    ${getTokenCountColor(estimateTokenCount(inputPrompt))} 
                                    ${darkMode ? 'bg-dark-700/50' : 'bg-white/80'}`}>
                      {estimateTokenCount(inputPrompt).toLocaleString()} tokens
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                                    ${darkMode ? 'bg-dark-700 text-dark-400' : 'bg-gray-100 text-gray-600'}`}>
                      {inputPrompt.length.toLocaleString()} chars
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setExpandedInput(!expandedInput)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg
                            ${darkMode 
                              ? 'bg-dark-700/50 hover:bg-dark-600 text-dark-300 backdrop-blur-sm' 
                              : 'bg-white/80 hover:bg-gray-50 text-gray-600 backdrop-blur-sm'}`}
                  title={expandedInput ? "Collapse" : "Expand"}
                >
                  {expandedInput ? <FaCompress className="text-lg" /> : <FaExpand className="text-lg" />}
                </button>
                
                <button
                  onClick={onShowPromptLibrary}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold
                            transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm
                            ${darkMode
                              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                              : 'bg-blue-100/80 text-blue-700 hover:bg-blue-200/80 border border-blue-200'}`}
                >
                  <FaBookOpen />
                  <span>Library</span>
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                             ${darkMode ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10' : 'bg-gradient-to-r from-blue-100/50 to-purple-100/50'}`} />
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onFocus={() => setFocusedSection('input')}
                onBlur={() => setFocusedSection(null)}
                rows={expandedInput ? 25 : 15}
                className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300
                          focus:outline-none focus:ring-4 resize-none font-mono text-sm leading-relaxed
                          ${focusedSection === 'input' ? 'scale-[1.01] shadow-2xl' : 'shadow-lg'}
                          ${darkMode
                            ? 'bg-dark-700/80 border-dark-500 text-dark-100 focus:ring-blue-400/30 focus:border-blue-400 backdrop-blur-sm'
                            : 'bg-white/90 border-gray-300 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500 backdrop-blur-sm'}`}
                placeholder="✨ Enter your prompt here or select one from your library to begin the transformation journey..."
              />
              
              {/* Enhanced Input Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setInputPrompt('')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                              transition-all duration-300 hover:scale-105
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300 hover:text-red-400'
                                : 'hover:bg-red-50 text-gray-600 hover:text-red-600'}`}
                  >
                    <FaTimes size={14} />
                    <span>Clear</span>
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(inputPrompt)}
                    disabled={!inputPrompt}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                              transition-all duration-300 hover:scale-105
                              ${inputPrompt
                                ? darkMode
                                  ? 'hover:bg-dark-600 text-dark-300 hover:text-blue-400'
                                  : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                                : 'opacity-50 cursor-not-allowed'
                              }`}
                  >
                    <FaCopy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onAnalyze}
                    disabled={!inputPrompt.trim() || isAnalyzing}
                    className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-bold text-lg
                              transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-lg
                              ${darkMode
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'}`}
                  >
                    {isAnalyzing ? (
                      <>
                        <FaSpinner className="animate-spin text-xl" />
                        <span>Analyzing Magic...</span>
                      </>
                    ) : (
                      <>
                        <FaBrain className="text-xl group-hover:animate-pulse" />
                        <span>Analyze</span>
                        <FaBrain className="text-sm opacity-70" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={onUpgrade}
                    disabled={!inputPrompt.trim() || isUpgrading}
                    className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-bold text-lg
                              transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-xl
                              ${darkMode
                                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white'
                                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white'}`}
                  >
                    {isUpgrading ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <FaBrain className="animate-bounce text-xl" />
                          <FaSpinner className="animate-spin text-xl" />
                        </div>
                        <span>Transforming...</span>
                      </>
                    ) : (
                      <>
                        <FaRocket className="text-xl group-hover:animate-bounce" />
                        <span>Upgrade</span>
                        <FaMagic className="text-sm opacity-70 group-hover:animate-pulse" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Output Section */}
          {upgradedPrompt && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-600/20' : 'bg-green-100'}`}>
                    <FaBrain className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      Enhanced Prompt
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full
                                      ${getTokenCountColor(estimateTokenCount(upgradedPrompt))} 
                                      ${darkMode ? 'bg-dark-700/50' : 'bg-white/80'}`}>
                        {estimateTokenCount(upgradedPrompt).toLocaleString()} tokens
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                                      ${darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        ENHANCED
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setExpandedOutput(!expandedOutput)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg
                              ${darkMode 
                                ? 'bg-dark-700/50 hover:bg-dark-600 text-dark-300 backdrop-blur-sm' 
                                : 'bg-white/80 hover:bg-gray-50 text-gray-600 backdrop-blur-sm'}`}
                    title={expandedOutput ? "Collapse" : "Expand"}
                  >
                    {expandedOutput ? <FaCompress className="text-lg" /> : <FaExpand className="text-lg" />}
                  </button>
                  
                  <button
                    onClick={onShowComparison}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold
                              transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm
                              ${darkMode
                                ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                                : 'bg-blue-100/80 text-blue-700 hover:bg-blue-200/80 border border-blue-200'}`}
                  >
                    <FaChartLine />
                    <span>Compare</span>
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(upgradedPrompt)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg
                              ${darkMode
                                ? 'bg-dark-700/50 hover:bg-dark-600 text-dark-300 hover:text-blue-400 backdrop-blur-sm'
                                : 'bg-white/80 hover:bg-blue-50 text-gray-600 hover:text-blue-600 backdrop-blur-sm'}`}
                    title="Copy to clipboard"
                  >
                    <FaCopy className="text-lg" />
                  </button>
                  
                  <button
                    onClick={onShowSave}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold
                              transition-all duration-300 hover:scale-105 shadow-lg
                              ${darkMode
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'}`}
                  >
                    <FaSave />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               ${darkMode ? 'bg-gradient-to-r from-green-600/10 to-emerald-600/10' : 'bg-gradient-to-r from-green-100/50 to-emerald-100/50'}`} />
                <div className={`relative p-6 rounded-2xl border-2 font-mono text-sm whitespace-pre-wrap overflow-y-auto leading-relaxed
                               ${expandedOutput ? 'max-h-[32rem]' : 'max-h-80'}
                               ${focusedSection === 'output' ? 'scale-[1.01] shadow-2xl' : 'shadow-lg'}
                               ${darkMode 
                                 ? 'bg-dark-700/80 border-green-500/30 text-dark-100 backdrop-blur-sm' 
                                 : 'bg-white/90 border-green-300/50 text-gray-700 backdrop-blur-sm'}`}
                     onFocus={() => setFocusedSection('output')}
                     onBlur={() => setFocusedSection(null)}
                     tabIndex={0}>
                  {upgradedPrompt}
                </div>
              </div>
              
              {/* Enhanced Improvement Metrics */}
              {inputPrompt && (
                <div className={`p-6 rounded-2xl shadow-lg ${getGradientBackground('secondary')}`}>
                  <h4 className={`font-bold text-lg mb-4 flex items-center space-x-3
                                ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                    <FaChartBar className="text-blue-500" />
                    <span>Enhancement Metrics</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold
                                   ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                      LIVE
                    </div>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Length Change',
                        value: `${upgradedPrompt.length > inputPrompt.length ? '+' : ''}${((upgradedPrompt.length - inputPrompt.length) / inputPrompt.length * 100).toFixed(1)}%`,
                        color: upgradedPrompt.length > inputPrompt.length 
                          ? 'text-green-500' 
                          : upgradedPrompt.length < inputPrompt.length 
                            ? 'text-red-500' 
                            : 'text-gray-500',
                        icon: FaChartLine
                      },
                      {
                        label: 'Token Count',
                        value: estimateTokenCount(upgradedPrompt).toLocaleString(),
                        color: getTokenCountColor(estimateTokenCount(upgradedPrompt)),
                        icon: FaLayerGroup
                      },
                      {
                        label: 'Est. Cost',
                        value: `$${estimateCost(estimateTokenCount(upgradedPrompt), selectedModel).toFixed(4)}`,
                        color: 'text-green-500',
                        icon: FaGlobe
                      },
                      {
                        label: 'Quality',
                        value: 'Enhanced',
                        color: darkMode ? 'text-purple-400' : 'text-purple-600',
                        icon: FaGraduationCap
                      }
                    ].map((metric, index) => (
                      <div key={index} className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 shadow-lg
                                                 ${darkMode ? 'bg-dark-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                        <div className="flex items-center justify-center mb-2">
                          <metric.icon className={`text-lg ${metric.color}`} />
                        </div>
                        <div className={`font-medium text-xs mb-1 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          {metric.label}
                        </div>
                        <div className={`text-lg font-bold ${metric.color}`}>
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Settings Panel */}
        {showSettings && (
          <div className={`mt-10 pt-8 border-t-2 transition-all duration-500 ${getGradientBackground('secondary')}
                         ${darkMode ? 'border-dark-600/50' : 'border-indigo-200/50'} rounded-2xl p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
                <FaCog className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Advanced Configuration
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold
                             ${darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                SMART AI
              </div>
            </div>
            
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