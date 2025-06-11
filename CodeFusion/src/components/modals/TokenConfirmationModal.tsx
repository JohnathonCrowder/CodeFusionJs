import React from 'react';
import { FaExclamationTriangle, FaTimes, FaRocket } from 'react-icons/fa';

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
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-md w-full
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Confirm Analysis
              </h2>
              <button
                onClick={onCancel}
                className={`p-2 rounded-lg transition-colors
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300'
                            : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className={`flex items-start space-x-3 p-4 rounded-lg mb-6
                           ${darkMode 
                             ? 'bg-yellow-900/20 border-yellow-500/50' 
                             : 'bg-yellow-50 border-yellow-200'} border`}>
              <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
              <div>
                <h3 className={`font-medium mb-1
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Token Usage Confirmation
                </h3>
                <p className={`text-sm
                             ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  This analysis will consume tokens from your API quota.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-dark-400' : 'text-gray-600'}>
                  Estimated Tokens:
                </span>
                <span className={`font-medium ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  {tokenCount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={darkMode ? 'text-dark-400' : 'text-gray-600'}>
                  Model:
                </span>
                <span className={`font-medium ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  {model}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={darkMode ? 'text-dark-400' : 'text-gray-600'}>
                  Estimated Cost:
                </span>
                <span className={`font-bold text-green-500`}>
                  ${estimatedCost.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          <div className={`flex justify-end space-x-3 p-6 border-t
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <FaRocket />
              <span>Proceed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenConfirmationModal;