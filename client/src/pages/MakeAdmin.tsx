import React, { useState, useEffect } from 'react';
import { Search, Shield, ShieldOff, Loader2, AlertCircle, Crown } from 'lucide-react';
import { getToken } from '../utils/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: string;
}

const MakeAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId));
      const token = getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users/${userId}/admin`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin })
      });

      if (!response.ok) {
        throw new Error('Failed to update admin status');
      }

      // Update the user in the local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isAdmin } : user
        )
      );

      setSuccessMessage(`User ${isAdmin ? 'promoted to' : 'removed from'} admin successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      console.error('Error updating admin status:', err);
      setError('Failed to update admin status. Please try again.');
    } finally {
      setUpdatingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.isAdmin).length;
  const premiumUsers = users.filter(user => user.isPremium).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-primary">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary mb-2">Admin Panel</h1>
          <p className="text-primary/70">Manage user admin privileges and view subscription status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-primary/70">Total Users</p>
                <p className="text-2xl font-bold text-primary">{totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-primary/70">Admin Users</p>
                <p className="text-2xl font-bold text-gold">{adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-gold/60" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-primary/70">Premium Users</p>
                <p className="text-2xl font-bold text-purple-600">{premiumUsers}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:border-gold bg-white"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Subscription</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Admin Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-primary/5">
                    <td className="px-6 py-4 text-sm text-primary font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary/70">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary/70">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isPremium 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isPremium ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </>
                        ) : (
                          'Free'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isAdmin 
                          ? 'bg-gold/20 text-gold' 
                          : 'bg-primary/10 text-primary/70'
                      }`}>
                        {user.isAdmin ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateAdminStatus(user._id, !user.isAdmin)}
                        disabled={updatingUsers.has(user._id)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                          user.isAdmin
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                            : 'bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30'
                        } disabled:opacity-50`}
                      >
                        {updatingUsers.has(user._id) ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : user.isAdmin ? (
                          <ShieldOff className="w-4 h-4 mr-1.5" />
                        ) : (
                          <Shield className="w-4 h-4 mr-1.5" />
                        )}
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12 text-primary/60">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-primary/60">
          <div>
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-6">
            <span>Premium Users: {premiumUsers}</span>
            <span>Admin Users: {adminUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAdmin;