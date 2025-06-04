import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaHeart, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer className={`relative p-6 text-center transition-colors duration-300 mt-0
                      ${darkMode 
                        ? 'bg-dark-800 border-t border-dark-600' 
                        : 'bg-gray-50 border-t border-gray-200'}`}>
      
      {/* Subtle gradient border at the top */}
      <div className={`absolute top-0 left-0 w-full h-[2px] transition-opacity duration-300
                     ${darkMode 
                       ? 'bg-gradient-to-r from-transparent via-accent-500/30 to-transparent' 
                       : 'bg-gradient-to-r from-transparent via-blue-400/20 to-transparent'}`}></div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto">
        
        {/* Main Footer Text */}
        <div className="mb-4">
          <p className={`text-lg font-semibold transition-colors duration-300
                       ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
            &copy; 2024 CodeFusion. All rights reserved.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 mb-4">
          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/PRIVACY_POLICY.md"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300
                      hover:scale-105 group
                      ${darkMode 
                        ? 'text-dark-300 hover:text-dark-50' 
                        : 'text-gray-600 hover:text-gray-900'}`}
          >
            <span>Privacy Policy</span>
            <FaExternalLinkAlt className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/TERMS_OF_SERVICE.md"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300
                      hover:scale-105 group
                      ${darkMode 
                        ? 'text-dark-300 hover:text-dark-50' 
                        : 'text-gray-600 hover:text-gray-900'}`}
          >
            <span>Terms of Service</span>
            <FaExternalLinkAlt className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="https://www.johnathoncrowder.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300
                      hover:scale-105 group
                      ${darkMode 
                        ? 'text-dark-300 hover:text-dark-50' 
                        : 'text-gray-600 hover:text-gray-900'}`}
          >
            <span>Contact</span>
            <FaExternalLinkAlt className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300
                      hover:scale-105 group
                      ${darkMode 
                        ? 'text-dark-300 hover:text-dark-50' 
                        : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FaGithub className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Developer Credit */}
        <div className={`flex items-center justify-center space-x-2 text-sm transition-colors duration-300
                       ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
          <span>Developed with</span>
          <FaHeart className={`h-4 w-4 transition-colors duration-300
                             ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          <span>by the CodeFusion Team</span>
        </div>

        {/* Version or Additional Info (Optional) */}
        <div className={`mt-3 text-xs transition-colors duration-300
                       ${darkMode ? 'text-dark-500' : 'text-gray-400'}`}>
          <p>Empowering developers with better code management tools</p>
        </div>
      </div>

      {/* Subtle background pattern (optional) */}
      <div className={`absolute inset-0 pointer-events-none opacity-5
                     ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, ${darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 0%, transparent 50%), 
                                radial-gradient(circle at 80% 50%, ${darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 0%, transparent 50%)`
             }}>
        </div>
      </div>
    </footer>
  );
};

export default Footer;