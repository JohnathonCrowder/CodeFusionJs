import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { 
  FaEyeSlash, 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaPlus,
  FaTrash,
  FaShieldAlt,
  FaSave,
  FaExclamationTriangle
} from "react-icons/fa";

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
  const { darkMode } = useContext(ThemeContext);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className={`relative rounded-xl shadow-2xl max-w-xl w-full transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-green-600/20 text-green-400' 
                                 : 'bg-green-100 text-green-600'}`}>
                  <FaEyeSlash className="text-xl" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Privacy Settings
                  </h2>
                  <p className={`text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Configure anonymization options
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Description */}
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-blue-900/20 border-blue-400 text-blue-300' 
                             : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
              <div className="flex items-start space-x-2">
                <FaShieldAlt className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Protect Your Privacy</p>
                  <p className="mt-1 opacity-90">
                    Enter your personal information below. When you anonymize your code, 
                    these details will be replaced with generic values to protect your privacy.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Personal Information Section */}
            <div className={`p-5 rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2
                             ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                <FaUser className={darkMode ? 'text-green-400' : 'text-green-600'} />
                <span>Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`} 
                         htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400 placeholder-dark-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 placeholder-gray-400'}`}
                    placeholder="Your first name"
                  />
                  <p className={`mt-1 text-xs transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Will be replaced with "John"
                  </p>
                </div>
                
                {/* Last Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`} 
                         htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400 placeholder-dark-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 placeholder-gray-400'}`}
                    placeholder="Your last name"
                  />
                  <p className={`mt-1 text-xs transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Will be replaced with "Doe"
                  </p>
                </div>

                {/* Username */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`} 
                         htmlFor="username">
                    Username/Handle
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400 placeholder-dark-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 placeholder-gray-400'}`}
                    placeholder="Your username"
                  />
                  <p className={`mt-1 text-xs transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Will be replaced with "user123"
                  </p>
                </div>
                
                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`} 
                         htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className={`absolute left-3 top-3.5 h-4 w-4
                                           ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400 placeholder-dark-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 placeholder-gray-400'}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <p className={`mt-1 text-xs transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Will be replaced with "john.doe@example.com"
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Replacements Section */}
            <div className={`p-5 rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold flex items-center space-x-2
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                  <FaEyeSlash className={darkMode ? 'text-green-400' : 'text-green-600'} />
                  <span>Custom Replacements</span>
                </h3>
                <button 
                  onClick={addCustomReplacement}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200
                            ${darkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <FaPlus className="h-3 w-3" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {customReplacements.map((replacement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={replacement.original}
                      onChange={(e) => updateCustomReplacement(index, 'original', e.target.value)}
                      className={`flex-1 p-3 rounded-l-lg border border-r-0 transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-inset
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'}`}
                      placeholder="Original text"
                    />
                    <div className={`px-2 py-3 border-t border-b
                                   ${darkMode ? 'border-dark-500 text-dark-400' : 'border-gray-300 text-gray-500'}`}>
                      →
                    </div>
                    <input
                      type="text"
                      value={replacement.replacement}
                      onChange={(e) => updateCustomReplacement(index, 'replacement', e.target.value)}
                      className={`flex-1 p-3 rounded-r-lg border border-l-0 transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-inset
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-green-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'}`}
                      placeholder="Replacement text"
                    />
                    <button
                      onClick={() => removeCustomReplacement(index)}
                      className={`p-3 rounded-lg transition-all duration-200
                                ${darkMode
                                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                  : 'text-red-500 hover:bg-red-50 hover:text-red-700'}`}
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className={`mt-3 p-3 rounded-lg transition-colors duration-300
                             ${darkMode 
                               ? 'bg-yellow-900/20 border-l-4 border-yellow-500' 
                               : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className={`mt-0.5 h-4 w-4
                                                   ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <p className={`text-xs transition-colors duration-300
                               ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    Add any other text that should be replaced (company names, project names, etc.)
                    Only filled entries will be saved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className={`flex justify-end space-x-4 p-6 border-t transition-colors duration-300
                         ${darkMode 
                           ? 'border-dark-600 bg-dark-700/30' 
                           : 'border-gray-200 bg-gray-50/30'}`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500 border border-dark-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        flex items-center space-x-2 shadow-lg hover:shadow-xl
                        ${darkMode
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <FaSave />
              <span>Save Privacy Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymizeModal;