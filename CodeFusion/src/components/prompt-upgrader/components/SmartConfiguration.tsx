import React, { useState } from 'react';
import { 
  FaBrain, FaUsers, FaCode, FaChevronDown, FaChevronUp, 
  FaLightbulb, FaShieldAlt, FaBookOpen, FaLanguage,
  FaToggleOn, FaToggleOff, FaCog, FaRocket, FaInfoCircle,
  FaRandom, FaExclamationTriangle, FaCheckCircle, FaGlobe,
  FaFlask, FaLayerGroup, FaFileAlt, FaBalanceScale, 
  FaArrowRight, FaPalette, FaGraduationCap, FaIndustry,
  FaMarkdown, FaTimes, FaQuestionCircle, FaStar,
  FaTools, FaEye, FaSearch, FaCubes, FaCompass,
  FaFilter, FaExpand, FaCompress, 
} from 'react-icons/fa';
import { UpgradeParameters, UPGRADE_TEMPLATES } from '../PromptUpgraderSupport';

interface SmartConfigurationProps {
  upgradeParams: UpgradeParameters;
  onParamsChange: (params: Partial<UpgradeParameters>) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  darkMode: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  selectedTemplate: string;
  onApplyTemplate: (templateName: string) => void;
}

interface TooltipProps {
  content: string;
  title?: string;
  children: React.ReactNode;
  darkMode: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showIcon?: boolean;
  maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  title, 
  children, 
  darkMode, 
  position = 'top', 
  size = 'medium',
  showIcon = true,
  maxWidth 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    small: maxWidth || 'max-w-sm w-80',
    medium: maxWidth || 'max-w-md w-96', 
    large: maxWidth || 'max-w-lg w-[28rem]',
    xlarge: maxWidth || 'max-w-2xl w-[36rem]'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center"
        tabIndex={0}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} animate-fade-in`}>
          <div className={`${sizeClasses[size]} px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm
                          ${darkMode
                            ? 'bg-dark-900/95 text-dark-100 border-dark-600 shadow-black/30'
                            : 'bg-white/95 text-gray-800 border-gray-300 shadow-gray-500/30'}`}>
            
            {title && (
              <div className={`font-semibold mb-2 pb-2 border-b flex items-center space-x-2 text-sm
                             ${darkMode ? 'border-dark-600 text-dark-50' : 'border-gray-200 text-gray-900'}`}>
                {showIcon && <FaInfoCircle className="text-blue-500 flex-shrink-0" />}
                <span className="font-bold">{title}</span>
              </div>
            )}
            
            <div className="leading-relaxed whitespace-pre-line text-sm">
              {content}
            </div>
            
            <div className={`absolute w-0 h-0 border-8
                           ${arrowClasses[position]}
                           ${darkMode ? 'border-dark-900/95' : 'border-white/95'}`} />
          </div>
        </div>
      )}
    </div>
  );
};

const SmartConfiguration: React.FC<SmartConfigurationProps> = ({
  upgradeParams,
  onParamsChange,
  customInstructions,
  onCustomInstructionsChange,
  darkMode,
  showAdvanced,
  onToggleAdvanced,
  selectedTemplate,
  onApplyTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  const [searchFilter, setSearchFilter] = useState('');

  const handleParamChange = (key: keyof UpgradeParameters, value: any) => {
    onParamsChange({ [key]: value });
  };

  const getTemplateDescription = (templateName: string) => {
    const descriptions: Record<string, string> = {
      'Code Generation': 'Optimized for generating clean, well-documented code with proper error handling and industry best practices.',
      'Code Review': 'Designed for comprehensive code analysis including quality, security, performance, and maintainability assessment.',
      'Documentation': 'Perfect for creating clear, comprehensive documentation with examples and proper formatting.',
      'Creative Writing': 'Enhances creative potential with multiple perspectives and innovative approaches.',
      'Debugging': 'Systematic debugging approach with step-by-step troubleshooting and validation steps.',
      'Analysis': 'Thorough analysis with evidence-based reasoning and multiple perspectives.',
      'Research': 'Comprehensive research guidance with proper methodology and validation techniques.',
      'Educational': 'Clear, engaging educational content with progressive difficulty and practical examples.'
    };
    return descriptions[templateName] || 'Professional template for general use cases.';
  };

  const getTemplateIcon = (templateName: string) => {
    const icons: Record<string, React.ComponentType> = {
      'Code Generation': FaCode,
      'Code Review': FaSearch,
      'Documentation': FaBookOpen,
      'Creative Writing': FaSearch,
      'Debugging': FaTools,
      'Analysis': FaBrain,
      'Research': FaFlask,
      'Educational': FaGraduationCap
    };
    return icons[templateName] || FaCog;
  };

  const getEnhancementCount = (template: any) => {
    const booleanFields = Object.entries(template).filter(([key, value]) => 
      typeof value === 'boolean' && value === true
    );
    return booleanFields.length;
  };

  const getActiveEnhancementCount = () => {
    return Object.entries(upgradeParams).filter(([key, value]) => 
      typeof value === 'boolean' && value === true
    ).length;
  };

  // Enhanced tooltip content
  const tooltipContent = {
    purpose: {
      title: "Prompt Purpose & Objective",
      content: `Defines the main objective and use case for your prompt upgrade, influencing all enhancement decisions.

🎯 **Code Generation**: Optimizes for creating functional, maintainable code
📊 **Analysis**: Enhances analytical and review capabilities  
📝 **Documentation**: Improves explanatory and instructional content
🐛 **Debugging**: Focuses on problem-solving and troubleshooting
🎨 **Creative**: Boosts innovative and creative thinking
⚙️ **General**: Balanced enhancement for versatile use cases

This setting influences tone, structure, enhancement priorities, and specialized features throughout the upgrade process.`
    },
    
    tone: {
      title: "Communication Tone & Style",
      content: `Sets the personality and communication approach of your upgraded prompt.

👔 **Professional**: Formal, business-appropriate language
🔧 **Technical**: Precise, detailed technical communication
😊 **Friendly**: Approachable, warm interaction style
💬 **Casual**: Relaxed, conversational approach
📢 **Authoritative**: Confident, commanding presence

The tone affects vocabulary choice, sentence structure, interaction patterns, and overall user experience.`
    },

    target_audience: {
      title: "Target Audience & Skill Level",
      content: `Specifies the intended users and adjusts complexity, terminology, and explanation depth accordingly.

🌱 **Beginner**: Simple explanations, foundational concepts
📈 **Intermediate**: Moderate complexity, some assumptions
🎓 **Expert**: Advanced concepts, technical depth
🔄 **Mixed**: Adaptable to various skill levels
👨‍🎓 **Students**: Educational focus, learning-oriented
👨‍💼 **Professionals**: Work-focused, practical applications

This determines vocabulary level, explanation depth, example complexity, and assumed background knowledge.`
    },

    detail_level: {
      title: "Information Detail & Comprehensiveness",
      content: `Controls the amount of information, explanation depth, and comprehensive coverage provided in responses.

📋 **Minimal**: Essential information only
✂️ **Concise**: Key points without excess detail
📄 **Detailed**: Comprehensive coverage of topics
📚 **Comprehensive**: Thorough, extensive information
🔍 **Exhaustive**: Complete, in-depth exploration

Higher detail levels provide more context and comprehensive coverage but may increase prompt length and complexity.`
    }
  };

  const TabButton = ({ id, label, icon: Icon, count }: { id: 'quick' | 'advanced', label: string, icon: React.ComponentType<any>, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === id
                  ? darkMode 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-blue-500 text-white shadow-lg'
                  : darkMode
                    ? 'text-dark-300 hover:bg-dark-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-1 rounded-full text-xs font-bold
                         ${activeTab === id 
                           ? 'bg-white/20 text-white' 
                           : darkMode 
                             ? 'bg-blue-600/20 text-blue-400'
                             : 'bg-blue-100 text-blue-700'
                         }`}>
          {count}
        </span>
      )}
    </button>
  );

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
              <FaCog className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Smart Configuration
              </h2>
              <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Customize your prompt enhancement settings
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium
                           ${darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
              {getActiveEnhancementCount()} active
            </div>
            <Tooltip 
              title="Configuration Guide"
              content={`Smart configuration system for optimal prompt enhancement.

🎯 **Quick Setup**: Templates and essential settings
⚙️ **Advanced**: Detailed customization options
📊 **Real-time**: See changes reflected immediately

Choose templates for instant setup, then fine-tune with advanced options.`}
              darkMode={darkMode}
              size="large"
            >
              <FaInfoCircle className={`cursor-help transition-colors duration-200 hover:text-blue-500
                                      ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
            </Tooltip>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-4">
          <TabButton id="quick" label="Quick Setup" icon={FaRocket} count={getActiveEnhancementCount()} />
          <TabButton id="advanced" label="Advanced" icon={FaTools} />
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'quick' ? (
          <div className="space-y-8">
            {/* Template Selection */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Enhancement Templates
                  </h3>
                  <Tooltip 
                    title="Template System"
                    content={`Pre-configured enhancement combinations for common use cases.

🚀 **Smart Templates**:
• Automatically configure multiple settings
• Optimized for specific purposes
• Save time with proven combinations
• Customizable after selection

Select a template that matches your needs, then adjust individual settings if needed.`}
                    darkMode={darkMode}
                    size="large"
                  >
                    <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-blue-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(UPGRADE_TEMPLATES).map(([name, template]) => {
                  const isSelected = selectedTemplate === name;
                  const IconComponent = getTemplateIcon(name);
                  
                  return (
                    <div
                      key={name}
                      onClick={() => onApplyTemplate(name)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                                ${isSelected
                                  ? darkMode
                                    ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                                  : darkMode
                                    ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isSelected 
                                         ? darkMode ? 'bg-blue-600/30' : 'bg-blue-200' 
                                         : darkMode ? 'bg-dark-600' : 'bg-gray-100'}`}>
                            <IconComponent className={isSelected 
                                                   ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                                   : darkMode ? 'text-dark-400' : 'text-gray-600'} size={16} />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                              {name.replace(/_/g, ' ')}
                            </h4>
                            <div className={`text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block
                                           ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                              {template.purpose.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="p-1 rounded-full bg-blue-500">
                            <FaCheckCircle className="text-white" size={12} />
                          </div>
                        )}
                      </div>

                      <p className={`text-xs mb-3 leading-relaxed line-clamp-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {getTemplateDescription(name)}
                      </p>

                      <div className={`flex items-center justify-between text-xs
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        <span>Features:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{getEnhancementCount(template)}</span>
                          <div className={`w-2 h-2 rounded-full
                                         ${getEnhancementCount(template) > 8 
                                           ? 'bg-green-500' 
                                           : getEnhancementCount(template) > 5
                                             ? 'bg-yellow-500' 
                                             : 'bg-blue-500'
                                         }`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Settings */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                Core Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'purpose', label: 'Purpose', tooltip: tooltipContent.purpose, options: [
                    { value: 'code_generation', label: 'Code Generation' },
                    { value: 'analysis', label: 'Analysis' },
                    { value: 'documentation', label: 'Documentation' },
                    { value: 'creative', label: 'Creative' },
                    { value: 'general', label: 'General' }
                  ]},
                  { key: 'tone', label: 'Tone', tooltip: tooltipContent.tone, options: [
                    { value: 'professional', label: 'Professional' },
                    { value: 'technical', label: 'Technical' },
                    { value: 'friendly', label: 'Friendly' },
                    { value: 'casual', label: 'Casual' }
                  ]},
                  { key: 'target_audience', label: 'Audience', tooltip: tooltipContent.target_audience, options: [
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'expert', label: 'Expert' },
                    { value: 'mixed', label: 'Mixed' }
                  ]},
                  { key: 'detail_level', label: 'Detail', tooltip: tooltipContent.detail_level, options: [
                    { value: 'concise', label: 'Concise' },
                    { value: 'detailed', label: 'Detailed' },
                    { value: 'comprehensive', label: 'Comprehensive' }
                  ]}
                ].map(({ key, label, tooltip, options }) => (
                  <div key={key} className={`p-4 rounded-lg border ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <label className={`text-sm font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {label}
                      </label>
                      <Tooltip 
                        title={tooltip.title}
                        content={tooltip.content} 
                        darkMode={darkMode}
                        size="xlarge"
                      >
                        <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                      </Tooltip>
                    </div>
                    <select
                      value={upgradeParams[key as keyof UpgradeParameters] as string}
                      onChange={(e) => handleParamChange(key as keyof UpgradeParameters, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-800 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Enhancements */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                Essential Enhancements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: 'include_examples', label: 'Add Examples', icon: FaBookOpen, desc: 'Concrete examples for clarity' },
                  { key: 'include_best_practices', label: 'Best Practices', icon: FaShieldAlt, desc: 'Industry standards' },
                  { key: 'improve_clarity', label: 'Improve Clarity', icon: FaLightbulb, desc: 'Clear communication' },
                  { key: 'enhance_specificity', label: 'More Specific', icon: FaUsers, desc: 'Detailed guidance' }
                ].map(({ key, label, icon: Icon, desc }) => {
                  const isActive = upgradeParams[key as keyof UpgradeParameters] as boolean;
                  return (
                    <div
                      key={key}
                      onClick={() => handleParamChange(key as keyof UpgradeParameters, !isActive)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]
                                ${isActive
                                  ? darkMode
                                    ? 'border-blue-500 bg-blue-900/20 shadow-md'
                                    : 'border-blue-500 bg-blue-50 shadow-md'
                                  : darkMode
                                    ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg ${isActive 
                                       ? darkMode ? 'bg-blue-600/30' : 'bg-blue-200' 
                                       : darkMode ? 'bg-dark-600' : 'bg-gray-100'}`}>
                          <Icon className={isActive 
                                         ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                         : darkMode ? 'text-dark-400' : 'text-gray-600'} size={16} />
                        </div>
                        <div className={`p-1 rounded-full transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                          {isActive ? (
                            <FaToggleOn className="text-blue-500" size={20} />
                          ) : (
                            <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} size={20} />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-medium text-sm mb-1 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                          {label}
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Advanced Tab Content
          <div className="space-y-8">
            {/* Search/Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm
                                    ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search advanced options..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Content Features */}
              <div className={`p-6 rounded-xl border ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <FaCubes className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={16} />
                  </div>
                  <h4 className={`font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Content Features
                  </h4>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'include_constraints', label: 'Constraints', desc: 'Add limitations and boundaries' },
                    { key: 'include_context', label: 'Context', desc: 'Background information' },
                    { key: 'include_alternatives', label: 'Alternatives', desc: 'Multiple approaches' },
                    { key: 'include_reasoning', label: 'Reasoning', desc: 'Explain the why' },
                    { key: 'include_troubleshooting', label: 'Troubleshooting', desc: 'Problem-solving guidance' },
                    { key: 'include_warnings', label: 'Warnings', desc: 'Important cautions' },
                    { key: 'include_resources', label: 'Resources', desc: 'Additional references' },
                    { key: 'include_validation', label: 'Validation', desc: 'Verification steps' }
                  ].filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map(({ key, label, desc }) => {
                    const isActive = upgradeParams[key as keyof UpgradeParameters] as boolean;
                    return (
                      <div
                        key={key}
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !isActive)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                                  ${isActive 
                                    ? darkMode ? 'bg-blue-900/30 border border-blue-600' : 'bg-blue-50 border border-blue-200'
                                    : darkMode ? 'hover: bg-dark-600' : 'hover:bg-white'
                                  }`}
                      >
                        <div>
                          <div className={`font-medium text-sm ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                            {label}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            {desc}
                          </div>
                        </div>
                        <div className="transition-transform duration-200">
                          {isActive ? (
                            <FaToggleOn className="text-blue-500" size={18} />
                          ) : (
                            <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} size={18} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quality Improvements */}
              <div className={`p-6 rounded-xl border ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-600/20' : 'bg-yellow-100'}`}>
                    <FaStar className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} size={16} />
                  </div>
                  <h4 className={`font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Quality Improvements
                  </h4>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'strengthen_structure', label: 'Structure', desc: 'Logical organization' },
                    { key: 'improve_flow', label: 'Flow', desc: 'Smooth transitions' },
                    { key: 'enhance_readability', label: 'Readability', desc: 'Clear presentation' },
                    { key: 'improve_coherence', label: 'Coherence', desc: 'Consistent messaging' },
                    { key: 'add_error_handling', label: 'Error Handling', desc: 'Robust error management' },
                    { key: 'add_edge_cases', label: 'Edge Cases', desc: 'Handle exceptions' },
                    { key: 'add_context_awareness', label: 'Context Awareness', desc: 'Situational understanding' }
                  ].filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map(({ key, label, desc }) => {
                    const isActive = upgradeParams[key as keyof UpgradeParameters] as boolean;
                    return (
                      <div
                        key={key}
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !isActive)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                                  ${isActive 
                                    ? darkMode ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
                                    : darkMode ? 'hover:bg-dark-600' : 'hover:bg-white'
                                  }`}
                      >
                        <div>
                          <div className={`font-medium text-sm ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                            {label}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            {desc}
                          </div>
                        </div>
                        <div className="transition-transform duration-200">
                          {isActive ? (
                            <FaToggleOn className="text-yellow-500" size={18} />
                          ) : (
                            <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} size={18} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Features */}
              <div className={`p-6 rounded-xl border ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
                    <FaCompass className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={16} />
                  </div>
                  <h4 className={`font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Advanced Features
                  </h4>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'add_chain_of_thought', label: 'Chain of Thought', desc: 'Step-by-step reasoning' },
                    { key: 'add_multi_perspective', label: 'Multi-Perspective', desc: 'Multiple viewpoints' },
                    { key: 'include_verification_steps', label: 'Verification', desc: 'Quality checks' },
                    { key: 'boost_creativity', label: 'Creativity', desc: 'Innovative thinking' },
                    { key: 'include_self_reflection', label: 'Self Reflection', desc: 'Meta-cognitive awareness' },
                    { key: 'add_iterative_refinement', label: 'Iterative Refinement', desc: 'Continuous improvement' },
                    { key: 'include_fallback_strategies', label: 'Fallback Strategies', desc: 'Alternative approaches' }
                  ].filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map(({ key, label, desc }) => {
                    const isActive = upgradeParams[key as keyof UpgradeParameters] as boolean;
                    return (
                      <div
                        key={key}
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !isActive)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                                  ${isActive 
                                    ? darkMode ? 'bg-purple-900/30 border border-purple-600' : 'bg-purple-50 border border-purple-200'
                                    : darkMode ? 'hover:bg-dark-600' : 'hover:bg-white'
                                  }`}
                      >
                        <div>
                          <div className={`font-medium text-sm ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                            {label}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            {desc}
                          </div>
                        </div>
                        <div className="transition-transform duration-200">
                          {isActive ? (
                            <FaToggleOn className="text-purple-500" size={18} />
                          ) : (
                            <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} size={18} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Markdown Setting */}
            <div className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200
                           ${darkMode ? 'border-orange-600 bg-orange-900/10' : 'border-orange-400 bg-orange-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-600/20' : 'bg-orange-100'}`}>
                    <FaMarkdown className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                      Markdown Formatting
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      Enable rich text formatting in upgraded prompts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleParamChange('enable_markdown', !upgradeParams.enable_markdown)}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  {upgradeParams.enable_markdown ? (
                    <FaToggleOn className="text-orange-500" size={24} />
                  ) : (
                    <FaToggleOff className={darkMode ? 'text-orange-600' : 'text-orange-400'} size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Instructions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-100'}`}>
              <FaLanguage className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} size={16} />
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              Custom Instructions
            </h3>
            <Tooltip 
              title="Custom Instructions"
              content={`Add specific requirements and preferences for your prompt upgrade.

✍️ **Perfect for**:
• Domain-specific requirements
• Unique formatting preferences  
• Special constraints or considerations
• Industry-specific terminology

These instructions are integrated directly into the upgrade process.`}
              darkMode={darkMode}
              size="large"
            >
              <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-indigo-500
                                      ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
            </Tooltip>
          </div>
          <div className="relative">
            <textarea
              value={customInstructions}
              onChange={(e) => onCustomInstructionsChange(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                        focus:outline-none focus:ring-2 resize-none text-sm
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-indigo-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'}`}
              placeholder="Add specific instructions for your prompt upgrade. For example: 'Focus on security best practices', 'Include performance considerations', or 'Use beginner-friendly language'..."
            />
            <div className={`absolute bottom-3 right-3 text-xs ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              {customInstructions.length} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartConfiguration;