import React from "react";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
}

interface SidebarProps {
  onClearText: () => void;
  onCopyText: () => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadDirectory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSettingsOpen: () => void;
  uploadedFiles: FileData[];
  skippedFiles: File[];
  onFileVisibilityToggle: (index: number) => void;
}

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
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Uploaded Files:
          </h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span
                  className={`cursor-pointer ${
                    file.visible ? "text-gray-800" : "text-gray-400"
                  }`}
                  onClick={() => onFileVisibilityToggle(index)}
                >
                  {file.name}
                </span>
                <input
                  type="checkbox"
                  checked={file.visible}
                  onChange={() => onFileVisibilityToggle(index)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 
                           focus:ring-blue-500"
                />
              </li>
            ))}
          </ul>
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
          webkitdirectory=""
          directory=""
          multiple
          onChange={onUploadDirectory}
          className="hidden"
        />
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Skipped Files:
          </h3>
          <ul className="list-disc pl-6 text-gray-600">
            {skippedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
