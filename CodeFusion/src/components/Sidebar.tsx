import React, { useState } from "react";
import { FaEyeSlash, FaEye, FaPlus, FaUserSecret, FaCog, FaUpload, FaFolder, FaTrash, FaCopy } from "react-icons/fa";

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
  onAnonymizeOpen: () => void;
  isAnonymized: boolean;
  toggleAnonymization: () => void;
  uploadedFiles: FileData[];
  skippedFiles: File[];
  onFileVisibilityToggle: (path: string) => void;
}

const FileTree: React.FC<{
  files: FileData[];
  onToggle: (path: string) => void;
  level?: number;
}> = ({ files, onToggle, level = 0 }) => {
  return (
    <ul className={`space-y-2 ${level > 0 ? "ml-4" : ""}`}>
      {files.map((file, index) => (
        <li key={file.path || index} className="flex flex-col">
          <div className="flex items-center justify-between">
            <span
              className={`cursor-pointer ${
                file.visible 
                  ? "text-gray-800 dark:text-gray-200" 
                  : "text-gray-400 dark:text-gray-500"
              }`}
              onClick={() => file.path && onToggle(file.path)}
            >
              {file.children ? "📁 " : "📄 "}
              {file.name}
            </span>
            <input
              type="checkbox"
              checked={file.visible}
              onChange={() => file.path && onToggle(file.path)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 
                       focus:ring-blue-500"
            />
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
  onAnonymizeOpen,
  isAnonymized,
  toggleAnonymization,
  uploadedFiles,
  skippedFiles,
  onFileVisibilityToggle,
}) => {
  const [showSkippedFiles, setShowSkippedFiles] = useState(false);

  const toggleSkippedFiles = () => {
    setShowSkippedFiles(!showSkippedFiles);
  };

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 p-6 shadow-lg overflow-y-auto border-l dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Options</h2>
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onCopyText}
            className="w-full px-4 py-2 bg-green-500 text-white font-semibold 
                     rounded-lg shadow-md hover:bg-green-600 focus:outline-none 
                     focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 
                     transition-colors duration-200 flex items-center justify-center"
          >
            <FaCopy className="mr-2" /> Copy
          </button>
          
          <button
            onClick={onClearText}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold 
                     rounded-lg shadow-md hover:bg-red-600 focus:outline-none 
                     focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 
                     transition-colors duration-200 flex items-center justify-center"
          >
            <FaTrash className="mr-2" /> Clear Text
          </button>
        </div>
        
        {/* Privacy Section */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy Controls</h3>
          
          <button
            onClick={toggleAnonymization}
            className={`w-full px-4 py-2 mb-2 font-semibold 
                     rounded-lg shadow-md focus:outline-none 
                     focus:ring-2 focus:ring-opacity-75 
                     transition-colors duration-200 flex items-center justify-center
                     ${
                       isAnonymized 
                         ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400" 
                         : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400"
                     }`}
          >
            {isAnonymized ? <FaEye className="mr-2" /> : <FaEyeSlash className="mr-2" />}
            {isAnonymized ? "Disable Anonymization" : "Anonymize Personal Info"}
          </button>
          
          <button
            onClick={onAnonymizeOpen}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium
                     rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none 
                     focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                     transition-colors duration-200 flex items-center justify-center"
          >
            <FaUserSecret className="mr-2" /> Privacy Settings
          </button>
        </div>
        
        {/* Upload Options */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Import Files</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium
                       rounded-lg shadow-md hover:bg-blue-600 focus:outline-none cursor-pointer 
                       focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                       transition-colors duration-200"
            >
              <FaUpload className="mr-2" /> Upload File
            </label>
            
            <label
              htmlFor="dirInput"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium
                       rounded-lg shadow-md hover:bg-blue-600 focus:outline-none cursor-pointer
                       focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                       transition-colors duration-200"
            >
              <FaFolder className="mr-2" /> Upload Directory
            </label>
            
            <button
              onClick={onSettingsOpen}
              className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-medium
                       rounded-lg shadow-md hover:bg-gray-600 focus:outline-none 
                       focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                       transition-colors duration-200"
            >
              <FaCog className="mr-2" /> Settings
            </button>
          </div>
          
          <input
            id="fileInput"
            type="file"
            onChange={onUploadFile}
            className="hidden"
          />
          <input
            id="dirInput"
            type="file"
            multiple
            onChange={onUploadDirectory}
            className="hidden"
            // Type assertion to bypass TypeScript checking
            {...({ webkitdirectory: "" } as any)}
            {...({ directory: "" } as any)}
          />
        </div>
        
        {/* File Tree Section */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-600 flex justify-between items-center">
              <span>Uploaded Files</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'}
              </span>
            </h3>
            <FileTree files={uploadedFiles} onToggle={onFileVisibilityToggle} />
          </div>
        )}
        
        {/* Skipped Files Section */}
        {skippedFiles.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={toggleSkippedFiles}
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <span>Skipped Files</span>
                <span className="ml-2 text-sm font-normal px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                  {skippedFiles.length}
                </span>
              </h3>
              <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {showSkippedFiles ? "Hide" : "Show"}
              </span>
            </div>
            
            {showSkippedFiles && (
              <div className="mt-4 max-h-64 overflow-y-auto">
                <ul className="space-y-2 divide-y divide-gray-200 dark:divide-gray-600">
                  {skippedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[70%]">
                        {file.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                        {file.type || "Unknown Type"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && skippedFiles.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <div className="flex flex-col items-center">
              <FaUpload className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No files uploaded yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Use the buttons above to upload files or a directory.
              </p>
            </div>
          </div>
        )}
        
        {/* Anonymization Hint */}
        {isAnonymized && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <FaUserSecret className="text-green-600 dark:text-green-400 mt-1 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Privacy Mode Active</h4>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Personal information will be anonymized when viewing or copying content.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;