import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { PromptAnalysis, getScoreColor } from '../PromptUpgraderSupport';


interface AnalysisResultsProps {
  analysis: PromptAnalysis;
  darkMode: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  darkMode
}) => {
  return (
    <div className={`rounded-xl border transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold transition-colors duration-300
                       ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
          Comprehensive Analysis
        </h2>
      </div>
      
      <div className="p-6">
        {/* Scores Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {[
            { key: 'clarity', label: 'Clarity', value: analysis.clarity },
            { key: 'specificity', label: 'Specificity', value: analysis.specificity },
            { key: 'effectiveness', label: 'Effectiveness', value: analysis.effectiveness },
            { key: 'structure', label: 'Structure', value: analysis.structure },
            { key: 'readability', label: 'Readability', value: analysis.readability },
            { key: 'coherence', label: 'Coherence', value: analysis.coherence }
          ].map(({ key, label, value }) => (
            <div key={key} className={`p-4 rounded-lg text-center
                                     ${darkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${getScoreColor(value, darkMode)}`}>
                {value}/10
              </div>
              <div className={`text-sm font-medium
                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.strengths.length > 0 && (
            <div>
              <h4 className={`font-medium mb-3 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaCheckCircle className="text-green-500" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className={`text-sm
                                             ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.weaknesses.length > 0 && (
            <div>
              <h4 className={`font-medium mb-3 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaExclamationTriangle className="text-yellow-500" />
                <span>Areas for Improvement</span>
              </h4>
              <ul className="space-y-1">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className={`text-sm
                                             ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    • {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div>
              <h4 className={`font-medium mb-3 flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaLightbulb className="text-blue-500" />
                <span>Suggestions</span>
              </h4>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className={`text-sm
                                             ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;