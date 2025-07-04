import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FaHeart,
  FaGithub,
  FaExternalLinkAlt,
  FaEnvelope,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { emailService } from "../../services/emailService";

const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await emailService.addEmail({
        email: email.toLowerCase().trim(),
        source: "footer",
        subscribed: true,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
        },
      });

      setSubmitStatus("success");
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(
        error.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className={`relative p-6 text-center transition-colors duration-300 mt-0
                      ${
                        darkMode
                          ? "bg-dark-800 border-t border-dark-600"
                          : "bg-gray-50 border-t border-gray-200"
                      }`}
    >
      {/* Subtle gradient border at the top */}
      <div
        className={`absolute top-0 left-0 w-full h-[2px] transition-opacity duration-300
                     ${
                       darkMode
                         ? "bg-gradient-to-r from-transparent via-accent-500/30 to-transparent"
                         : "bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                     }`}
      ></div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Signup Section */}
        <div
          className={`mb-8 p-6 rounded-xl border transition-colors duration-300
                       ${
                         darkMode
                           ? "bg-dark-700/50 border-dark-600"
                           : "bg-white/50 border-gray-200"
                       }`}
        >
          <div className="max-w-md mx-auto">
            <h3
              className={`text-xl font-bold mb-2 transition-colors duration-300
                           ${darkMode ? "text-dark-100" : "text-gray-900"}`}
            >
              Stay Updated
            </h3>
            <p
              className={`text-sm mb-4 transition-colors duration-300
                         ${darkMode ? "text-dark-300" : "text-gray-600"}`}
            >
              Get notified about new features, updates, and coding tips
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <FaEnvelope
                  className={`absolute left-3 top-3.5 h-4 w-4
                                       ${
                                         darkMode
                                           ? "text-dark-400"
                                           : "text-gray-400"
                                       }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${
                              darkMode
                                ? "bg-dark-600 border-dark-500 text-dark-100 placeholder-dark-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            } ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200
                          flex items-center justify-center space-x-2 min-w-[120px]
                          ${
                            isSubmitting || !email.trim()
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:scale-105"
                          }
                          ${
                            submitStatus === "success"
                              ? darkMode
                                ? "bg-green-600 text-white"
                                : "bg-green-600 text-white"
                              : submitStatus === "error"
                              ? darkMode
                                ? "bg-red-600 text-white"
                                : "bg-red-600 text-white"
                              : darkMode
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <FaCheck className="h-4 w-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope className="h-4 w-4" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>

            {submitStatus === "error" && errorMessage && (
              <p
                className={`mt-2 text-sm transition-colors duration-300
                           ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                {errorMessage}
              </p>
            )}

            {submitStatus === "success" && (
              <p
                className={`mt-2 text-sm transition-colors duration-300
                           ${darkMode ? "text-green-400" : "text-green-600"}`}
              >
                Thank you for subscribing! We'll keep you updated.
              </p>
            )}
          </div>
        </div>

        {/* Main Footer Text */}
        <div className="mb-4">
          <p
            className={`text-lg font-semibold transition-colors duration-300
                       ${darkMode ? "text-dark-100" : "text-gray-800"}`}
          >
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
                      ${
                        darkMode
                          ? "text-dark-300 hover:text-dark-50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
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
                      ${
                        darkMode
                          ? "text-dark-300 hover:text-dark-50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
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
                      ${
                        darkMode
                          ? "text-dark-300 hover:text-dark-50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
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
                      ${
                        darkMode
                          ? "text-dark-300 hover:text-dark-50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
          >
            <FaGithub className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Developer Credit */}
        <div
          className={`flex items-center justify-center space-x-2 text-sm transition-colors duration-300
                       ${darkMode ? "text-dark-400" : "text-gray-500"}`}
        >
          <span>Developed with</span>
          <FaHeart
            className={`h-4 w-4 transition-colors duration-300
                             ${darkMode ? "text-red-400" : "text-red-500"}`}
          />
          <span>by the CodeFusion Team</span>
        </div>

        {/* Version or Additional Info (Optional) */}
        <div
          className={`mt-3 text-xs transition-colors duration-300
                       ${darkMode ? "text-dark-500" : "text-gray-400"}`}
        >
          <p>Empowering developers with better code management tools</p>
        </div>
      </div>

      {/* Subtle background pattern (optional) */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-5
                     ${darkMode ? "bg-dark-700" : "bg-gray-100"}`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${
              darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"
            } 0%, transparent 50%), 
                                radial-gradient(circle at 80% 50%, ${
                                  darkMode
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : "rgba(59, 130, 246, 0.05)"
                                } 0%, transparent 50%)`,
          }}
        ></div>
      </div>
    </footer>
  );
};

export default Footer;
