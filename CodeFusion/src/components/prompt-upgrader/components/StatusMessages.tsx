import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface StatusMessagesProps {
  error: string;
  success: string;
  darkMode: boolean;
  onClearError: () => void;
  onClearSuccess: () => void;
}

const StatusMessages: React.FC<StatusMessagesProps> = ({
  error,
  success,
  darkMode,
  onClearError,
  onClearSuccess
}) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300
                       ${darkMode 
                         ? 'bg-red-900/20 border-red-500 text-red-300' 
                         : 'bg-red-50 border-red-500 text-red-700'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={onClearError}
              className="text-current hover:opacity-70"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300
                       ${darkMode 
                         ? 'bg-green-900/20 border-green-500 text-green-300' 
                         : 'bg-green-50 border-green-500 text-green-700'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success</p>
                <p className="text-sm">{success}</p>
              </div>
            </div>
            <button
              onClick={onClearSuccess}
              className="text-current hover:opacity-70"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusMessages;