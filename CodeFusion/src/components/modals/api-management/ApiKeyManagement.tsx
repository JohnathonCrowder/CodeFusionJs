import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiKeyData } from '../../../services/apiKeyService';
import { FaKey, FaTrash, FaPlus} from 'react-icons/fa';

interface ApiKeyManagementProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const ApiKeyManagement: React.FC<ApiKeyManagementProps> = ({
  isOpen,
  onClose,
  darkMode
}) => {
  const { getUserApiKeys, storeApiKey, deleteApiKey } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadApiKeys();
    }
  }, [isOpen]);

  const loadApiKeys = async () => {
    try {
      const keys = await getUserApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleAddKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    setLoading(true);
    try {
      await storeApiKey(newKeyName, newKeyValue, 'openai');
      setNewKeyName('');
      setNewKeyValue('');
      setShowAddForm(false);
      await loadApiKeys();
    } catch (error) {
      console.error('Failed to add API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      await deleteApiKey(keyId);
      await loadApiKeys();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full
                       ${darkMode ? 'bg-dark-800 border border-dark-600' : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              API Key Management
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              Securely manage your API keys across devices
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Add Key Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className={`w-full mb-4 p-3 border-2 border-dashed rounded-lg transition-colors
                          ${darkMode 
                            ? 'border-dark-600 hover:border-blue-500 text-dark-300 hover:text-blue-400'
                            : 'border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600'}`}
              >
                <FaPlus className="inline mr-2" />
                Add New API Key
              </button>
            )}

            {/* Add Form */}
            {showAddForm && (
              <div className={`mb-4 p-4 rounded-lg border ${darkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`font-medium mb-3 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  Add New API Key
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Key name (e.g., 'My OpenAI Key')"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border
                              ${darkMode 
                                ? 'bg-dark-800 border-dark-500 text-dark-100' 
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <input
                    type="password"
                    placeholder="API Key"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border
                              ${darkMode 
                                ? 'bg-dark-800 border-dark-500 text-dark-100' 
                                : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddKey}
                      disabled={loading || !newKeyName.trim() || !newKeyValue.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Key'}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-dark-600 text-dark-200' : 'bg-gray-200 text-gray-800'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Keys List */}
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`p-4 rounded-lg border ${darkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaKey className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                          {key.keyName}
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          Created: {key.createdAt.toLocaleDateString()}
                          {key.lastUsed && ` • Last used: ${key.lastUsed.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              {apiKeys.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  No API keys stored yet
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`w-full py-2 rounded-lg ${darkMode ? 'bg-dark-600 text-dark-200' : 'bg-gray-200 text-gray-800'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManagement;