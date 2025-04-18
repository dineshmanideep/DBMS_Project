import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, UserPlus, Trash2, Users, Lock, Globe, AlertTriangle, ChevronLeft } from 'lucide-react';
import { ContributerDetails } from '../types/repository_types';
import { BASE_URL, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
// Add this at the top of your file after imports
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB'
};

const LANGUAGES = Object.keys(LANGUAGE_COLORS);

export default function RepositorySettings() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoDetails, setRepoDetails] = useState({
    repo_name: '',
    description: '',
    visibility: 'Public' as 'Public' | 'Private',
    license: 'MIT License',
    language: '',
    languageColor: '',
    tags: [] as string[]
  });

  const [showAddContributor, setShowAddContributor] = useState(false);
  const [newContributor, setNewContributor] = useState({ creator_id: '', role: 'Contributor' });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [contributors, setContributors] = useState<ContributerDetails[]>([]);
  const { user } = useAuth();
  const [change, setChange] = useState(false);

  const fetchRepoDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/repo/get/${creator_id}/${repo_name}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        // Parse tags if they come as string
        const parsedTags = typeof data.data.tags === 'string'
          ? JSON.parse(data.data.tags)
          : data.data.tags || [];

        setRepoDetails({
          repo_name: data.data.repo_name,
          description: data.data.description || '',
          visibility: data.data.visibility,
          license: data.data.license || 'MIT License',
          language: data.data.language || '',
          languageColor: data.data.languageColor || '',
          tags: parsedTags
        });
      }
    } catch (error) {
      setError('Failed to load repository settings');
    }
  };

  const fetchContributors = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contributer/all/${creator_id}/${repo_name}/`,
        { credentials: 'include' }
      );
      const data = await response.json();
      console.log("contributers ",data.data.contributors)
      if (data.message === "Successfully retrieved contributors") {

        setContributors(data.data.contributors);
      }
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRepo = async () => {
    try {
      // Ensure tags is an array before sending
      const tagsToSend = Array.isArray(repoDetails.tags) ? repoDetails.tags : [];

      const response = await fetch(
        `${BASE_URL}/repo/${creator_id}/${repo_name}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            new_repo_name: repoDetails.repo_name,
            description: repoDetails.description,
            visibility: repoDetails.visibility,
            license: repoDetails.license,
            language: repoDetails.language,
            languageColor: repoDetails.languageColor,
            tags: tagsToSend
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update repository');
      }

      const data = await response.json();
      if (data.message === "Repository updated successfully") {
        if (repoDetails.repo_name !== repo_name) {
          navigate(`/${creator_id}/${repoDetails.repo_name}/settings`);
        }
        setRepoDetails(prev => ({ ...prev, ...data.data }));
        toast.success("updated settings")
        setChange(false);
      }
    } catch (error) {
      setError('Failed to update repository settings');
      toast.error("Failed to update repository settings")
    }
  };

  const handleAddContributor = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contributer/${creator_id}/${repo_name}/add`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: newContributor.creator_id,
            role: newContributor.role
          })
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle different error cases
        switch (response.status) {
          case 404:
            throw new Error(data.message || 'User not found');
          case 400:
            throw new Error(data.message || 'Invalid request');
          case 403:
            throw new Error(data.message || 'Not authorized to add contributors');
          case 409:
            throw new Error(data.message || 'User is already a contributor');
          default:
            throw new Error(data.message || 'Failed to add contributor');
        }
      }
  
      // Success case
      await fetchContributors();
      setShowAddContributor(false);
      setNewContributor({ creator_id: '', role: 'Contributor' });
      toast.success("Successfully added contributor");
  
    } catch (error) {
      console.error('Add contributor error:', error);
      toast.error(error.message || 'Failed to add contributor');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/contributer/${creator_id}/${repo_name}/${userId}/role`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ role: newRole })
        }
      );

      if (response.ok) {
        await fetchContributors();
      }
    } catch (error) {
      setError('Failed to update role');
    }
  };

  const handleRemoveContributor = async (userId: number) => {
    if (!window.confirm('Are you sure you want to remove this contributor?')) return;

    try {
      const response = await fetch(
        `${BASE_URL}/contributer/${creator_id}/${repo_name}/${userId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (response.ok) {
        await fetchContributors();
        toast.success("Removed Contributer")
      }
    } catch (error) {
      setError('Failed to remove contributor');
      toast.error("removed contributer")
    }
  };



  const handleDeleteRepository = async () => {
    if (deleteConfirmation !== repo_name) {
      toast.error("Name didnt match")
      setDeleteConfirmation("")
      setShowDeleteWarning(true);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/repo/${creator_id}/${repo_name}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (response.ok) {
        toast.success("Deleted the repository")
        navigate('/');
      }
    } catch (error) {
      setError('Failed to delete repository');
      toast.error("Failed to delete the repository")
    }
  };


  useEffect(() => {
    console.log("setloading true")
    setLoading(true);
    try {
      fetchRepoDetails();
      fetchContributors();
    } catch (error) {
      console.log("error:", error)
    }
    finally {
      console.log("set loading false")
      setLoading(false)
    }

  }, [creator_id, repo_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-800 rounded-md p-4 max-w-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}/main`)}
            className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back to Repository
          </button>
        </div>
      </div>
    );
  }

  // The rest of your existing return statement and JSX remains the same

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/${creator_id}/${repo_name}/main`)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Repository Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Repository Name</label>
                <input
                  type="text"
                  value={repoDetails.repo_name}
                  onChange={(e) => { setRepoDetails(prev => ({ ...prev, repo_name: e.target.value })), setChange(true) }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={repoDetails.description}
                  onChange={(e) => { setRepoDetails(prev => ({ ...prev, description: e.target.value })), setChange(true) }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="bg-gray-800 rounded-lg p-6 ">
            <h2 className="text-xl font-semibold mb-4">Repository Visibility</h2>
            <div className="space-y-4">
              <button
                onClick={() => { setRepoDetails({ ...repoDetails, visibility: 'Public' }), setChange(true) }}
                className={`w-full flex items-start p-4 rounded-lg border ${repoDetails.visibility === 'Public'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                  }`}
              >
                <Globe className="h-6 w-6 text-green-400 mt-1" />
                <div className="ml-3 text-left">
                  <p className="font-medium">Public</p>
                  <p className="text-sm text-gray-400">Anyone can see this repository</p>
                </div>
              </button>

              <button
                onClick={() => { setRepoDetails({ ...repoDetails, visibility: 'Private' }), setChange(true) }}
                className={`w-full flex items-start p-4 rounded-lg border ${repoDetails.visibility === 'Private'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                  }`}
              >
                <Lock className="h-6 w-6 text-yellow-400 mt-1" />
                <div className="ml-3 text-left">
                  <p className="font-medium">Private</p>
                  <p className="text-sm text-gray-400">Only contributors can see this repository</p>
                </div>
              </button>
            </div>


          </div>
          {/* Additional Settings */}
          {/* Additional Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">License</label>
                <select
                  value={repoDetails.license}
                  onChange={(e) => {
                    setRepoDetails(prev => ({ ...prev, license: e.target.value }));
                    setChange(true);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MIT License">MIT License</option>
                  <option value="Apache License 2.0">Apache License 2.0</option>
                  <option value="GNU GPL v3">GNU GPL v3</option>
                  <option value="BSD 3-Clause">BSD 3-Clause</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Language</label>
                <select
                  value={repoDetails.language}
                  onChange={(e) => {
                    const selectedLang = e.target.value;
                    setRepoDetails(prev => ({
                      ...prev,
                      language: selectedLang,
                      languageColor: LANGUAGE_COLORS[selectedLang] || '#000000'
                    }));
                    setChange(true);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a language</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {repoDetails.language && (
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: repoDetails.languageColor }}
                    />
                    <span className="text-sm text-gray-400">
                      {repoDetails.language}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {repoDetails.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 rounded-md flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => {
                          setRepoDetails(prev => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index)
                          }));
                          setChange(true);
                        }}
                        className="ml-2 text-gray-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (comma-separated)"
                  value={repoDetails.newTag || ''}
                  onChange={(e) => setRepoDetails(prev => ({ ...prev, newTag: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const newTags = e.currentTarget.value
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(tag => tag && !repoDetails.tags.includes(tag));

                      if (newTags.length > 0) {
                        setRepoDetails(prev => ({
                          ...prev,
                          tags: [...prev.tags, ...newTags],
                          newTag: ''
                        }));
                        setChange(true);
                      }
                    }
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Press Enter or use commas to add multiple tags
                </p>
              </div>
            </div>

            {/* Move save button here */}
            {change && (
              <button
                className='flex items-center px-4 py-2 mt-4 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors'
                onClick={handleUpdateRepo}
              >
                Save Changes
              </button>
            )}
          </div>



          {/* Contributors Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Contributors</h2>
              <button
                onClick={() => setShowAddContributor(true)}
                className="flex items-center px-3 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contributor
              </button>
            </div>

            <div className="space-y-4">
              {contributors.map((contributor) => (
                <div
                  key={contributor.user_id}
                  className="flex items-center justify-between p-4 bg-gray-750 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={contributor?.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.username)}`}
                      alt={contributor.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{contributor.username}</p>
                      <p className="text-sm text-gray-400">{contributor.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={contributor.role}
                      onChange={(e) => handleUpdateRole(contributor.user_id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1"
                    >
                      <option value="Contributor">Contributor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleRemoveContributor(contributor.user_id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-400">Delete Repository</h3>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Once you delete a repository, there is no going back. Please be certain.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={`Type "${repo_name}" to confirm`}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleDeleteRepository}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete this repository
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Contributor Modal */}
        {showAddContributor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Add Contributor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={newContributor.creator_id}
                    onChange={(e) => setNewContributor(prev => ({ ...prev, creator_id: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={newContributor.role}
                    onChange={(e) => setNewContributor(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddContributor(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContributor}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}