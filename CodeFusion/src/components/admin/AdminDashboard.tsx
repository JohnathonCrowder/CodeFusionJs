import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import EmailManagement from './EmailManagement';
import { db } from "../../config/firebase";
import {
  FaUsers,
  FaChartBar,
  FaShieldAlt,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCheck,
  FaSearch,
  FaExclamationCircle,
  FaCrown,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope
} from "react-icons/fa";

interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  subscriptionTier: 'free' | 'pro' | 'team' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'canceled';
  subscriptionExpiry?: Date;
  usageQuota: {
    uploadsToday: number;
    uploadsThisMonth: number;
    maxUploadsPerDay: number;
    maxUploadsPerMonth: number;
    maxFileSize: number;
    maxFilesPerDirectory: number;
    lastResetDate: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
  freeUsers: number;
  proUsers: number;
  teamUsers: number;
  enterpriseUsers: number;
}

const AdminDashboard: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'emails'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    teamUsers: 0,
    enterpriseUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'role' | 'subscription'>('date');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [filterSubscription, setFilterSubscription] = useState<string>("all");

  // Subscription tier configurations for display
  const SUBSCRIPTION_CONFIGS = {
    free: {
      name: 'Free',
      color: darkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-gray-100 text-gray-700',
      icon: '🆓'
    },
    pro: {
      name: 'Pro',
      color: darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
      icon: '👑'
    },
    team: {
      name: 'Team',
      color: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700',
      icon: '👥'
    },
    enterprise: {
      name: 'Enterprise',
      color: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700',
      icon: '🚀'
    }
  };

  // Create default quota for a subscription tier
  const createDefaultQuota = (tier: string) => {
    const configs = {
      free: {
        maxUploadsPerDay: 10,
        maxUploadsPerMonth: 200,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxFilesPerDirectory: 50
      },
      pro: {
        maxUploadsPerDay: 100,
        maxUploadsPerMonth: 2000,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        maxFilesPerDirectory: 500
      },
      team: {
        maxUploadsPerDay: 500,
        maxUploadsPerMonth: 10000,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxFilesPerDirectory: 1000
      },
      enterprise: {
        maxUploadsPerDay: -1, // unlimited
        maxUploadsPerMonth: -1, // unlimited
        maxFileSize: 500 * 1024 * 1024, // 500MB
        maxFilesPerDirectory: 5000
      }
    };
    
    const config = configs[tier as keyof typeof configs] || configs.free;
    return {
      uploadsToday: 0,
      uploadsThisMonth: 0,
      maxUploadsPerDay: config.maxUploadsPerDay,
      maxUploadsPerMonth: config.maxUploadsPerMonth,
      maxFileSize: config.maxFileSize,
      maxFilesPerDirectory: config.maxFilesPerDirectory,
      lastResetDate: new Date().toISOString().split('T')[0]
    };
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      
      const usersList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          subscriptionExpiry: data.subscriptionExpiry?.toDate() || undefined
        };
      }) as User[];
      
      setUsers(usersList);
      setFilteredUsers(usersList);
      
      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      setStats({
        totalUsers: usersList.length,
        adminUsers: usersList.filter(u => u.role === 'admin').length,
        regularUsers: usersList.filter(u => u.role === 'user').length,
        recentUsers: usersList.filter(u => u.createdAt > oneWeekAgo).length,
        freeUsers: usersList.filter(u => u.subscriptionTier === 'free').length,
        proUsers: usersList.filter(u => u.subscriptionTier === 'pro').length,
        teamUsers: usersList.filter(u => u.subscriptionTier === 'team').length,
        enterpriseUsers: usersList.filter(u => u.subscriptionTier === 'enterprise').length
      });
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Filter and sort users
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubscription = filterSubscription === 'all' || user.subscriptionTier === filterSubscription;
      
      return matchesSearch && matchesSubscription;
    });
    
    // Sort users
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'name':
          return (a.displayName || a.email).localeCompare(b.displayName || b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'subscription':
          return a.subscriptionTier.localeCompare(b.subscriptionTier);
        default:
          return 0;
      }
    });
    
    setFilteredUsers(sorted);
  }, [searchTerm, users, sortBy, filterSubscription]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.uid) {
      setError("You cannot change your own role");
      return;
    }

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user role");
      console.error(err);
    }
  };

  const handleSubscriptionChange = async (userId: string, newTier: 'free' | 'pro' | 'team' | 'enterprise') => {
    try {
      const userDoc = doc(db, 'users', userId);
      const expiryDate = newTier === 'free' ? null : (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      })();

      const newQuota = createDefaultQuota(newTier);
      const currentUser = users.find(u => u.uid === userId);
      
      await updateDoc(userDoc, {
        subscriptionTier: newTier,
        subscriptionStatus: newTier === 'free' ? 'canceled' : 'active',
        subscriptionExpiry: expiryDate,
        usageQuota: {
          ...newQuota,
          uploadsToday: currentUser?.usageQuota?.uploadsToday || 0,
          uploadsThisMonth: currentUser?.usageQuota?.uploadsThisMonth || 0
        }
      });

      await fetchUsers();
      setExpandedUser(null);
    } catch (err) {
      setError("Failed to update subscription");
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.uid) {
      setError("You cannot delete your own account");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      await fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === -1) return "Unlimited";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getSubscriptionBadge = (tier: string) => {
    const config = SUBSCRIPTION_CONFIGS[tier as keyof typeof SUBSCRIPTION_CONFIGS];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.name}
      </span>
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center p-8 rounded-xl
                       ${darkMode 
                         ? 'bg-dark-800 text-dark-100' 
                         : 'bg-white text-gray-900'}`}>
          <FaShieldAlt className={`h-12 w-12 mx-auto mb-4
                                 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 p-6 transition-colors duration-300
                   ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={`mt-2 transition-colors duration-300
                         ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
              Manage users, emails, and view system statistics
            </p>
          </div>
          <div className={`p-3 rounded-xl
                         ${darkMode 
                           ? 'bg-purple-600/20 text-purple-400' 
                           : 'bg-purple-100 text-purple-600'}`}>
            <FaShieldAlt className="h-8 w-8" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2
                         ${darkMode 
                           ? 'bg-red-900/20 text-red-400 border border-red-700/50' 
                           : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <FaExclamationCircle />
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-auto"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-6 space-x-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${activeTab === 'users'
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-dark-300 hover:bg-dark-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
          >
            <div className="flex items-center space-x-2">
              <FaUsers className="h-4 w-4" />
              <span>User Management</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${activeTab === 'emails'
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-dark-300 hover:bg-dark-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
          >
            <div className="flex items-center space-x-2">
              <FaEnvelope className="h-4 w-4" />
              <span>Email Management</span>
            </div>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'emails' ? (
          <EmailManagement />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300
                                 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Total Users
                    </p>
                    <p className={`text-2xl font-bold mt-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                      {stats.totalUsers}
                    </p>
                  </div>
                  <FaUsers className={`h-8 w-8 transition-colors duration-300
                                     ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300
                                 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Premium Users
                    </p>
                    <p className={`text-2xl font-bold mt-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                      {stats.proUsers + stats.teamUsers + stats.enterpriseUsers}
                    </p>
                  </div>
                  <FaCrown className={`h-8 w-8 transition-colors duration-300
                                     ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300
                                 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Admin Users
                    </p>
                    <p className={`text-2xl font-bold mt-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                      {stats.adminUsers}
                    </p>
                  </div>
                  <FaShieldAlt className={`h-8 w-8 transition-colors duration-300
                                         ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105
                             ${darkMode 
                               ? 'bg-dark-800 border-dark-600' 
                               : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300
                                 ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      Recent (7 days)
                    </p>
                    <p className={`text-2xl font-bold mt-2 transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                      {stats.recentUsers}
                    </p>
                  </div>
                  <FaChartBar className={`h-8 w-8 transition-colors duration-300
                                        ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
              </div>
            </div>

            {/* Subscription Breakdown */}
            <div className={`rounded-xl border transition-colors duration-300 mb-8
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600' 
                             : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Subscription Breakdown
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(SUBSCRIPTION_CONFIGS).map(([tier, config]) => {
                    const count = stats[`${tier}Users` as keyof typeof stats] as number;
                    const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={tier} className={`p-4 rounded-lg border
                                                ${darkMode 
                                                  ? 'bg-dark-700 border-dark-600' 
                                                  : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{config.icon}</span>
                          <span className={`font-medium ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                            {config.name}
                          </span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{count}</div>
                        <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                          {percentage}% of users
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div className={`rounded-xl border transition-colors duration-300
                           ${darkMode 
                             ? 'bg-dark-800 border-dark-600' 
                             : 'bg-white border-gray-200 shadow-sm'}`}>
              
              {/* Table Header */}
              <div className={`p-6 border-b transition-colors duration-300
                             ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className={`text-xl font-bold transition-colors duration-300
                                 ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                    User Management
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <FaSearch className={`absolute left-3 top-3.5 h-4 w-4
                                           ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                                  focus:outline-none focus:ring-2 w-64
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      />
                    </div>
                    
                    {/* Subscription Filter */}
                    <select
                      value={filterSubscription}
                      onChange={(e) => setFilterSubscription(e.target.value)}
                      className={`px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      <option value="all">All Subscriptions</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="team">Team</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    
                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`px-4 py-3 rounded-lg border transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${darkMode
                                  ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                    >
                      <option value="date">Sort by Date</option>
                      <option value="name">Sort by Name</option>
                      <option value="role">Sort by Role</option>
                      <option value="subscription">Sort by Subscription</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User Table */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className={`text-lg transition-colors duration-300
                                 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                    Loading users...
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b transition-colors duration-300
                                    ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                        <th className={`text-left p-6 font-medium transition-colors duration-300
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          User
                        </th>
                        <th className={`text-left p-6 font-medium transition-colors duration-300
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Role
                        </th>
                        <th className={`text-left p-6 font-medium transition-colors duration-300
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Subscription
                        </th>
                        <th className={`text-left p-6 font-medium transition-colors duration-300
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Joined
                        </th>
                        <th className={`text-right p-6 font-medium transition-colors duration-300
                                       ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <React.Fragment key={user.uid}>
                          <tr className={`border-b transition-all duration-200
                                        ${darkMode 
                                          ? 'border-dark-600 hover:bg-dark-700' 
                                          : 'border-gray-200 hover:bg-gray-50'}`}>
                            <td className="p-6">
                              <div>
                                <p className={`font-medium transition-colors duration-300
                                             ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                                  {user.displayName || 'No name'}
                                </p>
                                <p className={`text-sm transition-colors duration-300
                                             ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                                  {user.email}
                                </p>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                             ${user.role === 'admin'
                                               ? darkMode
                                                 ? 'bg-purple-600/20 text-purple-400'
                                                 : 'bg-purple-100 text-purple-700'
                                               : darkMode
                                                 ? 'bg-green-600/20 text-green-400'
                                                 : 'bg-green-100 text-green-700'
                                             }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                {getSubscriptionBadge(user.subscriptionTier)}
                                {user.subscriptionExpiry && (
                                  <span className={`text-xs ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                                    Expires: {user.subscriptionExpiry.toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-6">
                              <p className={`text-sm transition-colors duration-300
                                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                                {user.createdAt.toLocaleDateString()}
                              </p>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center justify-end space-x-2">
                                {/* Expand Details Button */}
                                <button
                                  onClick={() => setExpandedUser(expandedUser === user.uid ? null : user.uid)}
                                  className={`p-2 rounded-lg transition-colors duration-200
                                            ${darkMode
                                              ? 'hover:bg-dark-600 text-dark-300'
                                              : 'hover:bg-gray-100 text-gray-600'}`}
                                  title="View details"
                                >
                                  {expandedUser === user.uid ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                
                                {editingUser === user.uid ? (
                                  <>
                                    <button
                                      onClick={() => toggleUserRole(user.uid, user.role)}
                                      className={`p-2 rounded-lg transition-colors duration-200
                                                ${darkMode
                                                  ? 'bg-green-600 hover:bg-green-500 text-white'
                                                  : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                      title="Confirm role change"
                                    >
                                      <FaCheck className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingUser(null)}
                                      className={`p-2 rounded-lg transition-colors duration-200
                                                ${darkMode
                                                  ? 'bg-dark-600 hover:bg-dark-500 text-dark-200'
                                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                      title="Cancel"
                                    >
                                      <FaTimes className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => setEditingUser(user.uid)}
                                      disabled={user.uid === currentUser?.uid}
                                      className={`p-2 rounded-lg transition-colors duration-200
                                                ${user.uid === currentUser?.uid
                                                  ? 'opacity-50 cursor-not-allowed'
                                                  : darkMode
                                                    ? 'hover:bg-dark-600 text-dark-300'
                                                    : 'hover:bg-gray-100 text-gray-600'
                                                }`}
                                      title={user.uid === currentUser?.uid 
                                        ? "Cannot edit your own role" 
                                        : "Toggle user role"}
                                    >
                                      <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteUser(user.uid)}
                                      disabled={user.uid === currentUser?.uid}
                                      className={`p-2 rounded-lg transition-colors duration-200
                                                ${user.uid === currentUser?.uid
                                                  ? 'opacity-50 cursor-not-allowed'
                                                  : darkMode
                                                    ? 'hover:bg-red-600/20 text-red-400'
                                                    : 'hover:bg-red-50 text-red-600'
                                                }`}
                                      title={user.uid === currentUser?.uid 
                                        ? "Cannot delete your own account" 
                                        : "Delete user"}
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded User Details */}
                          {expandedUser === user.uid && (
                            <tr className={`${darkMode ? 'bg-dark-700/50' : 'bg-gray-50/50'}`}>
                              <td colSpan={5} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Subscription Management */}
                                  <div className={`p-4 rounded-lg border
                                                 ${darkMode 
                                                   ? 'bg-dark-600 border-dark-500' 
                                                   : 'bg-white border-gray-200'}`}>
                                    <h4 className={`font-semibold mb-3 flex items-center space-x-2
                                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                                      <FaCrown className="h-4 w-4" />
                                      <span>Subscription Management</span>
                                    </h4>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className={`block text-sm font-medium mb-2
                                                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                          Subscription Tier
                                        </label>
                                        <select
                                          value={user.subscriptionTier}
                                          onChange={(e) => handleSubscriptionChange(user.uid, e.target.value as any)}
                                          className={`w-full px-3 py-2 rounded-lg border
                                                    ${darkMode 
                                                      ? 'bg-dark-500 border-dark-400 text-dark-100' 
                                                      : 'bg-white border-gray-300 text-gray-900'}`}
                                        >
                                          <option value="free">Free</option>
                                          <option value="pro">Pro</option>
                                          <option value="team">Team</option>
                                          <option value="enterprise">Enterprise</option>
                                        </select>
                                      </div>
                                      
                                      <div className={`text-sm space-y-1
                                                     ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                                        <p>Status: <span className="font-medium">{user.subscriptionStatus}</span></p>
                                        {user.subscriptionExpiry && (
                                          <p>Expires: <span className="font-medium">
                                            {user.subscriptionExpiry.toLocaleDateString()}
                                          </span></p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Usage Information */}
                                  <div className={`p-4 rounded-lg border
                                                 ${darkMode 
                                                   ? 'bg-dark-600 border-dark-500' 
                                                   : 'bg-white border-gray-200'}`}>
                                    <h4 className={`font-semibold mb-3 flex items-center space-x-2
                                                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                                      <FaChartBar className="h-4 w-4" />
                                      <span>Usage Statistics</span>
                                    </h4>
                                    
                                    <div className={`space-y-2 text-sm
                                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                                      {user.usageQuota ? (
                                        <>
                                          <div className="flex justify-between">
                                            <span>Daily Uploads:</span>
                                            <span className="font-medium">
                                              {user.usageQuota.uploadsToday} / {
                                                user.usageQuota.maxUploadsPerDay === -1 
                                                  ? 'Unlimited' 
                                                  : user.usageQuota.maxUploadsPerDay
                                              }
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Monthly Uploads:</span>
                                            <span className="font-medium">
                                              {user.usageQuota.uploadsThisMonth} / {
                                                user.usageQuota.maxUploadsPerMonth === -1 
                                                  ? 'Unlimited' 
                                                  : user.usageQuota.maxUploadsPerMonth
                                              }
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Max File Size:</span>
                                            <span className="font-medium">
                                              {formatFileSize(user.usageQuota.maxFileSize)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Max Directory Files:</span>
                                            <span className="font-medium">
                                              {user.usageQuota.maxFilesPerDirectory === -1 
                                                ? 'Unlimited' 
                                                : user.usageQuota.maxFilesPerDirectory}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-gray-500">No usage data available</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                      <p className={`text-lg transition-colors duration-300
                                   ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        No users found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;