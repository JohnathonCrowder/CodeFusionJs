import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar"; // Import NavBar
import SettingsModal from "./components/SettingsModal";
import DirectorySelectionModal from "./components/DirectorySelectionModal";
import { filterFiles, readFileContent } from "./utils/fileUtils";
import HelpModal from "./components/HelpModal";

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
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [directoryStructure, setDirectoryStructure] = useState<DirectoryItem[]>(
    []
  );
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [skippedFiles, setSkippedFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState({
    newLineCount: 8,
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
    ],
  });

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
              const dirName = pathParts[j];
              const dirPath = pathParts.slice(0, j + 1).join("/");

              let dir = current.find((d) => d.path === dirPath);
              if (!dir) {
                dir = {
                  name: dirName,
                  path: dirPath,
                  selected: true,
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

    const directoryStructure: { [key: string]: FileData } = {};

    for (const file of filteredFiles) {
      const path = file.webkitRelativePath;
      const pathParts = path.split("/");
      let current = directoryStructure;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (i === pathParts.length - 1) {
          const content = await readFileContent(file);
          current[part] = {
            name: part,
            content,
            visible: true,
            path: path,
          };
        } else {
          if (!current[part]) {
            current[part] = {
              name: part,
              content: "",
              visible: true,
              children: {},
              path: pathParts.slice(0, i + 1).join("/"),
            };
          }
          current =
            (current[part].children as { [key: string]: FileData }) || {};
        }
      }
    }

    const convertToArray = (structure: {
      [key: string]: FileData;
    }): FileData[] => {
      return Object.values(structure).map((item) => ({
        ...item,
        children: item.children
          ? convertToArray(item.children as { [key: string]: FileData })
          : undefined,
      }));
    };

    const newFileData = convertToArray(directoryStructure);
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

  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleHelpOpen = () => {
    setShowHelpModal(true);
  };

  const handleHelpClose = () => {
    setShowHelpModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavBar onHelpOpen={handleHelpOpen} /> {/* Pass onHelpOpen */}
      <div className="flex flex-row-reverse flex-grow">
        <Sidebar
          onClearText={handleClearText}
          onCopyText={handleCopyText}
          onUploadFile={handleUploadFile}
          onUploadDirectory={handleUploadDirectory}
          onSettingsOpen={handleSettingsOpen}
          uploadedFiles={fileData}
          skippedFiles={skippedFiles}
          onFileVisibilityToggle={handleFileVisibilityToggle}
        />
        <MainContent fileData={fileData} />
        {showSettingsModal && (
          <SettingsModal
            settings={settings}
            onClose={handleSettingsClose}
            onSave={handleSettingsSave}
          />
        )}
        {showHelpModal && <HelpModal onClose={handleHelpClose} />}{" "}
        {/* Render HelpModal */}
        {showDirectoryModal && (
          <DirectorySelectionModal
            directories={directoryStructure}
            onConfirm={handleDirectorySelection}
            onCancel={() => {
              setShowDirectoryModal(false);
              setPendingFiles(null);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
