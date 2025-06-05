import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaCloudUploadAlt, FaExclamationTriangle } from 'react-icons/fa';

const UsageIndicator: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userProfile, getRemainingUploads } = useAuth();

  if (!userProfile) return null;

  const quota = userProfile.usageQuota;
  const remaining = getRemainingUploads();
  const isNearLimit = remaining <= 5 && quota.maxUploadsPerDay !== -1;
  const isUnlimited = quota.maxUploadsPerDay === -1;

  const getProgressPercentage = () => {
    if (isUnlimited) return 0;
    return ((quota.uploadsToday / quota.maxUploadsPerDay) * 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`p-3 rounded-lg border transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-700 border-dark-600' 
                     : 'bg-gray-50 border-gray-200'}`}>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FaCloudUploadAlt className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
            Daily Uploads
          </span>
        </div>
        
        {isNearLimit && (
          <FaExclamationTriangle className="h-4 w-4 text-orange-500" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
          {isUnlimited ? (
            <span className="text-green-500 font-semibold">Unlimited</span>
          ) : (
            `${remaining} remaining`
          )}
        </span>
        
        {!isUnlimited && (
          <span className={darkMode ? 'text-dark-400' : 'text-gray-500'}>
            {quota.uploadsToday} / {quota.maxUploadsPerDay}
          </span>
        )}
      </div>

      {!isUnlimited && (
        <div className={`mt-2 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-dark-600' : ''}`}>
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default UsageIndicator;