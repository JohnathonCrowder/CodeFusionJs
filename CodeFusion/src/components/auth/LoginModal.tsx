import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaTimes, 
  FaSignInAlt, 
  FaUserPlus,
  FaExclamationCircle,
  FaUser
} from 'react-icons/fa';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { darkMode } = useContext(ThemeContext);
  const { login, signup, resetPassword } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setError('');
      alert('Password reset email sent! Check your inbox.');
      setShowResetPassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={`relative w-full max-w-md rounded-xl shadow-2xl transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                {isSignup ? 'Create Account' : 'Sign In'}
              </h2>
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

          {/* Error Message */}
          {error && (
            <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center space-x-2
                           ${darkMode 
                             ? 'bg-red-900/20 text-red-400 border border-red-700/50' 
                             : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <FaExclamationCircle />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {isSignup && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Display Name
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-3 top-3.5 h-4 w-4
                                     ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-3.5 h-4 w-4
                                       ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <FaLock className={`absolute left-3 top-3.5 h-4 w-4
                                   ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isSignup && (
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className={`text-sm transition-colors duration-200
                          ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                        rounded-lg font-semibold transition-all duration-200
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  {isSignup ? <FaUserPlus /> : <FaSignInAlt />}
                  <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={`p-6 pt-0 text-center border-t transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <p className={`text-sm transition-colors duration-300
                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className={`ml-2 font-medium transition-colors duration-200
                          ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Reset Password Modal */}
        {showResetPassword && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
            <div className={`p-6 rounded-xl shadow-xl max-w-sm w-full
                           ${darkMode ? 'bg-dark-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Reset Password
              </h3>
              <p className={`text-sm mb-4
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                We'll send a password reset link to your email
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetPassword(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium
                            ${darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium
                            ${darkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;