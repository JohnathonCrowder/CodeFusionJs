import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import SettingsModal from "./components/SettingsModal";
import { filterFiles, readFileContent } from "./utils/fileUtils";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
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
    const visibleContent = fileData
      .filter((file) => file.visible)
      .map((file) => file.content)
      .join("\n".repeat(settings.newLineCount));
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
        newFileData.push({ name: file.name, content, visible: true });
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
      const newFileData: FileData[] = [];
      for (const file of acceptedFiles) {
        const content = await readFileContent(file);
        newFileData.push({
          name: file.webkitRelativePath || file.name,
          content,
          visible: true,
        });
      }
      setFileData([...fileData, ...newFileData]);
      setSkippedFiles(skippedFiles);
    }
  };

  const handleFileVisibilityToggle = (index: number) => {
    setFileData((prevFileData) =>
      prevFileData.map((file, i) =>
        i === index ? { ...file, visible: !file.visible } : file
      )
    );
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
