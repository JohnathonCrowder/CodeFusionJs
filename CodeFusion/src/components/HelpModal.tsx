import React, { useState } from "react";
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
} from "react-icons/fa";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <FaLightbulb />,
    },
    {
      id: "features",
      title: "Key Features",
      icon: <FaTools />,
    },
    {
      id: "workflows",
      title: "Common Workflows",
      icon: <FaBook />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <FaTimes size={24} />
        </button>

        {/* Left sidebar for navigation */}
        <div className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex-shrink-0 overflow-y-auto">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            Help Center
          </h2>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                  activeSection === section.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-lg mr-3">
                  {section.icon}
                </span>
                <span className="font-medium">{section.title}</span>
                {activeSection === section.id && (
                  <FaChevronRight className="ml-auto text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Need more help?
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              Check out our comprehensive documentation or reach out to us directly.
            </p>
            <a 
              href="https://github.com/JohnathonCrowder/CodeFusionJs" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Visit Documentation →
            </a>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-grow p-6 md:p-8 overflow-y-auto">
          {activeSection === "getting-started" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Getting Started with CodeFusion
              </h2>
              
              <div className="prose prose-blue dark:prose-invert max-w-none dark:text-gray-300">
                <p className="lead text-lg text-gray-600 dark:text-gray-400 mb-6">
                  CodeFusion helps you easily manage, view, and share code while keeping sensitive information private. Here's how to start:
                </p>

                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg mr-4">
                        <FaFileUpload className="text-blue-600 dark:text-blue-400 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          Step 1: Upload Your Code
                        </h3>
                        <p className="mb-4">
                          Use the <strong>Upload File</strong> or <strong>Upload Directory</strong> buttons in the sidebar to import your code files.
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Supported file types:</strong> JavaScript, TypeScript, Python, HTML, CSS, and many more.
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Tip:</strong> When uploading a directory, CodeFusion automatically filters out unnecessary folders like node_modules.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mr-4">
                        <FaEye className="text-green-600 dark:text-green-400 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          Step 2: View and Filter
                        </h3>
                        <p className="mb-4">
                          Your files will appear in the sidebar. Use the checkboxes to show/hide specific files. The main panel will display the content of selected files.
                        </p>
                        <img 
                          src="https://via.placeholder.com/500x200?text=File+Selection+Illustration" 
                          alt="File selection interface" 
                          className="w-full rounded-md mb-3"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Tip:</strong> Click the parent folder to toggle visibility for all files inside it.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
                        <FaCopy className="text-purple-600 dark:text-purple-400 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          Step 3: Copy and Share
                        </h3>
                        <p className="mb-2">
                          Click the <strong>Copy</strong> button to copy the formatted content of all visible files to your clipboard.
                        </p>
                        <p>
                          Paste the content in your preferred platform – whether it's email, chat, or AI assistants like ChatGPT.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "features" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Key Features
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    <FaCog className="mr-2 text-gray-600 dark:text-gray-400" />
                    Customizable Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Adjust file types, auto-excluded folders, and spacing between files through the Settings panel.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Access via the Settings button in the sidebar.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    <FaUserSecret className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Privacy Protection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Anonymize personal information before sharing code, replacing names, emails, and custom text patterns.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable with the "Anonymize Personal Info" button.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    <svg className="mr-2 text-yellow-600 dark:text-yellow-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Dark Mode
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Switch between light and dark themes for comfortable viewing in any environment.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle via the sun/moon icon in the navigation bar.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    <svg className="mr-2 text-green-600 dark:text-green-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6H8C7.44772 6 7 5.55228 7 5V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 8C5 7.44772 5.44772 7 6 7H14C14.5523 7 15 7.44772 15 8V10C15 10.5523 14.5523 11 14 11H6C5.44772 11 5 10.5523 5 10V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 13C3 12.4477 3.44772 12 4 12H16C16.5523 12 17 12.4477 17 13V15C17 15.5523 16.5523 16 16 16H4C3.44772 16 3 15.5523 3 15V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Project Presets
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Quickly apply optimized settings for different project types like React or Python.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select project types in the Settings modal.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                  Did You Know?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="text-blue-500 dark:text-blue-400 mr-3 mt-1">•</div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      CodeFusion preserves your dark/light mode preference between sessions
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-500 dark:text-blue-400 mr-3 mt-1">•</div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Swift files are now included by default with our latest update
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-500 dark:text-blue-400 mr-3 mt-1">•</div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Privacy mode maintains the original case patterns when replacing text
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-500 dark:text-blue-400 mr-3 mt-1">•</div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      You can toggle all files in a folder by clicking the folder's checkbox
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "workflows" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Common Workflows
              </h2>
              
              <div className="space-y-8">
                <div className="relative pl-10 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="absolute -left-3 top-0 bg-blue-500 dark:bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Sharing a Project with AI Assistants
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      <strong className="text-blue-600 dark:text-blue-400">Goal:</strong> Upload your project to analyze with ChatGPT or other AI tools
                    </p>
                    <ol className="list-decimal list-inside space-y-3 pl-2">
                      <li>Upload your project directory with the "Upload Directory" button</li>
                      <li>Deselect unnecessary files and folders from the sidebar</li>
                      <li>Ensure any sensitive information is anonymized using the Privacy Settings</li>
                      <li>Click "Copy" to copy all visible files</li>
                      <li>Paste into your AI assistant with a prompt like "Please analyze this code"</li>
                    </ol>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">⚠️</span>
                        <span>For large projects, consider uploading only the most relevant files to stay within token limits.</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-10 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="absolute -left-3 top-0 bg-blue-500 dark:bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Sharing Code Snippets with Colleagues
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      <strong className="text-blue-600 dark:text-blue-400">Goal:</strong> Share specific files with team members while protecting private information
                    </p>
                    <ol className="list-decimal list-inside space-y-3 pl-2">
                      <li>Upload files using "Upload File" or "Upload Directory"</li>
                      <li>Uncheck files you don't want to share from the sidebar</li>
                      <li>Open Privacy Settings and add your name, email, and other sensitive information</li>
                      <li>Enable anonymization with the "Anonymize Personal Info" button</li>
                      <li>Copy the formatted, anonymized content and share it with your colleagues</li>
                    </ol>
                  </div>
                </div>
                
                <div className="relative pl-10 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="absolute -left-3 top-0 bg-blue-500 dark:bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Analyzing a Complex Project
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      <strong className="text-blue-600 dark:text-blue-400">Goal:</strong> Explore and understand the structure of an unfamiliar codebase
                    </p>
                    <ol className="list-decimal list-inside space-y-3 pl-2">
                      <li>Upload the project directory using "Upload Directory"</li>
                      <li>Select a project preset (React, Python, etc.) in Settings if applicable</li>
                      <li>Browse the file structure in the sidebar to understand the organization</li>
                      <li>Toggle visibility of specific folders as you explore different parts</li>
                      <li>Copy selected files for reference or further analysis</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;