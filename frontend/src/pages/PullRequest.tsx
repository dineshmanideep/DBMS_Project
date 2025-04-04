import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitPullRequest, Check, X, MessageSquare, GitCommit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PullRequest {
  id: number;
  title: string;
  description: string;
  author: string;
  status: 'Open' | 'Merged' | 'Closed';
  createdAt: string;
  commits: number;
  comments: number;
}

export default function PullRequest() {
  const { username, repo_id, branch_name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Mock pull requests data
  const pullRequests: PullRequest[] = [
    {
      id: 1,
      title: 'Add user authentication',
      description: 'Implements user authentication using JWT tokens',
      author: 'johndoe',
      status: 'Open',
      createdAt: '2 days ago',
      commits: 3,
      comments: 2,
    },
    {
      id: 2,
      title: 'Fix login page styling',
      description: 'Updates the login page with new design',
      author: 'janedoe',
      status: 'Merged',
      createdAt: '1 week ago',
      commits: 1,
      comments: 4,
    },
  ];

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create pull request
    setShowCreateForm(false);
    setFormData({ title: '', description: '' });
  };

  const handleMergePR = (prId: number) => {
    // TODO: Implement merge pull request
  };

  const handleClosePR = (prId: number) => {
    // TODO: Implement close pull request
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GitPullRequest className="h-6 w-6 text-gray-400" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Pull Requests</h1>
            </div>
            {branch_name !== 'main' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <GitPullRequest className="h-4 w-4 mr-2" />
                Create Pull Request
              </button>
            )}
          </div>
        </div>

        {/* Create PR Form */}
        {showCreateForm && (
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create Pull Request</h2>
              <form onSubmit={handleCreatePR}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pull Requests List */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="divide-y divide-gray-200">
            {pullRequests.map((pr) => (
              <div key={pr.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{pr.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{pr.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>#{pr.id}</span>
                      <span>by {pr.author}</span>
                      <span>{pr.createdAt}</span>
                      <span className="flex items-center">
                        <GitCommit className="h-4 w-4 mr-1" />
                        {pr.commits} commits
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {pr.comments} comments
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {pr.status === 'Open' && user?.username === 'testuser' && (
                      <>
                        <button
                          onClick={() => handleMergePR(pr.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Merge
                        </button>
                        <button
                          onClick={() => handleClosePR(pr.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Close
                        </button>
                      </>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pr.status === 'Open'
                          ? 'bg-green-100 text-green-800'
                          : pr.status === 'Merged'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pr.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}