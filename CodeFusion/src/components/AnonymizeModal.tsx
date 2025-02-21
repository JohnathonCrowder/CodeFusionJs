import React, { useState, useEffect } from "react";
import { FaEyeSlash, FaTimes } from "react-icons/fa";

interface AnonymizeModalProps {
  onClose: () => void;
  onSave: (names: { 
    firstName: string; 
    lastName: string;
    username: string;
    email: string;
    customReplacements: Array<{original: string, replacement: string}>
  }) => void;
  currentSettings: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    customReplacements: Array<{original: string, replacement: string}>;
  };
}

const AnonymizeModal: React.FC<AnonymizeModalProps> = ({ 
  onClose, 
  onSave,
  currentSettings
}) => {
  const [firstName, setFirstName] = useState(currentSettings.firstName);
  const [lastName, setLastName] = useState(currentSettings.lastName);
  const [username, setUsername] = useState(currentSettings.username);
  const [email, setEmail] = useState(currentSettings.email);
  const [customReplacements, setCustomReplacements] = useState(
    currentSettings.customReplacements.length 
      ? currentSettings.customReplacements 
      : [{original: "", replacement: ""}]
  );

  const addCustomReplacement = () => {
    setCustomReplacements([...customReplacements, {original: "", replacement: ""}]);
  };

  const updateCustomReplacement = (index: number, field: 'original' | 'replacement', value: string) => {
    const newReplacements = [...customReplacements];
    newReplacements[index][field] = value;
    setCustomReplacements(newReplacements);
  };

  const removeCustomReplacement = (index: number) => {
    const newReplacements = customReplacements.filter((_, i) => i !== index);
    setCustomReplacements(newReplacements.length ? newReplacements : [{original: "", replacement: ""}]);
  };

  const handleSave = () => {
    // Filter out empty custom replacements
    const filteredCustomReplacements = customReplacements.filter(
      item => item.original.trim() !== "" && item.replacement.trim() !== ""
    );
    
    onSave({ 
      firstName, 
      lastName, 
      username, 
      email, 
      customReplacements: filteredCustomReplacements
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-80" />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <FaEyeSlash className="mr-3 text-blue-500" />
              Anonymize Personal Information
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enter your personal information below. When you anonymize your code, 
              these details will be replaced with generic values to protect your privacy.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your first name"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Will be replaced with "John"</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your last name"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Will be replaced with "Doe"</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                  Username/Handle
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your username"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Will be replaced with "user123"</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="your.email@example.com"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Will be replaced with "john.doe@example.com"</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom Replacements
                </label>
                <button 
                  onClick={addCustomReplacement}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add another
                </button>
              </div>
              
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {customReplacements.map((replacement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={replacement.original}
                      onChange={(e) => updateCustomReplacement(index, 'original', e.target.value)}
                      className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Original text"
                    />
                    <span className="text-gray-500">→</span>
                    <input
                      type="text"
                      value={replacement.replacement}
                      onChange={(e) => updateCustomReplacement(index, 'replacement', e.target.value)}
                      className="flex-1 p-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Replacement text"
                    />
                    <button
                      onClick={() => removeCustomReplacement(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Add any other text that should be replaced (company names, project names, etc.)
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md 
                      hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <FaEyeSlash className="mr-2" /> Save Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymizeModal;