import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import SettingsModal from "./components/SettingsModal";
import { filterFiles, readFileContent } from "./utils/fileUtils";

function App() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [textboxValue, setTextboxValue] = useState("");
  const [settings, setSettings] = useState({
    newLineCount: 8,
    acceptedTypes: [
      ".txt",
      ".py",
      ".js",
      ".ts",
      ".cpp",
      ".java",
      ".html",
      ".css",
      ".csv",
      ".json",
    ],
  });

  const handleClearText = () => {
    setTextboxValue("");
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(textboxValue);
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
      let fileContent = "";
      for (const file of acceptedFiles) {
        const content = await readFileContent(file);
        fileContent += content + "\n".repeat(settings.newLineCount);
      }
      setTextboxValue(fileContent.trim());
      displaySkippedFiles(skippedFiles);
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
      let fileContent = "";
      for (const file of acceptedFiles) {
        const content = await readFileContent(file);
        fileContent += content + "\n".repeat(settings.newLineCount);
      }
      setTextboxValue(fileContent.trim());
      displaySkippedFiles(skippedFiles);
    }
  };

  const displaySkippedFiles = (skippedFiles: File[]) => {
    const skippedFileListItems = document.getElementById(
      "skippedFileListItems"
    );
    if (skippedFileListItems) {
      skippedFileListItems.innerHTML = "";
      skippedFiles.forEach((file) => {
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        skippedFileListItems.appendChild(listItem);
      });
    }
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
      />
      <MainContent
        textboxValue={textboxValue}
        setTextboxValue={setTextboxValue}
      />
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
