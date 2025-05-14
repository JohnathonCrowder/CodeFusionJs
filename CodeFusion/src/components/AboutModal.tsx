import React from "react";
import { FaTimes, FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Header Image/Banner - Replace URL with your own banner image */}
          <div 
            className="h-48 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1605379399843-5870eea9b74e?q=80&w=2000&auto=format&fit=crop')`
            }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-8">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8 -mt-20">
              {/* Profile Image */}
              <div className="relative">
                {/* Replace this URL with your profile picture */}
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop" 
                  alt="Profile Picture" 
                  className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              
              {/* Name & Title */}
              <div className="md:ml-6 mt-4 md:mt-6 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alex Morgan</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Full Stack Developer & Creator of CodeFusion</p>
                
                {/* Social Links */}
                <div className="flex space-x-3 mt-4 justify-center md:justify-start">
                  <a href="https://github.com/alexmorgan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <FaGithub size={22} />
                  </a>
                  <a href="https://twitter.com/alexmorgan" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    <FaTwitter size={22} />
                  </a>
                  <a href="https://linkedin.com/in/alexmorgan" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300">
                    <FaLinkedin size={22} />
                  </a>
                  <a href="mailto:alex@example.com" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <FaEnvelope size={22} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* About Me Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md mr-3">
                  <FaCode className="text-blue-600 dark:text-blue-400" />
                </span>
                About Me
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Hello! I'm Alex, a passionate software engineer with over 8 years of experience building web applications
                  and developer tools. I created CodeFusion to solve a problem I frequently encountered: needing to
                  share code snippets while maintaining privacy and control over what gets shared.
                </p>
                <p>
                  My background spans full-stack development, with a particular focus on React, TypeScript, and 
                  cloud infrastructure. I've worked at companies ranging from early-stage startups to larger 
                  tech organizations, where I developed a keen eye for developer experience and productivity tools.
                </p>
                <p>
                  When I'm not coding, you can find me hiking in the mountains, playing guitar, or experimenting
                  with new programming languages. I'm particularly interested in WebAssembly, Rust, and the
                  future of web development.
                </p>
              </div>
            </div>
            
            {/* CodeFusion Project */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">The CodeFusion Story</h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="text-gray-600 dark:text-gray-300 space-y-4">
                  <p>
                    CodeFusion began as a weekend project in 2023 when I needed a better way to share code 
                    with my team while protecting sensitive information. The existing tools either lacked 
                    privacy features or were too cumbersome to use.
                  </p>
                  <p>
                    Built with React, TypeScript and Tailwind CSS, CodeFusion focuses on being lightweight,
                    privacy-focused, and developer-friendly. The project grew from a simple file viewer to a
                    comprehensive tool with features like:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Smart project structure recognition</li>
                    <li>Automatic privacy protection (name anonymization)</li>
                    <li>Dark mode for late-night coding sessions</li>
                    <li>Selective file inclusion</li>
                    <li>Customizable formatting options</li>
                  </ul>
                  <p className="pt-2">
                    CodeFusion is and will always remain open-source. I believe in building tools that respect
                    developer privacy while making our lives easier. I welcome contributions and feedback from
                    the community!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Technical Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "React", level: 95 },
                  { name: "TypeScript", level: 90 },
                  { name: "Node.js", level: 85 },
                  { name: "Tailwind CSS", level: 92 },
                  { name: "Python", level: 80 },
                  { name: "AWS", level: 75 },
                  { name: "Docker", level: 82 },
                  { name: "GraphQL", level: 78 }
                ].map((skill, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between mb-1 text-sm font-medium">
                      <span className="text-gray-700 dark:text-gray-200">{skill.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 px-8 py-6 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Alex Morgan. All rights reserved.  
            </p>
            <div className="mt-4 md:mt-0">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;