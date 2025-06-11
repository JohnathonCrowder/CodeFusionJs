import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { UPGRADE_TEMPLATES } from '../PromptUpgraderSupport';

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
  if (!isOpen) return null;

  return (
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

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(UPGRADE_TEMPLATES).map(([name, template]) => (
                <div
                  key={name}
                  onClick={() => onApplyTemplate(name)}
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
                    {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
  );
};

export default TemplatesModal;