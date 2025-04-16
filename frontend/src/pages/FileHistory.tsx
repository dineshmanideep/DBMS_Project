import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitCommit, Clock, ArrowLeft, File as FileIcon, ExternalLink } from 'lucide-react';
import { timeAgo } from '../lib/timeAlgo';
import { BASE_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface FileCommit {
  commit_id: number;
  commit_message: string;
  commit_timestamp: string;
  username: string;
  avatar?: string;
}

interface RouteParams {
  creator_id?: string;
  repo_name?: string;
  branch_name?: string;
  file_name?: string;
}

export default function FileHistory() {
  const { creator_id, repo_name, branch_name, file_name } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [commits, setCommits] = useState<FileCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFileHistory();
  }, [creator_id, repo_name, branch_name, file_name]);

  const fetchFileHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!creator_id || !repo_name || !branch_name || !file_name) {
        throw new Error('Missing required parameters');
      }

      const response = await fetch(
        `${BASE_URL}/file/history/${creator_id}/${repo_name}/${branch_name}/${file_name}`,
        {
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch file history');
      }

      const result = await response.json();
      
      if (!Array.isArray(result?.data)) {
        throw new Error('Invalid response format');
      }

      setCommits(result.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error fetching file history:', error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/${creator_id}/${repo_name}/${branch_name}`);
  };

  const handleViewCommit = (commitId: number) => {
    navigate(`/${creator_id}/${repo_name}/${branch_name}/${file_name}/${commitId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">File History</h1>
              <div className="flex items-center mt-1 text-gray-400">
                <FileIcon className="h-4 w-4 mr-1" />
                <span className="font-mono">{file_name}</span>
                <span className="mx-2">•</span>
                <span>{branch_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">
                Commit History ({commits?.length ?? 0} commits)
              </h2>
            </div>
            {commits?.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {commits.map((commit) => (
                  <div
                    key={commit.commit_id}
                    className="p-4 hover:bg-gray-750 transition-colors cursor-pointer group"
                    onClick={() => handleViewCommit(commit.commit_id)}
                  >
                    <div className="flex items-start">
                      <GitCommit className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                      <div className="ml-3 flex-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-white break-all pr-4">
                            {commit.commit_message}
                          </p>
                          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-400">
                          <img
                            src={commit.avatar || `https://ui-avatars.com/api/?name=${commit.username}`}
                            alt={`${commit.username}'s avatar`}
                            className="h-4 w-4 rounded-full mr-2"
                          />
                          <span>{commit.username}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span title={new Date(commit.commit_timestamp).toLocaleString()}>
                            {timeAgo(commit.commit_timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No commit history found for this file.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}