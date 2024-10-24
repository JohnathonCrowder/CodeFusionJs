import React, { useState } from "react";

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
                file.visible ? "text-gray-800" : "text-gray-400"
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
  uploadedFiles,
  skippedFiles,
  onFileVisibilityToggle,
}) => {
  const [showSkippedFiles, setShowSkippedFiles] = useState(false);

  const toggleSkippedFiles = () => {
    setShowSkippedFiles(!showSkippedFiles);
  };

  return (
    <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Options</h2>
      <div className="space-y-6">
        <button
          onClick={onClearText}
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-blue-700 focus:outline-none 
                   focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                   transition-colors duration-200"
        >
          Clear Text
        </button>
        <button
          onClick={onCopyText}
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-green-700 focus:outline-none 
                   focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 
                   transition-colors duration-200"
        >
          Copy
        </button>
        <button
          onClick={onSettingsOpen}
          className="w-full px-4 py-2 bg-gray-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-gray-700 focus:outline-none 
                   focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                   transition-colors duration-200"
        >
          Settings
        </button>
        <label
          htmlFor="fileInput"
          className="block w-full px-4 py-2 bg-gray-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-gray-700 focus:outline-none 
                   focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                   transition-colors duration-200 cursor-pointer"
        >
          Upload File
        </label>
        <label
          htmlFor="dirInput"
          className="block w-full px-4 py-2 bg-gray-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-gray-700 focus:outline-none 
                   focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                   transition-colors duration-200 cursor-pointer"
        >
          Upload Directory
        </label>
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
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Uploaded Files:
          </h3>
          <FileTree files={uploadedFiles} onToggle={onFileVisibilityToggle} />
        </div>
        <div className="mt-8">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleSkippedFiles}
          >
            <h3 className="text-lg font-bold text-gray-800">Skipped Files</h3>
            <span className="text-sm text-gray-500">
              {showSkippedFiles ? "Hide" : "Show"}
            </span>
          </div>
          {showSkippedFiles && (
            <div className="mt-4">
              {skippedFiles.length > 0 ? (
                <ul className="space-y-2">
                  {skippedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {file.type || "Unknown Type"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No skipped files.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
