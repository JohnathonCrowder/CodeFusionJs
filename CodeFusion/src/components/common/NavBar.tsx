import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaHome,
  FaGithub,
  FaQuestionCircle,
  FaCode,
  FaMoon,
  FaSun,
  FaUser,
  FaCodeBranch,
  FaSignInAlt,
  FaSignOutAlt,
  FaShieldAlt,
  FaBars,
  FaRocket,
  FaTimes,
  FaChevronDown,
  FaCrown,
  FaDonate,
  FaFileUpload,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../modals/auth/LoginModal";
import SubscriptionBadge from "../subscription/SubscriptionBadge";
import SubscriptionModal from "../modals/subscription/SubscriptionModal";

interface NavBarProps {
  onHelpOpen: () => void;
  onAboutOpen: () => void;
  onGitDiffOpen?: () => void;
  onAdminDashboardOpen?: () => void;
  onPromptLibraryOpen?: () => void;
  onPromptUpgraderOpen?: () => void;
  onHomeClick?: () => void;
  onDirectoryConverterOpen?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  onHelpOpen,
  onAboutOpen,
  onGitDiffOpen,
  onAdminDashboardOpen,
  onPromptLibraryOpen,
  onPromptUpgraderOpen,
  onHomeClick,
  onDirectoryConverterOpen,
}) => {
  const [activeTab, setActiveTab] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentUser, userProfile, logout, isPremium, getRemainingUploads } =
    useAuth();

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowToolsDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
      setShowUserDropdown(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Core navigation items (always visible)
  const coreNavItems = [
    {
      icon: <FaHome />,
      label: "Home",
      key: "home",
      onClick: () => {
        setActiveTab("home");
        onHomeClick?.();
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaCode />,
      label: "Tools",
      key: "tools",
      isDropdown: true,
      onClick: () => setShowToolsDropdown(!showToolsDropdown),
    },
  ];

  // Tool dropdown items
  const toolItems = [
    {
      icon: <FaFileUpload />,
      label: "Directory Converter",
      key: "converter",
      onClick: () => {
        setActiveTab("converter");
        onDirectoryConverterOpen?.();
        setShowToolsDropdown(false);
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaRocket />,
      label: "Prompt Upgrader",
      key: "upgrader",
      onClick: () => {
        setActiveTab("upgrader");
        onPromptUpgraderOpen?.();
        setShowToolsDropdown(false);
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaCode />,
      label: "Prompt Library",
      key: "prompts",
      onClick: () => {
        setActiveTab("prompts");
        onPromptLibraryOpen?.();
        setShowToolsDropdown(false);
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaCodeBranch />,
      label: "Git Diff Visualizer",
      key: "gitdiff",
      onClick: () => {
        setActiveTab("gitdiff");
        onGitDiffOpen?.();
        setShowToolsDropdown(false);
        setShowMobileMenu(false);
      },
    },
  ];

  // Secondary navigation items
  const secondaryItems = [
    {
      icon: <FaGithub />,
      label: "GitHub",
      key: "github",
      onClick: () => {
        window.open(
          "https://github.com/JohnathonCrowder/CodeFusionJs",
          "_blank"
        );
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaQuestionCircle />,
      label: "Help",
      key: "help",
      onClick: () => {
        onHelpOpen();
        setShowMobileMenu(false);
      },
    },
  ];

  // User dropdown items
  const userDropdownItems = [
    ...(userProfile?.role === "admin"
      ? [
          {
            icon: <FaShieldAlt />,
            label: "Admin Dashboard",
            key: "admin",
            onClick: () => {
              setActiveTab("admin");
              onAdminDashboardOpen?.();
              setShowUserDropdown(false);
            },
          },
        ]
      : []),
    {
      icon: <FaUser />,
      label: "About",
      key: "about",
      onClick: () => {
        onAboutOpen();
        setShowUserDropdown(false);
      },
    },
    ...(currentUser && !isPremium
      ? [
          {
            icon: <FaCrown />,
            label: "Upgrade to Pro",
            key: "upgrade",
            className: "text-yellow-500 hover:text-yellow-400",
            onClick: () => {
              setShowSubscriptionModal(true);
              setShowUserDropdown(false);
            },
          },
        ]
      : []),
    {
      icon: <FaDonate />,
      label: "Support Project",
      key: "donate",
      className: "text-pink-500 hover:text-pink-400",
      onClick: () => {
        window.open("https://github.com/sponsors/JohnathonCrowder", "_blank");
        setShowUserDropdown(false);
      },
    },
  ];

  const remainingUploads = currentUser ? getRemainingUploads() : 0;
  const showLowUploadsWarning =
    currentUser && !isPremium && remainingUploads <= 3;

  return (
    <>
      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${
                      scrolled
                        ? darkMode
                          ? "bg-dark-900/95 backdrop-blur-xl shadow-2xl border-b border-dark-600/50"
                          : "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
                        : darkMode
                        ? "bg-dark-800/90 backdrop-blur-md"
                        : "bg-white/90 backdrop-blur-md"
                    }
                    ${darkMode ? "text-dark-50" : "text-gray-800"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setActiveTab("home");
                  onHomeClick?.();
                }}
                className="flex items-center group transition-transform duration-200 hover:scale-105"
              >
                <FaCode
                  className={`h-8 w-8 mr-3 transition-all duration-300 
                               ${
                                 darkMode
                                   ? "text-accent-500 group-hover:text-accent-400"
                                   : "text-blue-600 group-hover:text-blue-500"
                               }`}
                />
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold tracking-tight">
                    CodeFusion
                  </span>
                  <span
                    className={`text-2xl font-bold ml-0.5 transition-colors
                                  ${
                                    darkMode
                                      ? "text-accent-500 group-hover:text-accent-400"
                                      : "text-blue-600 group-hover:text-blue-500"
                                  }`}
                  >
                    X
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {coreNavItems.map((item) => (
                <div
                  key={item.key}
                  className="relative"
                  ref={item.key === "tools" ? toolsDropdownRef : undefined}
                >
                  <button
                    onClick={item.onClick}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                              transition-all duration-200 group
                              ${
                                activeTab === item.key ||
                                (item.key === "tools" && showToolsDropdown)
                                  ? darkMode
                                    ? "bg-accent-500/10 text-accent-400"
                                    : "bg-blue-500/10 text-blue-600"
                                  : darkMode
                                  ? "text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                              }`}
                  >
                    <span className="transition-transform duration-200 group-hover:scale-105">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.isDropdown && (
                      <FaChevronDown
                        className={`h-3 w-3 transition-transform duration-200
                                               ${
                                                 showToolsDropdown
                                                   ? "rotate-180"
                                                   : ""
                                               }`}
                      />
                    )}
                  </button>

                  {/* Tools Dropdown */}
                  {item.isDropdown && showToolsDropdown && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl z-50
                                   ${
                                     darkMode
                                       ? "bg-dark-800 border border-dark-600"
                                       : "bg-white border border-gray-200"
                                   }`}
                    >
                      <div className="py-2">
                        {toolItems.map((toolItem) => (
                          <button
                            key={toolItem.key}
                            onClick={toolItem.onClick}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left
                                      transition-colors duration-200
                                      ${
                                        darkMode
                                          ? "hover:bg-dark-700 text-dark-200 hover:text-dark-100"
                                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                      }`}
                          >
                            <span className="text-sm">{toolItem.icon}</span>
                            <span className="text-sm font-medium">
                              {toolItem.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Secondary Items */}
              {secondaryItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`p-2 rounded-lg transition-all duration-200
                            ${
                              darkMode
                                ? "text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                            }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-200
                          ${
                            darkMode
                              ? "hover:bg-dark-700 text-accent-400"
                              : "hover:bg-gray-100 text-blue-600"
                          }`}
                title="Toggle theme"
              >
                {darkMode ? (
                  <FaSun className="h-5 w-5" />
                ) : (
                  <FaMoon className="h-5 w-5" />
                )}
              </button>

              {/* User Section */}
              {currentUser ? (
                <div className="hidden md:block relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                              ${
                                showUserDropdown
                                  ? darkMode
                                    ? "bg-dark-700 text-accent-400"
                                    : "bg-gray-100 text-blue-600"
                                  : darkMode
                                  ? "hover:bg-dark-700 text-dark-300"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                  >
                    <FaUser className="h-4 w-4" />
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {userProfile?.displayName || "User"}
                    </span>
                    <SubscriptionBadge />
                    {!isPremium && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full
                                     ${
                                       showLowUploadsWarning
                                         ? "bg-orange-500/20 text-orange-400"
                                         : "bg-blue-500/20 text-blue-400"
                                     }`}
                      >
                        {remainingUploads}
                      </span>
                    )}
                    <FaChevronDown
                      className={`h-3 w-3 transition-transform duration-200
                                             ${
                                               showUserDropdown
                                                 ? "rotate-180"
                                                 : ""
                                             }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div
                      className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl z-50
                                   ${
                                     darkMode
                                       ? "bg-dark-800 border border-dark-600"
                                       : "bg-white border border-gray-200"
                                   }`}
                    >
                      <div className="py-2">
                        {userDropdownItems.map((item) => (
                          <button
                            key={item.key}
                            onClick={item.onClick}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left
                                      transition-colors duration-200
                                      ${
                                        item.className ||
                                        (darkMode
                                          ? "hover:bg-dark-700 text-dark-200 hover:text-dark-100"
                                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900")
                                      }`}
                          >
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </button>
                        ))}

                        <hr
                          className={`my-2 ${
                            darkMode ? "border-dark-600" : "border-gray-200"
                          }`}
                        />

                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left
                                    transition-colors duration-200
                                    ${
                                      darkMode
                                        ? "hover:bg-red-900/20 text-red-400"
                                        : "hover:bg-red-50 text-red-600"
                                    }`}
                        >
                          <FaSignOutAlt className="text-sm" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                            transition-all duration-200
                            ${
                              darkMode
                                ? "bg-accent-500 hover:bg-accent-400 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden p-2 rounded-lg transition-all duration-200
                          ${
                            darkMode
                              ? "text-dark-200 hover:bg-dark-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
              >
                {showMobileMenu ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div
            ref={mobileMenuRef}
            className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] transform transition-transform duration-300
                       ${darkMode ? "bg-dark-800" : "bg-white"} shadow-2xl`}
          >
            {/* Mobile Menu Header */}
            <div
              className={`p-4 border-b ${
                darkMode ? "border-dark-600" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-lg font-semibold ${
                    darkMode ? "text-dark-100" : "text-gray-900"
                  }`}
                >
                  Menu
                </h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className={`p-2 rounded-lg ${
                    darkMode ? "hover:bg-dark-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* User Section */}
            {currentUser && (
              <div
                className={`p-4 border-b ${
                  darkMode ? "border-dark-600" : "border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg
                               ${darkMode ? "bg-dark-700" : "bg-gray-100"}`}
                >
                  <FaUser className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium truncate">
                        {userProfile?.displayName || "User"}
                      </span>
                      <SubscriptionBadge />
                    </div>
                    <p
                      className={`text-sm truncate ${
                        darkMode ? "text-dark-400" : "text-gray-500"
                      }`}
                    >
                      {userProfile?.email}
                    </p>
                    {!isPremium && (
                      <p
                        className={`text-xs mt-1 px-2 py-1 rounded-full inline-block
                                   ${
                                     showLowUploadsWarning
                                       ? "bg-orange-500/20 text-orange-400"
                                       : "bg-blue-500/20 text-blue-400"
                                   }`}
                      >
                        {remainingUploads} uploads left
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-3 space-y-1">
                {/* Core Items */}
                {coreNavItems
                  .filter((item) => !item.isDropdown)
                  .map((item) => (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                              transition-all duration-200
                              ${
                                activeTab === item.key
                                  ? darkMode
                                    ? "bg-accent-500/20 text-accent-400"
                                    : "bg-blue-50 text-blue-600"
                                  : darkMode
                                  ? "text-dark-200 hover:bg-dark-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}

                {/* Tool Items */}
                <div
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider
                               ${darkMode ? "text-dark-400" : "text-gray-500"}`}
                >
                  Tools
                </div>
                {toolItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                              transition-all duration-200
                              ${
                                activeTab === item.key
                                  ? darkMode
                                    ? "bg-accent-500/20 text-accent-400"
                                    : "bg-blue-50 text-blue-600"
                                  : darkMode
                                  ? "text-dark-200 hover:bg-dark-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                {/* Secondary Items */}
                <div
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider
                               ${darkMode ? "text-dark-400" : "text-gray-500"}`}
                >
                  More
                </div>
                {[...secondaryItems, ...userDropdownItems].map((item) => (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                              transition-all duration-200
                              ${
                                (item as any).className ||
                                (darkMode
                                  ? "text-dark-200 hover:bg-dark-700"
                                  : "text-gray-700 hover:bg-gray-50")
                              }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            {currentUser ? (
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-dark-600" : "border-gray-200"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                            font-medium transition-all duration-200
                            ${
                              darkMode
                                ? "bg-red-900/20 text-red-400 hover:bg-red-900/30"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-dark-600" : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                            font-medium transition-all duration-200
                            ${
                              darkMode
                                ? "bg-accent-500 hover:bg-accent-400 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default NavBar;
