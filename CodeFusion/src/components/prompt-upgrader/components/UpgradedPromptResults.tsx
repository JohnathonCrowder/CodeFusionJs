import React from 'react';
import { FaRocket, FaCopy, FaSave, FaChartLine } from 'react-icons/fa';
import { estimateTokenCount, estimateCost } from '../../../utils/tokenUtils';

interface UpgradedPromptResultsProps {
  upgradedPrompt: string;
  inputPrompt: string;
  selectedModel: string;
  darkMode: boolean;
  onShowComparison: () => void;
  onShowSave: () => void;
}

const UpgradedPromptResults: React.FC<UpgradedPromptResultsProps> = ({
  upgradedPrompt,
  inputPrompt,
  selectedModel,
  darkMode,
  onShowComparison,
  onShowSave
}) => {
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
            Upgraded Prompt
          </h2>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              {estimateTokenCount(upgradedPrompt)} tokens
            </span>
            <button
              onClick={onShowComparison}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              <FaRocket />
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
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <FaSave />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto
                       ${darkMode 
                         ? 'bg-dark-700 border-dark-600 text-dark-200' 
                         : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          {upgradedPrompt}
        </div>
        
        {/* Improvement Metrics */}
        {inputPrompt && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className={`font-medium mb-3 flex items-center space-x-2
                           ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              <FaChartLine className="text-blue-500" />
              <span>Improvement Metrics</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Length Change
                </div>
                <div className={`text-lg font-bold ${
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
                <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Token Count
                </div>
                <div className={`text-lg font-bold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  {estimateTokenCount(upgradedPrompt)}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Est. Cost
                </div>
                <div className={`text-lg font-bold text-green-500`}>
                  ${estimateCost(estimateTokenCount(upgradedPrompt), selectedModel).toFixed(4)}
                </div>
              </div>

              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <div className={`font-medium text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Quality
                </div>
                <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Enhanced
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradedPromptResults;