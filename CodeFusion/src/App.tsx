import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SettingsModal from "./components/SettingsModal";
import DirectorySelectionModal from "./components/DirectorySelectionModal";
import SmartCodeAnalyzer from "./components/SmartCodeAnalyzer";
import { filterFiles, readFileContent } from "./utils/fileUtils";
import HelpModal from "./components/HelpModal";
import { projectPresets } from "./utils/projectPresets";

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

function App() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showCodeAnalyzer, setShowCodeAnalyzer] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [directoryStructure, setDirectoryStructure] = useState<DirectoryItem[]>(
    []
  );
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [skippedFiles, setSkippedFiles] = useState<File[]>([]);
  const [projectType, setProjectType] = useState<"react" | "python" | "custom">(
    "custom"
  );
  const isAnonymized = false;
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
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
    ],
  });

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

  const handleClearText = () => {
    setFileData([]);
    setSkippedFiles([]);
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

  const handleSettingsOpen = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  const handleSettingsSave = (newSettings: any) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
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

  const handleCodeAnalyzerToggle = () => {
    setShowCodeAnalyzer(!showCodeAnalyzer);
  };

  const handleAnonymizeContent = (content: string): string => {
    if (!isAnonymized) {
      return content;
    }

    // Basic anonymization logic
    return (
      content
        // Anonymize email addresses
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
        .replace(/[A-Z][a-z]+\s+[A-Z][a-z]+/g, "[NAME]")
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavBar onHelpOpen={handleHelpOpen} onAboutOpen={handleAboutOpen} />
      <div className="flex flex-row-reverse flex-grow">
        <Sidebar
          onClearText={handleClearText}
          onCopyText={handleCopyText}
          onUploadFile={handleUploadFile}
          onUploadDirectory={handleUploadDirectory}
          onSettingsOpen={handleSettingsOpen}
          onCodeAnalyzerToggle={handleCodeAnalyzerToggle}
          showCodeAnalyzer={showCodeAnalyzer}
          uploadedFiles={fileData}
          skippedFiles={skippedFiles}
          onFileVisibilityToggle={handleFileVisibilityToggle}
        />
        <div className="flex flex-grow">
          <MainContent
            fileData={fileData}
            isAnonymized={isAnonymized}
            anonymizeContent={handleAnonymizeContent}
          />
          <SmartCodeAnalyzer
            fileData={fileData}
            isVisible={showCodeAnalyzer}
            onToggle={handleCodeAnalyzerToggle}
          />
        </div>
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
        {showAboutModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">About CodeFusion</h2>
                <p className="text-gray-600 mb-4">
                  CodeFusion is a powerful file management and analysis tool for
                  developers.
                </p>
                <button
                  onClick={handleAboutClose}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
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
      </div>
      <Footer />
    </div>
  );
}

export default App;
