import React, { useState } from "react";
import { FaHome, FaGithub, FaCog, FaQuestionCircle } from "react-icons/fa";

const NavBar: React.FC = () => {
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
        window.open("https://github.com/yourusername/codefusion", "_blank"),
    },
    {
      icon: <FaQuestionCircle />,
      label: "Help",
      key: "help",
      onClick: () => setActiveTab("help"),
    },
    {
      icon: <FaCog />,
      label: "Settings",
      key: "settings",
      onClick: () => setActiveTab("settings"),
    },
  ];

  return (
    <nav className="bg-gray-800 text-white py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="/path/to/your/logo.png" // Replace with your actual logo path
          alt="CodeFusion Logo"
          className="h-8 w-8 mr-3"
        />
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
