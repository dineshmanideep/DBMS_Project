import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, UserPlus, Trash2, Users, Lock, Globe, AlertTriangle } from 'lucide-react';
import { Contributor } from '../types/repository';

export default function RepositorySettings() {
  const { username, repo_id } = useParams();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [newContributor, setNewContributor] = useState({ username: '', role: 'Contributor' });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Mock contributors data
  const [contributors, setContributors] = useState<Contributor[]>([
    {
      user_id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      user_id: 2,
      username: 'janedoe',
      email: 'jane@example.com',
      role: 'Contributor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ]);

  const handleDeleteRepository = () => {
    if (deleteConfirmation === repo_id) {
      // Mock API call for deletion
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setShowDeleteWarning(true);
    }
  };

  const handleAddContributor = () => {
    if (newContributor.username.trim() === '') return;
    
    // Mock API call
    setContributors([...contributors, {
      user_id: Math.floor(Math.random() * 10000),
      username: newContributor.username,
      email: `${newContributor.username}@example.com`,
      role: newContributor.role as 'Admin' | 'Contributor',
    }]);
    setShowAddContributor(false);
    setNewContributor({ username: '', role: 'Contributor' });
  };

  const handleChangeRole = (userId: number, newRole: 'Admin' | 'Contributor') => {
    setContributors(contributors.map(c => 
      c.user_id === userId ? { ...c, role: newRole } : c
    ));
  };

  const handleRemoveContributor = (userId: number) => {
    if (window.confirm('Are you sure you want to remove this contributor?')) {
      setContributors(contributors.filter(c => c.user_id !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="px-6 py-5 border-b border-gray-700">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-indigo-400" />
              <h1 className="ml-3 text-xl font-semibold text-white">Repository Settings</h1>
            </div>
          </div>

          {/* Visibility Section */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white mb-4">Repository Visibility</h2>
            <div className="space-y-4">
              <div 
                className={`flex items-start p-4 rounded-md cursor-pointer border ${visibility === 'Public' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 bg-gray-750'}`}
                onClick={() => setVisibility('Public')}
              >
                <input
                  type="radio"
                  checked={visibility === 'Public'}
                  onChange={() => setVisibility('Public')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 mt-1"
                />
                <div className="ml-3">
                  <label className="flex items-center text-white font-medium cursor-pointer">
                    <Globe className="h-5 w-5 mr-2 text-green-400" />
                    Public
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Anyone can see this repository. You choose who can commit.
                  </p>
                </div>
              </div>
              
              <div 
                className={`flex items-start p-4 rounded-md cursor-pointer border ${visibility === 'Private' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 bg-gray-750'}`}
                onClick={() => setVisibility('Private')}
              >
                <input
                  type="radio"
                  checked={visibility === 'Private'}
                  onChange={() => setVisibility('Private')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 mt-1"
                />
                <div className="ml-3">
                  <label className="flex items-center text-white font-medium cursor-pointer">
                    <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                    Private
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Only contributors can see this repository. You choose who can contribute.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">
                <Users className="h-5 w-5 inline mr-2" />
                Contributors
              </h2>
              <button
                onClick={() => setShowAddContributor(!showAddContributor)}
                className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contributor
              </button>
            </div>
            
            {showAddContributor && (
              <div className="mb-6 p-4 bg-gray-750 rounded-md border border-gray-700">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={newContributor.username}
                    onChange={(e) => setNewContributor({ ...newContributor, username: e.target.value })}
                    placeholder="Username or email"
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={newContributor.role}
                    onChange={(e) => setNewContributor({ ...newContributor, role: e.target.value })}
                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddContributor(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContributor}
                      className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-gray-700 rounded-md border border-gray-700 overflow-hidden">
              {contributors.map((contributor) => (
                <div key={contributor.user_id} className="flex items-center justify-between p-4 hover:bg-gray-750">
                  <div className="flex items-center">
                    <img
                      src={contributor.avatar || 'https://github.com/ghost.png'}
                      alt={`${contributor.username}'s avatar`}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium text-white">{contributor.username}</div>
                      <div className="text-sm text-gray-400">{contributor.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={contributor.role}
                      onChange={(e) => handleChangeRole(contributor.user_id, e.target.value as 'Admin' | 'Contributor')}
                      className="bg-gray-700 border border-gray-600 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Contributor">Contributor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    
                    <button
                      onClick={() => handleRemoveContributor(contributor.user_id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove contributor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h2>
            <div className="bg-red-900/30 border border-red-800 rounded-md p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-white font-medium">Delete Repository</h3>
                  <p className="text-sm text-gray-300">
                    Once you delete a repository, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteWarning(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Repository
                </button>
              </div>
              
              {showDeleteWarning && (
                <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-md">
                  <div className="flex items-start mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <p className="text-sm text-red-300">
                      This action cannot be undone. This will permanently delete the <strong>{username}/{repo_id}</strong> repository, wiki, issues, comments, packages, and releases.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 items-center">
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder={`Type ${repo_id} to confirm`}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleDeleteRepository}
                      disabled={deleteConfirmation !== repo_id}
                      className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      I understand, delete this repository
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
