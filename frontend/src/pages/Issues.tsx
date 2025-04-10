import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, AlertCircle, CheckCircle, Clock, User, Filter, Search } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface Issue {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  assignee: {
    id: number;
    username: string;
    avatar: string;
  } | null;
  labels: string[];
  comments_count: number;
}

export default function Issues() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIssues();
  }, [creator_id, repo_name, filter]);

  const fetchIssues = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockIssues: Issue[] = [
        {
          id: 1,
          title: 'Fix navigation bug in mobile view',
          description: 'The navigation menu is not working correctly on mobile devices. Need to fix the responsive design issues.',
          status: 'open',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: { id: 1, username: 'demo', avatar: 'https://github.com/identicons/demo.png' },
          labels: ['bug', 'mobile', 'ui'],
          comments_count: 5,
        },
        {
          id: 2,
          title: 'Add dark mode support',
          description: 'Implement dark mode theme for the application. This should include a toggle button and appropriate styling.',
          status: 'open',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: null,
          labels: ['enhancement', 'ui'],
          comments_count: 3,
        },
        {
          id: 3,
          title: 'Update dependencies',
          description: 'Update all dependencies to their latest versions to fix security vulnerabilities.',
          status: 'closed',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: { id: 2, username: 'johndoe', avatar: 'https://github.com/identicons/johndoe.png' },
          labels: ['dependencies', 'security'],
          comments_count: 2,
        },
        {
          id: 4,
          title: 'Improve performance of data loading',
          description: 'The application is slow when loading large datasets. Need to implement pagination or infinite scrolling.',
          status: 'open',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: { id: 1, username: 'demo', avatar: 'https://github.com/identicons/demo.png' },
          labels: ['performance', 'backend'],
          comments_count: 7,
        },
        {
          id: 5,
          title: 'Add unit tests',
          description: 'Increase test coverage by adding unit tests for critical components.',
          status: 'open',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignee: null,
          labels: ['testing', 'quality'],
          comments_count: 1,
        },
      ];

      let filteredIssues = mockIssues;
      if (filter !== 'all') {
        filteredIssues = mockIssues.filter(issue => issue.status === filter);
      }

      if (searchQuery) {
        filteredIssues = filteredIssues.filter(issue => 
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          issue.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setIssues(filteredIssues);
      setLoading(false);
    }, 500);
  };

  const handleCreateIssue = () => {
    console.log('Create new issue');
    // Add navigation to a create issue page if implemented (e.g., /:creator_id/:repo_name/issues/new)
  };

  const handleIssueClick = (issueId: number) => {
    // Placeholder for navigating to issue detail (add route in App.tsx if needed)
    console.log('View issue:', issueId);
    // Uncomment and adjust if you add an IssueDetail route
    // navigate(`/${creator_id}/${repo_name}/issues/${issueId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/${creator_id}/${repo_name}`)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Issues</h1>
          </div>
          <button
            onClick={handleCreateIssue}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>New Issue</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('open')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'open' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilter('closed')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'closed' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Closed
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="w-full md:w-64 p-2 pl-8 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="table" />
          ) : (
            <div className="divide-y divide-gray-700">
              {issues.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No issues found</h3>
                  <p>There are no issues matching your current filter.</p>
                </div>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => handleIssueClick(issue.id)}
                    className="p-4 hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {issue.status === 'open' ? (
                          <AlertCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">{issue.title}</h3>
                          <div className="flex items-center space-x-2">
                            {issue.assignee ? (
                              <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full">
                                <img
                                  src={issue.assignee.avatar}
                                  alt={issue.assignee.username}
                                  className="h-5 w-5 rounded-full"
                                />
                                <span className="text-sm">{issue.assignee.username}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full">
                                <User className="h-4 w-4" />
                                <span className="text-sm">Unassigned</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-gray-400 line-clamp-2">{issue.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {issue.labels.map((label, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                            >
                              {label}
                            </span>
                          ))}
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Opened {formatDate(issue.created_at)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <span className="mx-2">•</span>
                            <span>{issue.comments_count} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}