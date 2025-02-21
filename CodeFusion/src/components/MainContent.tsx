import React from "react";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface MainContentProps {
  fileData: FileData[];
  isAnonymized: boolean;
  anonymizeContent: (content: string) => string;
}

const MainContent: React.FC<MainContentProps> = ({ 
  fileData, 
  isAnonymized, 
  anonymizeContent 
}) => {
  const getVisibleContent = (
    files: FileData[]
  ): Array<{
    content: string;
    name: string;
    path?: string;
  }> => {
    return files.flatMap((file) => {
      const contents: Array<{
        content: string;
        name: string;
        path?: string;
      }> = [];

      if (file.visible && file.content) {
        contents.push({
          // Apply anonymization to content when needed
          content: isAnonymized ? anonymizeContent(file.content) : file.content,
          name: file.name,
          path: file.path,
        });
      }

      if (file.children && file.visible) {
        contents.push(...getVisibleContent(file.children));
      }

      return contents;
    });
  };

  const visibleFiles = getVisibleContent(fileData);
  const formattedContent = visibleFiles
    .map((file) => {
      return [
        "=".repeat(60),
        `File: ${file.name}`,
        `Path: ${file.path || "N/A"}`,
        "=".repeat(60),
        "",
        file.content,
        "",
        "",
      ].join("\n");
    })
    .join("\n");

  return (
    <div className="w-3/4 p-6 flex flex-col h-full dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to CodeFusionX
        </h1>
        
        {isAnonymized && (
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 
                        rounded-full text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Privacy Mode Active
          </div>
        )}
      </div>
      
      {fileData.length > 0 ? (
        <textarea
          id="textbox"
          className="flex-grow p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none 
                   text-gray-200 bg-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent font-mono"
          value={formattedContent}
          readOnly
        />
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed 
                      border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Files Uploaded</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Upload files or a directory using the buttons in the sidebar to see your code here.
            {isAnonymized && (
              <span className="block mt-2 text-green-600 dark:text-green-400">
                Privacy mode is active - your personal information will be anonymized.
              </span>
            )}
          </p>
        </div>
      )}

      {fileData.length > 0 && isAnonymized && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
          Note: Personal information has been anonymized. Toggle "Disable Anonymization" in the sidebar to see original content.
        </div>
      )}
    </div>
  );
};

export default MainContent;