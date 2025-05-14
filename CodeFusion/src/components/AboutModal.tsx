import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FaTimes, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaEnvelope, 
  FaCode,
  FaExternalLinkAlt,
  FaLink
} from "react-icons/fa";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={`relative rounded-xl max-w-2xl w-full shadow-2xl transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header with logo */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors duration-300
                               ${darkMode 
                                 ? 'bg-blue-600/20 text-blue-400' 
                                 : 'bg-blue-100 text-blue-600'}`}>
                  <FaCode className="text-xl" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    About CodeFusion
                  </h2>
                  <p className={`text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Version 1.0.0
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div className={`p-5 rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-base leading-relaxed transition-colors duration-300
                           ${darkMode ? 'text-dark-200' : 'text-gray-600'}`}>
                CodeFusion is a powerful file management and analysis tool designed for developers. 
                It helps you organize, review, and share code while maintaining privacy and control 
                over sensitive information.
              </p>
            </div>

            {/* Features */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              {[
                {
                  title: "Smart Analysis",
                  description: "Analyze code quality and structure automatically"
                },
                {
                  title: "Privacy Protection",
                  description: "Anonymize sensitive information before sharing"
                },
                {
                  title: "File Management",
                  description: "Easily organize and manage multiple files"
                },
                {
                  title: "Dark Mode",
                  description: "Comfortable viewing in any environment"
                }
              ].map((feature, index) => (
                <div key={index} 
                     className={`p-4 rounded-lg border transition-colors duration-300
                                ${darkMode 
                                  ? 'bg-dark-700 border-dark-600' 
                                  : 'bg-white border-gray-200'}`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm transition-colors duration-300
                                ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className={`p-5 rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-700 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 transition-colors duration-300
                             ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                Connect & Contribute
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://github.com/JohnathonCrowder/CodeFusionJs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 p-3 rounded-lg 
                            transition-all duration-200 group
                            ${darkMode
                              ? 'bg-dark-600 hover:bg-dark-500 text-dark-200'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}
                >
                  <FaGithub className="h-5 w-5" />
                  <span>GitHub</span>
                  <FaExternalLinkAlt className={`h-3 w-3 ml-auto opacity-0 group-hover:opacity-100
                                              transition-opacity duration-200`} />
                </a>
                <a
                  href="https://www.johnathoncrowder.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 p-3 rounded-lg 
                            transition-all duration-200 group
                            ${darkMode
                              ? 'bg-dark-600 hover:bg-dark-500 text-dark-200'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}
                >
                  <FaLink className="h-5 w-5" />
                  <span>Website</span>
                  <FaExternalLinkAlt className={`h-3 w-3 ml-auto opacity-0 group-hover:opacity-100
                                              transition-opacity duration-200`} />
                </a>
              </div>
            </div>

            {/* License & Credits */}
            <div className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              <p>© 2024 CodeFusion. Released under the MIT License.</p>
              <p>Created by Johnathon Crowder</p>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t flex justify-end space-x-3 transition-colors duration-300
                         ${darkMode 
                           ? 'border-dark-600 bg-dark-700/30' 
                           : 'border-gray-200 bg-gray-50/30'}`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        shadow-lg hover:shadow-xl
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;