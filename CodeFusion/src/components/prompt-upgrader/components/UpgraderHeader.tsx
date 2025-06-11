import React from 'react';
import { FaCode, FaHistory, FaKey } from 'react-icons/fa';
import { Prompt } from '../../PromptLibrary';
import { UpgradeHistory } from '../PromptUpgraderSupport';

interface UpgraderHeaderProps {
  darkMode: boolean;
  userPrompts: Prompt[];
  upgradeHistory: UpgradeHistory[];
  apiKey: string;
  onShowPromptLibrary: () => void;
  onShowHistory: () => void;
  onShowApiKeyModal: () => void;
}

const UpgraderHeader: React.FC<UpgraderHeaderProps> = ({
  darkMode,
  userPrompts,
  upgradeHistory,
  apiKey,
  onShowPromptLibrary,
  onShowHistory,
  onShowApiKeyModal
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-300
                         ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
            Advanced Prompt Upgrader
          </h1>
          <p className={`mt-2 transition-colors duration-300
                       ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
            Transform your AI prompts with advanced analysis and intelligent upgrades
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onShowPromptLibrary}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105
                      ${darkMode
                        ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
          >
            <FaCode />
            <span>Library ({userPrompts.length})</span>
          </button>

          <button
            onClick={onShowHistory}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105
                      ${darkMode
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            <FaHistory />
            <span>History ({upgradeHistory.length})</span>
          </button>
          
          <button
            onClick={onShowApiKeyModal}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105
                      ${apiKey 
                        ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                        : darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}
            title={apiKey ? "API key configured" : "Configure API key"}
          >
            <FaKey />
            <span>{apiKey ? 'API Configured' : 'Configure API'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgraderHeader;