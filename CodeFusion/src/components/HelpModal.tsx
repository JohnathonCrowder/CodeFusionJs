import React, { useState } from "react";
import {
  FaUpload,
  FaEye,
  FaCopy,
  FaChevronRight,
  FaChevronDown,
  FaKeyboard,
  FaVideo,
  FaReact,
  FaPython,
  FaCog,
} from "react-icons/fa";

interface HelpModalProps {
  onClose: () => void;
}

const QuickTip: React.FC<{
  title: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ title, description, expanded, onToggle }) => (
  <div className="border-b border-gray-200 py-4">
    <div
      className="flex justify-between items-center cursor-pointer hover:text-blue-600"
      onClick={onToggle}
    >
      <div className="flex items-center">
        <span className="mr-2">
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </span>
        <h4 className="font-semibold">{title}</h4>
      </div>
    </div>
    {expanded && (
      <p className="text-sm text-gray-600 mt-2 pl-6">{description}</p>
    )}
  </div>
);

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "features" | "tutorials" | "shortcuts"
  >("features");
  const [expandedTips, setExpandedTips] = useState<number[]>([]);

  const featureSections = [
    {
      icon: <FaUpload className="text-blue-500" />,
      title: "Multi-Format File Upload",
      description:
        "Upload individual files or entire project directories with ease. Support for 20+ file types including source code, text, and configuration files.",
    },
    {
      icon: <FaEye className="text-green-500" />,
      title: "Granular Visibility Control",
      description:
        "Instantly toggle file and directory visibility. Customize your view by selecting which files appear in the main content area.",
    },
    {
      icon: <FaCopy className="text-purple-500" />,
      title: "Advanced Copying",
      description:
        "Copy visible content with a single click. Customize newline spacing and formatting to suit your needs.",
    },
    {
      icon: <FaReact className="text-blue-400" />,
      title: "React Project Support",
      description:
        "Full support for React projects including JSX, TSX, and related config files. Automatically excludes 'node_modules', '.next', and 'dist' folders.",
    },
    {
      icon: <FaPython className="text-yellow-500" />,
      title: "Python Project Support",
      description:
        "Complete support for Python projects. Automatically excludes 'venv' and '__pycache__' folders to keep your view clean.",
    },
    {
      icon: <FaCog className="text-gray-500" />,
      title: "Smart Folder Exclusion",
      description:
        "Automatically unselects common unnecessary folders like 'node_modules', 'venv', '.git', and more. Fully customizable in settings.",
    },
  ];

  const quickTips = [
    {
      title: "Drag and Drop Support",
      description:
        "Easily upload files by dragging and dropping them directly into the application window.",
    },
    {
      title: "Multi-Select Visibility",
      description:
        "Hold Ctrl (or Cmd on Mac) to select multiple files in the sidebar for quick visibility toggling.",
    },
    {
      title: "Large Project Handling",
      description:
        "CodeFusion is optimized to handle large project directories with hundreds of files efficiently.",
    },
    {
      title: "React Project Optimization",
      description:
        "When uploading React projects, 'node_modules', '.next', and 'dist' folders are automatically unselected. Config files like package.json are still included.",
    },
    {
      title: "Python Virtual Environment Handling",
      description:
        "'venv' folders are automatically unselected during directory upload to prevent unnecessary inclusion. You can manually include them if needed.",
    },
    {
      title: "Customizable Exclusions",
      description:
        "Use the settings panel to add or remove folders from the auto-exclusion list. Tailor it to your specific project needs.",
    },
  ];

  const toggleTip = (index: number) => {
    setExpandedTips((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  };

  const tutorialLinks = [
    {
      title: "Getting Started Video",
      icon: <FaVideo />,
      link: "#",
    },
    {
      title: "React Project Guide",
      icon: <FaReact />,
      link: "#",
    },
    {
      title: "Python Project Guide",
      icon: <FaPython />,
      link: "#",
    },
    {
      title: "Keyboard Shortcuts Guide",
      icon: <FaKeyboard />,
      link: "#",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 z-50 border-t-4 border-blue-600">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              CodeFusion Help Center
            </h2>
            <p className="text-gray-600">
              Your comprehensive guide to mastering file management
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8 space-x-4">
            {[
              { key: "features", label: "Features" },
              { key: "tutorials", label: "Tutorials" },
              { key: "shortcuts", label: "Quick Tips" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  px-4 py-2 rounded-md transition-colors
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          {activeTab === "features" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tutorials" && (
            <div className="grid md:grid-cols-2 gap-6">
              {tutorialLinks.map((tutorial, index) => (
                <a
                  key={index}
                  href={tutorial.link}
                  className="flex items-center bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <div className="text-2xl mr-4 text-blue-600">
                    {tutorial.icon}
                  </div>
                  <span className="font-semibold">{tutorial.title}</span>
                </a>
              ))}
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div className="bg-white rounded-lg">
              {quickTips.map((tip, index) => (
                <QuickTip
                  key={index}
                  title={tip.title}
                  description={tip.description}
                  expanded={expandedTips.includes(index)}
                  onToggle={() => toggleTip(index)}
                />
              ))}
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
