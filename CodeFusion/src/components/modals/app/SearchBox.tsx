import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  FaSearch,
  FaTimes,
  FaChevronUp,
  FaChevronDown
} from "react-icons/fa";

interface SearchMatch {
  index: number;
  start: number;
  end: number;
  lineNumber: number;
  lineStart: number;
}

interface SearchBoxProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
  onMatchesFound: (matches: SearchMatch[]) => void;
  onCurrentMatchChange: (index: number) => void;
  darkMode: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  content,
  isVisible,
  onClose,
  onMatchesFound,
  onCurrentMatchChange,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find all matches in the content
  const searchMatches = useMemo(() => {
    if (!searchTerm || !content) return [];

    const matches: SearchMatch[] = [];
    const searchFlags = caseSensitive ? 'g' : 'gi';
    
    let searchPattern = searchTerm;
    if (wholeWord) {
      searchPattern = `\\b${searchTerm}\\b`;
    }
    
    try {
      const regex = new RegExp(searchPattern, searchFlags);
      let match;
      let matchIndex = 0;
      
      // Calculate line information for each match
      const lines = content.split('\n');
      
      while ((match = regex.exec(content)) !== null) {
        let lineNumber = 0;
        let lineStart = 0;
        let currentCharCount = 0;
        
        // Find which line this match is on
        for (let i = 0; i < lines.length; i++) {
          const lineLength = lines[i].length + 1; // +1 for newline
          if (currentCharCount + lineLength > match.index) {
            lineNumber = i;
            lineStart = currentCharCount;
            break;
          }
          currentCharCount += lineLength;
        }
        
        matches.push({
          index: matchIndex++,
          start: match.index,
          end: match.index + match[0].length,
          lineNumber,
          lineStart
        });
      }
    } catch (e) {
      // Invalid regex, return empty matches
    }
    
    return matches;
  }, [searchTerm, content, caseSensitive, wholeWord]);

  // Notify parent of matches
  useEffect(() => {
    onMatchesFound(searchMatches);
  }, [searchMatches, onMatchesFound]);

  // Notify parent of current match change
  useEffect(() => {
    onCurrentMatchChange(currentMatchIndex);
  }, [currentMatchIndex, onCurrentMatchChange]);

  // Focus input when becoming visible
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  // Reset when closed
  useEffect(() => {
    if (!isVisible) {
      setSearchTerm('');
      setCurrentMatchIndex(0);
    }
  }, [isVisible]);

  const navigateToNextMatch = useCallback(() => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
    }
  }, [searchMatches.length]);

  const navigateToPreviousMatch = useCallback(() => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
    }
  }, [searchMatches.length]);

  // Keyboard shortcuts within the component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      // Navigate with Enter in search input
      if (e.key === 'Enter' && document.activeElement === searchInputRef.current) {
        e.preventDefault();
        if (e.shiftKey) {
          navigateToPreviousMatch();
        } else {
          navigateToNextMatch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, navigateToNextMatch, navigateToPreviousMatch]);

  if (!isVisible) return null;

  return (
    <div 
  className={`fixed top-20 left-0 right-0 shadow-xl z-40 transition-all duration-300
             ${darkMode 
               ? 'bg-dark-800/95 backdrop-blur-xl border-b border-dark-600' 
               : 'bg-white/95 backdrop-blur-xl border-b border-gray-200'}`}
>
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <FaSearch className={`absolute left-3 top-3 h-4 w-4
                                ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentMatchIndex(0);
              }}
              placeholder="Find in code..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm
                        focus:outline-none focus:ring-2
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400 placeholder-dark-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500'}`}
            />
          </div>
          
          {/* Match Counter */}
          {searchTerm && (
            <div className={`text-sm whitespace-nowrap px-3 py-2 rounded-lg
                           ${darkMode 
                             ? 'bg-dark-700 text-dark-300' 
                             : 'bg-gray-100 text-gray-600'}`}>
              {searchMatches.length > 0 
                ? `${currentMatchIndex + 1} of ${searchMatches.length}`
                : 'No results'
              }
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`flex items-center space-x-1 p-1 rounded-lg
                         ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <button
              onClick={navigateToPreviousMatch}
              disabled={searchMatches.length === 0}
              className={`p-2 rounded transition-colors
                        ${searchMatches.length === 0
                          ? darkMode 
                            ? 'text-dark-600 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                          : darkMode
                            ? 'hover:bg-dark-600 text-dark-300'
                            : 'hover:bg-gray-200 text-gray-600'}`}
              title="Previous match (Shift+Enter)"
            >
              <FaChevronUp className="h-4 w-4" />
            </button>
            
            <button
              onClick={navigateToNextMatch}
              disabled={searchMatches.length === 0}
              className={`p-2 rounded transition-colors
                        ${searchMatches.length === 0
                          ? darkMode 
                            ? 'text-dark-600 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                          : darkMode
                            ? 'hover:bg-dark-600 text-dark-300'
                            : 'hover:bg-gray-200 text-gray-600'}`}
              title="Next match (Enter)"
            >
              <FaChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          {/* Options */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg
                         ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`px-3 py-1.5 rounded text-sm font-mono transition-colors
                        ${caseSensitive
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : darkMode
                            ? 'hover:bg-dark-600 text-dark-400'
                            : 'hover:bg-gray-200 text-gray-500'}`}
              title="Match case"
            >
              Aa
            </button>
            
            <button
              onClick={() => setWholeWord(!wholeWord)}
              className={`px-3 py-1.5 rounded text-sm transition-colors
                        ${wholeWord
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : darkMode
                            ? 'hover:bg-dark-600 text-dark-400'
                            : 'hover:bg-gray-200 text-gray-500'}`}
              title="Match whole word"
            >
              <span className="font-mono text-xs">[W]</span>
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors
                      ${darkMode
                        ? 'hover:bg-dark-700 text-dark-300'
                        : 'hover:bg-gray-100 text-gray-600'}`}
            title="Close search (Esc)"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;