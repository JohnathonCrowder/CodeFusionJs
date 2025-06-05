import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
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
  FaEye,
  FaTimes,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaAngleDoubleLeft,
  FaCrown,
  FaLock,
  FaHistory
} from "react-icons/fa";

// Import subscription components
import UsageIndicator from "./subscription/UsageIndicator";
import UpgradePrompt from "./subscription/UpgradePrompt";
import SubscriptionModal from "./subscription/SubscriptionModal";

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
  onClose?: () => void;
  isMobile?: boolean;
}

const FileTree: React.FC<{
  files: FileData[];
  onToggle: (path: string) => void;
  level?: number;
  searchTerm?: string;
  expandedFolders: Set<string>;
  onFolderToggle: (path: string) => void;
}> = ({ files, onToggle, level = 0, searchTerm = "", expandedFolders, onFolderToggle }) => {
  const { darkMode } = useContext(ThemeContext);

  const filterFiles = (files: FileData[]): FileData[] => {
    if (!searchTerm) return files;
    
    return files.reduce((acc: FileData[], file) => {
      const nameMatches = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const childMatches = file.children ? filterFiles(file.children) : [];
      
      if (nameMatches || childMatches.length > 0) {
        acc.push({
          ...file,
          children: childMatches.length > 0 ? childMatches : file.children
        });
      }
      
      return acc;
    }, []);
  };

  const filteredFiles = filterFiles(files);

  return (
    <ul className={`space-y-0.5 ${level > 0 ? "ml-2 sm:ml-3 border-l pl-2 sm:pl-3" : ""} 
                  ${level > 0 ? (darkMode ? "border-dark-600" : "border-gray-200") : ""}`}>
      {filteredFiles.map((file, index) => {
        const hasChildren = file.children && file.children.length > 0;
        const isExpanded = expandedFolders.has(file.path || '');
        
        return (
          <li key={file.path || index} className="select-none">
            <div className={`group flex items-center justify-between py-1.5 px-2 rounded-lg w-full
                           transition-all duration-200 cursor-pointer
                           ${darkMode 
                             ? 'hover:bg-dark-600' 
                             : 'hover:bg-gray-100'}`}
                 title={file.name}
            >
              
              <div 
                className="flex items-center min-w-0 flex-1 pr-2"
                onClick={() => {
                  if (hasChildren && file.path) {
                    onFolderToggle(file.path);
                  }
                }}
              >
                <div className="flex-shrink-0 flex items-center">
                  {hasChildren && (
                    <button
                      className={`p-0.5 rounded transition-transform duration-200 mr-1 flex-shrink-0
                                ${darkMode ? 'text-dark-400 hover:text-dark-200' : 'text-gray-400 hover:text-gray-600'}
                                ${isExpanded ? 'transform rotate-90' : ''}`}
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  
                  {hasChildren ? (
                    <FaFolder className={`mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-colors duration-200
                                       ${file.visible 
                                         ? isExpanded
                                           ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                           : darkMode ? 'text-accent-400' : 'text-blue-500'
                                         : darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
                  ) : (
                    <FaFile className={`mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-colors duration-200
                                     ${file.visible 
                                       ? darkMode ? 'text-dark-300' : 'text-gray-600'
                                       : darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
                  )}
                </div>
                
                <span className={`text-xs sm:text-sm font-medium truncate overflow-ellipsis max-w-full transition-colors duration-200
                               ${file.visible 
                                 ? darkMode ? 'text-dark-200' : 'text-gray-800'
                                 : darkMode ? 'text-dark-500 line-through' : 'text-gray-400 line-through'}`}>
                  {file.name}
                </span>
                
                {searchTerm && file.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full flex-shrink-0
                                 ${darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                    match
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  file.path && onToggle(file.path);
                }}
                className={`ml-1 p-1 sm:p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0
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

            {hasChildren && isExpanded && file.visible && (
              <FileTree
                files={file.children || []}
                onToggle={onToggle}
                onFolderToggle={onFolderToggle}
                level={level + 1}
                searchTerm={searchTerm}
                expandedFolders={expandedFolders}
              />
            )}
          </li>
        );
      })}
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
  onClose,
  isMobile = false,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const { userProfile, trackUpload, isPremium } = useAuth();
  
  const [showSkippedFiles, setShowSkippedFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(new Set<string>());
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [upgradeFeature, setUpgradeFeature] = useState<string>("");
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  // Handle scroll state for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarScrollRef.current) {
        setIsScrolled(sidebarScrollRef.current.scrollTop > 10);
      }
    };

    const scrollContainer = sidebarScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-expand folders when searching
  useEffect(() => {
    if (searchTerm) {
      const expandAll = (files: FileData[]) => {
        files.forEach(file => {
          if (file.children && file.path) {
            setExpandedFolders(prev => new Set(prev).add(file.path!));
            expandAll(file.children);
          }
        });
      };
      expandAll(uploadedFiles);
    }
  }, [searchTerm, uploadedFiles]);

  // Clear upload error after 5 seconds
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  const toggleSkippedFiles = () => {
    setShowSkippedFiles(!showSkippedFiles);
  };

  const handleFolderToggle = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Enhanced file upload handler without arbitrary limits
  const handleFileUploadWithTracking = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !userProfile) return;

    setUploadError("");
    
    try {
      // Track the upload for analytics only, don't enforce limits
      await trackUpload();
      
      // Proceed with the actual upload - no file count limits
      onUploadFile(event);
      
      if (isMobile) onClose?.();
    } catch (err) {
      setUploadError("Failed to process upload");
      console.error(err);
    }
  };

  // Enhanced directory upload handler without arbitrary limits
  const handleDirectoryUploadWithTracking = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !userProfile) return;

    setUploadError("");

    try {
      // Track the upload for analytics only, don't enforce limits
      await trackUpload();
      
      // Proceed with the actual upload - no file count limits
      onUploadDirectory(event);
      
      if (isMobile) onClose?.();
    } catch (err) {
      setUploadError("Failed to process upload");
      console.error(err);
    }
  };

  // Handle premium feature access
  const handlePremiumFeature = (featureId: string) => {
    if (!isPremium) {
      setShowUpgradePrompt(true);
      setUpgradeFeature(featureId);
      return false;
    }
    return true;
  };

  const handleCodeAnalyzerToggle = () => {
    if (handlePremiumFeature("ai-insights")) {
      onCodeAnalyzerToggle();
      if (isMobile) onClose?.();
    }
  };

  // Calculate statistics
  const fileStats = {
    totalFiles: 0,
    visibleFiles: 0,
    calculateStats: (files: FileData[]) => {
      files.forEach(file => {
        if (file.content) {
          fileStats.totalFiles++;
          if (file.visible) fileStats.visibleFiles++;
        }
        if (file.children) {
          fileStats.calculateStats(file.children);
        }
      });
    }
  };
  fileStats.calculateStats(uploadedFiles);

  return (
    <div className={`w-full h-full flex flex-col transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-l border-dark-600' 
                     : 'bg-white border-l border-gray-200'}`}>
      
      {/* Header with close button for mobile */}
      <div className={`flex items-center justify-between p-4 sm:p-6 border-b transition-all duration-300 flex-shrink-0
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}
                     ${isScrolled && !isMobile ? 'shadow-md' : ''}`}>
        <div>
          <h2 className={`text-lg sm:text-xl font-bold transition-colors duration-300
                         ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
            Controls
          </h2>
          {fileStats.totalFiles > 0 && (
            <p className={`text-xs mt-1 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              {fileStats.visibleFiles} of {fileStats.totalFiles} files visible
            </p>
          )}
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200
                      ${darkMode
                        ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            aria-label="Close sidebar"
          >
            <FaAngleDoubleLeft className="text-lg" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div 
        ref={sidebarScrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin min-h-0"
      >
        {/* Usage Indicator */}
        {userProfile && (
          <div className="p-3 sm:p-4">
            <UsageIndicator />
          </div>
        )}

        {/* Upload Error Display */}
        {uploadError && (
          <div className={`mx-3 sm:mx-4 mb-4 p-3 rounded-lg border-l-4 transition-colors duration-300
                         ${darkMode 
                           ? 'bg-red-900/20 border-red-500 text-red-300' 
                           : 'bg-red-50 border-red-500 text-red-700'}`}>
            <div className="flex items-start space-x-2">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Upload Failed</p>
                <p>{uploadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Prompt */}
        {showUpgradePrompt && !isPremium && (
          <div className="p-3 sm:p-4">
            <UpgradePrompt
              feature={upgradeFeature === "ai-insights" ? "AI Code Insights" : 
                      upgradeFeature === "project-history" ? "Project History" : 
                      "Premium Features"}
              description={`Upgrade to Pro to access advanced features and tools.`}
              onUpgrade={() => setShowSubscriptionModal(true)}
              onDismiss={() => setShowUpgradePrompt(false)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Primary Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Clear Text Button */}
            <button
              onClick={() => {
                onClearText();
                if (isMobile) onClose?.();
              }}
              className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 
                        rounded-lg font-medium text-xs sm:text-sm transition-all duration-200
                        ${darkMode
                          ? 'bg-red-600/90 hover:bg-red-600 text-white shadow-dark'
                          : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'}`}
            >
              <FaEraser className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Clear</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={() => {
                onCopyText();
                if (isMobile) onClose?.();
              }}
              className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 
                        rounded-lg font-medium text-xs sm:text-sm transition-all duration-200
                        ${darkMode
                          ? 'bg-green-600/90 hover:bg-green-600 text-white shadow-dark'
                          : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'}`}
            >
              <FaCopy className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Copy</span>
            </button>
          </div>

          {/* Smart Analysis Button */}
          <div className="relative">
            <button
              onClick={handleCodeAnalyzerToggle}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 
                        rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 relative
                        ${showCodeAnalyzer && isPremium
                          ? darkMode
                            ? 'bg-accent-500 hover:bg-accent-400 text-white shadow-dark-lg'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                          : isPremium
                            ? darkMode
                              ? 'bg-purple-600/90 hover:bg-purple-600 text-white shadow-dark'
                              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm'
                            : darkMode
                              ? 'bg-dark-600 hover:bg-dark-500 text-dark-300 border border-dark-500'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-600 border border-gray-300'
                        }`}
            >
              <FaBrain className="h-4 w-4" />
              <span>AI Code Analysis</span>
              {!isPremium && <FaLock className="h-3 w-3 ml-1" />}
              {showCodeAnalyzer && isPremium && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto
                               ${darkMode ? 'bg-white/20' : 'bg-black/20'}`}>
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Privacy Settings Button */}
          <button
            onClick={() => {
              onAnonymizeOpen();
              if (isMobile) onClose?.();
            }}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 
                      rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
                      ${darkMode
                        ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-dark'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'}`}
          >
            <FaEyeSlash className="h-4 w-4" />
            <span>Privacy Settings</span>
          </button>

          {/* Project History Button (Premium Feature) */}
<div className="relative">
  <button
    onClick={() => {
      if (!handlePremiumFeature("project-history")) return;
      // TODO: Open project history
      if (isMobile) onClose?.();
    }}
    className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 
              rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
              ${isPremium
                ? darkMode
                  ? 'bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-dark'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                : darkMode
                  ? 'bg-dark-600 hover:bg-dark-500 text-dark-300 border border-dark-500'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 border border-gray-300'
              }`}
  >
    <FaHistory className="h-4 w-4" />
    <span>Project History</span>
    {!isPremium && <FaLock className="h-3 w-3 ml-1" />}
  </button>
  
  {!isPremium && showUpgradePrompt && upgradeFeature === "project-history" && (
    <div className="mt-2">
      <UpgradePrompt
        feature="Project History"
        onUpgrade={() => setShowSubscriptionModal(true)}
        compact
      />
    </div>
  )}
</div>

          {/* Settings Button */}
          <button
            onClick={() => {
              onSettingsOpen();
              if (isMobile) onClose?.();
            }}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 
                      rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
                      ${darkMode
                        ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
          >
            <FaCog className="h-4 w-4" />
            <span>Settings</span>
          </button>

          {/* Subscription Management Button */}
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 
                      rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
                      ${isPremium
                        ? darkMode
                          ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-dark'
                          : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-sm'
                        : darkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-dark'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-sm'
                      }`}
          >
            <FaCrown className="h-4 w-4" />
            <span>{isPremium ? 'Manage Plan' : 'Upgrade Account'}</span>
          </button>

          {/* Upload Section Divider */}
          <div className="flex items-center py-2">
            <div className={`flex-1 h-px ${darkMode ? 'bg-dark-600' : 'bg-gray-300'}`}></div>
            <span className={`px-3 text-xs font-medium
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              Upload Files
            </span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-dark-600' : 'bg-gray-300'}`}></div>
          </div>

          {/* Upload Buttons */}
          <div className="space-y-2">
            <label
              htmlFor="fileInput"
              className={`block w-full text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold 
                        text-sm sm:text-base cursor-pointer transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaFileUpload className="h-4 w-4" />
                <span>Upload Files</span>
              </div>
            </label>

            <label
              htmlFor="dirInput"
              className={`block w-full text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold 
                        text-sm sm:text-base cursor-pointer transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 hover:bg-dark-500 text-dark-200 border border-dark-500 shadow-dark'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaFolderOpen className="h-4 w-4" />
                <span>Upload Directory</span>
              </div>
            </label>
          </div>

          {/* Hidden File Inputs */}
          <input
            id="fileInput"
            type="file"
            onChange={handleFileUploadWithTracking}
            className="hidden"
            multiple
          />
          <input
            id="dirInput"
            type="file"
            multiple
            onChange={handleDirectoryUploadWithTracking}
            className="hidden"
            {...({ webkitdirectory: "" } as any)}
            {...({ directory: "" } as any)}
          />
        </div>

        {/* Uploaded Files Section */}
        <div className={`border-t transition-colors duration-300
                       ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm sm:text-base font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                Uploaded Files
              </h3>
              {uploadedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded 
                                 ${darkMode 
                                   ? 'bg-dark-600 text-dark-300' 
                                   : 'bg-gray-100 text-gray-600'}`}>
                    {fileStats.totalFiles}
                  </span>
                  {fileStats.visibleFiles < fileStats.totalFiles && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`text-xs px-2 py-1 rounded flex items-center space-x-1
                                transition-colors duration-200
                                ${darkMode 
                                  ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    >
                      <FaFilter className="h-3 w-3" />
                      <span>{fileStats.totalFiles - fileStats.visibleFiles} hidden</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <>
                {/* Search Box */}
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-8 pr-8 py-2 text-xs sm:text-sm rounded-lg border 
                                transition-all duration-200 focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-600 border-dark-500 text-dark-100 focus:ring-blue-400 placeholder-dark-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-400'}`}
                    />
                    <FaSearch className={`absolute left-2.5 top-2.5 h-3 w-3
                                        ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className={`absolute right-2.5 top-2 p-0.5 rounded
                                  ${darkMode ? 'hover:bg-dark-500' : 'hover:bg-gray-200'}`}
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* File Tree */}
                <div className={`rounded-lg border transition-colors duration-300 max-h-[500px] overflow-auto
                               ${darkMode 
                                 ? 'bg-dark-700 border-dark-600' 
                                 : 'bg-gray-50 border-gray-200'}`}>
                  <div className="p-1 sm:p-2">
                    <FileTree 
                      files={uploadedFiles} 
                      onToggle={onFileVisibilityToggle}
                      onFolderToggle={handleFolderToggle}
                      searchTerm={searchTerm}
                      expandedFolders={expandedFolders}
                    />
                  </div>
                </div>
              </>
            )}

            {uploadedFiles.length === 0 && (
              <div className={`text-xs sm:text-sm text-center py-8 rounded-lg border-2 border-dashed
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
          <div className="p-3 sm:p-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={toggleSkippedFiles}
            >
              <h3 className={`text-sm sm:text-base font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                Skipped Files
              </h3>
              <div className="flex items-center space-x-2">
                {skippedFiles.length > 0 && (
                  <span className={`text-xs px-2 py-1 rounded flex items-center space-x-1
                                 ${darkMode 
                                   ? 'bg-orange-900/30 text-orange-400' 
                                   : 'bg-orange-100 text-orange-600'}`}>
                    <FaExclamationTriangle className="h-3 w-3" />
                    <span>{skippedFiles.length}</span>
                  </span>
                )}
                <span className={`text-sm transition-transform duration-200
                               ${showSkippedFiles ? 'rotate-180' : ''}
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  <FaChevronDown className="h-3 w-3" />
                </span>
              </div>
            </button>
            
            {showSkippedFiles && (
              <div className="mt-3">
                {skippedFiles.length > 0 ? (
                  <div className={`rounded-lg border max-h-40 overflow-y-auto
                                 ${darkMode 
                                   ? 'bg-dark-700 border-dark-600' 
                                   : 'bg-gray-50 border-gray-200'}`}>
                    <div className="p-2 sm:p-3 space-y-1.5">
                      {skippedFiles.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded text-xs sm:text-sm
                                    ${darkMode 
                                      ? 'bg-dark-600 hover:bg-dark-500' 
                                      : 'bg-white hover:bg-gray-50'}`}
                          title={file.name}
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <FaFile className={`h-3 w-3 mr-2 flex-shrink-0
                                              ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                            <span className={`truncate
                                            ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                              {file.name}
                            </span>
                          </div>
                          <span className={`text-xs ml-2 flex-shrink-0 px-2 py-0.5 rounded
                                          ${darkMode 
                                            ? 'bg-dark-500 text-dark-300' 
                                            : 'bg-gray-200 text-gray-600'}`}>
                            {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`text-xs sm:text-sm text-center py-4 rounded-lg
                                 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    No files were skipped
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer - Mobile only */}
      {isMobile && fileStats.totalFiles > 0 && (
        <div className={`p-3 border-t flex items-center justify-around text-xs flex-shrink-0
                       ${darkMode 
                         ? 'bg-dark-700 border-dark-600 text-dark-300' 
                         : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
          <div className="flex items-center space-x-1">
            <FaCheckCircle className="h-3 w-3 text-green-500" />
            <span>{fileStats.visibleFiles} visible</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaFile className="h-3 w-3" />
            <span>{fileStats.totalFiles} total</span>
          </div>
          {skippedFiles.length > 0 && (
            <div className="flex items-center space-x-1">
              <FaExclamationTriangle className="h-3 w-3 text-orange-500" />
              <span>{skippedFiles.length} skipped</span>
            </div>
          )}
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Sidebar;