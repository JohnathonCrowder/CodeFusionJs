import React, { useState, useContext } from "react";
import {
  FaHome,
  FaGithub,
  FaQuestionCircle,
  FaCode,
  FaMoon,
  FaSun,
  FaUser,
  FaCodeBranch  // Git diff icon
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

interface NavBarProps {
  onHelpOpen: () => void;
  onAboutOpen: () => void;
  onGitDiffOpen?: () => void;  // Add this new prop
}

const NavBar: React.FC<NavBarProps> = ({ 
  onHelpOpen, 
  onAboutOpen,
  onGitDiffOpen  // Add this parameter
}) => {
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
      icon: <FaCodeBranch />,  // Git diff icon
      label: "Git Diff",
      key: "gitdiff",
      onClick: () => {
        setActiveTab("gitdiff");
        onGitDiffOpen && onGitDiffOpen(); // Call the git diff handler
      },
    },
    {
      icon: <FaUser />,
      label: "About",
      key: "about",
      onClick: () => {
        setActiveTab("about");
        onAboutOpen(); // This should open the about modal
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
    <nav className={`fixed top-0 left-0 right-0 transition-all duration-300 py-4 px-6 z-50
                  flex items-center justify-between
                  ${darkMode 
                    ? 'bg-dark-800/95 backdrop-blur-xl border-b border-dark-600/50 shadow-dark-lg text-dark-50'
                    : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm text-gray-800'
                  }`}>
      
      {/* Subtle gradient overlay for depth */}
      <div className={`absolute inset-0 pointer-events-none
                     ${darkMode 
                       ? 'bg-gradient-to-r from-dark-800/90 via-dark-700/30 to-dark-800/90'
                       : 'bg-gradient-to-r from-white/90 via-gray-50/30 to-white/90'
                     }`}></div>
      
      <div className="relative flex items-center z-10">
        {/* Professional Logo with glow effect */}
        <div className="flex items-center group">
          <div className="relative">
            <FaCode className={`h-8 w-8 mr-3 transition-all duration-300 
                           group-hover:scale-110
                           ${darkMode 
                             ? 'text-accent-500 group-hover:text-accent-400 drop-shadow-[0_0_8px_rgba(74,144,226,0.3)]'
                             : 'text-blue-600 group-hover:text-blue-500 drop-shadow-[0_0_4px_rgba(37,99,235,0.2)]'
                           }`} />
            <div className={`absolute inset-0 rounded-full blur-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300
                          ${darkMode ? 'bg-accent-500/20' : 'bg-blue-600/10'}`}></div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold tracking-tight">
              CodeFusion
            </span>
            <span className={`text-2xl font-bold ml-0.5 transition-colors
                          ${darkMode 
                            ? 'text-accent-500 group-hover:text-accent-400'
                            : 'text-blue-600 group-hover:text-blue-500'
                          }`}>X</span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center space-x-6 z-10">
        {/* Professional Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`
            flex items-center space-x-2.5 px-4 py-2.5 rounded-lg
            transition-all duration-300 group relative overflow-hidden
            border shadow-sm hover:shadow-md
            ${darkMode 
              ? "bg-dark-600/80 text-accent-400 hover:bg-dark-500/80 hover:text-accent-300 border-dark-500/50 hover:border-dark-400/50" 
              : "bg-gray-100/80 text-blue-600 hover:bg-gray-200/80 hover:text-blue-500 border-gray-200/50 hover:border-gray-300/50"
            }
          `}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {/* Subtle background glow */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         ${darkMode 
                           ? 'bg-gradient-to-r from-accent-500/10 to-accent-400/10'
                           : 'bg-gradient-to-r from-blue-500/5 to-blue-400/5'
                         }`}></div>
          
          <div className="relative z-10 flex items-center space-x-2">
            {darkMode ? (
              <>
                <FaSun className="text-lg transition-transform group-hover:rotate-180 duration-500" />
                <span className="hidden md:inline font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon className="text-lg transition-transform group-hover:-rotate-12 duration-300" />
                <span className="hidden md:inline font-medium">Dark Mode</span>
              </>
            )}
          </div>
        </button>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`
              flex items-center space-x-2.5 px-4 py-2.5 rounded-lg 
              transition-all duration-300 group relative overflow-hidden
              font-medium border
              ${
                activeTab === item.key
                  ? darkMode 
                    ? "bg-accent-500 text-white shadow-lg hover:bg-accent-400 border-accent-400" +
                      " ring-2 ring-accent-500/30 ring-offset-2 ring-offset-dark-800"
                    : "bg-blue-600 text-white shadow-lg hover:bg-blue-500 border-blue-500" +
                      " ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white"
                  : darkMode 
                      ? "text-dark-200 hover:bg-dark-600/80 hover:text-dark-50 border-transparent hover:border-dark-500/50"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-800 border-transparent hover:border-gray-300/50"
              }
            `}
          >
            {/* Active state glow */}
            {activeTab === item.key && (
              <div className={`absolute inset-0 animate-pulse-glow opacity-20
                             ${darkMode 
                               ? 'bg-gradient-to-r from-accent-600 to-accent-400'
                               : 'bg-gradient-to-r from-blue-600 to-blue-400'
                             }`}></div>
            )}
            
            <div className="relative z-10 flex items-center space-x-2">
              <span className={`text-lg transition-transform duration-200 
                              ${activeTab === item.key ? 'scale-110' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className="hidden md:inline transition-all duration-200">
                {item.label}
              </span>
            </div>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}></div>
          </button>
        ))}
      </div>
      
      {/* Bottom border gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-px
                     ${darkMode 
                       ? 'bg-gradient-to-r from-transparent via-accent-500/30 to-transparent'
                       : 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent'
                     }`}></div>
    </nav>
  );
};

export default NavBar;