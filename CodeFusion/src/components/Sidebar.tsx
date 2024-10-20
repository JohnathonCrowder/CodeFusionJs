import React from "react";

interface SidebarProps {
  onClearText: () => void;
  onCopyText: () => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadDirectory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSettingsOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClearText,
  onCopyText,
  onUploadFile,
  onUploadDirectory,
  onSettingsOpen,
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
          <ul id="fileListItems" className="space-y-2" />
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
          <ul
            id="skippedFileListItems"
            className="list-disc pl-6 text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
