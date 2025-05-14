import React, { useState, useContext } from "react";
import {
  FaHome,
  FaGithub,
  FaQuestionCircle,
  FaCode,
  FaMoon,
  FaSun,
  FaUser
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

interface NavBarProps {
  onHelpOpen: () => void;
  onAboutOpen: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onHelpOpen, onAboutOpen }) => {
  const [activeTab, setActiveTab] = useState("home");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const navItems = [
    {
      icon: <FaHome />,
      label: "Home",
      key: "home",
      onClick: () => setActiveTab("home"),
    },
    {
      icon: <FaUser />,
      label: "About",
      key: "about",
      onClick: () => {
        setActiveTab("about");
        onAboutOpen();
      },
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      key: "github",
      onClick: () => {
        window.open(
          "https://github.com/JohnathonCrowder/CodeFusionJs",
          "_blank"
        );
        setActiveTab("github");
      },
    },
    {
      icon: <FaQuestionCircle />,
      label: "Help",
      key: "help",
      onClick: () => {
        setActiveTab("help");
        onHelpOpen();
      },
    },
  ];

  return (
    // Use a different shade for dark mode - bg-gray-800 instead of bg-gray-900
    // Add a subtle border and shadow to create more separation
    <nav className="bg-gray-800 dark:bg-gray-800 border-b border-transparent dark:border-gray-700 
                  shadow-md dark:shadow-gray-950/50 text-white py-3 px-6 
                  flex items-center justify-between z-10 relative">
      <div className="flex items-center">
        {/* Logo with glow effect in dark mode */}
        <FaCode className="h-8 w-8 mr-3 text-blue-400 dark:text-blue-300 
                       dark:drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]" />
        <span className="text-xl font-bold">
          CodeFusion
          <span className="text-blue-400 dark:text-blue-300">X</span>
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Theme Toggle Button with distinct styling */}
        <button
          onClick={toggleDarkMode}
          className={`
            flex items-center space-x-2
            px-3 py-2 rounded-md
            transition-all duration-300
            ${
              darkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }
            border border-transparent hover:border-gray-500
          `}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <>
              <FaSun className="animate-pulse" />
              <span className="hidden md:inline">Light</span>
            </>
          ) : (
            <>
              <FaMoon />
              <span className="hidden md:inline">Dark</span>
            </>
          )}
        </button>

        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`
              flex items-center space-x-2 
              px-3 py-2 rounded-md 
              transition-colors duration-300
              ${
                activeTab === item.key
                  ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white shadow-md"
                  : "text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700"
              }
              border border-transparent hover:border-gray-600 dark:hover:border-gray-500
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;