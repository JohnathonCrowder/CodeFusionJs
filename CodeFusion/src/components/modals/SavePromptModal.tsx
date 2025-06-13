import React, { useState } from 'react';
import { FaTimes, FaSave, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
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
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    // Validate form
    if (!saveForm.title.trim()) {
      setValidationError('Title is required');
      return;
    }

    if (saveForm.title.trim().length < 3) {
      setValidationError('Title must be at least 3 characters long');
      return;
    }

    setValidationError('');
    setIsSaving(true);

    try {
      await onSave();
      // Modal will be closed by parent component after successful save
    } catch (error) {
      console.error('Save error:', error);
      setValidationError('Failed to save prompt. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const tag = input.value.trim();
      
      if (tag && !saveForm.tags.includes(tag)) {
        onFormChange('tags', [...saveForm.tags, tag]);
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onFormChange('tags', saveForm.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full transform transition-all duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-600/20' : 'bg-green-100'}`}>
                  <FaSave className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Save Enhanced Prompt
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Save your upgraded prompt to your library
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSaving}
                className={`p-2 rounded-lg transition-colors
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300 disabled:opacity-50'
                            : 'hover:bg-gray-100 text-gray-500 disabled:opacity-50'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Validation Error */}
            {validationError && (
              <div className={`p-4 rounded-lg border-l-4 ${darkMode 
                ? 'bg-red-900/20 border-red-500 text-red-300' 
                : 'bg-red-50 border-red-500 text-red-700'}`}>
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle />
                  <span className="font-medium">{validationError}</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Title <span className="text-red-500">*</span>
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
                placeholder="Enter a descriptive title for your prompt..."
                disabled={isSaving}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                {saveForm.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
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
                placeholder="Brief description of what this prompt does..."
                disabled={isSaving}
              />
            </div>

            {/* Category and Language */}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                >
                  {LANGUAGES.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-2
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Tags
              </label>
              <input
                type="text"
                onKeyDown={handleTagInput}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Type tags and press Enter or comma to add..."
                disabled={isSaving}
              />
              
              {/* Tag Display */}
              {saveForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {saveForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                 ${darkMode 
                                   ? 'bg-blue-600/20 text-blue-400' 
                                   : 'bg-blue-100 text-blue-800'}`}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-500"
                        disabled={isSaving}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Public Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={saveForm.isPublic}
                onChange={(e) => onFormChange('isPublic', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
                disabled={isSaving}
              />
              <label htmlFor="isPublic" className={`text-sm cursor-pointer
                                                  ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Make this prompt public for others to discover and use
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end space-x-3 p-6 border-t
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={!saveForm.title.trim() || isSaving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
                        ${darkMode
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePromptModal;