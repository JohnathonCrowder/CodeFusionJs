import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; 2024 CodeFusion. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          {/* Update this link to point to the raw GitHub URL of your PRIVACY_POLICY.md */}
          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/PRIVACY_POLICY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Privacy Policy
          </a>
          <a
            href="https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/TERMS_OF_SERVICE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Terms of Service
          </a>
          <a
            href="https://www.johnathoncrowder.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Contact
          </a>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Developed with ❤️ by the CodeFusion Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
