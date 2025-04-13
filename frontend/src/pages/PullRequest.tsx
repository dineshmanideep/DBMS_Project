import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitPullRequest, Check, X, MessageSquare, GitCommit, Clock, User, Plus } from 'lucide-react';
import { useAuth, BASE_URL } from '../context/AuthContext';
import { timeAgo } from '../lib/timeAlgo';
interface Branch {
  branch_id: number;
  name: string;
}


interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface PullRequest {
  pr_id: number;
  pr_title: string;
  pr_description: string;
  creator_id: string;
  pr_status: 'Open' | 'Merged' | 'Closed';
  creation_date: string;
  base_branch_id:string;
  target_branch_id:string;
  User: { username: string };
  baseBranch: { name: string };
  targetBranch: { name: string }
}

export default function PullRequest() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formData, setFormData] = useState({
    pr_title: '',
    pr_description: '',
    base_branch_id: '',
    target_branch_id: ''
  });

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/branch/list/${creator_id}/${repo_name}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  // Add fetchBranches to useEffect
  useEffect(() => {
    fetchPullRequests();
    fetchBranches();
  }, [creator_id, repo_name]);
  const fetchPullRequests = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/pull-requests/list/${creator_id}/${repo_name}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      console.log("pull request",data.data)
      if (response.ok) {
        setPullRequests(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch pull requests');
    }
  };

  const handleCreatePR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/pull-requests/create/${creator_id}/${repo_name}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchPullRequests();
        setShowCreateForm(false);
        setFormData({
          pr_title: '',
          pr_description: '',
          base_branch_id: '',
          target_branch_id: ''
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to create pull request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPullRequests();
  }, [creator_id, repo_name]);



  const handleMergePR = (prId: number) => {
    console.log(`Merging PR #${prId}`);
    setPullRequests(pullRequests.map(pr =>
      pr.pr_id === prId ? { ...pr, status: 'Merged' } : pr
    ));
  };

  const handleClosePR = (prId: number) => {
    console.log(`Closing PR #${prId}`);
    setPullRequests(pullRequests.map(pr =>
      pr.pr_id === prId ? { ...pr, status: 'Closed' } : pr
    ));
  };

  const handleOpenPR = (prId: number) => {
    navigate(`/${creator_id}/${repo_name}/pull/${prId}`);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GitPullRequest className="h-6 w-6 text-indigo-400" />
              <h1 className="ml-3 text-2xl font-bold text-white">Pull Requests</h1>
            </div>
            {creator_id !== 'main' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <GitPullRequest className="h-4 w-4 mr-2" />
                Create Pull Request
              </button>
            )}
          </div>
        </div>

        {/* Create PR Form */}
        {showCreateForm && (
          <div className="bg-gray-800 rounded-lg shadow-lg mb-8 border border-gray-700">
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">Create Pull Request</h2>
              <form onSubmit={handleCreatePR}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.pr_title}
                      onChange={(e) => setFormData({ ...formData, pr_title: e.target.value })}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                      placeholder="Pull request title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="base_branch" className="block text-sm font-medium text-gray-300">
                        Base Branch (target)
                      </label>
                      <select
                        id="base_branch"
                        value={formData.base_branch_id}
                        onChange={(e) => setFormData({ ...formData, base_branch_id: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                        required
                      >
                        <option value="">Select base branch</option>
                        {branches.map((branch) => (
                          <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="target_branch" className="block text-sm font-medium text-gray-300">
                        Compare Branch (source)
                      </label>
                      <select
                        id="target_branch"
                        value={formData.target_branch_id}
                        onChange={(e) => setFormData({ ...formData, target_branch_id: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                        required
                      >
                        <option value="">Select compare branch</option>
                        {branches.map((branch) => (
                          <option
                            key={branch.branch_id}
                            value={branch.branch_id}
                            disabled={branch.branch_id === Number(formData.base_branch_id)}
                          >
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.pr_description}
                      onChange={(e) => setFormData({ ...formData, pr_description: e.target.value })}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                      placeholder="Describe your changes"
                    />
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pull Requests List */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-700">
            {pullRequests.map((pr) => (
              <div key={pr.pr_id} className="p-6 hover:bg-gray-750 transition-colors" onClick={()=>navigate(`/${creator_id}/${repo_name}/pull/${pr.pr_id}`)}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{pr.pr_title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{pr.pr_description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                      <span>#{pr.pr_id}</span>
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        {pr.User?.username}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {timeAgo(pr.creation_date)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pr.pr_status === 'Open'
                        ? 'bg-green-900 text-green-300'
                        : pr.pr_status === 'Merged'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-red-900 text-red-300'
                      }`}>
                      {pr.pr_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {pullRequests.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <GitPullRequest size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No pull requests yet</p>
                <p className="mt-1">Create a new branch and submit a pull request to start collaborating</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}