import React from 'react';
import { FaTimes, FaSearch, FaCode } from 'react-icons/fa';
import { Prompt } from '../PromptLibrary';
import { estimateTokenCount } from '../../utils/tokenUtils';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPrompts: Prompt[];
  selectedPrompt: Prompt | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onPromptSelect: (prompt: Prompt) => void;
  darkMode: boolean;
}

const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  userPrompts,
  selectedPrompt,
  searchTerm,
  onSearchChange,
  onPromptSelect,
  darkMode
}) => {
  if (!isOpen) return null;

  const filteredPrompts = userPrompts.filter(prompt => 
    !searchTerm || 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh]
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Your Prompt Library
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
            <div className="mt-3 relative">
              <FaSearch className={`absolute left-3 top-3 h-4 w-4
                                   ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100'
                            : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8">
                <FaCode className={`h-8 w-8 mx-auto mb-3
                                  ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  {userPrompts.length === 0 
                    ? "No prompts found. Create some in the Prompt Library first."
                    : "No prompts match your search."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => onPromptSelect(prompt)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200
                              ${selectedPrompt?.id === prompt.id
                                ? darkMode
                                  ? 'border-blue-500 bg-blue-900/20'
                                  : 'border-blue-500 bg-blue-50'
                                : darkMode
                                  ? 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                  >
                    <h3 className={`font-medium mb-1 transition-colors duration-300
                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      {prompt.title}
                    </h3>
                    {prompt.description && (
                      <p className={`text-sm mb-2 line-clamp-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        {prompt.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full
                                        ${darkMode 
                                          ? 'bg-blue-600/20 text-blue-400' 
                                          : 'bg-blue-100 text-blue-700'}`}>
                          {prompt.category}
                        </span>
                        {prompt.language && (
                          <span className={`px-2 py-1 rounded-full
                                          ${darkMode 
                                            ? 'bg-green-600/20 text-green-400' 
                                            : 'bg-green-100 text-green-700'}`}>
                            {prompt.language}
                          </span>
                        )}
                      </div>
                      <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
                        {estimateTokenCount(prompt.content)} tokens
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

export default PromptLibraryModal;