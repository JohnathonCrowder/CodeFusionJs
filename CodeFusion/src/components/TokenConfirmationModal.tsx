import React from "react";
import { FaExclamationTriangle, FaCheck, FaTimes, FaDollarSign } from "react-icons/fa";
import { getDetailedCostEstimate } from "../utils/tokenUtils";

interface TokenConfirmationModalProps {
  isOpen: boolean;
  tokenCount: number;
  estimatedCost: number;
  model: string;
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
}

const TokenConfirmationModal: React.FC<TokenConfirmationModalProps> = ({
  isOpen,
  tokenCount,
  estimatedCost,
  model,
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;
  
  // Get detailed cost breakdown
  const costDetails = getDetailedCostEstimate(tokenCount);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={`relative rounded-xl shadow-2xl max-w-md w-full transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors duration-300
                             ${darkMode 
                               ? 'bg-yellow-600/20 text-yellow-400' 
                               : 'bg-yellow-100 text-yellow-600'}`}>
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Confirm API Request
                </h2>
                <p className={`text-sm transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  This request will use your OpenAI API credits
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className={`p-4 rounded-lg border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`font-medium transition-colors duration-300
                                ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Model:
                </span>
                <span className={`font-bold transition-colors duration-300
                                ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  GPT-4.1 mini
                </span>
              </div>
              
              <div className={`pt-3 border-t transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm transition-colors duration-300
                                    ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      Input tokens:
                    </span>
                    <span className={`text-sm font-medium transition-colors duration-300
                                    ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                      {costDetails.inputTokens.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm transition-colors duration-300
                                    ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      Est. output tokens:
                    </span>
                    <span className={`text-sm font-medium transition-colors duration-300
                                    ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                      ~{costDetails.outputTokens.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={`pt-2 mt-2 border-t transition-colors duration-300
                                 ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm transition-colors duration-300
                                      ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Input cost:
                      </span>
                      <span className={`text-sm transition-colors duration-300
                                      ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                        ${costDetails.inputCost.toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm transition-colors duration-300
                                      ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Est. output cost:
                      </span>
                      <span className={`text-sm transition-colors duration-300
                                      ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                        ${costDetails.outputCost.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`pt-2 mt-2 border-t transition-colors duration-300
                                 ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium transition-colors duration-300
                                      ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                        Total estimated cost:
                      </span>
                      <span className={`font-bold transition-colors duration-300
                                      ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ${costDetails.totalCost.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-blue-900/20 border-blue-400 text-blue-300' 
                             : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
              <div className="flex items-start space-x-2">
                <FaDollarSign className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">GPT-4.1 mini Pricing</p>
                  <ul className="text-xs opacity-90 space-y-1">
                    <li>• Input: $0.40 per 1M tokens</li>
                    <li>• Output: $1.60 per 1M tokens</li>
                    <li>• Actual cost may vary based on response length</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end space-x-3 p-6 border-t transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              <div className="flex items-center space-x-2">
                <FaTimes />
                <span>Cancel</span>
              </div>
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                         ${darkMode
                           ? 'bg-green-600 hover:bg-green-500 text-white'
                           : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <div className="flex items-center space-x-2">
                <FaCheck />
                <span>Confirm & Analyze</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenConfirmationModal;