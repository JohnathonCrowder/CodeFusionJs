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
  FaCog,
  FaTimes,
  FaChevronRight,
  FaCrown,
  FaDonate
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./auth/LoginModal";
import SubscriptionBadge from "./subscription/SubscriptionBadge";
import SubscriptionModal from "./subscription/SubscriptionModal";


interface NavBarProps {
  onHelpOpen: () => void;
  onAboutOpen: () => void;
  onGitDiffOpen?: () => void;
  onAdminDashboardOpen?: () => void;
  onPromptLibraryOpen?: () => void;
  onPromptUpgraderOpen?: () => void; // Add this line
  onHomeClick?: () => void;
  onMobileMenuToggle?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  onHelpOpen, 
  onAboutOpen,
  onGitDiffOpen,
  onAdminDashboardOpen,
  onPromptLibraryOpen,
  onPromptUpgraderOpen, // Add this line
  onHomeClick,
  onMobileMenuToggle,
}) => {

  const [activeTab, setActiveTab] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentUser, userProfile, logout, isPremium, getRemainingUploads } = useAuth();

  // Better screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Navigation items with conditional rendering
  const navItems = [
    {
      icon: <FaHome />,
      label: "Home",
      key: "home",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("home");
        onHomeClick && onHomeClick();
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaRocket />,
      label: "Upgrader",
      key: "upgrader",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("upgrader");
        onPromptUpgraderOpen && onPromptUpgraderOpen();
        setShowMobileMenu(false);
      },
    },
    
    {
      icon: <FaCode />,
      label: "Prompts",
      key: "prompts",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("prompts");
        onPromptLibraryOpen && onPromptLibraryOpen();
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaCodeBranch />,
      label: "Git Diff",
      key: "gitdiff",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("gitdiff");
        onGitDiffOpen && onGitDiffOpen();
        setShowMobileMenu(false);
      },
    },
    ...(userProfile?.role === 'admin' ? [{
      icon: <FaShieldAlt />,
      label: "Admin",
      key: "admin",
      showOnMobile: true,
      badge: "Admin",
      badgeColor: "purple",
      onClick: () => {
        setActiveTab("admin");
        onAdminDashboardOpen && onAdminDashboardOpen();
        setShowMobileMenu(false);
      },
    }] : []),
    {
      icon: <FaUser />,
      label: "About",
      key: "about",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("about");
        onAboutOpen();
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      key: "github",
      showOnMobile: true,
      onClick: () => {
        window.open("https://github.com/JohnathonCrowder/CodeFusionJs", "_blank");
        setActiveTab("github");
        setShowMobileMenu(false);
      },
    },
    {
      icon: <FaQuestionCircle />,
      label: "Help",
      key: "help",
      showOnMobile: true,
      onClick: () => {
        setActiveTab("help");
        onHelpOpen();
        setShowMobileMenu(false);
      },
    },
  ];

  // Get remaining uploads for display
  const remainingUploads = currentUser ? getRemainingUploads() : 0;
  const showLowUploadsWarning = currentUser && !isPremium && remainingUploads <= 3;

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${scrolled 
                      ? darkMode 
                        ? 'bg-dark-900/98 shadow-2xl' 
                        : 'bg-white/98 shadow-lg'
                      : darkMode 
                        ? 'bg-dark-800/95' 
                        : 'bg-white/95'
                    }
                    ${darkMode 
                      ? 'backdrop-blur-xl border-b border-dark-600/50 text-dark-50'
                      : 'backdrop-blur-xl border-b border-gray-200/50 text-gray-800'
                    }`}>
        
        <div className="relative">
          {/* Desktop & Tablet Layout */}
          <div className={`flex items-center justify-between
                         ${screenSize === 'mobile' ? 'px-3 py-2' : 'px-4 sm:px-6 lg:px-8 py-3'}`}>
            
            {/* Logo Section */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setActiveTab("home");
                  onHomeClick && onHomeClick();
                }}
                className="flex items-center group transition-transform duration-200 hover:scale-105"
              >
                <FaCode className={`transition-all duration-300 
                               ${screenSize === 'mobile' ? 'h-6 w-6 mr-2' : 'h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3'}
                               ${darkMode 
                                 ? 'text-accent-500 group-hover:text-accent-400'
                                 : 'text-blue-600 group-hover:text-blue-500'}`} />
                <div className="flex items-baseline">
                  <span className={`font-bold tracking-tight
                                  ${screenSize === 'mobile' ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                    CodeFusion
                  </span>
                  <span className={`font-bold ml-0.5 transition-colors
                                  ${screenSize === 'mobile' ? 'text-lg' : 'text-xl sm:text-2xl'}
                                  ${darkMode 
                                    ? 'text-accent-500 group-hover:text-accent-400'
                                    : 'text-blue-600 group-hover:text-blue-500'}`}>
                    X
                  </span>
                </div>
              </button>
            </div>

            {/* Center Navigation - Desktop Only */}
            {screenSize === 'desktop' && (
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`relative px-4 py-2.5 rounded-lg font-medium text-sm
                              transition-all duration-200 group
                              ${activeTab === item.key
                                ? darkMode 
                                  ? "bg-accent-500/10 text-accent-400"
                                  : "bg-blue-500/10 text-blue-600"
                                : darkMode 
                                  ? "text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                              }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`transition-transform duration-200 
                                      ${activeTab === item.key ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                                        ${item.badgeColor === 'purple' 
                                          ? darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                                          : 'bg-blue-100 text-blue-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {activeTab === item.key && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                                     ${darkMode ? 'bg-accent-500' : 'bg-blue-600'}`} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Right Side Controls */}
            <div className="flex items-center">
              {/* Desktop Controls */}
              <div className={`items-center ${screenSize === 'mobile' ? 'hidden' : 'hidden sm:flex'} 
                             ${screenSize === 'tablet' ? 'space-x-2' : 'space-x-3'}`}>
                
                {/* User Info with Subscription */}
                {currentUser && screenSize === 'desktop' && (
                  <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg mr-2
                                 ${darkMode 
                                   ? 'bg-dark-700/50 text-dark-300' 
                                   : 'bg-gray-100 text-gray-700'}`}>
                    <FaUser className="h-3.5 w-3.5 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium max-w-[120px] truncate">
                          {userProfile?.displayName || userProfile?.email}
                        </span>
                        <SubscriptionBadge />
                      </div>
                      {userProfile && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs opacity-75">
                            {userProfile.subscriptionTier} plan
                          </span>
                          {!isPremium && (
                            <span className={`text-xs px-1 py-0.5 rounded
                                           ${showLowUploadsWarning 
                                             ? 'bg-orange-500/20 text-orange-400' 
                                             : 'bg-blue-500/20 text-blue-400'}`}>
                              {remainingUploads} uploads left
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upgrade Button - Desktop Only for Free Users */}
                {currentUser && !isPremium && screenSize === 'desktop' && (
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm
                              transition-all duration-200 hover:scale-105
                              ${darkMode
                                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white'
                                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white'}`}
                  >
                    <FaCrown className="h-3.5 w-3.5" />
                    <span>Upgrade</span>
                  </button>
                )}

                {/* Donation Button */}
                <button
                  onClick={() => window.open('https://github.com/sponsors/JohnathonCrowder', '_blank')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm
                            transition-all duration-200 hover:scale-105
                            ${darkMode
                              ? 'bg-pink-600 hover:bg-pink-500 text-white'
                              : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
                >
                  <FaDonate className="h-3.5 w-3.5" />
                  {screenSize === 'desktop' && <span>Donate</span>}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`relative p-2.5 rounded-lg transition-all duration-200 group
                            ${darkMode 
                              ? "hover:bg-dark-700 text-accent-400" 
                              : "hover:bg-gray-100 text-blue-600"}`}
                  aria-label="Toggle theme"
                >
                  <div className="relative">
                    {darkMode ? (
                      <FaSun className="h-5 w-5 transition-transform duration-500 group-hover: rotate-180" />
                    ) : (
                      <FaMoon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
                    )}
                  </div>
                </button>

                {/* Auth Button - Desktop/Tablet */}
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm
                              transition-all duration-200
                              ${darkMode 
                                ? "text-red-400 hover:bg-red-900/20"
                                : "text-red-600 hover:bg-red-50"}`}
                  >
                    <FaSignOutAlt />
                    {screenSize === 'desktop' && <span>Logout</span>}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm
                              transition-all duration-200
                              ${darkMode 
                                ? "bg-accent-500 hover:bg-accent-400 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    <FaSignInAlt />
                    {screenSize === 'desktop' && <span>Login</span>}
                  </button>
                )}
              </div>

              {/* Mobile/Tablet Controls */}
              <div className={`flex items-center space-x-2 ${screenSize === 'mobile' ? 'flex' : 'flex sm:hidden'}`}>
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all duration-300
                            ${darkMode 
                              ? "text-accent-400 hover:bg-dark-700" 
                              : "text-blue-600 hover:bg-gray-100"}`}
                >
                  {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
                </button>

                {/* Mobile Controls Button */}
                {onMobileMenuToggle && (
                  <button
                    onClick={onMobileMenuToggle}
                    className={`p-2 rounded-lg transition-all duration-300
                              ${darkMode
                                ? 'text-dark-200 hover:bg-dark-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaCog className="h-5 w-5" />
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className={`p-2 rounded-lg transition-all duration-300
                            ${showMobileMenu
                              ? darkMode
                                ? 'bg-dark-700 text-accent-400'
                                : 'bg-gray-100 text-blue-600'
                              : darkMode 
                                ? "text-dark-200 hover:bg-dark-700" 
                                : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <div className="relative w-5 h-5">
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300
                                    ${showMobileMenu ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
                      <FaTimes className="h-5 w-5" />
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300
                                    ${showMobileMenu ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
                      <FaBars className="h-5 w-5" />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Tablet Navigation - Horizontal Scroll */}
          {screenSize === 'tablet' && (
            <div className={`px-4 pb-2 -mt-1 overflow-x-auto scrollbar-hide
                           ${darkMode ? 'bg-dark-800/95' : 'bg-white/95'}`}>
              <div className="flex items-center space-x-2 min-w-max">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium
                              whitespace-nowrap transition-all duration-200
                              ${activeTab === item.key
                                ? darkMode 
                                  ? "bg-accent-500/20 text-accent-400"
                                  : "bg-blue-500/20 text-blue-600"
                                : darkMode 
                                  ? "text-dark-300 hover:text-dark-100"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                                      ${item.badgeColor === 'purple' 
                                        ? darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-px overflow-hidden
                       ${darkMode 
                         ? 'bg-gradient-to-r from-transparent via-accent-500/30 to-transparent'
                         : 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent'}`}>
          <div className={`h-full w-full transform transition-transform duration-1000
                         ${scrolled ? 'translate-x-0' : '-translate-x-full'}
                         ${darkMode ? 'bg-accent-500/50' : 'bg-blue-500/50'}`} />
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div className={`fixed inset-0 z-50 pointer-events-none`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300
                     ${showMobileMenu ? 'opacity-50 pointer-events-auto' : 'opacity-0'}`}
          onClick={() => setShowMobileMenu(false)}
        />
        
        {/* Menu Panel */}
        <div 
          ref={mobileMenuRef}
          className={`absolute right-0 top-0 h-full w-full max-w-sm pointer-events-auto
                     transform transition-transform duration-300 ease-out
                     ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}
                     ${darkMode 
                       ? 'bg-dark-800 shadow-2xl' 
                       : 'bg-white shadow-2xl'}`}
        >
          {/* Menu Header */}
          <div className={`p-4 border-b
                         ${darkMode ? 'border-dark-600 bg-dark-700/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold
                            ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Menu
              </h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className={`p-2 rounded-lg transition-colors
                          ${darkMode 
                            ? 'hover:bg-dark-600 text-dark-300' 
                            : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User Section */}
          {currentUser && (
            <div className={`p-4 border-b
                           ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg
                             ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
                <div className={`p-2 rounded-full
                               ${darkMode ? 'bg-dark-600' : 'bg-gray-200'}`}>
                  <FaUser className={`h-5 w-5
                                    ${darkMode ? 'text-dark-300' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className={`font-medium truncate
                                 ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      {userProfile?.displayName || 'User'}
                    </p>
                    <SubscriptionBadge />
                  </div>
                  <p className={`text-sm truncate
                               ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    {userProfile?.email}
                  </p>
                  {!isPremium && (
                    <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block
                                 ${showLowUploadsWarning 
                                   ? 'bg-orange-500/20 text-orange-400' 
                                   : 'bg-blue-500/20 text-blue-400'}`}>
                      {remainingUploads} uploads remaining
                    </p>
                  )}
                </div>
              </div>
              
              {/* Mobile Upgrade Button */}
              {!isPremium && (
                <button
                  onClick={() => {
                    setShowSubscriptionModal(true);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full mt-3 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                            font-medium transition-all duration-200
                            ${darkMode 
                              ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white'}`}
                >
                  <FaCrown />
                  <span>Upgrade to Pro</span>
                </button>
              )}
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg
                            transition-all duration-200 group
                            ${activeTab === item.key
                              ? darkMode 
                                ? "bg-accent-500/20 text-accent-400 border border-accent-600/30"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                              : darkMode 
                                ? "text-dark-200 hover:bg-dark-700 hover:text-dark-100"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg
                                    ${activeTab === item.key ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                                      ${item.badgeColor === 'purple' 
                                        ? darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  <FaChevronRight className={`h-4 w-4 transition-transform duration-200
                                            ${darkMode ? 'text-dark-500' : 'text-gray-400'}
                                            group-hover:translate-x-1`} />
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className={`p-4 border-t space-y-2
                         ${darkMode ? 'border-dark-600 bg-dark-700/50' : 'border-gray-200 bg-gray-50'}`}>
            
            {/* Donation Button - Mobile */}
            <button
              onClick={() => {
                window.open('https://github.com/sponsors/JohnathonCrowder', '_blank');
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                        font-medium transition-all duration-200
                        ${darkMode 
                          ? "bg-pink-600 hover:bg-pink-500 text-white"
                          : "bg-pink-500 hover:bg-pink-600 text-white"}`}
            >
              <FaDonate />
              <span>Support CodeFusion</span>
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                          font-medium transition-all duration-200
                          ${darkMode 
                            ? "bg-red-900/20 text-red-400 hover:bg-red-900/30"
                            : "bg-red-50 text-red-600 hover:bg-red-100"}`}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                          font-medium transition-all duration-200
                          ${darkMode 
                            ? "bg-accent-500 hover:bg-accent-400 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
    </>
  );
};

export default NavBar;