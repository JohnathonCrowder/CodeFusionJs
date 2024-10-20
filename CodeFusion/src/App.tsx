import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import SettingsModal from "./components/SettingsModal";
import { filterFiles, readFileContent } from "./utils/fileUtils";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

function App() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
  };

  const handleCopyText = () => {
    const getVisibleContent = (files: FileData[]): string[] => {
      return files.flatMap((file) => {
        const contents: string[] = [];
        if (file.visible && file.content) {
          contents.push(file.content);
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
      const { acceptedFiles, skippedFiles } = filterFiles(
        files,
        settings.acceptedTypes
      );

      const directoryStructure: { [key: string]: FileData } = {};

      for (const file of acceptedFiles) {
        const path = file.webkitRelativePath || file.name;
        const pathParts = path.split("/");
        let current = directoryStructure;

        // Build directory structure
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (i === pathParts.length - 1) {
            // This is a file
            const content = await readFileContent(file);
            current[part] = {
              name: part,
              content,
              visible: true,
              path: path,
            };
          } else {
            // This is a directory
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

      // Convert the directory structure to array format
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
      setSkippedFiles(skippedFiles);
    }
  };

  const handleFileVisibilityToggle = (path: string) => {
    const toggleVisibility = (files: FileData[]): FileData[] => {
      return files.map((file) => {
        if (file.path === path) {
          // Toggle this file/directory
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
          // Recurse into children
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

  return (
    <div className="flex flex-row-reverse h-screen bg-gray-100">
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
    </div>
  );
}

export default App;
