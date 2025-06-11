import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { emailService, EmailSubscriber } from '../../services/emailService';
import {
  FaEnvelope,
  FaDownload,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaChartBar,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaSpinner,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const EmailManagement: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const [emails, setEmails] = useState<EmailSubscriber[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    subscribed: 0,
    unsubscribed: 0,
    bySource: {} as Record<string, number>
  });
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Fetch emails and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      const [emailData, statsData] = await Promise.all([
        emailService.getAllEmails(),
        emailService.getEmailStats()
      ]);
      
      setEmails(emailData);
      setFilteredEmails(emailData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching email data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter emails based on search and filters
  useEffect(() => {
    let filtered = emails.filter(email => {
      const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           email.metadata?.displayName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource = sourceFilter === 'all' || email.source === sourceFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'subscribed' && email.subscribed) ||
                           (statusFilter === 'unsubscribed' && !email.subscribed);

      return matchesSearch && matchesSource && matchesStatus;
    });

    setFilteredEmails(filtered);
  }, [searchTerm, sourceFilter, statusFilter, emails]);

  // Handle bulk actions
  const handleBulkUnsubscribe = async () => {
    if (selectedEmails.size === 0) return;
    
    if (!confirm(`Unsubscribe ${selectedEmails.size} selected emails?`)) return;

    try {
      await Promise.all(
        Array.from(selectedEmails).map(emailId => emailService.unsubscribe(emailId))
      );
      setSelectedEmails(new Set());
      await fetchData();
    } catch (error) {
      console.error('Error bulk unsubscribing:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmails.size === 0) return;
    
    if (!confirm(`Permanently delete ${selectedEmails.size} selected emails? This cannot be undone.`)) return;

    try {
      await Promise.all(
        Array.from(selectedEmails).map(emailId => emailService.deleteEmail(emailId))
      );
      setSelectedEmails(new Set());
      await fetchData();
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  // Export emails to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Source', 'Status', 'Subscribed Date', 'Display Name', 'User ID'],
      ...filteredEmails.map(email => [
        email.email,
        email.source,
        email.subscribed ? 'Subscribed' : 'Unsubscribed',
        email.subscribedAt.toLocaleDateString(),
        email.metadata?.displayName || '',
        email.metadata?.userId || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSourceBadge = (source: string) => {
    const configs = {
      user_signup: { label: 'User Signup', color: 'bg-blue-100 text-blue-800' },
      newsletter: { label: 'Newsletter', color: 'bg-green-100 text-green-800' },
      footer: { label: 'Footer', color: 'bg-purple-100 text-purple-800' },
      manual: { label: 'Manual', color: 'bg-gray-100 text-gray-800' }
    };

    const config = configs[source as keyof typeof configs] || configs.manual;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        darkMode 
          ? config.color.replace('100', '900/20').replace('800', '400')
          : config.color
      }`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-colors duration-300
                   ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Email Management</h2>
          <p className={`${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
            Manage email subscribers and export lists
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105
                      ${darkMode
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            <FaDownload className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border-dark-600' 
                         : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Total Emails
              </p>
              <p className="text-2xl font-bold mt-2">{stats.total}</p>
            </div>
            <FaUsers className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border-dark-600' 
                         : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Subscribed
              </p>
              <p className="text-2xl font-bold mt-2 text-green-600">{stats.subscribed}</p>
            </div>
            <FaUserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border-dark-600' 
                         : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Unsubscribed
              </p>
              <p className="text-2xl font-bold mt-2 text-red-600">{stats.unsubscribed}</p>
            </div>
            <FaUserTimes className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border-dark-600' 
                         : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                Conversion Rate
              </p>
              <p className="text-2xl font-bold mt-2 text-purple-600">
                {stats.total > 0 ? Math.round((stats.subscribed / stats.total) * 100) : 0}%
              </p>
            </div>
            <FaChartBar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`p-6 rounded-xl border transition-colors duration-300
                     ${darkMode 
                       ? 'bg-dark-800 border-dark-600' 
                       : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className={`absolute left-3 top-3.5 h-4 w-4
                                 ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${darkMode
                          ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            />
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={`px-4 py-3 rounded-lg border transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          >
            <option value="all">All Sources</option>
            <option value="user_signup">User Signup</option>
            <option value="newsletter">Newsletter</option>
            <option value="footer">Footer</option>
            <option value="manual">Manual</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 rounded-lg border transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          >
            <option value="all">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedEmails.size > 0 && (
          <div className="mt-4 flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-sm font-medium text-blue-800">
              {selectedEmails.size} emails selected
            </span>
            <div className="flex space-x-3">
              <button
                onClick={handleBulkUnsubscribe}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white"
              >
                Unsubscribe Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className={`rounded-xl border transition-colors duration-300
                     ${darkMode 
                       ? 'bg-dark-800 border-dark-600' 
                       : 'bg-white border-gray-200 shadow-sm'}`}>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmails.size === filteredEmails.length && filteredEmails.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmails(new Set(filteredEmails.map(email => email.id!)));
                      } else {
                        setSelectedEmails(new Set());
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className={`text-left p-4 font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Email
                </th>
                <th className={`text-left p-4 font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Source
                </th>
                <th className={`text-left p-4 font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`text-left p-4 font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Subscribed Date
                </th>
                <th className={`text-right p-4 font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => (
                <React.Fragment key={email.id}>
                  <tr className={`border-b transition-all duration-200
                                ${darkMode 
                                  ? 'border-dark-600 hover:bg-dark-700' 
                                  : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedEmails.has(email.id!)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedEmails);
                          if (e.target.checked) {
                            newSelected.add(email.id!);
                          } else {
                            newSelected.delete(email.id!);
                          }
                          setSelectedEmails(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{email.email}</p>
                        {email.metadata?.displayName && (
                          <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                            {email.metadata.displayName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {getSourceBadge(email.source)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                      ${email.subscribed
                                        ? darkMode
                                          ? 'bg-green-900/20 text-green-400'
                                          : 'bg-green-100 text-green-800'
                                        : darkMode
                                          ? 'bg-red-900/20 text-red-400'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                        {email.subscribed ? <FaCheck className="mr-1 h-3 w-3" /> : <FaTimes className="mr-1 h-3 w-3" />}
                        {email.subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        {email.subscribedAt.toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setShowDetails(showDetails === email.id ? null : email.id!)}
                          className={`p-2 rounded-lg transition-colors duration-200
                                    ${darkMode
                                      ? 'hover:bg-dark-600 text-dark-300'
                                      : 'hover:bg-gray-100 text-gray-600'}`}
                          title="View details"
                        >
                          {showDetails === email.id ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        
                        {email.subscribed ? (
                          <button
                            onClick={() => emailService.unsubscribe(email.id!).then(fetchData)}
                            className={`p-2 rounded-lg transition-colors duration-200
                                      ${darkMode
                                        ? 'hover:bg-orange-600/20 text-orange-400'
                                        : 'hover:bg-orange-50 text-orange-600'}`}
                            title="Unsubscribe"
                          >
                            <FaUserTimes className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => emailService.resubscribe(email.id!).then(fetchData)}
                            className={`p-2 rounded-lg transition-colors duration-200
                                      ${darkMode
                                        ? 'hover:bg-green-600/20 text-green-400'
                                        : 'hover:bg-green-50 text-green-600'}`}
                            title="Resubscribe"
                          >
                            <FaUserCheck className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            if (confirm('Permanently delete this email?')) {
                              emailService.deleteEmail(email.id!).then(fetchData);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors duration-200
                                    ${darkMode
                                      ? 'hover:bg-red-600/20 text-red-400'
                                      : 'hover:bg-red-50 text-red-600'}`}
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded details row */}
                  {showDetails === email.id && (
                    <tr className={`${darkMode ? 'bg-dark-700/50' : 'bg-gray-50/50'}`}>
                      <td colSpan={6} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Metadata</h4>
                            <div className={`text-sm space-y-1 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                              {email.metadata?.userId && (
                                <p><strong>User ID:</strong> {email.metadata.userId}</p>
                              )}
                              {email.metadata?.userAgent && (
                                <p><strong>User Agent:</strong> {email.metadata.userAgent}</p>
                              )}
                              {email.metadata?.referrer && (
                                <p><strong>Referrer:</strong> {email.metadata.referrer}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Timeline</h4>
                            <div className={`text-sm space-y-1 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                              <p><strong>Subscribed:</strong> {email.subscribedAt.toLocaleString()}</p>
                              {email.unsubscribedAt && (
                                <p><strong>Unsubscribed:</strong> {email.unsubscribedAt.toLocaleString()}</p>
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
          
          {filteredEmails.length === 0 && (
            <div className="p-12 text-center">
              <FaEnvelope className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
              <p className={`text-lg ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                No emails found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailManagement;
