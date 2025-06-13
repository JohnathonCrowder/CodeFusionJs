import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { FaTimes, FaKey, FaExclamationTriangle, FaEye, FaEyeSlash, FaDollarSign, FaInfoCircle } from 'react-icons/fa';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentApiKey 
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={`relative rounded-xl shadow-2xl max-w-lg w-full transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-blue-600/20 text-blue-400' 
                                 : 'bg-blue-100 text-blue-600'}`}>
                  <FaKey className="text-xl" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    OpenAI API Key Required
                  </h2>
                  <p className={`text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Configure your API key for AI analysis
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            {/* Model Information */}
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-purple-900/20 border-purple-400 text-purple-300' 
                             : 'bg-purple-50 border-purple-500 text-purple-800'}`}>
              <div className="flex items-start space-x-2">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Using GPT-4.1 mini</p>
                  <p className="text-xs opacity-90">
                    Affordable model balancing speed and intelligence for code analysis
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pricing Information */}
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-blue-900/20 border-blue-400 text-blue-300' 
                             : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
              <div className="flex items-start space-x-2">
                <FaDollarSign className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Usage-Based Pricing</p>
                  <p className="mb-2">
                    This feature uses OpenAI's GPT-4.1 mini model:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                    <li><strong>Input:</strong> $0.40 per 1M tokens (~$0.0004 per analysis)</li>
                    <li><strong>Output:</strong> $1.60 per 1M tokens (~$0.0003 per analysis)</li>
                    <li><strong>Typical analysis:</strong> Less than $0.001 total</li>
                    <li>Very affordable - analyze hundreds of files for pennies!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Warning */}
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-orange-900/20 border-orange-400 text-orange-300' 
                             : 'bg-orange-50 border-orange-500 text-orange-700'}`}>
              <div className="flex items-start space-x-2">
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Privacy & Security</p>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                    <li>Your API key is stored locally in your browser</li>
                    <li>Code is sent directly to OpenAI for analysis</li>
                    <li>For sensitive code, consider using a backend proxy</li>
                    <li>Review OpenAI's data usage policy for details</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full pr-12 pl-3 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  placeholder="sk-..."
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className={`absolute right-3 top-3 p-1 rounded transition-colors
                            ${darkMode ? 'text-dark-400 hover:text-dark-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showKey ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Help Text */}
              <div className={`mt-2 text-xs space-y-1 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                <p>
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/account/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`font-medium transition-colors duration-200
                              ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    OpenAI Dashboard
                  </a>
                </p>
                <p>
                  Make sure you have billing set up in your{' '}
                  <a 
                    href="https://platform.openai.com/account/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`font-medium transition-colors duration-200
                              ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    OpenAI billing settings
                  </a>
                </p>
              </div>
            </div>

            {/* Cost Comparison */}
            <div className={`p-3 rounded-lg transition-colors duration-300
                           ${darkMode 
                             ? 'bg-green-900/20 border border-green-700/50' 
                             : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-start space-x-2">
                <FaInfoCircle className={`mt-0.5 flex-shrink-0 text-sm
                                        ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <div className={`text-xs transition-colors duration-300
                               ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  <p className="font-medium">Cost-Effective Analysis</p>
                  <p className="mt-1">
                    GPT-4.1 mini is extremely affordable. You can analyze hundreds of code files for just a few cents. 
                    Each analysis shows estimated cost before sending the request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end space-x-3 p-6 border-t transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${apiKey.trim()
                          ? darkMode
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'}`}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;