import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaStar,
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaCode,
  FaTag,
  FaCalendar,
  FaUser,
  FaGlobe,
  FaLock,
  FaSave,
  FaTimes,
  FaHeart,
  FaBookmark,
  FaShare,
  FaDownload,
  FaUpload,
  FaFileImport,
  FaFileExport
} from 'react-icons/fa';

export interface Prompt {
  id?: string;
  title: string;
  content: string;
  description?: string;
  category: string;
  tags: string[];
  userId: string;
  userDisplayName?: string;
  isPublic: boolean;
  isFavorite: boolean;
  isBookmarked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating?: number;
  language?: string;
  variables?: PromptVariable[];
  version: number;
  parentId?: string; // For versioning
}

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[]; // For select type
}

const CATEGORIES = [
  'Code Generation',
  'Code Review',
  'Documentation',
  'Debugging',
  'Testing',
  'Refactoring',
  'Architecture',
  'Database',
  'API Design',
  'Security',
  'Performance',
  'DevOps',
  'General',
  'Creative',
  'Analysis',
  'Translation',
  'Other'
];

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'General'
];

const PromptLibrary: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, userProfile } = useAuth();
  
  // State management
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyPublic, setShowOnlyPublic] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title' | 'usage'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '',
    content: '',
    description: '',
    category: 'General',
    tags: [],
    isPublic: false,
    language: 'General',
    variables: []
  });
  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState<PromptVariable>({
    name: '',
    description: '',
    defaultValue: '',
    required: false,
    type: 'text'
  });

  // Fetch prompts from Firebase
  useEffect(() => {
    if (!currentUser) return;
  
    const promptsQuery = query(
      collection(db, 'prompts'),
      where('userId', '==', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );
  
    const unsubscribe = onSnapshot(promptsQuery, (snapshot) => {
      const promptsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Prompt[];
      
      setPrompts(promptsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching prompts:', error);
      setLoading(false);
    });
  
    return unsubscribe;
  }, [currentUser]);

  // Filter and sort prompts
  useEffect(() => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'All' || prompt.language === selectedLanguage;
      const matchesFavorites = !showOnlyFavorites || prompt.isFavorite;
      const matchesPublic = !showOnlyPublic || prompt.isPublic;

      return matchesSearch && matchesCategory && matchesLanguage && matchesFavorites && matchesPublic;
    });

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'updated':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedCategory, selectedLanguage, showOnlyFavorites, showOnlyPublic, sortBy]);

  // Create new prompt
  const handleCreatePrompt = async () => {
    if (!currentUser || !formData.title || !formData.content) return;

    try {
      const promptData = {
        ...formData,
        userId: currentUser.uid,
        userDisplayName: userProfile?.displayName || currentUser.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        usageCount: 0,
        version: 1,
        isFavorite: false
      };

      await addDoc(collection(db, 'prompts'), promptData);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating prompt:', error);
    }
  };

  // Update prompt
  const handleUpdatePrompt = async () => {
    if (!editingPrompt?.id || !formData.title || !formData.content) return;

    try {
      await updateDoc(doc(db, 'prompts', editingPrompt.id), {
        ...formData,
        updatedAt: Timestamp.now(),
        version: editingPrompt.version + 1
      });

      setEditingPrompt(null);
      resetForm();
    } catch (error) {
      console.error('Error updating prompt:', error);
    }
  };

  // Delete prompt
  const handleDeletePrompt = async (promptId: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await deleteDoc(doc(db, 'prompts', promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (prompt: Prompt) => {
    if (!prompt.id) return;

    try {
      await updateDoc(doc(db, 'prompts', prompt.id), {
        isFavorite: !prompt.isFavorite,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Copy prompt to clipboard
  const copyPromptToClipboard = async (prompt: Prompt) => {
    let content = prompt.content;
    
    // Replace variables with placeholders
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach(variable => {
        const placeholder = variable.defaultValue || `[${variable.name.toUpperCase()}]`;
        content = content.replace(new RegExp(`{{${variable.name}}}`, 'g'), placeholder);
      });
    }

    await navigator.clipboard.writeText(content);
    
    // Update usage count
    if (prompt.id) {
      await updateDoc(doc(db, 'prompts', prompt.id), {
        usageCount: prompt.usageCount + 1,
        updatedAt: Timestamp.now()
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      description: '',
      category: 'General',
      tags: [],
      isPublic: false,
      language: 'General',
      variables: []
    });
    setNewTag('');
    setNewVariable({
      name: '',
      description: '',
      defaultValue: '',
      required: false,
      type: 'text'
    });
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Add variable
  const addVariable = () => {
    if (newVariable.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variables: [...(prev.variables || []), { ...newVariable }]
      }));
      setNewVariable({
        name: '',
        description: '',
        defaultValue: '',
        required: false,
        type: 'text'
      });
    }
  };

  // Remove variable
  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables?.filter((_, i) => i !== index) || []
    }));
  };

  // Export all prompts
  const exportPrompts = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `prompts-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import prompts
  const handleImportPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedPrompts = JSON.parse(e.target?.result as string);
        
        for (const prompt of importedPrompts) {
          const promptData = {
            ...prompt,
            id: undefined, // Remove ID to create new
            userId: currentUser?.uid,
            userDisplayName: userProfile?.displayName || currentUser?.email,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            usageCount: 0
          };
          
          await addDoc(collection(db, 'prompts'), promptData);
        }
        
        setShowImportModal(false);
      } catch (error) {
        console.error('Error importing prompts:', error);
        alert('Error importing prompts. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen pt-20 p-6 flex items-center justify-center
                     ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-xl
                       ${darkMode ? 'bg-dark-800 text-dark-100' : 'bg-white text-gray-900'}`}>
          <FaLock className={`h-12 w-12 mx-auto mb-4
                             ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
            Please log in to access your prompt library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 p-6 transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Prompt Library
            </h1>
            <p className={`mt-2 transition-colors duration-300
                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              Organize and manage your AI prompts efficiently
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-dark-600 hover:bg-dark-500 text-dark-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              <FaFileImport />
              <span>Import</span>
            </button>
            
            <button
              onClick={exportPrompts}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-dark-600 hover:bg-dark-500 text-dark-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              <FaFileExport />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-200 hover:scale-105
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <FaPlus />
              <span>New Prompt</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-6 rounded-xl border mb-6 transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border-dark-600' 
                         : 'bg-white border-gray-200'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className={`absolute left-3 top-3.5 h-4 w-4
                                   ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2
                          ${darkMode
                            ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`px-4 py-3 rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            >
              <option value="All">All Languages</option>
              {LANGUAGES.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-3 rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
              <option value="usage">Most Used</option>
            </select>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Favorites Only
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyPublic}
                onChange={(e) => setShowOnlyPublic(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                Public Only
              </span>
            </label>

            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors
                          ${viewMode === 'grid'
                            ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                            : darkMode ? 'hover:bg-dark-600 text-dark-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors
                          ${viewMode === 'list'
                            ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                            : darkMode ? 'hover:bg-dark-600 text-dark-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
              >
                <div className="space-y-1">
                  <div className="h-1 w-4 bg-current rounded"></div>
                  <div className="h-1 w-4 bg-current rounded"></div>
                  <div className="h-1 w-4 bg-current rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Prompts Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className={`text-lg ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              Loading prompts...
            </div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border
                         ${darkMode 
                           ? 'bg-dark-800 border-dark-600' 
                           : 'bg-white border-gray-200'}`}>
            <FaCode className={`h-12 w-12 mx-auto mb-4
                              ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2
                           ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              {prompts.length === 0 ? 'No prompts yet' : 'No prompts match your filters'}
            </h3>
            <p className={`text-sm mb-4
                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              {prompts.length === 0 
                ? 'Create your first prompt to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {prompts.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                          ${darkMode
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Create Your First Prompt
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`rounded-xl border transition-all duration-300 hover:shadow-lg
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600 hover:border-dark-500' 
                             : 'bg-white border-gray-200 hover:border-gray-300'}`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold mb-2 truncate
                                     ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                        {prompt.title}
                      </h3>
                      {prompt.description && (
                        <p className={`text-sm line-clamp-2
                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                          {prompt.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleFavorite(prompt)}
                        className={`p-2 rounded-lg transition-colors
                                  ${prompt.isFavorite
                                    ? 'text-yellow-500 hover:text-yellow-600'
                                    : darkMode 
                                      ? 'text-dark-400 hover:text-yellow-500'
                                      : 'text-gray-400 hover:text-yellow-500'
                                  }`}
                      >
                        <FaStar className={prompt.isFavorite ? 'fill-current' : ''} />
                      </button>
                      
                      {prompt.isPublic && (
                        <FaGlobe className={`h-4 w-4
                                           ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs font-medium
                                     ${darkMode 
                                       ? 'bg-blue-600/20 text-blue-400' 
                                       : 'bg-blue-100 text-blue-700'}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className={`px-2 py-1 rounded-full text-xs
                                        ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                          +{prompt.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className={`flex items-center justify-between text-xs mb-4
                                 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <FaTag />
                        <span>{prompt.category}</span>
                      </span>
                      {prompt.language && (
                        <span className="flex items-center space-x-1">
                          <FaCode />
                          <span>{prompt.language}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <FaEye />
                        <span>{prompt.usageCount}</span>
                      </span>
                    </div>
                    <span>{prompt.updatedAt.toLocaleDateString()}</span>
                  </div>

                  {/* Content Preview */}
                  <div className={`p-3 rounded-lg border mb-4
                                 ${darkMode 
                                   ? 'bg-dark-700 border-dark-600' 
                                   : 'bg-gray-50 border-gray-200'}`}>
                    <code className={`text-xs font-mono line-clamp-3
                                    ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                      {prompt.content}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyPromptToClipboard(prompt)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm
                                  font-medium transition-all duration-200 hover:scale-105
                                  ${darkMode
                                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        <FaCopy />
                        <span>Copy</span>
                      </button>
                      
                      <button
                        onClick={() => setViewingPrompt(prompt)}
                        className={`p-2 rounded-lg transition-colors
                                  ${darkMode
                                    ? 'hover:bg-dark-600 text-dark-300'
                                    : 'hover:bg-gray-100 text-gray-600'}`}
                      >
                        <FaEye />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt);
                          setFormData(prompt);
                        }}
                        className={`p-2 rounded-lg transition-colors
                                  ${darkMode
                                    ? 'hover:bg-dark-600 text-dark-300'
                                    : 'hover:bg-gray-100 text-gray-600'}`}
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => handleDeletePrompt(prompt.id!)}
                        className={`p-2 rounded-lg transition-colors
                                  ${darkMode
                                    ? 'hover:bg-red-600/20 text-red-400'
                                    : 'hover:bg-red-50 text-red-600'}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPrompt) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              {/* Modal Header */}
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPrompt(null);
                      resetForm();
                    }}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      placeholder="Enter prompt title..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={formData.category || 'General'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2
                                     ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Language
                    </label>
                    <select
                      value={formData.language || 'General'}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      {LANGUAGES.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                        Make Public
                      </span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2 resize-none
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    placeholder="Brief description of the prompt..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Prompt Content *
                  </label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                              focus:outline-none focus:ring-2 resize-none font-mono text-sm
                              ${darkMode
                                ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    placeholder="Enter your prompt content here..."
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                    Use {'{{variable_name}}'} for variables that can be replaced
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                                   ${darkMode 
                                     ? 'bg-blue-600/20 text-blue-400' 
                                     : 'bg-blue-100 text-blue-700'}`}
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-500"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className={`flex-1 px-4 py-2 rounded-l-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      placeholder="Add a tag..."
                    />
                    <button
                      onClick={addTag}
                      className={`px-4 py-2 rounded-r-lg font-medium transition-colors
                                ${darkMode
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Variables */}
                <div>
                  <label className={`block text-sm font-medium mb-2
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Variables
                  </label>
                  
                  {formData.variables && formData.variables.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.variables.map((variable, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border
                                     ${darkMode 
                                       ? 'bg-dark-700 border-dark-600' 
                                       : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <span className={`text-sm font-medium
                                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                                  {variable.name}
                                </span>
                                {variable.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </div>
                              <div>
                                <span className={`text-sm
                                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                                  {variable.description || 'No description'}
                                </span>
                              </div>
                              <div>
                                <span className={`text-xs px-2 py-1 rounded-full
                                               ${darkMode 
                                                 ? 'bg-purple-600/20 text-purple-400' 
                                                 : 'bg-purple-100 text-purple-700'}`}>
                                  {variable.type}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeVariable(index)}
                              className={`p-1 rounded transition-colors ml-3
                                        ${darkMode
                                          ? 'hover:bg-red-600/20 text-red-400'
                                          : 'hover:bg-red-50 text-red-600'}`}
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Variable Form */}
                  <div className={`p-4 rounded-lg border
                                 ${darkMode 
                                   ? 'bg-dark-700 border-dark-600' 
                                   : 'bg-gray-50 border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                        className={`px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-600 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Variable name"
                      />
                      <input
                        type="text"
                        value={newVariable.description}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                        className={`px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-600 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <select
                        value={newVariable.type}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value as any }))}
                        className={`px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-600 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="select">Select</option>
                      </select>
                      
                      <input
                        type="text"
                        value={newVariable.defaultValue}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, defaultValue: e.target.value }))}
                        className={`px-3 py-2 rounded-lg border text-sm
                                  ${darkMode
                                    ? 'bg-dark-600 border-dark-500 text-dark-100'
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Default value"
                      />
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newVariable.required}
                          onChange={(e) => setNewVariable(prev => ({ ...prev, required: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Required
                        </span>
                      </label>
                    </div>
                    
                    <button
                      onClick={addVariable}
                      disabled={!newVariable.name.trim()}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
                                ${newVariable.name.trim()
                                  ? darkMode
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                }`}
                    >
                      Add Variable
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end space-x-3 p-6 border-t
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPrompt(null);
                    resetForm();
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors
                            ${darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                
                <button
                  onClick={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
                  disabled={!formData.title?.trim() || !formData.content?.trim()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                            transition-all duration-200 hover:scale-105
                            ${formData.title?.trim() && formData.content?.trim()
                              ? darkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            }`}
                >
                  <FaSave />
                  <span>{editingPrompt ? 'Update' : 'Create'} Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prompt Modal */}
      {viewingPrompt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              {/* Modal Header */}
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className={`text-2xl font-bold transition-colors duration-300
                                     ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                        {viewingPrompt.title}
                      </h2>
                      {viewingPrompt.isFavorite && (
                        <FaStar className="text-yellow-500 fill-current" />
                      )}
                      {viewingPrompt.isPublic && (
                        <FaGlobe className={darkMode ? 'text-green-400' : 'text-green-600'} />
                      )}
                    </div>
                    
                    {viewingPrompt.description && (
                      <p className={`text-base transition-colors duration-300
                                   ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                        {viewingPrompt.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setViewingPrompt(null)}
                    className={`p-2 rounded-lg transition-colors ml-4
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className={`text-xs font-medium uppercase tracking-wide
                                    ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                      Category
                    </span>
                    <p className={`mt-1 font-medium
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      {viewingPrompt.category}
                    </p>
                  </div>
                  
                  <div>
                    <span className={`text-xs font-medium uppercase tracking-wide
                                    ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                      Language
                    </span>
                    <p className={`mt-1 font-medium
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      {viewingPrompt.language || 'General'}
                    </p>
                  </div>
                  
                  <div>
                    <span className={`text-xs font-medium uppercase tracking-wide
                                    ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                      Usage Count
                    </span>
                    <p className={`mt-1 font-medium
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      {viewingPrompt.usageCount}
                    </p>
                  </div>
                  
                  <div>
                    <span className={`text-xs font-medium uppercase tracking-wide
                                    ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                      Last Updated
                    </span>
                    <p className={`mt-1 font-medium
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                      {viewingPrompt.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {viewingPrompt.tags && viewingPrompt.tags.length > 0 && (
                  <div>
                    <span className={`text-sm font-medium mb-3 block
                                    ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {viewingPrompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-sm font-medium
                                     ${darkMode 
                                       ? 'bg-blue-600/20 text-blue-400' 
                                       : 'bg-blue-100 text-blue-700'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variables */}
                {viewingPrompt.variables && viewingPrompt.variables.length > 0 && (
                  <div>
                    <span className={`text-sm font-medium mb-3 block
                                    ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Variables
                    </span>
                    <div className="space-y-3">
                      {viewingPrompt.variables.map((variable, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border
                                     ${darkMode 
                                       ? 'bg-dark-700 border-dark-600' 
                                       : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <span className={`text-sm font-medium
                                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                                {variable.name}
                                {variable.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className={`text-sm
                                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                                {variable.description || 'No description'}
                              </span>
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full
                                             ${darkMode 
                                               ? 'bg-purple-600/20 text-purple-400' 
                                               : 'bg-purple-100 text-purple-700'}`}>
                                {variable.type}
                              </span>
                            </div>
                            <div>
                              {variable.defaultValue && (
                                <span className={`text-sm font-mono
                                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                  Default: {variable.defaultValue}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium
                                    ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                      Prompt Content
                    </span>
                    <button
                      onClick={() => copyPromptToClipboard(viewingPrompt)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                                font-medium transition-all duration-200 hover:scale-105
                                ${darkMode
                                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      <FaCopy />
                      <span>Copy</span>
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap
                                 ${darkMode 
                                   ? 'bg-dark-700 border-dark-600 text-dark-200' 
                                   : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {viewingPrompt.content}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-between items-center p-6 border-t
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  Version {viewingPrompt.version} • Created {viewingPrompt.createdAt.toLocaleDateString()}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleFavorite(viewingPrompt)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                              font-medium transition-all duration-200
                              ${viewingPrompt.isFavorite
                                ? darkMode
                                  ? 'bg-yellow-600/20 text-yellow-400'
                                  : 'bg-yellow-100 text-yellow-700'
                                : darkMode
                                  ? 'hover:bg-dark-600 text-dark-300'
                                  : 'hover:bg-gray-100 text-gray-600'
                              }`}
                  >
                    <FaStar className={viewingPrompt.isFavorite ? 'fill-current' : ''} />
                    <span>{viewingPrompt.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setViewingPrompt(null);
                      setEditingPrompt(viewingPrompt);
                      setFormData(viewingPrompt);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                              font-medium transition-all duration-200 hover:scale-105
                              ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className={`relative rounded-xl shadow-2xl max-w-lg w-full
                           ${darkMode 
                             ? 'bg-dark-800 border border-dark-600' 
                             : 'bg-white border border-gray-200'}`}>
              
              {/* Modal Header */}
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    Import Prompts
                  </h2>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className={`p-2 rounded-lg transition-colors
                              ${darkMode
                                ? 'hover:bg-dark-600 text-dark-300'
                                : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className={`p-4 rounded-lg border-2 border-dashed text-center
                               ${darkMode 
                                 ? 'border-dark-500 bg-dark-700' 
                                 : 'border-gray-300 bg-gray-50'}`}>
                  <FaUpload className={`h-8 w-8 mx-auto mb-3
                                      ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium mb-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    Upload JSON file with prompts
                  </p>
                  <p className={`text-xs mb-4
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Select a JSON file exported from CodeFusion or compatible format
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportPrompts}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg
                              font-medium cursor-pointer transition-all duration-200 hover:scale-105
                              ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    <FaFileImport />
                    <span>Choose File</span>
                  </label>
                </div>
                
                <div className={`mt-4 p-3 rounded-lg
                               ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <strong>Note:</strong> Imported prompts will be added to your library with new IDs. 
                    Duplicates may be created if you import the same file multiple times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibrary;