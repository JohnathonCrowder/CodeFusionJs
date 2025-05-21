import React, { useState, useContext, useMemo } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaTimes,
  FaPlus,
  FaSave,
  FaCog,
  FaFileAlt,
  FaSearch,
  FaCheck,
  FaTrash,
  FaRocket,
  FaToggleOn,
  FaToggleOff,
  FaMinus,
  FaUndo
} from "react-icons/fa";
import { projectPresets, getPresetMetadata } from "../utils/projectPresets";

// Update the interface to accept any preset key
interface SettingsModalProps {
  settings: {
    newLineCount: number;
    autoUnselectFolders: string[];
    acceptedTypes: string[];
  };
  projectType: keyof typeof projectPresets;  // This now accepts any preset key
  setProjectType: (type: keyof typeof projectPresets) => void;
  onClose: () => void;
  onSave: (settings: any) => void;
}

const commonExcludedFolders = [
  "node_modules", "venv", ".git", "__pycache__", ".next", "build", "dist",
  ".vscode", ".idea", "coverage", "tmp", "logs", ".env", "out", "target",
  ".nuxt", ".svelte-kit", "vendor", "bin", "obj", ".expo", "ios", "android",
  ".turbo", ".parcel-cache", ".cache", "staticfiles", "media"
];

const fileTypeGroups = [
  {
    label: "Web Fundamentals",
    icon: "🌐",
    color: "blue",
    types: [".html", ".htm", ".css", ".scss", ".sass", ".less", ".styl"],
  },
  {
    label: "JavaScript & TypeScript",
    icon: "⚡",
    color: "yellow", 
    types: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
  },
  {
    label: "Modern Frameworks",
    icon: "🚀",
    color: "purple",
    types: [".vue", ".svelte", ".astro", ".solid"],
  },
  {
    label: "Python",
    icon: "🐍",
    color: "green",
    types: [".py", ".pyi", ".pyc", ".pyd", ".pyo", ".pyw"],
  },
  {
    label: "Configuration & Data",
    icon: "⚙️",
    color: "gray",
    types: [".json", ".yml", ".yaml", ".xml", ".toml", ".ini", ".conf", ".env"],
  },
  {
    label: "Documentation",
    icon: "📝",
    color: "blue",
    types: [".md", ".mdx", ".txt", ".rst", ".adoc"],
  },
  {
    label: "Build & Package",
    icon: "📦",
    color: "orange",
    types: [".lock", ".gitignore", ".dockerignore", ".editorconfig"],
  },
  {
    label: "Database & Schema", 
    icon: "🗄️",
    color: "indigo",
    types: [".sql", ".db", ".sqlite", ".graphql", ".prisma"],
  },
  {
    label: "System Languages",
    icon: "🔧",
    color: "red",
    types: [".c", ".cpp", ".h", ".hpp", ".java", ".go", ".rs", ".swift", ".kt"],
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
  const [autoUnselectFolders, setAutoUnselectFolders] = useState<string[]>(settings.autoUnselectFolders);
  const [acceptedTypes, setAcceptedTypes] = useState(settings.acceptedTypes);
  const [newFolderInput, setNewFolderInput] = useState("");
  const [folderInputError, setFolderInputError] = useState("");
  const [activeTab, setActiveTab] = useState<"presets" | "advanced" | "fileTypes">("presets");
  const [fileTypeSearch, setFileTypeSearch] = useState("");
  const [showAdvancedFolders, setShowAdvancedFolders] = useState(false);
  const [presetSearch, setPresetSearch] = useState("");

  // Get preset metadata
  const presetMetadata = getPresetMetadata();
  
  // Get all available presets
  const availablePresets = Object.keys(projectPresets) as (keyof typeof projectPresets)[];
  
  // Filter presets based on search
  const filteredPresets = useMemo(() => {
    if (!presetSearch) return availablePresets;
    
    return availablePresets.filter(preset => {
      const metadata = presetMetadata[preset];
      return metadata?.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
             metadata?.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
             preset.toLowerCase().includes(presetSearch.toLowerCase());
    });
  }, [presetSearch, availablePresets, presetMetadata]);

  // Filter file types based on search
  const filteredFileGroups = useMemo(() => {
    if (!fileTypeSearch) return fileTypeGroups;
    
    return fileTypeGroups.map(group => ({
      ...group,
      types: group.types.filter(type => 
        type.toLowerCase().includes(fileTypeSearch.toLowerCase())
      )
    })).filter(group => group.types.length > 0);
  }, [fileTypeSearch]);

  const isValidFolderName = (folderName: string): boolean => {
    return /^[a-zA-Z0-9._-]+$/.test(folderName) && folderName.length <= 50;
  };

  const addFolder = (folder: string) => {
    const trimmedFolder = folder.trim();
    if (!trimmedFolder) return;

    if (!isValidFolderName(trimmedFolder)) {
      setFolderInputError("Invalid folder name. Use only alphanumeric characters, dots, underscores, and hyphens.");
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
    setAutoUnselectFolders(autoUnselectFolders.filter(folder => folder !== folderToRemove));
  };

  const handleFileTypeChange = (fileType: string) => {
    if (acceptedTypes.includes(fileType)) {
      setAcceptedTypes(acceptedTypes.filter(type => type !== fileType));
    } else {
      setAcceptedTypes([...acceptedTypes, fileType]);
    }
  };

  const applyPreset = (preset: keyof typeof projectPresets) => {
    const config = projectPresets[preset];
    setProjectType(preset);
    if (preset !== 'custom') {
      setAutoUnselectFolders(config.autoUnselectFolders);
      setAcceptedTypes(config.acceptedTypes);
    }
  };

  const handleSave = () => {
    onSave({ newLineCount, autoUnselectFolders, acceptedTypes });
  };

  const selectAllInGroup = (group: typeof fileTypeGroups[0]) => {
    const newTypes = [...new Set([...acceptedTypes, ...group.types])];
    setAcceptedTypes(newTypes);
  };

  const deselectAllInGroup = (group: typeof fileTypeGroups[0]) => {
    const newTypes = acceptedTypes.filter(type => !group.types.includes(type));
    setAcceptedTypes(newTypes);
  };

  const resetToDefaults = () => {
    setNewLineCount(2);
    applyPreset(projectType);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative w-full max-w-6xl rounded-2xl shadow-2xl transition-all duration-500 transform
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600/50' 
                         : 'bg-white border border-gray-100'}`}>
          
          {/* Modern Header */}
          <div className={`relative px-8 py-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600/50' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl transition-all duration-300
                               ${darkMode 
                                 ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                                 : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200'}`}>
                  <FaCog className={`text-2xl transition-colors duration-300
                                  ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className={`text-3xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Settings
                  </h2>
                  <p className={`text-base transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Customize your CodeFusion experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetToDefaults}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
                            transition-all duration-200 hover:scale-105
                            ${darkMode
                              ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'}`}
                >
                  <FaUndo className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={onClose}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105
                            ${darkMode
                              ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modern Tab Navigation */}
            <div className="flex mt-6 space-x-2">
              {[
                { id: 'presets', label: 'Project Presets', icon: <FaRocket /> },
                { id: 'advanced', label: 'Advanced', icon: <FaCog /> },
                { id: 'fileTypes', label: 'File Types', icon: <FaFileAlt /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium
                            transition-all duration-300 hover:scale-105
                            ${activeTab === tab.id
                              ? darkMode
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : darkMode
                                ? 'text-dark-300 hover:bg-dark-600 hover:text-dark-100'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            
            {/* Project Presets Tab */}
            {activeTab === "presets" && (
              <div className="space-y-8">
                
                {/* Search for presets */}
                <div className={`p-6 rounded-2xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700/50 border-dark-600' 
                                 : 'bg-gray-50/50 border-gray-200'}`}>
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="Search project types..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border text-lg
                                transition-all duration-200 focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 shadow-sm'}`}
                    />
                    <FaSearch className={`absolute left-4 top-5 h-5 w-5
                                        ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                  </div>
                </div>

                {/* Preset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPresets.map((preset) => {
                    const metadata = presetMetadata[preset];
                    if (!metadata) return null;
                    
                    return (
                      <div
                        key={preset}
                        onClick={() => applyPreset(preset)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer
                                  transition-all duration-300 hover:scale-105 hover:shadow-xl
                                  ${projectType === preset
                                    ? darkMode
                                      ? 'border-blue-500 bg-blue-900/20 shadow-xl'
                                      : 'border-blue-500 bg-blue-50 shadow-xl'
                                    : darkMode
                                      ? 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
                                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                                  }`}
                      >
                        {projectType === preset && (
                          <div className="absolute -top-2 -right-2">
                            <div className={`p-2 rounded-full
                                          ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                              <FaCheck className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-4xl">{metadata.icon}</div>
                          <div>
                            <h3 className={`text-xl font-bold transition-colors duration-300
                                         ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                              {metadata.name}
                            </h3>
                            <p className={`text-sm mt-1 transition-colors duration-300
                                         ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                              {preset}
                            </p>
                          </div>
                        </div>
                        
                        <p className={`text-base mb-4 transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                          {metadata.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-sm font-medium transition-colors duration-300
                                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                              Excluded folders:
                            </span>
                            <span className={`text-sm font-bold transition-colors duration-300
                                           ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {projectPresets[preset].autoUnselectFolders.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm font-medium transition-colors duration-300
                                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                              File types:
                            </span>
                            <span className={`text-sm font-bold transition-colors duration-300
                                           ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {projectPresets[preset].acceptedTypes.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* No results message */}
                {filteredPresets.length === 0 && (
                  <div className={`text-center py-12 rounded-2xl border transition-colors duration-300
                                 ${darkMode 
                                   ? 'bg-dark-700/50 border-dark-600' 
                                   : 'bg-gray-50/50 border-gray-200'}`}>
                    <FaSearch className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300
                                        ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    <p className={`text-lg font-medium transition-colors duration-300
                                 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      No presets found matching "{presetSearch}"
                    </p>
                  </div>
                )}

                {/* Current Configuration Summary */}
                <div className={`p-6 rounded-2xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700/50 border-dark-600' 
                                 : 'bg-gray-50/50 border-gray-200'}`}>
                  <h3 className={`text-xl font-bold mb-4 transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                    Current Configuration: {presetMetadata[projectType]?.name || projectType}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-4 rounded-xl transition-colors duration-300
                                   ${darkMode ? 'bg-dark-600' : 'bg-white shadow-sm'}`}>
                      <div className={`text-3xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {newLineCount}
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Lines between files
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl transition-colors duration-300
                                   ${darkMode ? 'bg-dark-600' : 'bg-white shadow-sm'}`}>
                      <div className={`text-3xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {autoUnselectFolders.length}
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Excluded folders
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl transition-colors duration-300
                                   ${darkMode ? 'bg-dark-600' : 'bg-white shadow-sm'}`}>
                      <div className={`text-3xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {acceptedTypes.length}
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Accepted file types
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings Tab */}
            {activeTab === "advanced" && (
              <div className="space-y-8">
                
                {/* Line Spacing Control */}
                <div className={`p-6 rounded-2xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700/50 border-dark-600' 
                                 : 'bg-gray-50/50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        Line Spacing
                      </h3>
                      <p className={`text-base transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        Number of blank lines between files in output
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setNewLineCount(Math.max(0, newLineCount - 1))}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110
                                  ${darkMode ? 'bg-dark-600 hover:bg-dark-500 text-dark-200' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm'}`}
                      >
                        <FaMinus />
                      </button>
                      <div className={`px-6 py-3 rounded-xl font-bold text-2xl min-w-[80px] text-center
                                     ${darkMode ? 'bg-dark-600 text-dark-100' : 'bg-white text-gray-900 shadow-sm'}`}>
                        {newLineCount}
                      </div>
                      <button
                        onClick={() => setNewLineCount(Math.min(20, newLineCount + 1))}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110
                                  ${darkMode ? 'bg-dark-600 hover:bg-dark-500 text-dark-200' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm'}`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={newLineCount}
                    onChange={(e) => setNewLineCount(parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                              ${darkMode ? 'bg-dark-600' : 'bg-gray-200'}`}
                    style={{
                      background: `linear-gradient(to right, ${
                        darkMode ? '#3b82f6' : '#2563eb'
                      } 0%, ${
                        darkMode ? '#3b82f6' : '#2563eb'
                      } ${(newLineCount / 20) * 100}%, ${
                        darkMode ? '#374151' : '#e5e7eb'
                      } ${(newLineCount / 20) * 100}%, ${
                        darkMode ? '#374151' : '#e5e7eb'
                      } 100%)`
                    }}
                  />
                </div>

                {/* Folder Exclusion Management */}
                <div className={`p-6 rounded-2xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700/50 border-dark-600' 
                                 : 'bg-gray-50/50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        Excluded Folders
                      </h3>
                      <p className={`text-base transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        Folders that will be automatically excluded during uploads
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAdvancedFolders(!showAdvancedFolders)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
                                transition-all duration-200 hover:scale-105
                                ${darkMode
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      <span>{showAdvancedFolders ? <FaToggleOn /> : <FaToggleOff />}</span>
                      <span>Advanced</span>
                    </button>
                  </div>

                  {/* Add new folder */}
                  <div className="flex mb-6">
                    <input
                      type="text"
                      value={newFolderInput}
                      onChange={(e) => setNewFolderInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFolder(newFolderInput)}
                      className={`flex-grow p-4 border rounded-l-xl text-lg transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 shadow-sm'}`}
                      placeholder="Enter folder name to exclude..."
                    />
                    <button
                      onClick={() => addFolder(newFolderInput)}
                      className={`px-6 py-4 rounded-r-xl font-medium transition-all duration-200
                                  hover:shadow-lg focus:outline-none focus:ring-2
                                  ${darkMode
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'}`}
                    >
                      <FaPlus className="h-5 w-5" />
                    </button>
                  </div>

                  {folderInputError && (
                    <div className={`p-4 rounded-xl mb-6 transition-colors duration-300
                                   ${darkMode ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`text-sm font-medium transition-colors duration-300
                                   ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                        {folderInputError}
                      </p>
                    </div>
                  )}

                  {/* Current excluded folders */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {autoUnselectFolders.map((folder) => (
                      <div
                        key={folder}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                                  transition-all duration-200 hover:scale-105
                                  ${darkMode
                                    ? 'bg-red-600/20 text-red-300 border border-red-600/30'
                                    : 'bg-red-100 text-red-800 border border-red-200'}`}
                      >
                        <span className="text-lg">📁</span>
                        <span>{folder}</span>
                        <button
                          onClick={() => removeFolder(folder)}
                          className={`p-1 rounded-full hover:bg-white/20 transition-colors
                                    ${darkMode ? 'text-red-300' : 'text-red-600'}`}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Common suggestions */}
                  {showAdvancedFolders && (
                    <div>
                      <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300
                                     ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                        Common Exclusions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {commonExcludedFolders
                          .filter((folder) => !autoUnselectFolders.includes(folder))
                          .map((folder) => (
                            <button
                              key={folder}
                              onClick={() => addFolder(folder)}
                              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
                                        hover:scale-105
                                        ${darkMode
                                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500 border border-dark-500'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-200'}`}
                            >
                              {folder}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Types Tab */}
            {activeTab === "fileTypes" && (
              <div className="space-y-6">
                
                {/* Search and Controls */}
                <div className={`p-6 rounded-2xl border transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-dark-700/50 border-dark-600' 
                                 : 'bg-gray-50/50 border-gray-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search file types..."
                        value={fileTypeSearch}
                        onChange={(e) => setFileTypeSearch(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border text-lg
                                  transition-all duration-200 focus:outline-none focus:ring-2
                                  ${darkMode
                                    ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 shadow-sm'}`}
                      />
                      <FaSearch className={`absolute left-4 top-5 h-5 w-5
                                          ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    </div>
                    
                    <div className={`flex items-center space-x-3 p-2 rounded-xl
                                   ${darkMode ? 'bg-dark-600' : 'bg-white shadow-sm'}`}>
                      <span className={`text-sm font-medium transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        Selected: {acceptedTypes.length}
                      </span>
                      <div className={`h-6 w-px transition-colors duration-300
                                     ${darkMode ? 'bg-dark-500' : 'bg-gray-300'}`}></div>
                      <button
                        onClick={() => setAcceptedTypes(fileTypeGroups.flatMap(g => g.types))}
                        className={`text-sm font-medium transition-colors duration-200
                                  ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setAcceptedTypes([])}
                        className={`text-sm font-medium transition-colors duration-200
                                  ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Type Groups */}
                <div className="grid gap-6">
                  {filteredFileGroups.map((group) => (
                    <div
                      key={group.label}
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg
                                 ${darkMode 
                                   ? 'bg-dark-700/50 border-dark-600 hover:border-dark-500' 
                                   : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{group.icon}</span>
                          <div>
                            <h4 className={`text-xl font-bold transition-colors duration-300
                                           ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                              {group.label}
                            </h4>
                            <p className={`text-sm transition-colors duration-300
                                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                              {group.types.length} file types
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => selectAllInGroup(group)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105
                                      ${darkMode
                                        ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          >
                            <FaCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deselectAllInGroup(group)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105
                                      ${darkMode
                                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {group.types.map((fileType) => (
                          <label
                            key={fileType}
                            className={`relative flex items-center justify-center p-4 rounded-xl cursor-pointer
                                      transition-all duration-200 hover:scale-105 font-mono font-bold
                                      ${acceptedTypes.includes(fileType)
                                        ? darkMode
                                          ? 'bg-blue-600/20 text-blue-300 border-2 border-blue-500/50 shadow-lg'
                                          : 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-lg'
                                        : darkMode
                                          ? 'bg-dark-600 text-dark-300 border-2 border-dark-500 hover:border-dark-400'
                                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
                                      }`}
                          >
                            <input
                              type="checkbox"
                              checked={acceptedTypes.includes(fileType)}
                              onChange={() => handleFileTypeChange(fileType)}
                              className="sr-only"
                            />
                            <span className="text-sm">{fileType}</span>
                            {acceptedTypes.includes(fileType) && (
                              <div className="absolute -top-1 -right-1">
                                <FaCheck className={`h-3 w-3 p-0.5 rounded-full
                                                   ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className={`flex justify-between items-center p-8 border-t transition-colors duration-300
                         ${darkMode ? 'border-dark-600/50 bg-dark-700/30' : 'border-gray-100 bg-gray-50/30'}`}>
            <div className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              <p>Changes will be saved to your local browser storage</p>
              <p className="mt-1">
                Current preset: <strong>{presetMetadata[projectType]?.name || projectType}</strong>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105
                          ${darkMode
                            ? 'bg-dark-600 text-dark-200 hover:bg-dark-500 border-2 border-dark-500'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-2 border-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg
                          transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl
                          ${darkMode
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
              >
                <FaSave className="h-5 w-5" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;