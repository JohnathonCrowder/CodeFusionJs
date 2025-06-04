import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  FaUsers,
  FaChartBar,
  FaCog,
  FaShieldAlt,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCheck,
  FaSearch,
  FaSort,
  FaExclamationCircle
} from "react-icons/fa";

interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
}

const AdminDashboard: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser, isAdmin } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'role'>('date');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      
      const usersList = userSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as User[];
      
      setUsers(usersList);
      setFilteredUsers(usersList);
      
      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      setStats({
        totalUsers: usersList.length,
        adminUsers: usersList.filter(u => u.role === 'admin').length,
        regularUsers: usersList.filter(u => u.role === 'user').length,
        recentUsers: usersList.filter(u => u.createdAt > oneWeekAgo).length
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

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort users
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'name':
          return (a.displayName || a.email).localeCompare(b.displayName || b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });
    
    setFilteredUsers(sorted);
  }, [searchTerm, users, sortBy]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.uid) {
      setError("You cannot change your own role");
      return;
    }

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      await fetchUsers(); // Refresh the list
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user role");
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
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
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
              Manage users and view system statistics
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  Regular Users
                </p>
                <p className={`text-2xl font-bold mt-2 transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  {stats.regularUsers}
                </p>
              </div>
              <FaUsers className={`h-8 w-8 transition-colors duration-300
                                 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
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
              
              <div className="flex items-center gap-4">
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
                    <tr 
                      key={user.uid}
                      className={`border-b transition-all duration-200
                                ${darkMode 
                                  ? 'border-dark-600 hover:bg-dark-700' 
                                  : 'border-gray-200 hover:bg-gray-50'}`}
                    >
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
                        <p className={`text-sm transition-colors duration-300
                                     ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                          {user.createdAt.toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end space-x-2">
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
      </div>
    </div>
  );
};

export default AdminDashboard;