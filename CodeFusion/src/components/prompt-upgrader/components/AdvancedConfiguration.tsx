import React from 'react';
import { 
  FaRandom, FaBrain, FaRocket, FaExclamationTriangle, 
  FaBookOpen, FaCheckCircle, FaUsers, FaGlobe, FaShieldAlt, 
  FaFlask, FaLayerGroup, FaFileAlt, FaBalanceScale, 
  FaArrowRight, FaCode, FaPalette, FaGraduationCap,
  FaIndustry, FaLanguage, FaMarkdown
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
    <div className={`rounded-xl border transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold transition-colors duration-300
                       ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
          Configuration Settings
        </h2>
        <p className={`mt-1 text-sm transition-colors duration-300
                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
          Configure all aspects of your prompt upgrade with comprehensive settings
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Primary Configuration */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaCode className="text-blue-500" />
                <span>Primary Settings</span>
              </h3>
              
              <div className="space-y-4">
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
                    <option value="analysis">Analysis & Review</option>
                    <option value="documentation">Documentation</option>
                    <option value="debugging">Debugging</option>
                    <option value="creative">Creative Writing</option>
                    <option value="general">General Purpose</option>
                    <option value="testing">Testing</option>
                    <option value="refactoring">Refactoring</option>
                    <option value="optimization">Optimization</option>
                    <option value="explanation">Explanation</option>
                    <option value="translation">Translation</option>
                    <option value="research">Research</option>
                    <option value="planning">Planning</option>
                    <option value="review">Review</option>
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
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="conversational">Conversational</option>
                    <option value="formal">Formal</option>
                    <option value="encouraging">Encouraging</option>
                    <option value="direct">Direct</option>
                    <option value="diplomatic">Diplomatic</option>
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
                    <option value="students">Students</option>
                    <option value="professionals">Professionals</option>
                    <option value="researchers">Researchers</option>
                    <option value="general_public">General Public</option>
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
              </div>
            </div>
          </div>

          {/* Format & Style Configuration */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaPalette className="text-purple-500" />
                <span>Format & Style</span>
              </h3>
              
              <div className="space-y-4">
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
                    Response Style
                  </label>
                  <select
                    value={upgradeParams.response_style}
                    onChange={(e) => handleParamChange('response_style', e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="direct">Direct</option>
                    <option value="explanatory">Explanatory</option>
                    <option value="interactive">Interactive</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="reference">Reference</option>
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

                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Vocabulary Level
                  </label>
                  <select
                    value={upgradeParams.vocabulary_level}
                    onChange={(e) => handleParamChange('vocabulary_level', e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="advanced">Advanced</option>
                    <option value="specialized">Specialized</option>
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
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Depth
                  </label>
                  <select
                    value={upgradeParams.depth}
                    onChange={(e) => handleParamChange('depth', e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100'
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="surface">Surface</option>
                    <option value="moderate">Moderate</option>
                    <option value="deep">Deep</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhancement Options */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaRocket className="text-green-500" />
                <span>Enhancement Options</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Content Enhancements
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: 'include_examples', label: 'Include Examples', icon: FaBookOpen },
                      { key: 'include_constraints', label: 'Include Constraints', icon: FaShieldAlt },
                      { key: 'include_context', label: 'Include Context', icon: FaGlobe },
                      { key: 'include_alternatives', label: 'Include Alternatives', icon: FaRandom },
                      { key: 'include_reasoning', label: 'Include Reasoning', icon: FaBrain },
                      { key: 'include_troubleshooting', label: 'Include Troubleshooting', icon: FaRocket },
                      { key: 'include_best_practices', label: 'Include Best Practices', icon: FaCheckCircle },
                      { key: 'include_warnings', label: 'Include Warnings', icon: FaExclamationTriangle },
                      { key: 'include_resources', label: 'Include Resources', icon: FaBookOpen },
                      { key: 'include_validation', label: 'Include Validation', icon: FaCheckCircle }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-opacity-50 hover:bg-gray-100">
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
                  <div className="space-y-2">
                    {[
                      { key: 'improve_clarity', label: 'Improve Clarity', icon: FaFileAlt },
                      { key: 'enhance_specificity', label: 'Enhance Specificity', icon: FaArrowRight },
                      { key: 'boost_creativity', label: 'Boost Creativity', icon: FaFlask },
                      { key: 'strengthen_structure', label: 'Strengthen Structure', icon: FaLayerGroup },
                      { key: 'add_error_handling', label: 'Add Error Handling', icon: FaShieldAlt },
                      { key: 'improve_flow', label: 'Improve Flow', icon: FaArrowRight },
                      { key: 'enhance_readability', label: 'Enhance Readability', icon: FaFileAlt },
                      { key: 'add_edge_cases', label: 'Add Edge Cases', icon: FaFlask },
                      { key: 'improve_coherence', label: 'Improve Coherence', icon: FaBalanceScale },
                      { key: 'add_context_awareness', label: 'Add Context Awareness', icon: FaGlobe }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-opacity-50 hover:bg-gray-100">
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
                  <div className="space-y-2">
                    {[
                      { key: 'add_chain_of_thought', label: 'Chain of Thought', icon: FaBrain },
                      { key: 'include_self_reflection', label: 'Self Reflection', icon: FaBrain },
                      { key: 'add_multi_perspective', label: 'Multi-Perspective', icon: FaUsers },
                      { key: 'include_verification_steps', label: 'Verification Steps', icon: FaCheckCircle },
                      { key: 'add_iterative_refinement', label: 'Iterative Refinement', icon: FaArrowRight },
                      { key: 'include_fallback_strategies', label: 'Fallback Strategies', icon: FaShieldAlt }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-opacity-50 hover:bg-gray-100">
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

                {/* Markdown Setting - Disabled by Default */}
                <div className={`p-4 rounded-lg border-2 border-dashed
                               ${darkMode ? 'border-yellow-600 bg-yellow-900/10' : 'border-yellow-400 bg-yellow-50'}`}>
                  <h4 className={`text-sm font-semibold mb-2 flex items-center space-x-2
                                 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    <FaMarkdown />
                    <span>Formatting Options</span>
                  </h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upgradeParams.enable_markdown}
                      onChange={(e) => handleParamChange('enable_markdown', e.target.checked)}
                      className="rounded text-yellow-600 focus:ring-yellow-500"
                    />
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        Enable Markdown Formatting
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Disabled by default. Enable to use markdown syntax in upgraded prompts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Instructions - Full Width */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                         ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
            <FaLanguage className="text-indigo-500" />
            <span>Custom Instructions</span>
          </h3>
          <textarea
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                      focus:outline-none focus:ring-2 resize-none text-sm
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            placeholder="Add specific instructions for the upgrade process. These will be incorporated into the upgrade prompt to provide additional context and requirements..."
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedConfiguration;