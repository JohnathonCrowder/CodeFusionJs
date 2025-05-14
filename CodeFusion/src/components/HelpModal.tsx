import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaTimes,
  FaLightbulb,
  FaBook,
  FaTools,
  FaFileUpload,
  FaEye,
  FaCopy,
  FaCog,
  FaUserSecret,
  FaChevronRight,
  FaKeyboard,
  FaQuestionCircle,
  FaRocket,
  FaBrain,
  FaShieldAlt,
  FaCode
} from "react-icons/fa";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { darkMode } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <FaRocket />,
    },
    {
      id: "features",
      title: "Key Features",
      icon: <FaTools />,
    },
    {
      id: "file-management",
      title: "File Management",
      icon: <FaFileUpload />,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <FaShieldAlt />,
    },
    {
      id: "analysis",
      title: "Code Analysis",
      icon: <FaBrain />,
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      icon: <FaKeyboard />,
    },
    {
      id: "faq",
      title: "FAQ",
      icon: <FaQuestionCircle />,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Getting Started with CodeFusion
            </h2>
            
            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-blue-900/20 border-blue-400' 
                             : 'bg-blue-50 border-blue-500'}`}>
              <p className={`text-base leading-relaxed transition-colors duration-300
                           ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Welcome to CodeFusion! This guide will help you get started with managing, 
                analyzing, and sharing your code efficiently while maintaining your privacy.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Upload Your Files",
                  content: "Use the 'Upload Files' or 'Upload Directory' buttons in the sidebar to import your code files. CodeFusion supports a wide variety of file types including JavaScript, TypeScript, Python, CSS, and more.",
                  icon: <FaFileUpload />
                },
                {
                  step: "2", 
                  title: "Review & Select",
                  content: "Your uploaded files will appear in the sidebar file tree. You can toggle visibility of individual files or entire directories using the eye icons.",
                  icon: <FaEye />
                },
                {
                  step: "3",
                  title: "Copy & Share",
                  content: "Click the 'Copy All' button to copy your selected files to the clipboard in a clean, organized format perfect for sharing with team members or AI assistants.",
                  icon: <FaCopy />
                }
              ].map((item, index) => (
                <div key={index} 
                     className={`p-4 rounded-lg border transition-colors duration-300
                                ${darkMode 
                                  ? 'bg-dark-700 border-dark-600' 
                                  : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                                   ${darkMode 
                                     ? 'bg-blue-600 text-white' 
                                     : 'bg-blue-100 text-blue-600'}`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                          {item.icon}
                        </div>
                        <h3 className={`text-lg font-semibold transition-colors duration-300
                                       ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <p className={`transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Key Features
            </h2>

            <div className="grid gap-4">
              {[
                {
                  title: "Smart File Organization",
                  description: "Automatically excludes common build directories like node_modules, .git, and build folders to keep your uploads clean.",
                  icon: <FaCog />,
                  color: "blue"
                },
                {
                  title: "Privacy Protection",
                  description: "Anonymize personal information before sharing code. Replace names, emails, and custom text patterns automatically.",
                  icon: <FaShieldAlt />,
                  color: "green"
                },
                {
                  title: "Code Analysis",
                  description: "Analyze your code quality with metrics like line counts, imports, TODOs, and potential issues.",
                  icon: <FaBrain />,
                  color: "purple"
                },
                {
                  title: "Dark Mode",
                  description: "Professional dark theme for comfortable coding sessions, with seamless light/dark mode switching.",
                  icon: <FaLightbulb />,
                  color: "orange"
                },
                {
                  title: "Project Presets",
                  description: "Optimized settings for React and Python projects with smart defaults for file types and exclusions.",
                  icon: <FaCode />,
                  color: "indigo"
                },
                {
                  title: "Search Functionality",
                  description: "Quickly find content within your uploaded files using the built-in search feature.",
                  icon: <FaQuestionCircle />,
                  color: "teal"
                }
              ].map((feature, index) => (
                <div key={index}
                     className={`p-5 rounded-lg border transition-colors duration-300
                                ${darkMode 
                                  ? 'bg-dark-700 border-dark-600' 
                                  : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg transition-colors duration-300
                                   ${darkMode 
                                     ? `bg-${feature.color}-600/20 text-${feature.color}-400` 
                                     : `bg-${feature.color}-100 text-${feature.color}-600`}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300
                                     ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                        {feature.title}
                      </h3>
                      <p className={`transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "file-management":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              File Management
            </h2>

            <div className="space-y-6">
              <div className={`p-5 rounded-lg border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                  Supported File Types
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    "JavaScript (.js, .jsx, .ts, .tsx)",
                    "Python (.py)",
                    "Styles (.css, .scss, .sass, .less)",
                    "Markup (.html, .xml, .md)",
                    "Config (.json, .yml, .yaml, .env)",
                    "Documentation (.txt, .md, .rst)"
                  ].map((type, index) => (
                    <div key={index}
                         className={`p-2 rounded border transition-colors duration-300
                                   ${darkMode 
                                     ? 'bg-dark-600 border-dark-500 text-dark-200' 
                                     : 'bg-white border-gray-200 text-gray-700'}`}>
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-5 rounded-lg border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                  Managing File Visibility
                </h3>
                <ul className={`space-y-2 text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                  <li className="flex items-center space-x-2">
                    <FaEye className="h-4 w-4 text-green-500" />
                    <span>Click the eye icon to toggle file visibility</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaFileUpload className="h-4 w-4 text-blue-500" />
                    <span>Upload individual files or entire directories</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCog className="h-4 w-4 text-purple-500" />
                    <span>Configure auto-excluded folders in Settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Privacy & Security
            </h2>

            <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300
                           ${darkMode 
                             ? 'bg-green-900/20 border-green-400' 
                             : 'bg-green-50 border-green-500'}`}>
              <h3 className={`font-semibold mb-2 transition-colors duration-300
                             ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                Your Data Stays Local
              </h3>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                CodeFusion processes all files locally in your browser. No data is sent to external servers.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`p-5 rounded-lg border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                  Anonymization Features
                </h3>
                <ul className={`space-y-2 text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                  <li>• Replace personal names with generic alternatives (John Doe)</li>
                  <li>• Anonymize email addresses and usernames</li>
                  <li>• Custom text replacements for company names, project names, etc.</li>
                  <li>• Automatic detection of common sensitive patterns</li>
                </ul>
              </div>

              <div className={`p-5 rounded-lg border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300
                               ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                  Best Practices
                </h3>
                <ul className={`space-y-2 text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                  <li>• Review anonymized content before sharing</li>
                  <li>• Use custom replacements for project-specific terms</li>
                  <li>• Exclude sensitive configuration files</li>
                  <li>• Test anonymization with sample data first</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "analysis":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Code Analysis
            </h2>

            <div className={`p-5 rounded-lg border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                Available Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { metric: "Line Counts", description: "Total, code, and blank lines" },
                  { metric: "File Sizes", description: "Individual and total project size" },
                  { metric: "Import Analysis", description: "Count of dependencies and imports" },
                  { metric: "Code Issues", description: "Long lines, mixed indentation" },
                  { metric: "TODO Comments", description: "Track pending work items" },
                  { metric: "Project Overview", description: "Summary statistics across all files" }
                ].map((item, index) => (
                  <div key={index}
                       className={`p-3 rounded border transition-colors duration-300
                                 ${darkMode 
                                   ? 'bg-dark-600 border-dark-500' 
                                   : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-medium transition-colors duration-300
                                   ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                      {item.metric}
                    </h4>
                    <p className={`text-sm transition-colors duration-300
                                 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "shortcuts":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Keyboard Shortcuts
            </h2>

            <div className="space-y-4">
              {[
                { keys: "Ctrl/Cmd + F", action: "Search within files" },
                { keys: "Ctrl/Cmd + C", action: "Copy selected content" },
                { keys: "Ctrl/Cmd + G", action: "Go to line (in code view)" },
                { keys: "Escape", action: "Close modals/clear search" },
                { keys: "Space", action: "Toggle file visibility" }
              ].map((shortcut, index) => (
                <div key={index}
                     className={`flex items-center justify-between p-4 rounded-lg border
                                transition-colors duration-300
                                ${darkMode 
                                  ? 'bg-dark-700 border-dark-600' 
                                  : 'bg-white border-gray-200'}`}>
                  <span className={`transition-colors duration-300
                                  ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                    {shortcut.action}
                  </span>
                  <kbd className={`px-3 py-1 rounded font-mono text-sm border
                                 ${darkMode 
                                   ? 'bg-dark-600 border-dark-500 text-dark-100' 
                                   : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "How large files can I upload?",
                  answer: "CodeFusion processes files in your browser, so the limit depends on your device's memory. For best performance, we recommend keeping individual files under 10MB."
                },
                {
                  question: "Is my code sent to any servers?",
                  answer: "No. All processing happens locally in your browser. Your code never leaves your device unless you explicitly copy and share it."
                },
                {
                  question: "Can I use CodeFusion offline?",
                  answer: "Yes, once loaded, CodeFusion works entirely offline. Your files are processed locally without any internet connection required."
                },
                {
                  question: "How does anonymization work?",
                  answer: "Anonymization replaces specified personal information (names, emails, etc.) with generic alternatives. You can configure custom replacements in the Privacy settings."
                },
                {
                  question: "What happens to my uploaded files?",
                  answer: "Files are only stored in your browser's memory while using the app. They're automatically cleared when you close the tab or click 'Clear Text'."
                }
              ].map((faq, index) => (
                <div key={index}
                     className={`p-5 rounded-lg border transition-colors duration-300
                                ${darkMode 
                                  ? 'bg-dark-700 border-dark-600' 
                                  : 'bg-white border-gray-200'}`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    {faq.question}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex
                       transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg z-10 transition-all duration-200
                      ${darkMode
                        ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
          >
            <FaTimes size={20} />
          </button>

          {/* Sidebar Navigation */}
          <div className={`w-64 border-r p-6 transition-colors duration-300
                         ${darkMode 
                           ? 'bg-dark-700 border-dark-600' 
                           : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg transition-colors duration-300
                             ${darkMode 
                               ? 'bg-blue-600/20 text-blue-400' 
                               : 'bg-blue-100 text-blue-600'}`}>
                <FaBook className="text-xl" />
              </div>
              <h2 className={`text-xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Help Center
              </h2>
            </div>
            
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200
                            text-left group
                            ${activeSection === section.id
                              ? darkMode
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                              : darkMode
                                ? 'text-dark-300 hover:bg-dark-600 hover:text-dark-100'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                >
                  <span className="text-lg mr-3">
                    {section.icon}
                  </span>
                  <span className="font-medium flex-1">{section.title}</span>
                  {activeSection === section.id && (
                    <FaChevronRight className={`transition-colors duration-200
                                               ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  )}
                </button>
              ))}
            </nav>

            {/* Help footer */}
            <div className={`mt-8 p-4 rounded-lg border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-blue-900/20 border-blue-700/50' 
                             : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm font-medium mb-2 transition-colors duration-300
                           ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Need more help?
              </p>
              <p className={`text-xs mb-3 transition-colors duration-300
                           ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                Check out our documentation or reach out to us directly.
              </p>
              <a 
                href="https://github.com/JohnathonCrowder/CodeFusionJs" 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-medium transition-colors duration-200
                          ${darkMode 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-800'}`}
              >
                Visit GitHub →
              </a>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;