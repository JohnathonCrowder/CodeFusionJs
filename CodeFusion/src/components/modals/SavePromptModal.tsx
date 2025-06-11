import React from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { CATEGORIES, LANGUAGES } from '../prompt-upgrader/PromptUpgraderSupport';

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  saveForm: {
    title: string;
    description: string;
    category: string;
    language: string;
    tags: string[];
    isPublic: boolean;
  };
  onFormChange: (field: string, value: any) => void;
  darkMode: boolean;
}

const SavePromptModal: React.FC<SavePromptModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saveForm,
  onFormChange,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Save Upgraded Prompt
              </h2>
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

          <div className="p-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                value={saveForm.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Enter prompt title..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={saveForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2 resize-none
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Brief description of the prompt..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  value={saveForm.category}
                  onChange={(e) => onFormChange('category', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Language
                </label>
                <select
                  value={saveForm.language}
                  onChange={(e) => onFormChange('language', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                >
                  {LANGUAGES.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveForm.isPublic}
                  onChange={(e) => onFormChange('isPublic', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Make Public
                </span>
              </label>
            </div>
          </div>

          <div className={`flex justify-end space-x-3 p-6 border-t
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-colors
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            
            <button
              onClick={onSave}
              disabled={!saveForm.title.trim()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105 disabled:opacity-50
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <FaSave />
              <span>Save Prompt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePromptModal;