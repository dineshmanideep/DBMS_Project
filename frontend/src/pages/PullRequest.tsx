import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitPullRequest, Check, X, MessageSquare, GitCommit, Clock, User, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface PullRequest {
  id: number;
  title: string;
  description: string;
  author: string;
  status: 'Open' | 'Merged' | 'Closed';
  createdAt: string;
  commits: number;
  comments: Comment[];
}

export default function PullRequest() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([
    {
      id: 1,
      title: 'Add user authentication',
      description: 'Implements user authentication using JWT tokens',
      author: 'johndoe',
      status: 'Open',
      createdAt: '2 days ago',
      commits: 3,
      comments: [
        { id: 1, author: 'janedoe', content: 'Looks good, but add error handling.', createdAt: '1 day ago' },
        { id: 2, author: 'johndoe', content: 'Added error handling as requested.', createdAt: '12 hours ago' },
      ],
    },
    {
      id: 2,
      title: 'Fix login page styling',
      description: 'Updates the login page with new design',
      author: 'janedoe',
      status: 'Merged',
      createdAt: '1 week ago',
      commits: 1,
      comments: [
        { id: 1, author: 'mike_smith', content: 'Nice design changes!', createdAt: '6 days ago' },
      ],
    },
  ]);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCreateForm(false);
      setFormData({ title: '', description: '' });
      const newPR: PullRequest = {
        id: pullRequests.length + 1,
        title: formData.title,
        description: formData.description,
        author: user?.username || 'anonymous',
        status: 'Open',
        createdAt: 'just now',
        commits: 0,
        comments: [],
      };
      setPullRequests([...pullRequests, newPR]);
    }, 1000);
  };

  const handleMergePR = (prId: number) => {
    console.log(`Merging PR #${prId}`);
    setPullRequests(pullRequests.map(pr =>
      pr.id === prId ? { ...pr, status: 'Merged' } : pr
    ));
  };

  const handleClosePR = (prId: number) => {
    console.log(`Closing PR #${prId}`);
    setPullRequests(pullRequests.map(pr =>
      pr.id === prId ? { ...pr, status: 'Closed' } : pr
    ));
  };

  const handleOpenPR = (prId: number) => {
    navigate(`/${creator_id}/${repo_name}/pull/${prId}`);
  };

  const handleAddComment = (prId: number, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = newComment[prId]?.trim();
    if (!commentText) return;

    setPullRequests(pullRequests.map(pr =>
      pr.id === prId
        ? {
            ...pr,
            comments: [
              ...pr.comments,
              {
                id: pr.comments.length + 1,
                author: user?.username || 'anonymous',
                content: commentText,
                createdAt: 'just now',
              },
            ],
          }
        : pr
    ));
    setNewComment(prev => ({ ...prev, [prId]: '' }));
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                      placeholder="Pull request title"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                      placeholder="Describe your changes"
                    />
                  </div>
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
              <div key={pr.id} className="p-6 hover:bg-gray-750 transition-colors">
                <div onClick={() => handleOpenPR(pr.id)} className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{pr.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">{pr.description}</p>
                      <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span>#{pr.id}</span>
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {pr.author}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {pr.createdAt}
                        </span>
                        <span className="flex items-center">
                          <GitCommit size={14} className="mr-1" />
                          {pr.commits} commits
                        </span>
                        <span className="flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          {pr.comments.length} comments
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {pr.status === 'Open' && user?.username === 'testuser' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMergePR(pr.id); }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-600 transition-colors"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Merge
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleClosePR(pr.id); }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Close
                          </button>
                        </>
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pr.status === 'Open'
                            ? 'bg-green-900 text-green-300'
                            : pr.status === 'Merged'
                            ? 'bg-purple-900 text-purple-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {pr.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Section for Each PR */}
                <div className="mt-4 p-4 bg-gray-750 rounded-md border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Comments</h4>
                  {pr.comments.map((comment) => (
                    <div key={comment.id} className="mb-2 text-sm text-gray-300">
                      <span className="font-medium">{comment.author}</span> ({comment.createdAt}): {comment.content}
                    </div>
                  ))}
                  <form onSubmit={(e) => { e.stopPropagation(); handleAddComment(pr.id, e); }} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newComment[pr.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [pr.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </form>
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