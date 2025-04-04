import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, UserPlus, Trash2, Users, Lock, Globe } from 'lucide-react';
import { Contributor } from '../types/repository';

export default function RepositorySettings() {
  const { username, repo_id } = useParams();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [newContributor, setNewContributor] = useState({ username: '', role: 'Contributor' });

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
    if (window.confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      // TODO: Implement repository deletion
      navigate('/');
    }
  };

  const handleAddContributor = () => {
    // TODO: Implement add contributor logic
    setContributors([...contributors, {
      user_id: Math.random(),
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {/* Header */}
          <div className="px-6 py-5">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-gray-400" />
              <h2 className="ml-3 text-xl font-bold text-gray-900">Repository Settings</h2>
            </div>
          </div>

          {/* Visibility Section */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900">Repository Visibility</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  id="public"
                  checked={visibility === 'Public'}
                  onChange={() => setVisibility('Public')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="public" className="ml-3 flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Public</span>
                    <span className="block text-sm text-gray-500">Anyone can see this repository</span>
                  </div>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  id="private"
                  checked={visibility === 'Private'}
                  onChange={() => setVisibility('Private')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="private" className="ml-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Private</span>
                    <span className="block text-sm text-gray-500">Only contributors can see this repository</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contributors</h3>
              <button
                onClick={() => setShowAddContributor(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contributor
              </button>
            </div>

            {showAddContributor && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={newContributor.username}
                    onChange={(e) => setNewContributor({ ...newContributor, username: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <select
                    value={newContributor.role}
                    onChange={(e) => setNewContributor({ ...newContributor, role: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddContributor(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContributor}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              {contributors.map((contributor) => (
                <div
                  key={contributor.user_id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center">
                    <img
                      src={contributor.avatar || `https://ui-avatars.com/api/?name=${contributor.username}`}
                      alt={contributor.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{contributor.username}</div>
                      <div className="text-sm text-gray-500">{contributor.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={contributor.role}
                      onChange={(e) => handleChangeRole(contributor.user_id, e.target.value as 'Admin' | 'Contributor')}
                      className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Contributor">Contributor</option>
                    </select>
                    <button
                      onClick={() => handleRemoveContributor(contributor.user_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <div className="mt-4">
              <button
                onClick={handleDeleteRepository}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}