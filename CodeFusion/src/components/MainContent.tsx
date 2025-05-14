import React, { useContext, useState, useMemo } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaFile, FaShieldAlt, FaUpload, FaEye, FaSearch, FaCopy, FaCheck } from "react-icons/fa";

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
  const { darkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

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

  // Simple search highlighting
  const highlightedContent = useMemo(() => {
    if (!searchTerm.trim()) return formattedContent;
    
    try {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return formattedContent.replace(regex, '🔍$1🔍');
    } catch {
      return formattedContent;
    }
  }, [formattedContent, searchTerm]);

  // Calculate basic stats
  const totalFiles = visibleFiles.length;
  const totalLines = formattedContent.split('\n').length;
  const sizeInKB = (new Blob([formattedContent]).size / 1024).toFixed(1);

  // Copy functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`flex-1 flex flex-col transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      {/* Search and Controls Bar (only shown when files are uploaded) */}
      {fileData.length > 0 && (
        <div className={`border-b p-6 transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800/50 border-dark-600/50' 
                         : 'bg-white/80 border-gray-200/50'}`}>
          
          {/* Stats and Privacy section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* File Stats */}
            <div className={`flex items-center space-x-6 text-sm
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              <div className="flex items-center space-x-2">
                <FaFile className="h-4 w-4" />
                <span>{totalFiles} files</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEye className="h-4 w-4" />
                <span>{totalLines.toLocaleString()} lines</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📊</span>
                <span>{sizeInKB} KB</span>
              </div>
            </div>
            
            {/* Privacy Mode Indicator */}
            {isAnonymized && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                             ${darkMode 
                               ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                               : 'bg-green-50 text-green-700 border border-green-200'}`}>
                <FaShieldAlt className="h-4 w-4" />
                <span>Privacy Mode Active</span>
              </div>
            )}
          </div>
          
          {/* Search and Copy */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in code..."
                className={`w-full pl-8 pr-4 py-2 rounded-lg border text-sm
                          ${darkMode
                            ? 'bg-dark-600 border-dark-500 text-dark-200 placeholder-dark-400'
                            : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'}`}
              />
              <FaSearch className={`absolute left-2.5 top-3 h-3 w-3
                                  ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
            </div>
            
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200
                        ${darkMode
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {copyStatus === 'copied' ? (
                <>
                  <FaCheck className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy className="h-4 w-4" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {fileData.length > 0 ? (
          <div className="h-full flex flex-col">
            {/* Code Content */}
            <div className={`flex-1 relative rounded-xl border transition-all duration-300
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600/50 shadow-dark-lg' 
                             : 'bg-white border-gray-200 shadow-sm'}`}>
              
              {/* Code Header */}
              <div className={`flex items-center justify-between p-4 border-b
                             ${darkMode 
                               ? 'border-dark-600/50 bg-dark-700/50' 
                               : 'border-gray-200 bg-gray-50/50'}`}>
                <span className={`text-sm font-medium
                               ${darkMode ? 'text-dark-200' : 'text-gray-600'}`}>
                  Combined Project Files
                </span>
                <span className={`text-xs px-3 py-1 rounded-full
                               ${darkMode 
                                 ? 'bg-dark-600 text-dark-300' 
                                 : 'bg-gray-100 text-gray-600'}`}>
                  {totalFiles} files • {sizeInKB} KB
                </span>
              </div>
              
              {/* Code Editor Area */}
              <div className="relative h-full">
                <textarea
                  className={`w-full h-full p-6 resize-none font-mono text-sm leading-relaxed
                            focus:outline-none border-0 bg-transparent
                            transition-colors duration-300
                            ${darkMode 
                              ? 'text-dark-100 placeholder-dark-400' 
                              : 'text-gray-800 placeholder-gray-400'}`}
                  value={highlightedContent}
                  readOnly
                  placeholder="Your code will appear here..."
                  style={{ minHeight: '500px' }}
                />
                
                {/* Subtle line highlight for search results */}
                {searchTerm && (
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs
                                 ${darkMode 
                                   ? 'bg-accent-900/50 text-accent-300' 
                                   : 'bg-blue-100 text-blue-700'}`}>
                    Search: "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Footer */}
            {isAnonymized && (
              <div className={`mt-4 p-4 rounded-lg border-l-4 
                             ${darkMode 
                               ? 'bg-green-900/10 border-green-500 text-green-400' 
                               : 'bg-green-50 border-green-500 text-green-700'}`}>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Privacy Protection Applied
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-80">
                  Personal information has been anonymized. Toggle "Disable Anonymization" in the sidebar to view original content.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="h-full flex items-center justify-center">
            <div className={`text-center p-12 rounded-2xl transition-all duration-300
                           ${darkMode 
                             ? 'bg-dark-800/50 border border-dark-600/50' 
                             : 'bg-white shadow-sm border border-gray-200'}`}>
              
              {/* Upload Icon */}
              <div className="mb-8">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center
                               ${darkMode 
                                 ? 'bg-dark-700 border-2 border-dark-600' 
                                 : 'bg-gray-50 border-2 border-gray-200'}`}>
                  <FaUpload className={`h-10 w-10 transition-colors duration-300
                                       ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Empty State Content */}
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                No Files Uploaded
              </h3>
              
              <p className={`text-base mb-8 max-w-md mx-auto leading-relaxed
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                Upload files or a directory using the sidebar controls to begin viewing your code.
              </p>

              {/* Simple Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700/50' : 'bg-gray-50'}`}>
                  <FaFile className={`h-6 w-6 mx-auto mb-2
                                     ${darkMode ? 'text-accent-400' : 'text-blue-600'}`} />
                  <p className={`text-sm font-medium
                               ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                    Individual Files
                  </p>
                </div>
                <div className={`p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700/50' : 'bg-gray-50'}`}>
                  <FaUpload className={`h-6 w-6 mx-auto mb-2
                                       ${darkMode ? 'text-accent-400' : 'text-blue-600'}`} />
                  <p className={`text-sm font-medium
                               ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                    Project Directories
                  </p>
                </div>
              </div>

              {/* Privacy Note */}
              {isAnonymized && (
                <div className={`mt-6 p-4 rounded-lg transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-green-900/20 border border-green-700/50' 
                                 : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <FaShieldAlt className={`h-4 w-4
                                           ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium
                                   ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      Privacy mode is active
                    </span>
                  </div>
                  <p className={`text-xs mt-2 opacity-80
                               ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                    Your personal information will be anonymized when files are uploaded.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;