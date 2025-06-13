import React, { useState, useContext, useMemo, useEffect, useRef, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FaFile, 
  FaShieldAlt, 
  FaUpload, 
  FaCopy, 
  FaCheck,
  FaSearch,
  FaTimesCircle,
  FaAngleDown,
  FaAngleUp
} from "react-icons/fa";
import { SearchBox } from "./modals/app";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  // Refs
  const codeViewerRef = useRef<HTMLPreElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if running on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        setIsSearchExpanded(true);
      }
      
      // Close search with Escape
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setIsSearchExpanded(false);
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
      
      // Show success state briefly
      setTimeout(() => setCopyStatus('idle'), 2000);
      
      // Provide haptic feedback on mobile if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearchMatches([]);
    setCurrentMatchIndex(0);
    setIsSearchExpanded(false);
  }, []);

  const handleMatchesFound = useCallback((matches: SearchMatch[]) => {
    setSearchMatches(matches);
  }, []);

  const handleCurrentMatchChange = useCallback((index: number) => {
    setCurrentMatchIndex(index);
  }, []);

  // Get stats for the code
  const codeStats = useMemo(() => {
    if (!formattedContent) return { lines: 0, chars: 0, files: 0 };
    
    const lines = formattedContent.split('\n').length;
    const chars = formattedContent.length;
    const files = visibleFiles.length;
    
    return { lines, chars, files };
  }, [formattedContent, visibleFiles]);

  return (
    <div 
      ref={contentContainerRef}
      className={`flex-1 flex flex-col transition-colors duration-300 min-w-0 overflow-hidden h-full
                 ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}
      style={{ minWidth: 0 }} // Ensure flex item can shrink below content size
    >
      
      {/* Controls Bar - Responsive */}
      {fileData.length > 0 && (
        <div className={`border-b transition-colors duration-300 flex-shrink-0
                       ${darkMode 
                         ? 'bg-dark-800/50 border-dark-600/50' 
                         : 'bg-white/95 border-gray-200/50'}
                       ${isMobile ? 'sticky top-16 z-10' : 'relative'}`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between min-w-0">
            {/* Upper Controls Row */}
            <div className="flex items-center justify-between px-3 py-2 sm:py-3 min-w-0">
              <div className="flex items-center min-w-0">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2 rounded-lg transition-all duration-200 mr-2 flex-shrink-0
                            ${darkMode 
                              ? `bg-${showSearch ? 'accent-500/20' : 'dark-700'} text-${showSearch ? 'accent-400' : 'dark-300'}` 
                              : `bg-${showSearch ? 'blue-50' : 'gray-100'} text-${showSearch ? 'blue-600' : 'gray-500'}`}`}
                >
                  <FaSearch className="h-4 w-4" />
                </button>
                
                <div className={`text-xs sm:text-sm transition-colors duration-300 overflow-hidden
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  <span className="hidden sm:inline">Press </span>
                  <kbd className={`px-1 py-0.5 mx-1 rounded text-xs font-mono
                                 ${darkMode 
                                   ? 'bg-dark-600 text-dark-200' 
                                   : 'bg-gray-200 text-gray-700'}`}>
                    Ctrl+F
                  </kbd>
                  <span className="hidden sm:inline">to search</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-3 text-xs flex-shrink-0">
                <span className={`hidden sm:inline px-2 py-1 rounded-full whitespace-nowrap
                                ${darkMode 
                                  ? 'bg-dark-700 text-dark-400' 
                                  : 'bg-gray-100 text-gray-600'}`}>
                  {codeStats.files} file{codeStats.files !== 1 ? 's' : ''}
                </span>
                <span className={`px-2 py-1 rounded-full whitespace-nowrap
                                ${darkMode 
                                  ? 'bg-dark-700 text-dark-400' 
                                  : 'bg-gray-100 text-gray-600'}`}>
                  {codeStats.lines.toLocaleString()} lines
                </span>
              </div>
            </div>
            
            {/* Responsive Action Row */}
            <div className="flex items-center justify-end space-x-2 px-3 pb-2 sm:pb-0 sm:pr-3 flex-shrink-0">
              {/* Privacy Mode Indicator - Responsive */}
              {isAnonymized && (
                <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap
                               ${darkMode 
                                 ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                                 : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  <FaShieldAlt className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <span className="hidden xs:inline">Privacy Mode</span>
                </div>
              )}
              
              {/* Copy Button - Responsive */}
              <button
                onClick={handleCopy}
                className={`flex items-center space-x-1 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg 
                          font-medium text-xs sm:text-sm whitespace-nowrap
                          transition-all duration-200 relative group flex-shrink-0
                          ${darkMode
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'}`}
                aria-label="Copy all code"
              >
                {copyStatus === 'copied' ? (
                  <>
                    <FaCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span>Copy Code</span>
                  </>
                )}
                
                {/* Tooltip */}
                <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                                px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100
                                transition-opacity duration-200 z-10 pointer-events-none
                                ${darkMode 
                                  ? 'bg-dark-600 text-dark-200' 
                                  : 'bg-gray-700 text-white'}`}>
                  {copyStatus === 'copied' ? 'Copied to clipboard!' : 'Copy all code'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Box Overlay */}
      {showSearch && (
        <SearchBox
          content={formattedContent}
          isVisible={showSearch}
          onClose={handleSearchClose}
          onMatchesFound={handleMatchesFound}
          onCurrentMatchChange={handleCurrentMatchChange}
          darkMode={darkMode}
        />
      )}

      {/* Main Content Area - Responsive padding with proper overflow handling */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 relative min-w-0 overflow-hidden">
        {fileData.length > 0 ? (
          <div className="h-full flex flex-col min-w-0">
            {/* Code Content - Responsive with proper constraints */}
            <div className={`flex-1 relative rounded-lg md:rounded-xl border transition-all duration-300 min-w-0 overflow-hidden
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600/50 shadow-dark-lg' 
                             : 'bg-white border-gray-200 shadow-sm'}`}>
              
              {/* Code Header - Responsive */}
              <div className={`flex items-center justify-between p-2 sm:p-3 border-b flex-shrink-0
                             ${darkMode 
                               ? 'border-dark-600/50 bg-dark-700/50' 
                               : 'border-gray-200 bg-gray-50/50'}`}>
                <span className={`text-xs sm:text-sm font-medium truncate
                               ${darkMode ? 'text-dark-200' : 'text-gray-600'}`}>
                  Code Output
                </span>

                {/* File count badge */}
                <div className={`flex items-center text-xs space-x-1.5 flex-shrink-0
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  <FaFile className="h-3 w-3" />
                  <span>{visibleFiles.length} file{visibleFiles.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Code Viewer Area - Fixed with proper overflow handling */}
              <div className="relative flex-1 overflow-hidden">
                <pre
                  ref={codeViewerRef}
                  className={`w-full h-full p-3 sm:p-4 md:p-6 overflow-auto font-mono text-xs sm:text-sm leading-relaxed
                            whitespace-pre-wrap break-words m-0 focus:outline-none
                            ${darkMode 
                              ? 'text-dark-100 bg-dark-800 scrollbar-dark' 
                              : 'text-gray-800 bg-white scrollbar-light'}`}
                  style={{ 
                    scrollBehavior: 'smooth',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    minWidth: 0
                  }}
                  tabIndex={0}
                >
                  {renderHighlightedContent}
                </pre>
                
                {/* Search Result Navigation */}
                {searchMatches.length > 0 && !isSearchExpanded && (
                  <div className={`absolute bottom-4 right-4 flex items-center space-x-2 p-1.5 rounded-lg shadow-lg z-10
                                 ${darkMode 
                                   ? 'bg-dark-700 border border-dark-600' 
                                   : 'bg-white border border-gray-200'}`}>
                    <button
                      onClick={() => setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length)}
                      className={`p-1.5 rounded-md transition-colors
                                ${darkMode 
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <FaAngleUp className="h-4 w-4" />
                    </button>
                    
                    <div className={`text-xs font-medium px-2 whitespace-nowrap
                                   ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      {currentMatchIndex + 1} of {searchMatches.length}
                    </div>
                    
                    <button
                      onClick={() => setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length)}
                      className={`p-1.5 rounded-md transition-colors
                                ${darkMode 
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <FaAngleDown className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={handleSearchClose}
                      className={`p-1.5 rounded-md transition-colors
                                ${darkMode 
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <FaTimesCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Footer - Responsive */}
            {isAnonymized && (
              <div className={`mt-3 md:mt-4 p-3 md:p-4 rounded-lg border-l-4 text-xs sm:text-sm flex-shrink-0
                             ${darkMode 
                               ? 'bg-green-900/10 border-green-500 text-green-400' 
                               : 'bg-green-50 border-green-500 text-green-700'}`}>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium">
                    Privacy Protection Active
                  </span>
                </div>
                <p className="mt-1 opacity-80 text-xs">
                  Personal information has been anonymized for sharing.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty State - Responsive */
          <div className="h-full flex items-center justify-center px-4 min-w-0">
            <div className={`text-center p-6 sm:p-8 md:p-12 rounded-xl md:rounded-2xl transition-all duration-300 w-full max-w-md
                           ${darkMode 
                             ? 'bg-dark-800/50 border border-dark-600/50' 
                             : 'bg-white shadow-sm border border-gray-200'}`}>
              
              {/* Upload Icon */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-full flex items-center justify-center
                               ${darkMode 
                                 ? 'bg-dark-700 border-2 border-dark-600' 
                                 : 'bg-gray-50 border-2 border-gray-200'}`}>
                  <FaUpload className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 transition-colors duration-300
                                       ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Empty State Content */}
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                No Files Uploaded
              </h3>
              
              <p className={`text-sm sm:text-base mb-6 md:mb-8 max-w-md mx-auto leading-relaxed
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                Upload files or a directory using the sidebar controls to begin viewing your code.
              </p>

              {/* Feature Highlights - Responsive grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto">
                <div className={`p-3 md:p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700/50' : 'bg-gray-50'}`}>
                  <FaFile className={`h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2
                                     ${darkMode ? 'text-accent-400' : 'text-blue-600'}`} />
                  <p className={`text-xs md:text-sm font-medium
                               ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                    Individual Files
                  </p>
                </div>
                <div className={`p-3 md:p-4 rounded-lg transition-colors duration-300
                               ${darkMode ? 'bg-dark-700/50' : 'bg-gray-50'}`}>
                  <FaUpload className={`h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2
                                       ${darkMode ? 'text-accent-400' : 'text-blue-600'}`} />
                  <p className={`text-xs md:text-sm font-medium
                               ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                    Project Directories
                  </p>
                </div>
              </div>
              
              {/* Privacy Note - When anonymization is active */}
              {isAnonymized && (
                <div className={`mt-6 p-3 sm:p-4 rounded-lg transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-green-900/20 border border-green-700/50' 
                                 : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <FaShieldAlt className={`h-3.5 w-3.5
                                           ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium
                                   ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      Privacy mode is active
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-dark::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .scrollbar-dark::-webkit-scrollbar-track {
          background: #1a1d21;
        }
        
        .scrollbar-dark::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 6px;
          border: 3px solid #1a1d21;
        }
        
        .scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
        
        .scrollbar-light::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .scrollbar-light::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        
        .scrollbar-light::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
          border: 3px solid #f8fafc;
        }
        
        .scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default MainContent;