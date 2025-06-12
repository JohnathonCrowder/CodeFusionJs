import React, { useState } from 'react';
import { usePromptUpgrader } from './hooks/usePromptUpgrader';
import UpgraderHeader from './components/UpgraderHeader';
import StatusMessages from './components/StatusMessages';
import PromptInput from './components/PromptInput';
import SmartConfiguration from './components/SmartConfiguration';
import AnalysisResults from './components/AnalysisResults';
import UpgradedPromptResults from './components/UpgradedPromptResults';
import ApiKeyModal from '../ApiKeyModal';
import TokenConfirmationModal from '../modals/TokenConfirmationModal';
import PromptLibraryModal from '../modals/PromptLibraryModal';
import SavePromptModal from '../modals/SavePromptModal';
import HistoryModal from '../modals/HistoryModal';
import ComparisonModal from '../modals/ComparisonModal';
import { FaKey } from 'react-icons/fa';

const PromptUpgrader: React.FC = () => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const {
    // State and handlers
    darkMode,
    currentUser,
    error,
    success,
    setError,
    setSuccess,
    // Prompt state
    inputPrompt,
    setInputPrompt,
    upgradedPrompt,
    analysis,
    upgradeParams,
    setUpgradeParams,
    // UI state
    isAnalyzing,
    isUpgrading,
    // Modal state
    showApiKeyModal,
    setShowApiKeyModal,
    showTokenConfirmation,
    setShowTokenConfirmation,
    showSaveModal,
    setShowSaveModal,
    showHistoryModal,
    setShowHistoryModal,
    showComparisonModal,
    setShowComparisonModal,
    showPromptLibrary,
    setShowPromptLibrary,
    // Data
    userPrompts,
    selectedPrompt,
    upgradeHistory,
    comparisonPrompts,
    saveForm,
    searchTerm,
    setSearchTerm,
    selectedTemplate,
    tokenCount,
    estimatedCost,
    selectedModel,
    apiKey,
    customInstructions,
    // Handlers
    handleApiKeySave,
    analyzePrompt,
    confirmAnalysis,
    upgradePrompt,
    handlePromptSelect,
    saveUpgradedPrompt,
    handleHistoryLoad,
    handleHistoryCompare,
    handleSaveFormChange,
    handleUpgradeParamsChange,
    handleCustomInstructionsChange,
    applyTemplate,
    exportHistory,
    clearHistory
  } = usePromptUpgrader();

  if (!currentUser) {
    return (
      <div className={`min-h-screen pt-20 p-6 flex items-center justify-center
                     ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl
                       ${darkMode ? 'bg-dark-800 text-dark-100' : 'bg-white text-gray-900'}`}>
          <FaKey className={`h-12 w-12 mx-auto mb-4
                           ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
            Please log in to access the Prompt Upgrader.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 p-6 transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      <div className="max-w-6xl mx-auto">
        <UpgraderHeader
          darkMode={darkMode}
          userPrompts={userPrompts}
          upgradeHistory={upgradeHistory}
          apiKey={apiKey}
          onShowPromptLibrary={() => setShowPromptLibrary(true)}
          onShowHistory={() => setShowHistoryModal(true)}
          onShowApiKeyModal={() => setShowApiKeyModal(true)}
        />

        <StatusMessages
          error={error}
          success={success}
          darkMode={darkMode}
          onClearError={() => setError('')}
          onClearSuccess={() => setSuccess('')}
        />

        <div className="space-y-8">
          {/* Main Input Section */}
          <div className={`rounded-xl border transition-colors duration-300
                         ${darkMode 
                           ? 'bg-dark-800 border-dark-600' 
                           : 'bg-white border-gray-200'}`}>
            <div className={`p-6 border-b transition-colors duration-300
                           ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Prompt Input
                </h2>
                {selectedPrompt && (
                  <span className={`px-2 py-1 rounded-full text-xs
                                    ${darkMode 
                                      ? 'bg-blue-600/20 text-blue-400' 
                                      : 'bg-blue-100 text-blue-700'}`}>
                    {selectedPrompt.title}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <PromptInput
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                selectedPrompt={selectedPrompt}
                isAnalyzing={isAnalyzing}
                isUpgrading={isUpgrading}
                darkMode={darkMode}
                onShowPromptLibrary={() => setShowPromptLibrary(true)}
                onAnalyze={analyzePrompt}
                onUpgrade={upgradePrompt}
              />
            </div>
          </div>

          {/* Smart Configuration Section */}
          <SmartConfiguration
            upgradeParams={upgradeParams}
            onParamsChange={handleUpgradeParamsChange}
            customInstructions={customInstructions}
            onCustomInstructionsChange={handleCustomInstructionsChange}
            darkMode={darkMode}
            showAdvanced={showAdvancedSettings}
            onToggleAdvanced={() => setShowAdvancedSettings(!showAdvancedSettings)}
            selectedTemplate={selectedTemplate}
            onApplyTemplate={applyTemplate}
          />

          {/* Analysis Results Section */}
          {analysis && (
            <AnalysisResults
              analysis={analysis}
              darkMode={darkMode}
            />
          )}

          {/* Upgraded Prompt Results Section */}
          {upgradedPrompt && (
            <UpgradedPromptResults
              upgradedPrompt={upgradedPrompt}
              inputPrompt={inputPrompt}
              selectedModel={selectedModel}
              darkMode={darkMode}
              onShowComparison={() => setShowComparisonModal(true)}
              onShowSave={() => setShowSaveModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modal Components */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
        currentApiKey={apiKey}
      />

      <TokenConfirmationModal
        isOpen={showTokenConfirmation}
        tokenCount={tokenCount}
        estimatedCost={estimatedCost}
        model={selectedModel}
        onConfirm={confirmAnalysis}
        onCancel={() => setShowTokenConfirmation(false)}
        darkMode={darkMode}
      />

      <PromptLibraryModal
        isOpen={showPromptLibrary}
        onClose={() => setShowPromptLibrary(false)}
        userPrompts={userPrompts}
        selectedPrompt={selectedPrompt}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onPromptSelect={handlePromptSelect}
        darkMode={darkMode}
      />

      <SavePromptModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveUpgradedPrompt}
        saveForm={saveForm}
        onFormChange={handleSaveFormChange}
        darkMode={darkMode}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        upgradeHistory={upgradeHistory}
        onExportHistory={exportHistory}
        onClearHistory={clearHistory}
        onLoadHistory={handleHistoryLoad}
        onCompareHistory={handleHistoryCompare}
        darkMode={darkMode}
      />

      <ComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        comparisonPrompts={comparisonPrompts}
        darkMode={darkMode}
      />
    </div>
  );
};

export default PromptUpgrader;