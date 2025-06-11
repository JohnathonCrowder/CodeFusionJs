import React from 'react';
import { 
  FaRandom, FaBrain, FaRocket, FaExclamationTriangle, 
  FaBookOpen, FaCheckCircle, FaUsers, FaGlobe, FaShieldAlt, 
  FaFlask, FaLayerGroup, FaFileAlt, FaBalanceScale, 
  FaArrowRight 
} from 'react-icons/fa';
import { UpgradeParameters } from '../PromptUpgraderSupport';

interface AdvancedConfigurationProps {
  upgradeParams: UpgradeParameters;
  onParamsChange: (params: Partial<UpgradeParameters>) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  darkMode: boolean;
}

const AdvancedConfiguration: React.FC<AdvancedConfigurationProps> = ({
  upgradeParams,
  onParamsChange,
  customInstructions,
  onCustomInstructionsChange,
  darkMode
}) => {
  const handleParamChange = (key: keyof UpgradeParameters, value: any) => {
    onParamsChange({ [key]: value });
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300 mt-8
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold transition-colors duration-300
                       ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
          Advanced Configuration
        </h2>
        <p className={`mt-1 text-sm transition-colors duration-300
                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
          Fine-tune your prompt upgrade with detailed parameters and enhancements
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    onChange={(e) => handleParamChange('detail_level', e.target.value as any)}
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
                    onChange={(e) => handleParamChange('output_format', e.target.value as any)}
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
                    onChange={(e) => handleParamChange('domain', e.target.value as any)}
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

                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Complexity Level
                  </label>
                  <select
                    value={upgradeParams.complexity_level}
                    onChange={(e) => handleParamChange('complexity_level', e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Language Style
                  </label>
                  <select
                    value={upgradeParams.language_style}
                    onChange={(e) => handleParamChange('language_style', e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="natural">Natural</option>
                    <option value="technical">Technical</option>
                    <option value="academic">Academic</option>
                    <option value="business">Business</option>
                    <option value="creative">Creative</option>
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
                onChange={(e) => onCustomInstructionsChange(e.target.value)}
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
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Content Enhancements
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'include_alternatives', label: 'Include Alternatives', icon: FaRandom },
                      { key: 'include_reasoning', label: 'Include Reasoning', icon: FaBrain },
                      { key: 'include_troubleshooting', label: 'Troubleshooting', icon: FaRocket },
                      { key: 'include_warnings', label: 'Include Warnings', icon: FaExclamationTriangle },
                      { key: 'include_resources', label: 'Include Resources', icon: FaBookOpen },
                      { key: 'include_validation', label: 'Include Validation', icon: FaCheckCircle }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-opacity-50 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                          onChange={(e) => handleParamChange(key as keyof UpgradeParameters, e.target.checked)}
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
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'add_chain_of_thought', label: 'Chain of Thought', icon: FaBrain },
                      { key: 'add_multi_perspective', label: 'Multi-Perspective', icon: FaUsers },
                      { key: 'include_verification_steps', label: 'Verification Steps', icon: FaCheckCircle },
                      { key: 'boost_creativity', label: 'Boost Creativity', icon: FaFlask },
                      { key: 'add_error_handling', label: 'Error Handling', icon: FaShieldAlt },
                      { key: 'add_context_awareness', label: 'Context Awareness', icon: FaGlobe }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-opacity-50 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                          onChange={(e) => handleParamChange(key as keyof UpgradeParameters, e.target.checked)}
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
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'strengthen_structure', label: 'Strengthen Structure', icon: FaLayerGroup },
                      { key: 'enhance_readability', label: 'Enhance Readability', icon: FaFileAlt },
                      { key: 'improve_coherence', label: 'Improve Coherence', icon: FaBalanceScale },
                      { key: 'improve_flow', label: 'Improve Flow', icon: FaArrowRight },
                      { key: 'add_edge_cases', label: 'Add Edge Cases', icon: FaFlask }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-opacity-50 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                          onChange={(e) => handleParamChange(key as keyof UpgradeParameters, e.target.checked)}
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
    </div>
  );
};

export default AdvancedConfiguration;