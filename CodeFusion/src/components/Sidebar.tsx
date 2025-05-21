import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FaBrain, 
  FaEraser, 
  FaCopy, 
  FaFileUpload, 
  FaFolderOpen, 
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaEyeSlash,
  FaEye
} from "react-icons/fa";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface SidebarProps {
  onClearText: () => void;
  onCopyText: () => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadDirectory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSettingsOpen: () => void;
  onCodeAnalyzerToggle: () => void;
  onAnonymizeOpen: () => void;
  showCodeAnalyzer: boolean;
  uploadedFiles: FileData[];
  skippedFiles: File[];
  onFileVisibilityToggle: (path: string) => void;
}

const FileTree: React.FC<{
  files: FileData[];
  onToggle: (path: string) => void;
  level?: number;
}> = ({ files, onToggle, level = 0 }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <ul className={`space-y-1 ${level > 0 ? "ml-4 border-l pl-4" : ""} 
                  ${level > 0 ? (darkMode ? "border-dark-600" : "border-gray-200") : ""}`}>
      {files.map((file, index) => (
        <li key={file.path || index} className="flex flex-col">
          <div className={`flex items-center justify-between py-2 px-3 rounded-lg
                         transition-all duration-200
                         ${darkMode 
                           ? 'hover:bg-dark-600' 
                           : 'hover:bg-gray-100'}`}>
            
            <div className="flex items-center min-w-0">
              {file.children ? (
                <FaFolder className={`mr-3 h-4 w-4 transition-colors duration-200
                                   ${file.visible 
                                     ? darkMode ? 'text-accent-400' : 'text-blue-500'
                                     : darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
              ) : (
                <FaFile className={`mr-3 h-4 w-4 transition-colors duration-200
                                 ${file.visible 
                                   ? darkMode ? 'text-dark-300' : 'text-gray-600'
                                   : darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
              )}
              
              <span className={`font-medium truncate transition-colors duration-200
                             ${file.visible 
                               ? darkMode ? 'text-dark-200' : 'text-gray-800'
                               : darkMode ? 'text-dark-500' : 'text-gray-400'}`}>
                {file.name}
              </span>
            </div>

            <button
              onClick={() => file.path && onToggle(file.path)}
              className={`p-2 rounded-lg transition-all duration-200
                        ${file.visible 
                          ? darkMode 
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                          : darkMode
                            ? 'bg-dark-600 text-dark-400 hover:bg-dark-500'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              title={file.visible ? "Hide file" : "Show file"}
            >
              {file.visible ? <FaEye className="h-3 w-3" /> : <FaEyeSlash className="h-3 w-3" />}
            </button>
          </div>

          {file.children && file.visible && (
            <FileTree
              files={file.children}
              onToggle={onToggle}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  onClearText,
  onCopyText,
  onUploadFile,
  onUploadDirectory,
  onSettingsOpen,
  onCodeAnalyzerToggle,
  onAnonymizeOpen,
  showCodeAnalyzer,
  uploadedFiles,
  skippedFiles,
  onFileVisibilityToggle,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [showSkippedFiles, setShowSkippedFiles] = useState(false);

  const toggleSkippedFiles = () => {
    setShowSkippedFiles(!showSkippedFiles);
  };

  return (
    <div className={`w-full h-full border-l flex flex-col transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold transition-colors duration-300
                       ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
          Controls
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        {/* Clear Text Button */}
        <button
          onClick={onClearText}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200
                    ${darkMode
                      ? 'bg-red-600/90 hover:bg-red-600 text-white shadow-dark'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'}`}
        >
          <FaEraser className="h-4 w-4" />
          <span>Clear Text</span>
        </button>

        {/* Copy Button */}
        <button
          onClick={onCopyText}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200
                    ${darkMode
                      ? 'bg-green-600/90 hover:bg-green-600 text-white shadow-dark'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'}`}
        >
          <FaCopy className="h-4 w-4" />
          <span>Copy All</span>
        </button>

        {/* Smart Analysis Button */}
        <button
          onClick={onCodeAnalyzerToggle}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200
                    ${showCodeAnalyzer
                      ? darkMode
                        ? 'bg-accent-500 hover:bg-accent-400 text-white shadow-dark-lg'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : darkMode
                        ? 'bg-purple-600/90 hover:bg-purple-600 text-white shadow-dark'
                        : 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm'
                    }`}
        >
          <FaBrain className="h-4 w-4" />
          <span>Smart Analysis</span>
        </button>

        {/* Anonymize Button */}
        <button
          onClick={onAnonymizeOpen}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200
                    ${darkMode
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-dark'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'}`}
        >
          <FaEyeSlash className="h-4 w-4" />
          <span>Anonymize Personal Info</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onSettingsOpen}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200
                    ${darkMode
                      ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
        >
          <FaCog className="h-4 w-4" />
          <span>Settings</span>
        </button>

        {/* Upload Buttons */}
        <div className="space-y-2">
          <label
            htmlFor="fileInput"
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold 
                      cursor-pointer transition-all duration-200
                      ${darkMode
                        ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
          >
            <div className="flex items-center justify-center space-x-3">
              <FaFileUpload className="h-4 w-4" />
              <span>Upload Files</span>
            </div>
          </label>

          <label
            htmlFor="dirInput"
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold 
                      cursor-pointer transition-all duration-200
                      ${darkMode
                        ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
          >
            <div className="flex items-center justify-center space-x-3">
              <FaFolderOpen className="h-4 w-4" />
              <span>Upload Directory</span>
            </div>
          </label>
        </div>

        {/* Hidden File Inputs */}
        <input
          id="fileInput"
          type="file"
          onChange={onUploadFile}
          className="hidden"
          multiple
        />
        <input
          id="dirInput"
          type="file"
          multiple
          onChange={onUploadDirectory}
          className="hidden"
          {...({ webkitdirectory: "" } as any)}
          {...({ directory: "" } as any)}
        />
      </div>

      {/* Uploaded Files Section */}
      <div className={`flex-1 border-t transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
              Uploaded Files
            </h3>
            {uploadedFiles.length > 0 && (
              <span className={`text-sm px-2 py-1 rounded 
                             ${darkMode 
                               ? 'bg-dark-600 text-dark-300' 
                               : 'bg-gray-100 text-gray-600'}`}>
                {uploadedFiles.length}
              </span>
            )}
          </div>

          {uploadedFiles.length > 0 ? (
            <div className={`rounded-lg border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <div className="p-3">
                <FileTree 
                  files={uploadedFiles} 
                  onToggle={onFileVisibilityToggle}
                />
              </div>
            </div>
          ) : (
            <div className={`text-sm text-center py-8 rounded-lg border-2 border-dashed
                           ${darkMode 
                             ? 'text-dark-400 border-dark-600' 
                             : 'text-gray-400 border-gray-300'}`}>
              No files uploaded yet
            </div>
          )}
        </div>
      </div>

      {/* Skipped Files Section */}
      <div className={`border-t transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="p-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleSkippedFiles}
          >
            <h3 className={`text-lg font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
              Skipped Files
            </h3>
            <div className="flex items-center space-x-2">
              {skippedFiles.length > 0 && (
                <span className={`text-sm px-2 py-1 rounded
                               ${darkMode 
                                 ? 'bg-orange-900/30 text-orange-400' 
                                 : 'bg-orange-100 text-orange-600'}`}>
                  {skippedFiles.length}
                </span>
              )}
              <span className={`text-sm transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                {showSkippedFiles ? (
                  <FaChevronDown className="h-3 w-3" />
                ) : (
                  <FaChevronRight className="h-3 w-3" />
                )}
              </span>
            </div>
          </div>
          
          {showSkippedFiles && (
            <div className="mt-4">
              {skippedFiles.length > 0 ? (
                <div className={`rounded-lg border max-h-40 overflow-y-auto
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}>
                  <div className="p-3 space-y-2">
                    {skippedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded
                                  ${darkMode 
                                    ? 'bg-dark-600 hover:bg-dark-500' 
                                    : 'bg-white hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center min-w-0">
                          <FaFile className={`h-3 w-3 mr-2 flex-shrink-0
                                            ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                          <span className={`text-sm truncate
                                          ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                            {file.name}
                          </span>
                        </div>
                        <span className={`text-xs ml-2 flex-shrink-0
                                        ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                          {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`text-sm text-center py-4 rounded-lg
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  No files were skipped
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;