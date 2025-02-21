import { useState, useEffect, useContext } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SettingsModal from "./components/SettingsModal";
import DirectorySelectionModal from "./components/DirectorySelectionModal";
import AnonymizeModal from "./components/AnonymizeModal";
import AboutModal from "./components/AboutModal";
import { filterFiles, readFileContent } from "./utils/fileUtils";
import HelpModal from "./components/HelpModal";
import { projectPresets } from "./utils/projectPresets";
import { ThemeContext } from "./context/ThemeContext";

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
  // Theme Context
  const { darkMode } = useContext(ThemeContext);
  
  // Modal States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // File and Directory States
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [directoryStructure, setDirectoryStructure] = useState<DirectoryItem[]>([]);
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [skippedFiles, setSkippedFiles] = useState<File[]>([]);
  
  // Settings States
  const [projectType, setProjectType] = useState<"react" | "python" | "custom">("custom");
  const [settings, setSettings] = useState({
    newLineCount: 4,
    autoUnselectFolders: [
      "venv",
      ".git",
      "node_modules",
      "__pycache__",
      ".next",
      "build",
      "dist",
    ],
    acceptedTypes: [
      ".txt",
      ".py",
      ".js",
      ".ts",
      ".tsx",
      ".jsx",
      ".cpp",
      ".java",
      ".html",
      ".css",
      ".csv",
      ".json",
      ".md",
      ".yml",
      ".yaml",
      ".env",
      ".gitignore",
      ".scss",
      ".less",
      ".graphql",
      ".prisma",
      ".lock",
      ".swift",
    ],
  });
  
  // Anonymization States
  const [anonymizeSettings, setAnonymizeSettings] = useState<AnonymizeSettings>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    customReplacements: []
  });
  const [isAnonymized, setIsAnonymized] = useState(false);

  useEffect(() => {
    if (projectType !== "custom") {
      const preset = projectPresets[projectType];
      setSettings((prev) => ({
        ...prev,
        autoUnselectFolders: preset.autoUnselectFolders,
        acceptedTypes: preset.acceptedTypes,
      }));
    }
  }, [projectType]);

  // File and Text Handling Functions
  const handleClearText = () => {
    setFileData([]);
    setSkippedFiles([]);
  };

  const handleCopyText = () => {
    const getVisibleContent = (files: FileData[]): string[] => {
      return files.flatMap((file) => {
        const contents: string[] = [];
        if (file.visible && file.content) {
          const processedContent = isAnonymized ? anonymizeContent(file.content) : file.content;
          
          contents.push(
            [
              "=".repeat(60),
              `File: ${file.name}`,
              `Path: ${file.path || "N/A"}`,
              "=".repeat(60),
              "",
              processedContent,
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

      // Create directory structure for selection
      const structure: DirectoryItem[] = [];
      const paths = new Set<string>();

      // Function to determine if a directory should be selected
      const shouldBeSelected = (dirPath: string): boolean => {
        const parts = dirPath.toLowerCase().split("/");
        return !settings.autoUnselectFolders.some((folder) =>
          parts.includes(folder)
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

    // Filter files based on selected directories
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

  // Modal Functions
  const handleSettingsOpen = () => setShowSettingsModal(true);
  const handleSettingsClose = () => setShowSettingsModal(false);
  const handleSettingsSave = (newSettings: any) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
  };
  
  const handleHelpOpen = () => setShowHelpModal(true);
  const handleHelpClose = () => setShowHelpModal(false);
  
  const handleAboutOpen = () => setShowAboutModal(true);
  const handleAboutClose = () => setShowAboutModal(false);

  // Anonymization Functions
  const handleAnonymizeOpen = () => {
    setShowAnonymizeModal(true);
  };

  const handleAnonymizeClose = () => {
    setShowAnonymizeModal(false);
  };

  const handleAnonymizeSettingsSave = (settings: AnonymizeSettings) => {
    setAnonymizeSettings(settings);
    setShowAnonymizeModal(false);
    
    // Automatically enable anonymization if settings are provided
    if (settings.firstName || settings.lastName || settings.email || settings.username || 
        settings.customReplacements.length > 0) {
      setIsAnonymized(true);
    }
  };

  const toggleAnonymization = () => {
    if (!isAnonymized && !hasAnonymizationSettings()) {
      // If turning on anonymization but no settings, open the modal
      handleAnonymizeOpen();
    } else {
      // Otherwise, just toggle the state
      setIsAnonymized(!isAnonymized);
    }
  };

  const hasAnonymizationSettings = () => {
    return anonymizeSettings.firstName || 
           anonymizeSettings.lastName || 
           anonymizeSettings.email || 
           anonymizeSettings.username || 
           anonymizeSettings.customReplacements.length > 0;
  };

  const anonymizeContent = (content: string): string => {
    if (!isAnonymized) return content;
    
    let result = content;
    
    // Helper function to preserve case when replacing
    const replaceWithCase = (text: string, find: string, replace: string): string => {
      if (!find) return text;
      
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      return text.replace(regex, (match) => {
        // If it's all uppercase, replace with uppercase
        if (match === match.toUpperCase()) {
          return replace.toUpperCase();
        } 
        // If it's title case, replace with title case
        else if (match.charAt(0) === match.charAt(0).toUpperCase()) {
          return replace.charAt(0).toUpperCase() + replace.slice(1).toLowerCase();
        } 
        // Otherwise replace with lowercase
        else {
          return replace.toLowerCase();
        }
      });
    };
    
    // Replace first and last names
    if (anonymizeSettings.firstName) {
      result = replaceWithCase(result, anonymizeSettings.firstName, "John");
    }
    
    if (anonymizeSettings.lastName) {
      result = replaceWithCase(result, anonymizeSettings.lastName, "Doe");
    }
    
    // Replace username
    if (anonymizeSettings.username) {
      result = result.replace(new RegExp(anonymizeSettings.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), "user123");
    }
    
    // Replace email
    if (anonymizeSettings.email) {
      result = result.replace(
        new RegExp(anonymizeSettings.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
        "john.doe@example.com"
      );
    }
    
    // Apply custom replacements
    anonymizeSettings.customReplacements.forEach(item => {
      if (item.original && item.replacement) {
        result = replaceWithCase(result, item.original, item.replacement);
      }
    });
    
    return result;
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
      <NavBar onHelpOpen={handleHelpOpen} onAboutOpen={handleAboutOpen} />
      <div className="flex flex-row-reverse flex-grow">
        <Sidebar
          onClearText={handleClearText}
          onCopyText={handleCopyText}
          onUploadFile={handleUploadFile}
          onUploadDirectory={handleUploadDirectory}
          onSettingsOpen={handleSettingsOpen}
          onAnonymizeOpen={handleAnonymizeOpen}
          isAnonymized={isAnonymized}
          toggleAnonymization={toggleAnonymization}
          uploadedFiles={fileData}
          skippedFiles={skippedFiles}
          onFileVisibilityToggle={handleFileVisibilityToggle}
        />
        <MainContent 
          fileData={fileData} 
          isAnonymized={isAnonymized}
          anonymizeContent={anonymizeContent}
        />
        
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
            onSave={handleAnonymizeSettingsSave}
            currentSettings={anonymizeSettings}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;