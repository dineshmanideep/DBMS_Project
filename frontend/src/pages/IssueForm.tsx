import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { BASE_URL } from '../context/AuthContext';
import { Issue } from '../types/repository_types';

export default function IssueForm() {
  const { creator_id, repo_name, issue_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open'
  });

  // Fetch issue data if editing
  useEffect(() => {
    if (issue_id) {
      fetchIssueData();
    }
  }, [issue_id]);

  const fetchIssueData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/issues/${creator_id}/${repo_name}/${issue_id}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch issue');
      
      const data = await response.json();
      console.log("issue",data)
      setFormData({
        title: data.data.issue_title,
        description: data.data.issue_description,
        status: data.data.status
      });
    } catch (error) {
      setError('Failed to load issue data');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = issue_id 
        ? `${BASE_URL}/issues/${creator_id}/${repo_name}/${issue_id}`
        : `${BASE_URL}/issues/${creator_id}/${repo_name}/create`;

      const response = await fetch(url, {
        method: issue_id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save issue');
      }

      navigate(`/${creator_id}/${repo_name}/issues`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}/issues`)}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold ml-2">
            {issue_id ? 'Edit Issue' : 'Create New Issue'}
          </h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Issue title"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px]"
                placeholder="Describe the issue..."
                required
              />
            </div>

            {issue_id && (
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/${creator_id}/${repo_name}/issues`)}
                className="px-4 py-2 mr-3 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  issue_id ? 'Saving...' : 'Creating...'
                ) : (
                  issue_id ? 'Save Changes' : 'Create Issue'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}