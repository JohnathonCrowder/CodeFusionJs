import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaCrown, FaArrowUp, FaTimes } from "react-icons/fa";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  onUpgrade: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  description,
  onUpgrade,
  onDismiss,
  compact = false,
}) => {
  const { darkMode } = useContext(ThemeContext);

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-300
                     ${
                       darkMode
                         ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50"
                         : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                     }`}
      >
        <div className="flex items-center space-x-3">
          <FaCrown
            className={darkMode ? "text-yellow-400" : "text-yellow-600"}
          />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-dark-200" : "text-gray-700"
            }`}
          >
            Upgrade for {feature}
          </span>
        </div>
        <button
          onClick={onUpgrade}
          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors
                    ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
        >
          Upgrade
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative p-6 rounded-xl border transition-colors duration-300
                   ${
                     darkMode
                       ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50"
                       : "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200"
                   }`}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`absolute top-4 right-4 p-1 rounded transition-colors
                    ${
                      darkMode
                        ? "hover:bg-dark-600 text-dark-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-full ${
            darkMode ? "bg-yellow-600/20" : "bg-yellow-100"
          }`}
        >
          <FaCrown
            className={`h-6 w-6 ${
              darkMode ? "text-yellow-400" : "text-yellow-600"
            }`}
          />
        </div>

        <div className="flex-1">
          <h3
            className={`text-lg font-bold mb-2 ${
              darkMode ? "text-dark-100" : "text-gray-900"
            }`}
          >
            Unlock {feature}
          </h3>

          {description && (
            <p
              className={`text-sm mb-4 ${
                darkMode ? "text-dark-300" : "text-gray-600"
              }`}
            >
              {description}
            </p>
          )}

          <button
            onClick={onUpgrade}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold
                      transition-all duration-200 hover:scale-105
                      ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
          >
            <FaArrowUp className="h-4 w-4" />
            <span>Upgrade Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
