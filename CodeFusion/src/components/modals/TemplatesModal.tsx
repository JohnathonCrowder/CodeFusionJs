import React, { useState } from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import { UPGRADE_TEMPLATES } from '../prompt-upgrader/PromptUpgraderSupport';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: string;
  onApplyTemplate: (templateName: string) => void;
  darkMode: boolean;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onApplyTemplate,
  darkMode
}) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [lastAppliedTemplate, setLastAppliedTemplate] = useState<string>('');

  if (!isOpen) return null;

  const handleTemplateClick = async (templateName: string) => {
    setIsApplyingTemplate(true);
    setLastAppliedTemplate(templateName);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      onApplyTemplate(templateName);
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  const getTemplateDescription = (templateName: string) => {
    const descriptions: Record<string, string> = {
      'Code Generation': 'Optimized for generating clean, well-documented code with proper error handling and industry best practices.',
      'Code Review': 'Designed for comprehensive code analysis including quality, security, performance, and maintainability assessment.',
      'Documentation': 'Perfect for creating clear, comprehensive documentation with examples and proper formatting.',
      'Creative Writing': 'Enhances creative potential with multiple perspectives and innovative approaches.',
      'Debugging': 'Systematic debugging approach with step-by-step troubleshooting and validation steps.'
    };
    return descriptions[templateName] || 'Professional template for general use cases.';
  };

  const getTemplateIcon = (templateName: string) => {
    const icons: Record<string, string> = {
      'Code Generation': '🔧',
      'Code Review': '🔍',
      'Documentation': '📚',
      'Creative Writing': '✨',
      'Debugging': '🐛'
    };
    return icons[templateName] || '⚙️';
  };

  const getEnhancementCount = (template: any) => {
    const booleanFields = Object.entries(template).filter(([key, value]) => 
      typeof value === 'boolean' && value === true
    );
    return booleanFields.length;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh]
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Upgrade Templates
                </h2>
                <p className={`mt-1 text-sm transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Choose a pre-configured template to optimize your prompt upgrade
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300'
                            : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {Object.keys(UPGRADE_TEMPLATES).length === 0 ? (
              <div className="text-center py-8">
                <div className={`text-4xl mb-4`}>📝</div>
                <p className={`text-lg font-medium mb-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  No Templates Available
                </p>
                <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Templates are being loaded. Please try again in a moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(UPGRADE_TEMPLATES).map(([name, template]) => {
                  const isSelected = selectedTemplate === name;
                  const isApplying = isApplyingTemplate && lastAppliedTemplate === name;
                  
                  return (
                    <div
                      key={name}
                      onClick={() => !isApplyingTemplate && handleTemplateClick(name)}
                      className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                                ${isSelected
                                  ? darkMode
                                    ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20'
                                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                                  : darkMode
                                    ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                                ${isApplyingTemplate ? 'pointer-events-none opacity-75' : ''}
                                `}
                    >
                      {/* Template Icon & Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getTemplateIcon(name)}</div>
                          <div>
                            <h3 className={`font-bold text-lg
                                           ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                              {name.replace(/_/g, ' ')}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium
                                              ${darkMode 
                                                ? 'bg-blue-600/20 text-blue-400' 
                                                : 'bg-blue-100 text-blue-700'}`}>
                                {template.purpose.replace(/_/g, ' ')}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium
                                              ${darkMode 
                                                ? 'bg-green-600/20 text-green-400' 
                                                : 'bg-green-100 text-green-700'}`}>
                                {template.tone}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2">
                          {isApplying && (
                            <FaSpinner className="animate-spin text-blue-500" size={16} />
                          )}
                          {isSelected && !isApplying && (
                            <div className={`p-1 rounded-full
                                           ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}>
                              <FaCheck className="text-white" size={12} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-sm mb-4 leading-relaxed
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        {getTemplateDescription(name)}
                      </p>

                      {/* Template Details */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                              Detail Level:
                            </span>
                            <span className={`capitalize ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              {template.detail_level}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                              Domain:
                            </span>
                            <span className={`capitalize ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                              {template.domain?.replace(/_/g, ' ') || 'General'}
                            </span>
                          </div>
                        </div>

                        {/* Enhancement Count */}
                        <div className={`flex items-center justify-between pt-2 border-t
                                       ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                          <span className={`text-sm font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            Active Enhancements:
                          </span>
                          <div className={`flex items-center space-x-2`}>
                            <span className={`text-sm font-bold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                              {getEnhancementCount(template)}
                            </span>
                            <div className={`w-2 h-2 rounded-full
                                           ${getEnhancementCount(template) > 5 
                                             ? 'bg-green-500' 
                                             : getEnhancementCount(template) > 3 
                                               ? 'bg-yellow-500' 
                                               : 'bg-gray-400'
                                           }`} />
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="flex flex-wrap gap-1 pt-2">
                          {Object.entries(template)
                            .filter(([key, value]) => typeof value === 'boolean' && value)
                            .slice(0, 4)
                            .map(([key]) => (
                              <span
                                key={key}
                                className={`text-xs px-2 py-1 rounded-full
                                          ${darkMode 
                                            ? 'bg-dark-600 text-dark-300' 
                                            : 'bg-gray-100 text-gray-600'}`}
                              >
                                {key.replace(/_/g, ' ').replace(/^(include|add|improve|enhance)_?/, '')}
                              </span>
                            ))}
                          {getEnhancementCount(template) > 4 && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium
                                            ${darkMode 
                                              ? 'bg-blue-600/20 text-blue-400' 
                                              : 'bg-blue-100 text-blue-700'}`}>
                              +{getEnhancementCount(template) - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Apply Button Overlay */}
                      {!isSelected && (
                        <div className={`absolute inset-0 rounded-xl flex items-center justify-center
                                       opacity-0 hover:opacity-100 transition-opacity duration-200
                                       ${darkMode 
                                         ? 'bg-dark-900/80' 
                                         : 'bg-white/90'}`}>
                          <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                                            ${darkMode
                                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            {isApplying ? (
                              <div className="flex items-center space-x-2">
                                <FaSpinner className="animate-spin" />
                                <span>Applying...</span>
                              </div>
                            ) : (
                              'Apply Template'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex justify-between items-center p-6 border-t
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              {selectedTemplate ? (
                <span className="flex items-center space-x-2">
                  <FaCheck className="text-green-500" />
                  <span>Template "{selectedTemplate}" is currently active</span>
                </span>
              ) : (
                'Select a template to configure your upgrade parameters'
              )}
            </div>
            
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;