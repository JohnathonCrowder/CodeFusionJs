import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaTimes,
  FaPlus,
  FaInfo,
  FaSave,
  FaTimes as FaClose,
  FaCog,
  FaFileAlt,
  FaProjectDiagram,
} from "react-icons/fa";

interface SettingsModalProps {
  settings: {
    newLineCount: number;
    autoUnselectFolders: string[];
    acceptedTypes: string[];
  };
  projectType: "react" | "python" | "custom";
  setProjectType: (type: "react" | "python" | "custom") => void;
  onClose: () => void;
  onSave: (settings: any) => void;
}

const commonExcludedFolders = [
  "node_modules",
  "venv",
  ".git",
  "__pycache__",
  ".next",
  "build",
  "dist",
  ".vscode",
  ".idea",
  "coverage",
  "tmp",
  "logs",
  ".env",
  "out",
  "target",
];

const fileTypeGroups = [
  {
    label: "JavaScript & React",
    types: [".js", ".jsx", ".ts", ".tsx", ".json", ".mjs", ".cjs"],
  },
  {
    label: "Styles",
    types: [".css", ".scss", ".sass", ".less", ".styl"],
  },
  {
    label: "Configuration",
    types: [
      ".yml",
      ".yaml",
      ".env",
      ".lock",
      ".gitignore",
      ".graphql",
      ".prisma",
      ".conf",
      ".ini",
    ],
  },
  {
    label: "Python",
    types: [".py", ".pyi", ".pyc", ".pyd", ".pyo", ".pyw"],
  },
  {
    label: "Text & Markup",
    types: [".txt", ".md", ".mdx", ".html", ".htm", ".xml", ".rst"],
  },
  {
    label: "Data",
    types: [".csv", ".json", ".xml", ".sql", ".db", ".sqlite"],
  },
  {
    label: "Other Languages",
    types: [".cpp", ".h", ".java", ".go", ".rs", ".php", ".rb", ".swift"],
  },
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  projectType,
  setProjectType,
  onClose,
  onSave,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [newLineCount, setNewLineCount] = useState(settings.newLineCount);
  const [autoUnselectFolders, setAutoUnselectFolders] = useState<string[]>(
    settings.autoUnselectFolders
  );
  const [acceptedTypes, setAcceptedTypes] = useState(settings.acceptedTypes);
  const [newFolderInput, setNewFolderInput] = useState("");
  const [folderInputError, setFolderInputError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "fileTypes">(
    "general"
  );

  const isValidFolderName = (folderName: string): boolean => {
    return /^[a-zA-Z0-9._-]+$/.test(folderName) && folderName.length <= 50;
  };

  const addFolder = (folder: string) => {
    const trimmedFolder = folder.trim();
    if (!trimmedFolder) return;

    if (!isValidFolderName(trimmedFolder)) {
      setFolderInputError(
        "Invalid folder name. Use only alphanumeric characters, dots, underscores, and hyphens."
      );
      return;
    }

    if (autoUnselectFolders.includes(trimmedFolder)) {
      setFolderInputError("This folder is already in the list.");
      return;
    }

    setAutoUnselectFolders([...autoUnselectFolders, trimmedFolder]);
    setNewFolderInput("");
    setFolderInputError("");
  };

  const removeFolder = (folderToRemove: string) => {
    setAutoUnselectFolders(
      autoUnselectFolders.filter((folder) => folder !== folderToRemove)
    );
  };

  const handleFileTypeChange = (fileType: string) => {
    if (acceptedTypes.includes(fileType)) {
      setAcceptedTypes(acceptedTypes.filter((type) => type !== fileType));
    } else {
      setAcceptedTypes([...acceptedTypes, fileType]);
    }
  };

  const handleSave = () => {
    onSave({
      newLineCount,
      autoUnselectFolders,
      acceptedTypes,
    });
  };

  const selectAllTypes = (group: (typeof fileTypeGroups)[0]) => {
    const newTypes = [...new Set([...acceptedTypes, ...group.types])];
    setAcceptedTypes(newTypes);
  };

  const deselectAllTypes = (group: (typeof fileTypeGroups)[0]) => {
    const newTypes = acceptedTypes.filter(
      (type) => !group.types.includes(type)
    );
    setAcceptedTypes(newTypes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Modal Header */}
          <div className={`flex justify-between items-center p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors duration-300
                             ${darkMode 
                               ? 'bg-blue-600/20 text-blue-400' 
                               : 'bg-blue-100 text-blue-600'}`}>
                <FaCog className="text-xl" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Settings
                </h2>
                <p className={`text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  Configure your preferences
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
              <FaClose size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50/30'}`}>
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200
                        ${
                          activeTab === "general"
                            ? darkMode
                              ? "border-b-2 border-blue-400 text-blue-400 bg-dark-700"
                              : "border-b-2 border-blue-500 text-blue-500 bg-white"
                            : darkMode
                              ? "text-dark-300 hover:text-dark-100 hover:bg-dark-700"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
            >
              <FaProjectDiagram />
              <span>General</span>
            </button>
            <button
              onClick={() => setActiveTab("fileTypes")}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200
                        ${
                          activeTab === "fileTypes"
                            ? darkMode
                              ? "border-b-2 border-blue-400 text-blue-400 bg-dark-700"
                              : "border-b-2 border-blue-500 text-blue-500 bg-white"
                            : darkMode
                              ? "text-dark-300 hover:text-dark-100 hover:bg-dark-700"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
            >
              <FaFileAlt />
              <span>File Types</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "general" && (
              <div className="space-y-8">
                {/* Project Type Selection */}
                <div className={`p-5 rounded-xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <FaProjectDiagram className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <label
                      className={`text-lg font-semibold transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}
                      htmlFor="projectType"
                    >
                      Project Type
                    </label>
                  </div>
                  <select
                    id="projectType"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className={`w-full p-3 rounded-lg border font-medium transition-all duration-200
                              focus:outline-none focus:ring-2 
                              ${darkMode
                                ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="custom">Custom Configuration</option>
                    <option value="react">React Project</option>
                    <option value="python">Python Project</option>
                  </select>
                  <div className={`mt-2 p-3 rounded-lg transition-colors duration-300
                                 ${darkMode 
                                   ? 'bg-blue-900/20 border-l-4 border-blue-400' 
                                   : 'bg-blue-50 border-l-4 border-blue-500'}`}>
                    <p className={`text-sm flex items-center space-x-2
                                 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      <FaInfo />
                      <span>Selecting a project type applies optimized settings for that environment.</span>
                    </p>
                  </div>
                </div>

                {/* New Lines Between Files */}
                <div className={`p-5 rounded-xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}>
                  <label
                    className={`block text-lg font-semibold mb-4 transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}
                    htmlFor="newLineCount"
                  >
                    New Lines Between Files
                  </label>
                  <input
                    type="number"
                    id="newLineCount"
                    min="0"
                    max="20"
                    value={newLineCount}
                    onChange={(e) => setNewLineCount(parseInt(e.target.value))}
                    className={`w-full p-3 rounded-lg border font-medium transition-all duration-200
                              focus:outline-none focus:ring-2 
                              ${darkMode
                                ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  />
                </div>

                {/* Auto-unselect Folders */}
                <div className={`p-5 rounded-xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    Auto-exclude Folders
                  </h3>

                  {/* Selected folders */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {autoUnselectFolders.map((folder) => (
                      <span
                        key={folder}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full 
                                  text-sm font-medium transition-all duration-200
                                  ${darkMode
                                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'}`}
                      >
                        <span>{folder}</span>
                        <button
                          onClick={() => removeFolder(folder)}
                          className={`hover:bg-white/20 rounded-full p-0.5 transition-colors
                                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input for new folders */}
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newFolderInput}
                      onChange={(e) => setNewFolderInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && addFolder(newFolderInput)
                      }
                      className={`flex-grow p-3 border rounded-l-lg transition-all duration-200
                                focus:outline-none focus:ring-2 
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      placeholder="Add a folder to exclude"
                    />
                    <button
                      onClick={() => addFolder(newFolderInput)}
                      className={`px-4 py-3 rounded-r-lg font-medium transition-all duration-200
                                  hover:shadow-lg focus:outline-none focus:ring-2 
                                  ${darkMode
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'}`}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {folderInputError && (
                    <p className={`text-red-500 text-sm mb-4 p-2 rounded
                                 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                      {folderInputError}
                    </p>
                  )}

                  {/* Common folder suggestions */}
                  <div>
                    <span className={`text-sm transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      Common folders:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonExcludedFolders
                        .filter((folder) => !autoUnselectFolders.includes(folder))
                        .map((folder) => (
                          <button
                            key={folder}
                            onClick={() => addFolder(folder)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium
                                      transition-all duration-200 
                                      ${darkMode
                                        ? 'bg-dark-600 text-dark-200 hover:bg-dark-500 border border-dark-500'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-200'}`}
                          >
                            {folder}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fileTypes" && (
              <div className="space-y-6">
                {fileTypeGroups.map((group) => (
                  <div
                    key={group.label}
                    className={`p-5 rounded-xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`font-semibold text-lg transition-colors duration-300
                                     ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                        {group.label}
                      </h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => selectAllTypes(group)}
                          className={`text-sm font-medium transition-colors duration-200
                                    ${darkMode
                                      ? 'text-blue-400 hover:text-blue-300'
                                      : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => deselectAllTypes(group)}
                          className={`text-sm font-medium transition-colors duration-200
                                    ${darkMode
                                      ? 'text-red-400 hover:text-red-300'
                                      : 'text-red-600 hover:text-red-800'}`}
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {group.types.map((fileType) => (
                        <label key={fileType} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptedTypes.includes(fileType)}
                            onChange={() => handleFileTypeChange(fileType)}
                            className={`h-4 w-4 rounded border transition-colors duration-200
                                      focus:ring-2 focus:ring-offset-0
                                      ${darkMode
                                        ? 'border-dark-500 text-blue-600 bg-dark-600 focus:ring-blue-400'
                                        : 'border-gray-300 text-blue-600 bg-white focus:ring-blue-500'}`}
                          />
                          <span className={`text-sm font-medium transition-colors duration-300
                                          ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                            {fileType}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-end space-x-4 p-6 border-t transition-colors duration-300
                         ${darkMode ? 'border-dark-600 bg-dark-700/30' : 'border-gray-200 bg-gray-50/30'}`}>
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
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <FaSave />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;