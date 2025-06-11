import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SettingsModal from "./components/SettingsModal";
import DirectorySelectionModal from "./components/DirectorySelectionModal";
import SmartCodeAnalyzer from "./components/SmartCodeAnalyzer";
import AnonymizeModal from "./components/AnonymizeModal";
import AboutModal from "./components/AboutModal";
import HelpModal from "./components/HelpModal";
import GitDiffVisualizer from "./components/GitDiffVisualizer";
import AdminDashboard from "./components/admin/AdminDashboard";
import { filterFiles, readFileContent } from "./utils/fileUtils";
import PromptLibrary from "./components/PromptLibrary";
import { projectPresets } from "./utils/projectPresets";
import { FaCog } from "react-icons/fa";
import PromptUpgrader from "./components/PromptUpgrader";


interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface DirectoryItem {
  name: string;
  path: string;
  selected: boolean;
  children?: DirectoryItem[];
}

interface AnonymizeSettings {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  customReplacements: Array<{original: string, replacement: string}>;
}

function App() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showCodeAnalyzer, setShowCodeAnalyzer] = useState(false);
  const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [directoryStructure, setDirectoryStructure] = useState<DirectoryItem[]>(
    []
  );
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [skippedFiles, setSkippedFiles] = useState<File[]>([]);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPromptUpgrader, setShowPromptUpgrader] = useState(false);


  
  // Updated to support all presets dynamically
  const [projectType, setProjectType] = useState<keyof typeof projectPresets>("custom");
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGitDiff, setShowGitDiff] = useState(false);
  
  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 320; // Increased from 320
  });
  const [isResizing, setIsResizing] = useState(false);
  
  // Mobile states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on mobile when screen size changes
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Updated optimized default settings
  const [settings, setSettings] = useState({
    newLineCount: 2,
    autoUnselectFolders: [
      // Version Control
      ".git", ".svn", ".hg",
      
      // Node.js & JavaScript
      "node_modules", ".next", ".nuxt", "dist", "build", "out",
      
      // Python
      "venv", ".venv", "__pycache__", ".pytest_cache", "site-packages",
      
      // IDEs & Editors
      ".vscode", ".idea", ".vs", ".sublime-workspace", ".sublime-project",
      
      // Build Output & Caches
      "target", "bin", "obj", "vendor", ".turbo", ".parcel-cache", ".cache",
      
      // Mobile Development
      ".expo", "ios", "android",
      
      // Modern Frameworks
      ".svelte-kit", ".astro", ".solid",
      
      // DevOps & Tools
      ".terraform", ".docker", "coverage", "tmp", "logs", "log",
      
      // OS Files
      ".DS_Store", "Thumbs.db",
      
      // Legacy but still common
      ".sass-cache", ".tmp"
    ],
    acceptedTypes: [
      // Web Core
      ".html", ".htm", ".css", ".scss", ".sass", ".less", ".styl",
      
      // JavaScript & TypeScript
      ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
      
      // Modern Frameworks
      ".vue", ".svelte", ".astro", ".solid",
      
      // Python
      ".py", ".pyi", ".pyw",
      
      // Other Popular Languages
      ".java", ".cpp", ".c", ".h", ".hpp", ".go", ".rs", ".swift", ".kt",
      ".php", ".rb", ".scala", ".clj", ".hs",
      
      // Configuration & Data
      ".json", ".yaml", ".yml", ".toml", ".ini", ".conf", ".cfg", ".env",
      
      // Documentation
      ".md", ".mdx", ".txt", ".rst", ".adoc",
      
      // Database & API
      ".sql", ".graphql", ".prisma",
      
      // Build & Package Files
      ".lock", ".gitignore", ".dockerignore", ".editorconfig",
      
      // Data Files
      ".csv", ".xml",
      
      // Specialized
      ".dockerfile", ".makefile", ".sh", ".bat", ".ps1"
    ],
  });

  // Anonymize settings state
  const [anonymizeSettings, setAnonymizeSettings] = useState<AnonymizeSettings>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    customReplacements: []
  });

  // Resizer handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  // Effect for handling sidebar resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      
      const minWidth = 250;
      const maxWidth = 600;
      
      setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Save sidebar width to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  // Load saved project type preference
  useEffect(() => {
    const savedProjectType = localStorage.getItem('projectType') as keyof typeof projectPresets;
    if (savedProjectType && projectPresets[savedProjectType]) {
      setProjectType(savedProjectType);
    }
  }, []);

  // Save project type preference and apply preset settings
  useEffect(() => {
    localStorage.setItem('projectType', projectType);
    
    if (projectType !== "custom") {
      const preset = projectPresets[projectType];
      if (preset) {
        setSettings((prev) => ({
          ...prev,
          autoUnselectFolders: preset.autoUnselectFolders,
          acceptedTypes: preset.acceptedTypes,
        }));
      }
    }
  }, [projectType]);

  const handleClearText = () => {
    setFileData([]);
    setSkippedFiles([]);
  };

  const handleHelpOpen = () => {
    setShowHelpModal(true);
  };

  const handleHelpClose = () => {
    setShowHelpModal(false);
  };

  const handleAboutOpen = () => {
    setShowAboutModal(true);
  };

  const handleAboutClose = () => {
    setShowAboutModal(false);
  };

  const handlePromptLibraryOpen = () => {
    setShowPromptLibrary(true);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
  };

  const handlePromptUpgraderOpen = () => {
    setShowPromptUpgrader(true);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
    setShowPromptLibrary(false);
  };
  
  
  
  
  const handleHomeClick = () => {
  setShowAdminDashboard(false);
  setShowGitDiff(false);
  setShowPromptLibrary(false);
  setShowPromptUpgrader(false);
};
  

  const handleGitDiffOpen = () => {
    setShowGitDiff(true);
    setShowAdminDashboard(false);
  };

  const handleGitDiffClose = () => {
    setShowGitDiff(false);
  };

  const handleAdminDashboardOpen = () => {
    setShowAdminDashboard(true);
    setShowGitDiff(false);
  };

  
  const handleCopyText = () => {
    const getVisibleContent = (files: FileData[]): string[] => {
      return files.flatMap((file) => {
        const contents: string[] = [];
        if (file.visible && file.content) {
          contents.push(
            [
              "=".repeat(60),
              `File: ${file.name}`,
              `Path: ${file.path || "N/A"}`,
              "=".repeat(60),
              "",
              file.content,
              "",
              "",
            ].join("\n")
          );
        }
        if (file.children && file.visible) {
          contents.push(...getVisibleContent(file.children));
        }
        return contents;
      });
    };

    const visibleContent = getVisibleContent(fileData).join(
      "\n".repeat(settings.newLineCount)
    );
    navigator.clipboard.writeText(visibleContent);
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const { acceptedFiles, skippedFiles } = filterFiles(
        files,
        settings.acceptedTypes
      );
      const newFileData: FileData[] = [];
      for (const file of acceptedFiles) {
        const content = await readFileContent(file);
        newFileData.push({
          name: file.name,
          content,
          visible: true,
          path: file.name,
        });
      }
      setFileData([...fileData, ...newFileData]);
      setSkippedFiles(skippedFiles);
    }
  };

  const handleUploadDirectory = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setPendingFiles(files);

      const structure: DirectoryItem[] = [];
      const paths = new Set<string>();

      const shouldBeSelected = (dirPath: string): boolean => {
        const parts = dirPath.toLowerCase().split("/");
        return !settings.autoUnselectFolders.some((folder) =>
          parts.includes(folder.toLowerCase())
        );
      };

      for (const file of files) {
        const pathParts = file.webkitRelativePath.split("/");
        let currentPath = "";

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          currentPath = currentPath ? `${currentPath}/${part}` : part;

          if (!paths.has(currentPath)) {
            paths.add(currentPath);
            let current = structure;
            for (let j = 0; j <= i; j++) {
              const dirPath = pathParts.slice(0, j + 1).join("/");

              let dir = current.find((d) => d.path === dirPath);
              if (!dir) {
                dir = {
                  name: pathParts[j],
                  path: dirPath,
                  selected: shouldBeSelected(dirPath),
                  children: [],
                };
                current.push(dir);
              }
              current = dir.children || [];
            }
          }
        }
      }

      setDirectoryStructure(structure);
      setShowDirectoryModal(true);
    }
  };

  const handleDirectorySelection = async (selectedDirs: DirectoryItem[]) => {
    if (!pendingFiles) return;

    const selectedPaths = new Set<string>();
    const getSelectedPaths = (items: DirectoryItem[]) => {
      items.forEach((item) => {
        if (item.selected) {
          selectedPaths.add(item.path);
          if (item.children) {
            getSelectedPaths(item.children);
          }
        }
      });
    };
    getSelectedPaths(selectedDirs);

    const { acceptedFiles, skippedFiles: newSkippedFiles } = filterFiles(
      pendingFiles,
      settings.acceptedTypes
    );

    const filteredFiles = acceptedFiles.filter((file) => {
      const dirPath = file.webkitRelativePath.split("/").slice(0, -1).join("/");
      return selectedPaths.has(dirPath);
    });

    const directoryStructure: FileData = {
      name: "",
      content: "",
      visible: true,
      children: [],
    };

    for (const file of filteredFiles) {
      const path = file.webkitRelativePath;
      const pathParts = path.split("/");
      let current = directoryStructure;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (i === pathParts.length - 1) {
          const content = await readFileContent(file);
          current.children!.push({
            name: part,
            content,
            visible: true,
            path: path,
          });
        } else {
          let dir = current.children!.find((d) => d.name === part);
          if (!dir) {
            dir = {
              name: part,
              content: "",
              visible: true,
              children: [],
              path: pathParts.slice(0, i + 1).join("/"),
            };
            current.children!.push(dir);
          }
          current = dir;
        }
      }
    }

    const newFileData = directoryStructure.children || [];
    setFileData([...fileData, ...newFileData]);
    setSkippedFiles([...skippedFiles, ...newSkippedFiles]);
    setShowDirectoryModal(false);
    setPendingFiles(null);
  };

  const handleFileVisibilityToggle = (path: string) => {
    const toggleVisibility = (files: FileData[]): FileData[] => {
      return files.map((file) => {
        if (file.path === path) {
          const newVisible = !file.visible;
          return {
            ...file,
            visible: newVisible,
            children: file.children
              ? file.children.map((child) => ({
                  ...child,
                  visible: newVisible,
                }))
              : undefined,
          };
        } else if (file.children) {
          return {
            ...file,
            children: toggleVisibility(file.children),
          };
        }
        return file;
      });
    };

    setFileData((prevFileData) => toggleVisibility(prevFileData));
  };

  const handleSettingsOpen = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  const handleSettingsSave = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    setShowSettingsModal(false);
  };

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleCodeAnalyzerToggle = () => {
    setShowCodeAnalyzer(!showCodeAnalyzer);
  };

  // Anonymize handlers
  const handleAnonymizeOpen = () => {
    setShowAnonymizeModal(true);
  };

  const handleAnonymizeClose = () => {
    setShowAnonymizeModal(false);
  };

  const handleAnonymizeSave = (newSettings: AnonymizeSettings) => {
    setAnonymizeSettings(newSettings);
    setIsAnonymized(true);
    localStorage.setItem('anonymizeSettings', JSON.stringify(newSettings));
    setShowAnonymizeModal(false);
  };

  // Load saved anonymize settings on mount
  useEffect(() => {
    const savedAnonymizeSettings = localStorage.getItem('anonymizeSettings');
    if (savedAnonymizeSettings) {
      try {
        const parsedSettings = JSON.parse(savedAnonymizeSettings);
        setAnonymizeSettings(parsedSettings);
        setIsAnonymized(true);
      } catch (error) {
        console.error('Failed to parse saved anonymize settings:', error);
      }
    }
  }, []);

  const handleAnonymizeContent = (content: string): string => {
    if (!isAnonymized) {
      return content;
    }

    let anonymizedContent = content;

    // Replace personal information if provided
    if (anonymizeSettings.firstName) {
      const firstNameRegex = new RegExp(anonymizeSettings.firstName, 'gi');
      anonymizedContent = anonymizedContent.replace(firstNameRegex, 'John');
    }

    if (anonymizeSettings.lastName) {
      const lastNameRegex = new RegExp(anonymizeSettings.lastName, 'gi');
      anonymizedContent = anonymizedContent.replace(lastNameRegex, 'Doe');
    }

    if (anonymizeSettings.username) {
      const usernameRegex = new RegExp(anonymizeSettings.username, 'gi');
      anonymizedContent = anonymizedContent.replace(usernameRegex, 'user123');
    }

    if (anonymizeSettings.email) {
      const emailRegex = new RegExp(anonymizeSettings.email, 'gi');
      anonymizedContent = anonymizedContent.replace(emailRegex, 'john.doe@example.com');
    }

    // Apply custom replacements
    anonymizeSettings.customReplacements.forEach(({ original, replacement }) => {
      if (original && replacement) {
        const customRegex = new RegExp(original, 'gi');
        anonymizedContent = anonymizedContent.replace(customRegex, replacement);
      }
    });

    // Apply general anonymization patterns
    return anonymizedContent
      // Anonymize email addresses (if not already replaced)
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
      // Anonymize URLs
      .replace(/(https?:\/\/[^\s]+)/g, "[URL]")
      // Anonymize IP addresses
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]")
      // Anonymize file paths
      .replace(/[\/\\][\w\-. ]+[\/\\][\w\-. ]+/g, "[PATH]")
      // Anonymize potential API keys and tokens
      .replace(/[a-zA-Z0-9_-]{20,}/g, "[KEY]")
      // Anonymize phone numbers
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]")
      // Anonymize names (basic implementation)
      .replace(/[A-Z][a-z]+\s+[A-Z][a-z]+/g, "[NAME]");
  };

  // Enhanced project type detection based on uploaded files
  const detectProjectType = (files: FileData[]): keyof typeof projectPresets => {
    const fileNames = new Set<string>();
    const extensions = new Set<string>();

    const collectFileInfo = (files: FileData[]) => {
      files.forEach(file => {
        if (file.content) {
          fileNames.add(file.name.toLowerCase());
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext) extensions.add(`.${ext}`);
        }
        if (file.children) {
          collectFileInfo(file.children);
        }
      });
    };

    collectFileInfo(files);

    // Check for specific project indicators
    if (fileNames.has('package.json')) {
      if (fileNames.has('next.config.js') || fileNames.has('next.config.mjs')) {
        return 'nextjs';
      }
      if (extensions.has('.vue') || fileNames.has('nuxt.config.js')) {
        return 'vue';
      }
      if (extensions.has('.svelte') || fileNames.has('svelte.config.js')) {
        return 'svelte';
      }
      if (extensions.has('.jsx') || extensions.has('.tsx')) {
        return 'react';
      }
    }

    if (fileNames.has('requirements.txt') || fileNames.has('pyproject.toml')) {
      if (fileNames.has('manage.py') || fileNames.has('settings.py')) {
        return 'django';
      }
      return 'python';
    }

    if (fileNames.has('cargo.toml')) {
      return 'rust';
    }

    if (fileNames.has('go.mod') || extensions.has('.go')) {
      return 'go';
    }

    return 'custom';
  };

  // Auto-detect project type when files are uploaded
  useEffect(() => {
    if (fileData.length > 0 && projectType === 'custom') {
      const detectedType = detectProjectType(fileData);
      if (detectedType !== 'custom') {
        setProjectType(detectedType);
      }
    }
  }, [fileData, projectType]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-dark-50 transition-colors duration-300">
      <NavBar 
  onHelpOpen={handleHelpOpen} 
  onAboutOpen={handleAboutOpen}
  onGitDiffOpen={handleGitDiffOpen}
  onAdminDashboardOpen={handleAdminDashboardOpen}
  onPromptLibraryOpen={handlePromptLibraryOpen}
  onPromptUpgraderOpen={handlePromptUpgraderOpen}
  onHomeClick={handleHomeClick}
  onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
/>
      
      {/* Main Content Area - Full height between navbar and footer */}
      <div className="flex-1 flex flex-col">
      {showAdminDashboard ? (
  <AdminDashboard />
) : showGitDiff ? (
  <GitDiffVisualizer onClose={handleGitDiffClose} />
) : showPromptLibrary ? (
  <PromptLibrary />
) : showPromptUpgrader ? (
  <PromptUpgrader />
) : (

          <div className="flex-1 flex flex-col md:flex-row-reverse relative pt-16">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}
  
            {/* Resizable Sidebar - Desktop / Drawer - Mobile */}
            <div 
              style={{ width: isMobile ? '100%' : `${sidebarWidth}px` }}
              className={`
                ${isMobile 
                  ? `fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ${
                      isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } w-full max-w-sm`
                  : `flex-shrink-0 relative transition-all duration-200 ${isResizing ? '' : 'ease-out'} h-full`
                }
              `}
            >
              <div className="h-full">
                <Sidebar
                  onClearText={handleClearText}
                  onCopyText={handleCopyText}
                  onUploadFile={handleUploadFile}
                  onUploadDirectory={handleUploadDirectory}
                  onSettingsOpen={handleSettingsOpen}
                  onCodeAnalyzerToggle={handleCodeAnalyzerToggle}
                  onAnonymizeOpen={handleAnonymizeOpen}
                  showCodeAnalyzer={showCodeAnalyzer}
                  uploadedFiles={fileData}
                  skippedFiles={skippedFiles}
                  onFileVisibilityToggle={handleFileVisibilityToggle}
                  onClose={() => setIsMobileSidebarOpen(false)}
                  isMobile={isMobile}
                />
              </div>
            </div>
  
            {/* Resizer Handle - Desktop only */}
            {!isMobile && (
              <div 
                className={`w-1 cursor-col-resize hover:bg-accent-500/50 relative group transition-colors duration-200 h-full
                           ${isResizing 
                             ? 'bg-accent-500' 
                             : 'bg-dark-600 hover:bg-accent-500/30'}`}
                onMouseDown={handleMouseDown}
                onDoubleClick={() => setSidebarWidth(320)}
              >
                {/* Visual indicator for the resizer */}
                <div className={`absolute inset-0 transition-all duration-200 group-hover:scale-x-[3]
                               ${isResizing ? 'bg-accent-500' : ''}`} />
                
                {/* Dots indicator */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <div className="flex flex-col space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1 h-1 rounded-full bg-accent-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
  
            {/* Main content area that adjusts to remaining space */}
            <div className="flex-1 flex h-full min-h-0">
              <MainContent
                fileData={fileData}
                isAnonymized={isAnonymized}
                anonymizeContent={handleAnonymizeContent}
              />
              {!isMobile && (
                <SmartCodeAnalyzer
                  fileData={fileData}
                  isVisible={showCodeAnalyzer}
                  onToggle={handleCodeAnalyzerToggle}
                />
              )}
            </div>
          </div>
        )}
      </div>
  
      {/* Mobile Floating Action Button */}
      {isMobile && !showAdminDashboard && !showGitDiff && !isMobileSidebarOpen && (
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-accent-500 text-white rounded-full shadow-dark-xl z-30 flex items-center justify-center"
          aria-label="Open controls"
        >
          <FaCog className="text-xl" />
        </button>
      )}


      {/* Modals */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onClose={handleSettingsClose}
          onSave={handleSettingsSave}
          projectType={projectType}
          setProjectType={setProjectType}
        />
      )}

      {showHelpModal && <HelpModal onClose={handleHelpClose} />}

      {showAboutModal && <AboutModal onClose={handleAboutClose} />}

      {showDirectoryModal && (
        <DirectorySelectionModal
          directories={directoryStructure}
          onConfirm={handleDirectorySelection}
          onCancel={() => {
            setShowDirectoryModal(false);
            setPendingFiles(null);
          }}
          settings={settings}
        />
      )}

      {showAnonymizeModal && (
        <AnonymizeModal
          onClose={handleAnonymizeClose}
          onSave={handleAnonymizeSave}
          currentSettings={anonymizeSettings}
        />
      )}
      
      <Footer />
    </div>
  );
}

export default App;