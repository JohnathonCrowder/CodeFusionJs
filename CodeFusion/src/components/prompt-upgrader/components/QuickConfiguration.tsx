import React from 'react';
import { FaCog } from 'react-icons/fa';
import { UpgradeParameters } from '../PromptUpgraderSupport';

interface QuickConfigurationProps {
  upgradeParams: UpgradeParameters;
  setUpgradeParams: React.Dispatch<React.SetStateAction<UpgradeParameters>>;
  darkMode: boolean;
  onShowAdvancedOptions: () => void;
}

const QuickConfiguration: React.FC<QuickConfigurationProps> = ({
  upgradeParams,
  setUpgradeParams,
  darkMode,
  onShowAdvancedOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className={`font-semibold ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
        Quick Configuration
      </h3>
      
      {/* Purpose */}
      <div>
        <label className={`block text-sm font-medium mb-2
                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
          Purpose
        </label>
        <select
          value={upgradeParams.purpose}
          onChange={(e) => setUpgradeParams(prev => ({ 
            ...prev, 
            purpose: e.target.value as any 
          }))}
          className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
                    focus:outline-none focus:ring-2 text-sm
                    ${darkMode
                      ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        >
          <option value="code_generation">Code Generation</option>
          <option value="analysis">Analysis & Review</option>
          <option value="documentation">Documentation</option>
          <option value="debugging">Debugging</option>
          <option value="creative">Creative Writing</option>
          <option value="general">General Purpose</option>
        </select>
      </div>

      {/* Tone & Audience */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={`block text-sm font-medium mb-2
                           ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
            Tone
          </label>
          <select
            value={upgradeParams.tone}
            onChange={(e) => setUpgradeParams(prev => ({ 
              ...prev, 
              tone: e.target.value as any 
            }))}
            className={`w-full px-3 py-2 rounded-lg border text-sm
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100'
                        : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2
                           ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
            Audience
          </label>
          <select
            value={upgradeParams.target_audience}
            onChange={(e) => setUpgradeParams(prev => ({ 
              ...prev, 
              target_audience: e.target.value as any 
            }))}
            className={`w-full px-3 py-2 rounded-lg border text-sm
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100'
                        : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Quick Enhancements */}
      <div>
        <label className={`block text-sm font-medium mb-2
                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
          Quick Enhancements
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={upgradeParams.enable_markdown}
              onChange={(e) => setUpgradeParams(prev => ({ 
                ...prev, 
                enable_markdown: e.target.checked 
              }))}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
              Enable Markdown
            </span>
          </label>
          {[
            { key: 'include_examples', label: 'Add Examples' },
            { key: 'include_constraints', label: 'Add Constraints' },
            { key: 'include_best_practices', label: 'Best Practices' },
            { key: 'improve_clarity', label: 'Improve Clarity' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={upgradeParams[key as keyof UpgradeParameters] as boolean}
                onChange={(e) => setUpgradeParams(prev => ({ 
                  ...prev, 
                  [key]: e.target.checked 
                }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onShowAdvancedOptions}
        className={`w-full flex items-center justify-center space-x-2 py-2 px-3 
                  rounded-lg font-medium transition-all duration-200
                  ${darkMode
                    ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        <FaCog />
        <span>Advanced Options</span>
      </button>
    </div>
  );
};

export default QuickConfiguration;