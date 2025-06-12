import React from 'react';
import { 
  FaBrain, FaUsers, FaCode, FaChevronDown, FaChevronUp, 
  FaLightbulb, FaShieldAlt, FaBookOpen, FaLanguage,
  FaToggleOn, FaToggleOff, FaCog, FaRocket
} from 'react-icons/fa';
import { UpgradeParameters } from '../PromptUpgraderSupport';

interface SmartConfigurationProps {
  upgradeParams: UpgradeParameters;
  onParamsChange: (params: Partial<UpgradeParameters>) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  darkMode: boolean;
  configurationMode: 'smart' | 'manual';
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

const SmartConfiguration: React.FC<SmartConfigurationProps> = ({
  upgradeParams,
  onParamsChange,
  customInstructions,
  onCustomInstructionsChange,
  darkMode,
  configurationMode,
  showAdvanced,
  onToggleAdvanced
}) => {
  const handleParamChange = (key: keyof UpgradeParameters, value: any) => {
    onParamsChange({ [key]: value });
  };

  // Smart mode presets
  const smartPresets = [
    {
      id: 'balanced',
      name: 'Balanced Enhancement',
      description: 'Comprehensive improvement with examples and best practices',
      icon: FaRocket,
      params: {
        include_examples: true,
        include_best_practices: true,
        improve_clarity: true,
        enhance_specificity: true,
        strengthen_structure: true
      }
    },
    {
      id: 'professional',
      name: 'Professional Focus',
      description: 'Business-ready with constraints and validation',
      icon: FaShieldAlt,
      params: {
        include_constraints: true,
        include_validation: true,
        include_best_practices: true,
        tone: 'professional' as const
      }
    },
    {
      id: 'creative',
      name: 'Creative Boost',
      description: 'Enhanced creativity with multiple perspectives',
      icon: FaLightbulb,
      params: {
        boost_creativity: true,
        add_multi_perspective: true,
        include_alternatives: true,
        tone: 'friendly' as const
      }
    },
    {
      id: 'technical',
      name: 'Technical Deep-dive',
      description: 'Detailed technical analysis with troubleshooting',
      icon: FaCode,
      params: {
        include_troubleshooting: true,
        add_error_handling: true,
        include_reasoning: true,
        tone: 'technical' as const
      }
    }
  ];

  const applyPreset = (preset: typeof smartPresets[0]) => {
    onParamsChange(preset.params);
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold transition-colors duration-300
                         ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Configuration Settings
          </h2>
          <button
            onClick={onToggleAdvanced}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                      transition-colors duration-200
                      ${darkMode
                        ?'hover:bg-dark-600 text-dark-300'
                        : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <FaCog />
            <span>{showAdvanced ? 'Simple' : 'Advanced'}</span>
            {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      <div className="p-6">
        {configurationMode === 'smart' ? (
          // Smart Mode - Preset-based configuration
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaBrain className="text-blue-500" />
                <span>Smart Presets</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {smartPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                              hover:scale-105 hover:shadow-lg
                              ${darkMode
                                ? 'border-dark-600 bg-dark-700 hover:border-blue-500'
                                : 'border-gray-200 bg-gray-50 hover:border-blue-400'}`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <preset.icon className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        {preset.name}
                      </h4>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Essential Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Purpose
                </label>
                <select
                  value={upgradeParams.purpose}
                  onChange={(e) => handleParamChange('purpose', e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100'
                              : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="code_generation">Code Generation</option>
                  <option value="analysis">Analysis</option>
                  <option value="documentation">Documentation</option>
                  <option value="creative">Creative</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Target Audience
                </label>
                <select
                  value={upgradeParams.target_audience}
                  onChange={(e) => handleParamChange('target_audience', e.target.value as any)}
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

              <div>
                <label className={`block text-sm font-medium mb-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Detail Level
                </label>
                <select
                  value={upgradeParams.detail_level}
                  onChange={(e) => handleParamChange('detail_level', e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100'
                              : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          // Manual Mode - Full control
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Core Settings */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  <FaCog className="text-purple-500" />
                  <span>Core Settings</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Consolidated core settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        Purpose
                      </label>
                      <select
                        value={upgradeParams.purpose}
                        onChange={(e) => handleParamChange('purpose', e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="code_generation">Code Generation</option>
                        <option value="analysis">Analysis</option>
                        <option value="documentation">Documentation</option>
                        <option value="debugging">Debugging</option>
                        <option value="creative">Creative</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        Tone
                      </label>
                      <select
                        value={upgradeParams.tone}
                        onChange={(e) => handleParamChange('tone', e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="professional">Professional</option>
                        <option value="technical">Technical</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Enhancements */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  <FaRocket className="text-green-500" />
                  <span>Quick Enhancements</span>
                </h3>
                
                <div className="space-y-3">
                  {[
                    { key: 'include_examples', label: 'Add Examples', icon: FaBookOpen },
                    { key: 'include_best_practices', label: 'Best Practices', icon: FaShieldAlt },
                    { key: 'improve_clarity', label: 'Improve Clarity', icon: FaLightbulb },
                    { key: 'enhance_specificity', label: 'More Specific', icon: FaUsers }
                  ].map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors hover:bg-opacity-50 hover:bg-gray-100">
                      <div className="flex items-center space-x-3">
                        <Icon className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                        className="text-lg"
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings (Collapsible) */}
        {showAdvanced && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                           ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              <FaCog className="text-indigo-500" />
              <span>Advanced Options</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advanced toggles organized by category */}
              <div>
                <h4 className={`font-medium mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Content Features
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'include_constraints', label: 'Constraints' },
                    { key: 'include_context', label: 'Context' },
                    { key: 'include_alternatives', label: 'Alternatives' },
                    { key: 'include_reasoning', label: 'Reasoning' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Quality Improvements
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'strengthen_structure', label: 'Structure' },
                    { key: 'improve_flow', label: 'Flow' },
                    { key: 'enhance_readability', label: 'Readability' },
                    { key: 'improve_coherence', label: 'Coherence' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Advanced Features
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'add_chain_of_thought', label: 'Chain of Thought' },
                    { key: 'add_multi_perspective', label: 'Multi-Perspective' },
                    { key: 'include_verification_steps', label: 'Verification' },
                    { key: 'boost_creativity', label: 'Creativity' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Instructions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                         ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
            <FaLanguage className="text-indigo-500" />
            <span>Custom Instructions</span>
          </h3>
          <textarea
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                      focus:outline-none focus:ring-2 resize-none text-sm
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            placeholder="Add specific instructions for the upgrade process..."
          />
        </div>
      </div>
    </div>
  );
};

export default SmartConfiguration;