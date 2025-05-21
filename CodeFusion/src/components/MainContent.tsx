import React, { useContext, useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FaFile, 
  FaShieldAlt, 
  FaUpload, 
  FaCopy, 
  FaCheck
} from "react-icons/fa";
import SearchBox from "./SearchBox";

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

interface SearchMatch {
  index: number;
  start: number;
  end: number;
  lineNumber: number;
  lineStart: number;
}

const MainContent: React.FC<MainContentProps> = ({ 
  fileData, 
  isAnonymized, 
  anonymizeContent 
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  // Refs
  const codeViewerRef = useRef<HTMLPreElement>(null);

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

  // Render content with highlighted matches
  const renderHighlightedContent = useMemo(() => {
    if (!searchMatches || searchMatches.length === 0) {
      return formattedContent;
    }
    
    const fragments = [];
    let lastIndex = 0;
    
    searchMatches.forEach((match, idx) => {
      // Add text before match
      if (match.start > lastIndex) {
        fragments.push(formattedContent.slice(lastIndex, match.start));
      }
      
      // Add highlighted match
      const matchText = formattedContent.slice(match.start, match.end);
      const isCurrentMatch = idx === currentMatchIndex;
      
      fragments.push(
        <mark
          key={`match-${idx}`}
          id={`match-${idx}`}
          className={`rounded px-0.5 transition-all duration-200
                     ${isCurrentMatch 
                       ? darkMode 
                         ? 'bg-orange-500 text-white ring-2 ring-orange-400' 
                         : 'bg-orange-400 text-white ring-2 ring-orange-300'
                       : darkMode
                         ? 'bg-yellow-600/40 text-yellow-100'
                         : 'bg-yellow-300 text-gray-900'
                     }`}
          style={{ borderRadius: '2px' }}
        >
          {matchText}
        </mark>
      );
      
      lastIndex = match.end;
    });
    
    // Add remaining text
    if (lastIndex < formattedContent.length) {
      fragments.push(formattedContent.slice(lastIndex));
    }
    
    return <>{fragments}</>;
  }, [formattedContent, searchMatches, currentMatchIndex, darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Close search with Escape
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
      
      // Navigate matches with F3 or Ctrl/Cmd + G
      if (showSearch && searchMatches.length > 0) {
        if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key === 'g')) {
          e.preventDefault();
          if (e.shiftKey) {
            setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
          } else {
            setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, searchMatches.length]);

  // Scroll to current match
  useEffect(() => {
    if (searchMatches.length > 0 && codeViewerRef.current) {
      const matchElement = document.getElementById(`match-${currentMatchIndex}`);
      if (matchElement) {
        matchElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentMatchIndex, searchMatches]);

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

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearchMatches([]);
    setCurrentMatchIndex(0);
  }, []);

  const handleMatchesFound = useCallback((matches: SearchMatch[]) => {
    setSearchMatches(matches);
  }, []);

  const handleCurrentMatchChange = useCallback((index: number) => {
    setCurrentMatchIndex(index);
  }, []);

  return (
    <div className={`flex-1 flex flex-col transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      {/* Controls Bar (only shown when files are uploaded) */}
      {fileData.length > 0 && (
        <div className={`border-b p-4 transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800/50 border-dark-600/50' 
                         : 'bg-white/80 border-gray-200/50'}`}>
          
          <div className="flex items-center justify-between">
            {/* Left side - Search shortcut hint */}
            <div className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              Press <kbd className={`px-2 py-1 mx-1 rounded text-xs font-mono
                                   ${darkMode 
                                     ? 'bg-dark-600 text-dark-200' 
                                     : 'bg-gray-200 text-gray-700'}`}>
                Ctrl+F
              </kbd> to search
            </div>
            
            {/* Right side - Copy button and Privacy indicator */}
            <div className="flex items-center space-x-4">
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
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 relative">
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
              </div>
              
              {/* Code Viewer Area */}
              <div className="relative h-full overflow-hidden">
                <pre
                  ref={codeViewerRef}
                  className={`w-full h-full p-6 overflow-auto font-mono text-sm leading-relaxed
                            whitespace-pre-wrap break-words m-0
                            ${darkMode 
                              ? 'text-dark-100 bg-dark-800' 
                              : 'text-gray-800 bg-white'}`}
                  style={{ minHeight: '500px' }}
                >
                  {renderHighlightedContent}
                </pre>
                
                {/* Search Box Component */}
                <SearchBox
                  content={formattedContent}
                  isVisible={showSearch}
                  onClose={handleSearchClose}
                  onMatchesFound={handleMatchesFound}
                  onCurrentMatchChange={handleCurrentMatchChange}
                  darkMode={darkMode}
                />
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
          /* Clean Empty State - keeping this the same */
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