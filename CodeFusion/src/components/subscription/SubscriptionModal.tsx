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
  FaShieldAlt,
  FaPalette,
  FaCode,
  FaChartBar,
  FaInfinity,
  FaLock,
  FaUserFriends,
  FaKey,
  FaHeadset
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
        {
          text: 'Unlimited file uploads',
          icon: <FaInfinity className="h-4 w-4 text-green-500" />
        },
        {
          text: 'Unlimited directory size',
          icon: <FaInfinity className="h-4 w-4 text-green-500" />
        },
        {
          text: 'Up to 500MB per file',
          icon: <FaFileCode className="h-4 w-4 text-blue-500" />
        },
        {
          text: 'Basic code analysis',
          icon: <FaChartBar className="h-4 w-4 text-purple-500" />
        },
        {
          text: 'Basic anonymization',
          icon: <FaShieldAlt className="h-4 w-4 text-indigo-500" />
        },
        {
          text: 'Local-only processing',
          icon: <FaLock className="h-4 w-4 text-yellow-500" />
        },
        {
          text: 'Community support',
          icon: <FaUsers className="h-4 w-4 text-cyan-500" />
        }
      ],
      limitations: []
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
        {
          text: 'Everything in Free',
          icon: <FaCheck className="h-4 w-4 text-green-500" />,
          highlight: false
        },
        {
          text: 'AI-powered code insights',
          icon: <FaBrain className="h-4 w-4 text-purple-500" />,
          highlight: true
        },
        {
          text: 'Advanced anonymization',
          icon: <FaShieldAlt className="h-4 w-4 text-indigo-500" />,
          highlight: true
        },
        {
          text: 'Custom themes & UI',
          icon: <FaPalette className="h-4 w-4 text-pink-500" />,
          highlight: true
        },
        {
          text: 'Export to GitHub/VSCode',
          icon: <FaCode className="h-4 w-4 text-green-500" />,
          highlight: true
        },
        {
          text: 'Priority email support',
          icon: <FaHeadset className="h-4 w-4 text-orange-500" />,
          highlight: true
        },
        {
          text: 'Up to 1GB per file',
          icon: <FaFileCode className="h-4 w-4 text-blue-500" />
        }
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
        {
          text: 'Everything in Pro',
          icon: <FaCheck className="h-4 w-4 text-green-500" />
        },
        {
          text: 'Team collaboration',
          icon: <FaUserFriends className="h-4 w-4 text-blue-500" />,
          highlight: true
        },
        {
          text: 'Shared workspaces',
          icon: <FaUsers className="h-4 w-4 text-indigo-500" />,
          highlight: true
        },
        {
          text: 'Team analytics dashboard',
          icon: <FaChartBar className="h-4 w-4 text-purple-500" />,
          highlight: true
        },
        {
          text: 'API access',
          icon: <FaKey className="h-4 w-4 text-yellow-500" />,
          highlight: true
        },
        {
          text: 'Dedicated support',
          icon: <FaHeadset className="h-4 w-4 text-orange-500" />,
          highlight: true
        },
        {
          text: 'Up to 2GB per file',
          icon: <FaFileCode className="h-4 w-4 text-blue-500" />
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      icon: <FaRocket className="h-6 w-6" />,
      color: 'text-purple-500',
      bgColor: darkMode ? 'bg-purple-600' : 'bg-purple-500',
      features: [
        {
          text: 'Everything in Team',
          icon: <FaCheck className="h-4 w-4 text-green-500" />
        },
        {
          text: 'Unlimited file size',
          icon: <FaInfinity className="h-4 w-4 text-green-500" />,
          highlight: true
        },
        {
          text: 'Custom integrations',
          icon: <FaCode className="h-4 w-4 text-blue-500" />,
          highlight: true
        },
        {
          text: 'SSO & advanced security',
          icon: <FaShieldAlt className="h-4 w-4 text-red-500" />,
          highlight: true
        },
        {
          text: 'Custom AI training',
          icon: <FaBrain className="h-4 w-4 text-indigo-500" />,
          highlight: true
        },
        {
          text: 'Dedicated account manager',
          icon: <FaHeadset className="h-4 w-4 text-orange-500" />,
          highlight: true
        },
        {
          text: 'SLA guarantees',
          icon: <FaShieldAlt className="h-4 w-4 text-green-500" />,
          highlight: true
        }
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
        <div className={`relative rounded-xl shadow-2xl max-w-7xl w-full transition-colors duration-300
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
                <p className={`mt-2 text-lg transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Start free with unlimited uploads. Upgrade for advanced features.
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

          {/* Value Proposition Banner */}
          <div className={`mx-6 mt-6 p-4 rounded-lg text-center
                         ${darkMode 
                           ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50' 
                           : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}>
            <p className={`text-lg font-semibold mb-1
                         ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
              🚀 No Upload Limits. Ever.
            </p>
            <p className={`text-sm
                         ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              Upload unlimited files and directories of any size with our free plan. Upgrade for AI-powered features and tools.
            </p>
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
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col
                              ${isCurrent
                                ? darkMode
                                  ? 'border-green-500 bg-green-900/20'
                                  : 'border-green-500 bg-green-50'
                                : plan.popular
                                  ? darkMode
                                    ? 'border-yellow-500 bg-yellow-900/20 shadow-xl'
                                    : 'border-yellow-500 bg-yellow-50 shadow-xl'
                                  : darkMode
                                    ? 'border-dark-600 bg-dark-700'
                                    : 'border-gray-200 bg-white'
                              }`}
                  >
                    {/* Popular badge */}
                    {plan.popular && !isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    {/* Current plan badge */}
                    {isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                          CURRENT PLAN
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
                        {plan.id !== 'free' && plan.id !== 'enterprise' && (
                          <span className={`text-sm font-normal ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            /{plan.period}
                          </span>
                        )}
                        {plan.id === 'enterprise' && (
                          <span className={`block text-sm font-normal mt-1 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="mt-0.5 flex-shrink-0">{feature.icon}</span>
                          <span className={`text-sm ${
                            feature.highlight 
                              ? darkMode ? 'text-dark-100 font-medium' : 'text-gray-800 font-medium'
                              : darkMode ? 'text-dark-300' : 'text-gray-600'
                          }`}>
                            {feature.text}
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
                                    ? plan.popular
                                      ? darkMode
                                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                                      : darkMode
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : plan.id === 'enterprise'
                                      ? darkMode
                                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                      : darkMode
                                        ? 'bg-dark-600 text-dark-400 cursor-default'
                                        : 'bg-gray-200 text-gray-500 cursor-default'
                                }`}
                    >
                      {isUpgrading ? (
                        <span>Upgrading...</span>
                      ) : isCurrent ? (
                        <span>Current Plan</span>
                      ) : plan.id === 'free' ? (
                        <span>Downgrade</span>
                      ) : plan.id === 'enterprise' ? (
                        <span>Contact Sales</span>
                      ) : canUpgrade ? (
                        <span>Upgrade to {plan.name}</span>
                      ) : (
                        <span>Not Available</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Feature comparison note */}
            <div className={`mt-8 p-6 rounded-lg border
                           ${darkMode 
                             ? 'bg-dark-700/50 border-dark-600' 
                             : 'bg-gray-50 border-gray-200'}`}>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2
                                 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ∞
                  </div>
                  <h4 className={`font-semibold mb-1
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    Unlimited Uploads
                  </h4>
                  <p className={`text-sm
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    All plans include unlimited file and directory uploads
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2
                                 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    🔒
                  </div>
                  <h4 className={`font-semibold mb-1
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    100% Private
                  </h4>
                  <p className={`text-sm
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Your code is processed locally and never sent to our servers
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2
                                 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    🚀
                  </div>
                  <h4 className={`font-semibold mb-1
                                 ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
                    Premium Features
                  </h4>
                  <p className={`text-sm
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Upgrade for AI insights and advanced tools
                  </p>
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className={`mt-4 p-4 rounded-lg text-center
                           ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-center space-x-2">
                <FaShieldAlt className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <span className="font-semibold">Note:</span> Manual billing currently active. 
                  After selecting a plan, our team will contact you within 24 hours to process payment.
                  Stripe integration coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;