import React from 'react';
import { 
  FaCode, 
  FaLayerGroup, 
  FaTimes, 
  FaCopy, 
  FaBrain, 
  FaRocket, 
  FaSpinner 
} from 'react-icons/fa';
import { estimateTokenCount } from '../../../utils/tokenUtils';
import { Prompt } from '../../PromptLibrary';

interface PromptInputProps {
  inputPrompt: string;
  setInputPrompt: (prompt: string) => void;
  selectedPrompt: Prompt | null;
  isAnalyzing: boolean;
  isUpgrading: boolean;
  darkMode: boolean;
  onShowPromptLibrary: () => void;
  onShowTemplates: () => void;
  onAnalyze: () => void;
  onUpgrade: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
    inputPrompt,
    setInputPrompt,
    selectedPrompt,
    isAnalyzing,
    isUpgrading,
    darkMode,
    onShowPromptLibrary,
    onShowTemplates,
    onAnalyze,
    onUpgrade
  }) => {
    return (
      <div className="w-full"> 
      <div className="flex items-center justify-between mb-3">
        <label className={`text-sm font-medium
                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
          Your Prompt
        </label>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
            {estimateTokenCount(inputPrompt)} tokens
          </span>
          <button
            onClick={onShowPromptLibrary}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                      font-medium transition-colors duration-200
                      ${darkMode
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            <FaCode />
            <span>Select from Library</span>
          </button>
          <button
            onClick={onShowTemplates}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                      font-medium transition-colors duration-200
                      ${darkMode
                        ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
          >
            <FaLayerGroup />
            <span>Templates</span>
          </button>
        </div>
      </div>
      
      <textarea
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
        rows={12}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                  focus:outline-none focus:ring-2 resize-none font-mono text-sm
                  ${darkMode
                    ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        placeholder="Enter your prompt here or select one from your library..."
      />
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInputPrompt('')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                      font-medium transition-colors duration-200
                      ${darkMode
                        ? 'hover:bg-dark-600 text-dark-300'
                        : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <FaTimes />
            <span>Clear</span>
          </button>
          
          <button
            onClick={() => navigator.clipboard.writeText(inputPrompt)}
            disabled={!inputPrompt}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                      font-medium transition-colors duration-200
                      ${inputPrompt
                        ? darkMode
                          ? 'hover:bg-dark-600 text-dark-300'
                          : 'hover:bg-gray-100 text-gray-600'
                        : 'opacity-50 cursor-not-allowed'
                      }`}
          >
            <FaCopy />
            <span>Copy</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onAnalyze}
            disabled={!inputPrompt.trim() || isAnalyzing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105 disabled:opacity-50
                      ${darkMode
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <FaBrain />
                <span>Analyze</span>
              </>
            )}
          </button>

          <button
            onClick={onUpgrade}
            disabled={!inputPrompt.trim() || isUpgrading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105 disabled:opacity-50
                      ${darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'}`}
          >
            {isUpgrading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Upgrading...</span>
              </>
            ) : (
              <>
                <FaRocket />
                <span>Upgrade</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;