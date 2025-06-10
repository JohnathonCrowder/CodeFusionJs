import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCrown, 
  FaLock, 
  FaRocket, 
  FaChartBar, 
  FaPalette,
  FaBrain,
  FaShieldAlt,
  FaUsers,
  FaCode,
  FaCheckCircle
} from 'react-icons/fa';
import SubscriptionModal from './SubscriptionModal';

const UsageIndicator: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userProfile, isPremium } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (!userProfile) return null;

  // Premium feature list for different tiers
  const premiumFeatures = {
    pro: [
      { icon: <FaBrain className="h-4 w-4" />, text: 'AI Code Insights', id: 'ai-insights' },
      { icon: <FaPalette className="h-4 w-4" />, text: 'Custom Themes', id: 'themes' },
      { icon: <FaShieldAlt className="h-4 w-4" />, text: 'Advanced Privacy', id: 'advanced-privacy' }
    ],
    team: [
      { icon: <FaUsers className="h-4 w-4" />, text: 'Team Collaboration', id: 'collaboration' },
      { icon: <FaChartBar className="h-4 w-4" />, text: 'Team Analytics', id: 'analytics' },
      { icon: <FaCode className="h-4 w-4" />, text: 'API Access', id: 'api-access' }
    ]
  };

  // For premium users, show their active features
  if (isPremium) {
    const tierFeatures = userProfile.subscriptionTier === 'team' 
      ? [...premiumFeatures.pro, ...premiumFeatures.team]
      : userProfile.subscriptionTier === 'enterprise'
      ? [...premiumFeatures.pro, ...premiumFeatures.team]
      : premiumFeatures.pro;

    return (
      <div className={`p-4 rounded-lg border transition-colors duration-300
                     ${darkMode 
                       ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-600/30' 
                       : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'}`}>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FaCrown className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`text-sm font-bold ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
              {userProfile.subscriptionTier.charAt(0).toUpperCase() + userProfile.subscriptionTier.slice(1)} Account
            </span>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors
                      ${darkMode 
                        ? 'hover:bg-dark-600 text-dark-300' 
                        : 'hover:bg-gray-100 text-gray-600'}`}
          >
            Manage
          </button>
        </div>

        <div className="space-y-2">
          <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Active Features:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {tierFeatures.slice(0, 3).map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <FaCheckCircle className={`h-3 w-3 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-xs ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
          {tierFeatures.length > 3 && (
            <div className={`text-xs text-center pt-1 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
              +{tierFeatures.length - 3} more features
            </div>
          )}
        </div>

        {/* Premium Benefits Display */}
        <div className={`mt-3 pt-3 border-t text-xs
                       ${darkMode ? 'border-dark-600 text-dark-400' : 'border-gray-200 text-gray-500'}`}>
          <div className="flex items-center space-x-1">
            <FaRocket className="h-3 w-3" />
            <span>Unlimited uploads • No restrictions</span>
          </div>
        </div>
      </div>
    );
  }

  // For free users, show upgrade prompt
  return (
    <>
      <div className={`p-4 rounded-lg border transition-colors duration-300
                     ${darkMode 
                       ? 'bg-dark-700 border-dark-600' 
                       : 'bg-gray-50 border-gray-200'}`}>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-dark-600' : 'bg-gray-100'}`}>
              <FaLock className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <span className={`text-sm font-medium ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              Free Account
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full
                          ${darkMode 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-green-100 text-green-700'}`}>
            Unlimited Files
          </span>
        </div>

        <div className={`text-sm mb-3 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
          You're using the free version with unlimited file uploads!
        </div>

        {/* Show locked premium features */}
        <div className={`space-y-2 p-3 rounded-lg mb-3
                       ${darkMode ? 'bg-dark-600/50' : 'bg-gray-100/50'}`}>
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
            Unlock Premium Features:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {premiumFeatures.pro.slice(0, 3).map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2 opacity-75">
                <div className={`${darkMode ? 'text-dark-500' : 'text-gray-400'}`}>
                  {feature.icon}
                </div>
                <span className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  {feature.text}
                </span>
                <FaLock className={`h-2.5 w-2.5 ml-auto ${darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowSubscriptionModal(true)}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    transform hover:scale-[1.02] hover:shadow-lg
                    ${darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaCrown className="h-4 w-4" />
            <span>Unlock Pro Features</span>
          </div>
        </button>

        {/* Subtle benefit reminder */}
        <div className={`mt-3 text-center text-xs ${darkMode ? 'text-dark-500' : 'text-gray-400'}`}>
          Starting at just $9/month
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default UsageIndicator;