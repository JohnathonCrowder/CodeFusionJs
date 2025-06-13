import React from 'react';
import { FaTimes, FaCopy } from 'react-icons/fa';
import { PromptAnalysis, getScoreColor } from '../../prompt-upgrader/PromptUpgraderSupport';
import { estimateTokenCount } from '../../../utils/tokenUtils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonPrompts: {
    original: string;
    upgraded: string;
    analysis?: PromptAnalysis;
  };
  darkMode: boolean;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  comparisonPrompts,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh]
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Prompt Comparison
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

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Metrics Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className={`p-4 rounded-lg text-center
                             ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  Length Change
                </h4>
                <div className={`text-2xl font-bold ${
                  comparisonPrompts.upgraded.length > comparisonPrompts.original.length 
                    ? 'text-green-500' 
                    : comparisonPrompts.upgraded.length < comparisonPrompts.original.length 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                }`}>
                  {comparisonPrompts.upgraded.length > comparisonPrompts.original.length ? '+' : ''}
                  {((comparisonPrompts.upgraded.length - comparisonPrompts.original.length) / comparisonPrompts.original.length * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className={`p-4 rounded-lg text-center
                             ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  Token Difference
                </h4>
                <div className={`text-2xl font-bold text-blue-500`}>
                  +{estimateTokenCount(comparisonPrompts.upgraded) - estimateTokenCount(comparisonPrompts.original)}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg text-center
                             ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  Estimated Quality
                </h4>
                <div className={`text-2xl font-bold text-green-500`}>
                  Improved
                </div>
              </div>
            </div>

            {/* Side-by-side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  <span className={`w-3 h-3 rounded-full bg-red-500`}></span>
                  <span>Original Prompt</span>
                  <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    ({comparisonPrompts.original.length} chars, {estimateTokenCount(comparisonPrompts.original)} tokens)
                  </span>
                </h3>
                <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                 : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  {comparisonPrompts.original}
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  <span className={`w-3 h-3 rounded-full bg-green-500`}></span>
                  <span>Upgraded Prompt</span>
                  <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    ({comparisonPrompts.upgraded.length} chars, {estimateTokenCount(comparisonPrompts.upgraded)} tokens)
                  </span>
                </h3>
                <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                 : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  {comparisonPrompts.upgraded}
                </div>
              </div>
            </div>

            {/* Analysis Comparison */}
            {comparisonPrompts.analysis && (
              <div className="mt-6">
                <h3 className={`text-lg font-bold mb-4
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Quality Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'clarity', label: 'Clarity' },
                    { key: 'specificity', label: 'Specificity' },
                    { key: 'effectiveness', label: 'Effectiveness' },
                    { key: 'structure', label: 'Structure' }
                  ].map(({ key, label }) => (
                    <div key={key} className={`p-3 rounded-lg text-center
                                               ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                      <div className={`text-lg font-bold ${getScoreColor(comparisonPrompts.analysis![key as keyof PromptAnalysis] as number, darkMode)}`}>
                        {comparisonPrompts.analysis![key as keyof PromptAnalysis]}/10
                      </div>
                      <div className={`text-sm font-medium
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`flex justify-end space-x-3 p-6 border-t
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={() => navigator.clipboard.writeText(comparisonPrompts.original)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              <FaCopy />
              <span>Copy Original</span>
            </button>
            
            <button
              onClick={() => navigator.clipboard.writeText(comparisonPrompts.upgraded)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200
                        ${darkMode
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <FaCopy />
              <span>Copy Upgraded</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;