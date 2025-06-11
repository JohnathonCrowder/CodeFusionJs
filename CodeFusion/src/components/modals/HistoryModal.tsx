import React from 'react';
import { FaTimes, FaHistory, FaDownload, FaUndo, FaRocket } from 'react-icons/fa';
import { UpgradeHistory, PromptAnalysis } from '../PromptUpgraderSupport';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgradeHistory: UpgradeHistory[];
  onExportHistory: () => void;
  onClearHistory: () => void;
  onLoadHistory: (entry: UpgradeHistory) => void;
  onCompareHistory: (entry: UpgradeHistory) => void;
  darkMode: boolean;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  upgradeHistory,
  onExportHistory,
  onClearHistory,
  onLoadHistory,
  onCompareHistory,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh]
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Upgrade History
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onExportHistory}
                  disabled={upgradeHistory.length === 0}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                            transition-all duration-200 disabled:opacity-50
                            ${darkMode
                              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  <FaDownload />
                  <span>Export</span>
                </button>
                
                <button
                  onClick={onClearHistory}
                  disabled={upgradeHistory.length === 0}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                            transition-all duration-200 disabled:opacity-50
                            ${darkMode
                              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  <FaTimes />
                  <span>Clear</span>
                </button>
                
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
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {upgradeHistory.length === 0 ? (
              <div className="text-center py-12">
                <FaHistory className={`h-12 w-12 mx-auto mb-4
                                     ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium mb-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  No upgrade history yet
                </p>
                <p className={darkMode ? 'text-dark-400' : 'text-gray-600'}>
                  Start upgrading prompts to see your history here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upgradeHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-medium mb-1
                                       ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                          Upgrade from {entry.timestamp.toLocaleDateString()}
                        </h4>
                        <p className={`text-sm
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          {entry.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onLoadHistory(entry)}
                          className={`p-2 rounded-lg transition-colors
                                    ${darkMode
                                      ? 'hover:bg-dark-600 text-dark-300'
                                      : 'hover:bg-gray-200 text-gray-600'}`}
                          title="Load this upgrade"
                        >
                          <FaUndo />
                        </button>
                        
                        <button
                          onClick={() => onCompareHistory(entry)}
                          className={`p-2 rounded-lg transition-colors
                                    ${darkMode
                                      ? 'hover:bg-dark-600 text-dark-300'
                                      : 'hover:bg-gray-200 text-gray-600'}`}
                          title="Compare prompts"
                        >
                          <FaRocket />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className={`text-sm font-medium mb-2
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Original ({entry.originalPrompt.length} chars)
                        </h5>
                        <div className={`p-3 rounded-lg text-sm font-mono max-h-32 overflow-y-auto
                                       ${darkMode 
                                         ? 'bg-dark-600 text-dark-200' 
                                         : 'bg-white text-gray-700'}`}>
                          {entry.originalPrompt.substring(0, 200)}
                          {entry.originalPrompt.length > 200 && '...'}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className={`text-sm font-medium mb-2
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Upgraded ({entry.upgradedPrompt.length} chars)
                        </h5>
                        <div className={`p-3 rounded-lg text-sm font-mono max-h-32 overflow-y-auto
                                       ${darkMode 
                                         ? 'bg-dark-600 text-dark-200' 
                                         : 'bg-white text-gray-700'}`}>
                          {entry.upgradedPrompt.substring(0, 200)}
                          {entry.upgradedPrompt.length > 200 && '...'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                          Purpose: {entry.parameters.purpose.replace(/_/g, ' ')}
                        </span>
                        <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                          Tone: {entry.parameters.tone}
                        </span>
                      </div>
                      <span className={`font-medium
                                      ${entry.upgradedPrompt.length > entry.originalPrompt.length 
                                        ? 'text-green-500' 
                                        : 'text-blue-500'}`}>
                        {entry.upgradedPrompt.length > entry.originalPrompt.length ? '+' : ''}
                        {((entry.upgradedPrompt.length - entry.originalPrompt.length) / entry.originalPrompt.length * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;