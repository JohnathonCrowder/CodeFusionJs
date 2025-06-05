import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTimes, 
  FaCheck, 
  FaCrown, 
  FaUsers, 
  FaRocket,
  FaCloudUploadAlt,
  FaFileCode,
  FaBrain,
  FaHistory,
  FaShieldAlt
} from 'react-icons/fa';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { darkMode } = useContext(ThemeContext);
  const { userProfile, upgradeTo } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      icon: <FaCloudUploadAlt className="h-6 w-6" />,
      color: darkMode ? 'text-gray-400' : 'text-gray-600',
      bgColor: darkMode ? 'bg-dark-600' : 'bg-gray-100',
      features: [
        '10 uploads per day',
        '5MB file size limit', 
        '50 files per directory',
        'Basic code analysis',
        'Community support'
      ],
      limitations: [
        'No project history',
        'No AI insights',
        'No team features'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9',
      period: 'month',
      icon: <FaCrown className="h-6 w-6" />,
      color: 'text-yellow-500',
      bgColor: darkMode ? 'bg-yellow-600' : 'bg-yellow-500',
      popular: true,
      features: [
        '100 uploads per day',
        '50MB file size limit',
        '500 files per directory', 
        'AI code insights',
        'Project history',
        'Advanced analysis',
        'Priority support'
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: '$29',
      period: 'month',
      icon: <FaUsers className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: darkMode ? 'bg-blue-600' : 'bg-blue-500',
      features: [
        '500 uploads per day',
        '100MB file size limit',
        '1000 files per directory',
        'Team workspaces',
        'Collaboration tools',
        'Shared projects',
        'Team analytics',
        'Dedicated support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      icon: <FaRocket className="h-6 w-6" />,
      color: 'text-purple-500',
      bgColor: darkMode ? 'bg-purple-600' : 'bg-purple-500',
      features: [
        'Unlimited uploads',
        '500MB file size limit',
        '5000 files per directory',
        'API access',
        'Custom integrations',
        'SSO support',
        'Advanced security',
        'Dedicated account manager'
      ]
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === userProfile?.subscriptionTier) return;
    
    setUpgrading(planId);
    try {
      await upgradeTo(planId as 'pro' | 'team' | 'enterprise');
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl shadow-2xl max-w-6xl w-full transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-3xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Choose Your Plan
                </h2>
                <p className={`mt-2 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Unlock more features and higher limits
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200
                          ${darkMode
                            ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="p-6">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              {plans.map((plan) => {
                const isCurrent = plan.id === userProfile?.subscriptionTier;
                const canUpgrade = plan.id !== 'free' && plan.id !== userProfile?.subscriptionTier;
                const isUpgrading = upgrading === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300
                              ${isCurrent
                                ? darkMode
                                  ? 'border-green-500 bg-green-900/20'
                                  : 'border-green-500 bg-green-50'
                                : plan.popular
                                  ? darkMode
                                    ? 'border-yellow-500 bg-yellow-900/20'
                                    : 'border-yellow-500 bg-yellow-50'
                                  : darkMode
                                    ? 'border-dark-600 bg-dark-700'
                                    : 'border-gray-200 bg-white'
                              }`}
                  >
                    {/* Popular badge */}
                    {plan.popular && !isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Current plan badge */}
                    {isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Current Plan
                        </span>
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="text-center mb-6">
                      <div className={`inline-flex p-3 rounded-full mb-4 ${plan.bgColor}`}>
                        <span className="text-white">{plan.icon}</span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        {plan.name}
                      </h3>
                      <div className={`text-3xl font-bold ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                        {plan.price}
                        {plan.id !== 'free' && (
                          <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            /{plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <FaCheck className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.color}`} />
                          <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                      
                      {plan.limitations && plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2 opacity-60">
                          <FaTimes className={`h-4 w-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
                          <span className={`text-sm line-through ${darkMode ? 'text-dark-500' : 'text-gray-400'}`}>
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Action button */}
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={!canUpgrade || isUpgrading}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                                ${isCurrent
                                  ? darkMode
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-green-600 text-white cursor-default'
                                  : canUpgrade
                                    ? darkMode
                                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : darkMode
                                      ? 'bg-dark-600 text-dark-400 cursor-default'
                                      : 'bg-gray-200 text-gray-500 cursor-default'
                                }`}
                    >
                      {isUpgrading ? (
                        <span>Upgrading...</span>
                      ) : isCurrent ? (
                        <span>Current Plan</span>
                      ) : canUpgrade ? (
                        <span>Upgrade to {plan.name}</span>
                      ) : (
                        <span>Contact Sales</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Feature comparison note */}
            <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <div className="flex items-start space-x-3">
                <FaShieldAlt className={`h-5 w-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    Note about upgrades
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Upgrades are currently manual. Contact support to process payment and activate your new plan.
                    Full payment integration coming soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;