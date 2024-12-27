import React, { useState } from "react";
import {
  FaTimes,
  FaPlus,
  FaInfo,
  FaSave,
  FaTimes as FaClose,
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaClose size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 ${
                activeTab === "general"
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("fileTypes")}
              className={`px-4 py-2 ${
                activeTab === "fileTypes"
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              File Types
            </button>
          </div>

          {activeTab === "general" && (
            <>
              {/* Project Type Selection */}
              <div className="mb-6">
                <label
                  className="block text-lg font-semibold mb-2"
                  htmlFor="projectType"
                >
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full p-2 border rounded-md focus:outline-none 
                          focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  <FaInfo className="inline mr-1" />
                  Selecting a project type will apply optimized settings for
                  that environment.
                </p>
              </div>

              {/* New Lines Between Files */}
              <div className="mb-6">
                <label
                  className="block text-lg font-semibold mb-2"
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
                  className="w-full p-2 border rounded-md focus:outline-none 
                          focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Auto-unselect Folders */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Auto-unselect Folders
                </h3>

                {/* Selected folders */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {autoUnselectFolders.map((folder) => (
                    <span
                      key={folder}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 
                                rounded-full text-sm font-medium"
                    >
                      {folder}
                      <button
                        onClick={() => removeFolder(folder)}
                        className="ml-2 text-blue-400 hover:text-blue-600"
                      >
                        <FaTimes />
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
                    className="flex-grow p-2 border rounded-l-md focus:outline-none 
                            focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a folder to exclude"
                  />
                  <button
                    onClick={() => addFolder(newFolderInput)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md 
                            hover:bg-blue-600 focus:outline-none focus:ring-2 
                            focus:ring-blue-500"
                  >
                    <FaPlus />
                  </button>
                </div>

                {folderInputError && (
                  <p className="text-red-500 text-sm mb-4">
                    {folderInputError}
                  </p>
                )}

                {/* Common folder suggestions */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Common folders:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonExcludedFolders
                      .filter((folder) => !autoUnselectFolders.includes(folder))
                      .map((folder) => (
                        <button
                          key={folder}
                          onClick={() => addFolder(folder)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full 
                                    text-sm hover:bg-gray-300 focus:outline-none 
                                    focus:ring-2 focus:ring-gray-400"
                        >
                          {folder}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "fileTypes" && (
            /* Accepted File Types */
            <div>
              {fileTypeGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-700">
                      {group.label}
                    </h4>
                    <div className="space-x-2">
                      <button
                        onClick={() => selectAllTypes(group)}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => deselectAllTypes(group)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {group.types.map((fileType) => (
                      <label key={fileType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={acceptedTypes.includes(fileType)}
                          onChange={() => handleFileTypeChange(fileType)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 
                                  focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm">{fileType}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md 
                      hover:bg-gray-300 focus:outline-none focus:ring-2 
                      focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 flex items-center"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
