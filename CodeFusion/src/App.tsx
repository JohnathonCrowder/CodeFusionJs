import { useState, useEffect } from "react";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import HomePage from "./components/HomePage";
import FileDirectoryPage from "./components/directory_converter/FileDirectoryPage";
import GitDiffVisualizer from "./components/diff_visualizer/GitDiffVisualizer";
import AdminDashboard from "./components/admin/AdminDashboard";
import PromptLibrary from "./components/PromptLibrary";
import PromptUpgrader from "./components/prompt-upgrader/PromptUpgrader";

// Updated modal imports using the new structure
import { HelpModal, AboutModal } from "./components/modals/app";

function App() {
  // Application-level state
  const [showHomePage, setShowHomePage] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPromptUpgrader, setShowPromptUpgrader] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGitDiff, setShowGitDiff] = useState(false);

  // Mobile states
  const [_isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [_isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation handlers
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
    setShowHomePage(false);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
    setShowPromptUpgrader(false);
  };

  const handlePromptUpgraderOpen = () => {
    setShowPromptUpgrader(true);
    setShowHomePage(false);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
    setShowPromptLibrary(false);
  };

  const handleHomeClick = () => {
    setShowHomePage(true);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
    setShowPromptLibrary(false);
    setShowPromptUpgrader(false);
  };

  const handleDirectoryConverterOpen = () => {
    setShowHomePage(false);
    setShowAdminDashboard(false);
    setShowGitDiff(false);
    setShowPromptLibrary(false);
    setShowPromptUpgrader(false);
  };

  const handleGitDiffOpen = () => {
    setShowGitDiff(true);
    setShowHomePage(false);
    setShowAdminDashboard(false);
    setShowPromptLibrary(false);
    setShowPromptUpgrader(false);
  };

  const handleGitDiffClose = () => {
    setShowGitDiff(false);
    setShowHomePage(true);
  };

  const handleAdminDashboardOpen = () => {
    setShowAdminDashboard(true);
    setShowHomePage(false);
    setShowGitDiff(false);
    setShowPromptLibrary(false);
    setShowPromptUpgrader(false);
  };

  // Handle navigation from HomePage
  const handleNavigateToTool = (tool: string) => {
    switch (tool) {
      case "directory-converter":
        handleDirectoryConverterOpen();
        break;
      case "prompt-upgrader":
        handlePromptUpgraderOpen();
        break;
      case "git-diff":
        handleGitDiffOpen();
        break;
      default:
        handleDirectoryConverterOpen();
    }
  };

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
        onDirectoryConverterOpen={handleDirectoryConverterOpen}
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
        ) : showHomePage ? (
          <HomePage onNavigateToTool={handleNavigateToTool} />
        ) : (
          <div className="flex-1 flex flex-col pt-16">
            <FileDirectoryPage />
          </div>
        )}
      </div>

      {/* Modals */}
      {showHelpModal && <HelpModal onClose={handleHelpClose} />}
      {showAboutModal && <AboutModal onClose={handleAboutClose} />}

      <Footer />
    </div>
  );
}

export default App;
