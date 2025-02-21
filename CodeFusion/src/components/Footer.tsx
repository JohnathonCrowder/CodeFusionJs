import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gray-800 dark:bg-gray-900 text-white py-6 text-center">
      {/* Subtle Gradient Border - more muted colors */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r 
                    from-gray-600/40 via-blue-400/30 to-gray-600/40 
                    dark:from-gray-700/50 dark:via-blue-700/40 dark:to-gray-700/50"></div>
      
      {/* Very subtle highlight line */}
      <div className="absolute top-[2px] left-0 w-full h-[1px] bg-white/5"></div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 pt-3">
        <p className="text-lg font-semibold">&copy; 2024 CodeFusion. All rights reserved.</p>
        <div className="mt-4 space-x-6 flex justify-center">
          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/PRIVACY_POLICY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/TERMS_OF_SERVICE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="https://www.johnathoncrowder.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
          >
            Contact 
          </a>
        </div>
        <div className="mt-4 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center">
          <span>Developed with </span>
          <span className="mx-1 text-red-500/70">❤️</span>
          <span>by the CodeFusion Team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;