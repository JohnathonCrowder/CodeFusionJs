import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaCrown, FaUsers, FaRocket } from 'react-icons/fa';

const SubscriptionBadge: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userProfile } = useAuth();

  if (!userProfile || userProfile.subscriptionTier === 'free') return null;

  const getBadgeConfig = () => {
    switch (userProfile.subscriptionTier) {
      case 'pro':
        return {
          icon: <FaCrown className="h-3 w-3" />,
          label: 'Pro',
          className: darkMode 
            ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' 
            : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900'
        };
      case 'team':
        return {
          icon: <FaUsers className="h-3 w-3" />,
          label: 'Team',
          className: darkMode 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-blue-400 text-blue-900'
        };
      case 'enterprise':
        return {
          icon: <FaRocket className="h-3 w-3" />,
          label: 'Enterprise',
          className: darkMode 
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
            : 'bg-gradient-to-r from-purple-500 to-purple-400 text-purple-900'
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default SubscriptionBadge;