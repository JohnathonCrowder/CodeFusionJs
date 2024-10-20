import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import SettingsModal from "./components/SettingsModal";

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

  const handleUploadFile = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleUploadDirectory = () => {
    document.getElementById("dirInput")?.click();
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
