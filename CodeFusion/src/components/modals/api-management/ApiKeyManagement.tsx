import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ApiKeyData } from "../../../services/apiKeyService";
import {
  FaKey,
  FaTrash,
  FaPlus,
  FaInfoCircle,
  FaDollarSign,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface ApiKeyManagementProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const ApiKeyManagement: React.FC<ApiKeyManagementProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const { getUserApiKeys, storeApiKey, deleteApiKey } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    usage: false,
    pricing: false,
    privacy: false,
  });

  useEffect(() => {
    if (isOpen) loadApiKeys();
  }, [isOpen]);

  const loadApiKeys = async () => {
    try {
      const keys = await getUserApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  };

  const handleAddKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    setLoading(true);
    try {
      await storeApiKey(newKeyName, newKeyValue, "openai");
      setNewKeyName("");
      setNewKeyValue("");
      setShowAddForm(false);
      await loadApiKeys();
    } catch (error) {
      console.error("Failed to add API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    try {
      await deleteApiKey(keyId);
      await loadApiKeys();
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };

  const toggleCard = (card: string) => {
    setExpandedCards((prev) => ({ ...prev, [card]: !prev[card] }));
  };

  const colorMap = {
    purple: {
      dark: "bg-purple-900/20 border-purple-400 text-purple-300",
      light: "bg-purple-50 border-purple-500 text-purple-800",
    },
    blue: {
      dark: "bg-blue-900/20 border-blue-400 text-blue-300",
      light: "bg-blue-50 border-blue-500 text-blue-800",
    },
    orange: {
      dark: "bg-orange-900/20 border-orange-400 text-orange-300",
      light: "bg-orange-50 border-orange-500 text-orange-700",
    },
  };

  const infoCards: {
    id: string;
    icon: JSX.Element;
    title: string;
    content: JSX.Element;
    color: keyof typeof colorMap; // 👈 this tells TS the color is a valid key
  }[] = [
    {
      id: "usage",
      icon: <FaInfoCircle />,
      title: "Using GPT-4o mini",
      content: (
        <p className="text-xs opacity-90">
          Fast and affordable model for code understanding and analysis
        </p>
      ),
      color: "purple",
    },
    {
      id: "pricing",
      icon: <FaDollarSign />,
      title: "Usage-Based Pricing",
      content: (
        <>
          <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
            <li>
              <strong>Input:</strong> $0.50 per 1M tokens
            </li>
            <li>
              <strong>Output:</strong> $1.50 per 1M tokens
            </li>
            <li>Typical analysis: Less than $0.002</li>
            <li>No hidden costs — pay only for what you use</li>
          </ul>
          <p className="mt-2 text-xs">
            You can view or update your billing status at{" "}
            <a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              OpenAI Billing
            </a>
            .
          </p>
        </>
      ),
      color: "blue",
    },
    {
      id: "privacy",
      icon: <FaExclamationTriangle />,
      title: "Privacy & Security",
      content: (
        <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
          <li>API keys are encrypted and stored in Firebase</li>
          <li>Data is sent directly to OpenAI, not logged</li>
          <li>Never share your key with others</li>
        </ul>
      ),
      color: "orange",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className={`relative rounded-xl shadow-2xl max-w-2xl w-full ${
            darkMode
              ? "bg-dark-800 border border-dark-600"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${
              darkMode ? "border-dark-600" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-dark-50" : "text-gray-900"
              }`}
            >
              API Key Management
            </h2>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-dark-400" : "text-gray-600"
              }`}
            >
              Securely manage your API keys across devices
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Expandable Cards */}
            {infoCards.map(({ id, icon, title, content, color }) => (
              <div
                key={id}
                className={`rounded-lg border-l-4 ${
                  darkMode ? colorMap[color].dark : colorMap[color].light
                }`}
              >
                <button
                  onClick={() => toggleCard(id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium"
                >
                  <div className="flex items-center space-x-2">
                    {icon}
                    <span>{title}</span>
                  </div>
                  {expandedCards[id] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expandedCards[id] && (
                  <div className="px-6 pb-4">{content}</div>
                )}
              </div>
            ))}

            {/* Add Key Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className={`w-full mt-2 p-3 border-2 border-dashed rounded-lg transition-colors ${
                  darkMode
                    ? "border-dark-600 hover:border-blue-500 text-dark-300 hover:text-blue-400"
                    : "border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600"
                }`}
              >
                <FaPlus className="inline mr-2" />
                Add New API Key
              </button>
            )}

            {/* Add Key Form */}
            {showAddForm && (
              <div
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? "border-dark-600 bg-dark-700"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Help section — always expanded */}
                <div className="mb-4">
                  <div
                    className={`p-4 rounded-lg text-sm space-y-2 border-l-4 ${
                      darkMode
                        ? "bg-dark-700 border-blue-500 text-dark-300"
                        : "bg-blue-50 border-blue-400 text-gray-700"
                    }`}
                  >
                    <p>
                      To use this app with your own OpenAI account, you'll need
                      an API key.
                    </p>
                    <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
                      <li>
                        Visit the{" "}
                        <a
                          href="https://platform.openai.com/account/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            darkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          OpenAI API Keys page
                        </a>{" "}
                        and log in
                      </li>
                      <li>Click “Create new secret key” and copy it</li>
                      <li>
                        Ensure you’ve added a payment method on your{" "}
                        <a
                          href="https://platform.openai.com/account/billing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            darkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          billing page
                        </a>
                      </li>
                      <li>Paste the key into this modal and save</li>
                    </ul>
                    <p className="text-xs mt-2 opacity-80">
                      OpenAI charges only for what you use — most users spend
                      less than $1/month.
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Key name (e.g., 'My OpenAI Key')"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                    darkMode
                      ? "bg-dark-800 border-dark-500 text-dark-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="password"
                  placeholder="API Key"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                    darkMode
                      ? "bg-dark-800 border-dark-500 text-dark-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddKey}
                    disabled={
                      loading || !newKeyName.trim() || !newKeyValue.trim()
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Key"}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-dark-600 text-dark-200"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* API Key List */}
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "border-dark-600 bg-dark-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaKey
                        className={`${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <div>
                        <h4
                          className={`font-medium ${
                            darkMode ? "text-dark-200" : "text-gray-800"
                          }`}
                        >
                          {key.keyName}
                        </h4>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-dark-400" : "text-gray-600"
                          }`}
                        >
                          Created: {key.createdAt.toLocaleDateString()}
                          {key.lastUsed &&
                            ` • Last used: ${key.lastUsed.toLocaleDateString()}`}
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
                <div
                  className={`text-center py-8 ${
                    darkMode ? "text-dark-400" : "text-gray-600"
                  }`}
                >
                  No API keys stored yet
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`p-6 border-t ${
              darkMode ? "border-dark-600" : "border-gray-200"
            }`}
          >
            <button
              onClick={onClose}
              className={`w-full py-2 rounded-lg ${
                darkMode
                  ? "bg-dark-600 text-dark-200"
                  : "bg-gray-200 text-gray-800"
              }`}
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
