import React, { useState } from "react";
import {
  FaHome,
  FaGithub,
  FaQuestionCircle,
  FaCode, // We'll use this as our logo icon
} from "react-icons/fa";

interface NavBarProps {
  onHelpOpen: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onHelpOpen }) => {
  const [activeTab, setActiveTab] = useState("home");

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
    <nav className="bg-gray-800 text-white py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        {/* Replace img with FaCode icon */}
        <FaCode className="h-8 w-8 mr-3 text-blue-400" />
        <span className="text-xl font-bold">CodeFusion</span>
      </div>

      <div className="flex items-center space-x-6">
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
                  : "hover:bg-gray-700 text-gray-300"
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
