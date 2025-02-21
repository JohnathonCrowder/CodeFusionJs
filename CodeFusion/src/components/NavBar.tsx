import React, { useState, useContext } from "react";
import {
  FaHome,
  FaGithub,
  FaQuestionCircle,
  FaCode,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

interface NavBarProps {
  onHelpOpen: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onHelpOpen }) => {
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
      icon: <FaGithub />,
      label: "GitHub",
      key: "github",
      onClick: () =>
        window.open(
          "https://github.com/JohnathonCrowder/CodeFusionJs",
          "_blank"
        ),
    },
    {
      icon: <FaQuestionCircle />,
      label: "Help",
      key: "help",
      onClick: onHelpOpen,
    },
  ];

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <FaCode className="h-8 w-8 mr-3 text-blue-400 dark:text-blue-300" />
        <span className="text-xl font-bold">CodeFusion</span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-2 
            px-3 py-2 rounded-md 
            transition-colors duration-300
            bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          <span className="hidden md:inline">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
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
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300 dark:hover:bg-gray-800"
              }
            `}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;