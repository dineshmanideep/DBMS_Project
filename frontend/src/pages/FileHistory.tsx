import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitCommit, Clock, ArrowLeft, File as FileIcon } from 'lucide-react';
import { timeAgo } from '../lib/timeAlgo';
const MOCK_DATA = {
    repositories: [
      {
        repo_id: 1,
        creator_id: 1,
        repo_name: 'demo-repo',
        description: 'A demo repository',
        visibility: 'Public' as const,
        creation_date: new Date().toISOString(),
        stars: 10,
        forks: 5,
      },
      // Add more mock repositories as needed
    ],
    branches: [
      {
        branch_id: 1,
        repo_id: 1,
        name: 'main',
        creator_id: 1,
        created_at: new Date().toISOString(),
        last_commit_id: 1,
        parent_branch_id: null,
        base_commit_id: null,
      },
      // Add more mock branches as needed
    ],
  };
interface FileCommit {
  commit_id: number;
  commit_message: string;
  creator_id: number;
  commit_timestamp: string;
  branch_id: number;
  file_name: string;
  file_content: string;
  User: {
    username: string;
    avatar?: string;
  };
}

export default function FileHistory() {
  const { creator_id, repo_name, branch_name, file_name } = useParams();
  const navigate = useNavigate();
  const [commits, setCommits] = useState<FileCommit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Mock data for file commits
    const mockCommits: FileCommit[] = [
      {
        commit_id: 1,
        commit_message: 'Initial commit',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        branch_id: 1,
        file_name: file_name || '',
        file_content: '// Initial file content',
        User: {
          username: 'demo',
          avatar: 'https://github.com/identicons/demo.png',
        },
      },
      {
        commit_id: 2,
        commit_message: 'Update file content',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        branch_id: 1,
        file_name: file_name || '',
        file_content: '// Updated file content\n// Added new features',
        User: {
          username: 'demo',
          avatar: 'https://github.com/identicons/demo.png',
        },
      },
      {
        commit_id: 3,
        commit_message: 'Fix bug in file',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        branch_id: 1,
        file_name: file_name || '',
        file_content: '// Fixed bug\n// Updated file content\n// Added new features',
        User: {
          username: 'demo',
          avatar: 'https://github.com/identicons/demo.png',
        },
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setCommits(mockCommits);
      setLoading(false);
    }, 500);
  }, [file_name]);

  const handleBack = () => {
    navigate(`/${creator_id}/${repo_name}/${branch_name}`);
  };

  const handleViewCommit = (commitId: number) => {
    // In a real app, this would navigate to a commit detail page
    console.log('Viewing commit:', commitId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">File History</h1>
            <div className="flex items-center mt-1 text-gray-400">
              <FileIcon className="h-4 w-4 mr-1" />
              <span>{file_name}</span>
              <span className="mx-2">•</span>
              <span>{branch_name}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Commit History</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {commits.map((commit) => (
                <div
                  key={commit.commit_id}
                  className="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handleViewCommit(commit.commit_id)}
                >
                  <div className="flex items-start">
                    <GitCommit className="h-5 w-5 text-indigo-400 mt-1" />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-white">{commit.commit_message}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-400">
                        <span>{commit.User.username}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{timeAgo(commit.commit_timestamp)}</span>
                      </div>
                      <div className="mt-2 p-2 bg-gray-900 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                        <pre>{commit.file_content}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 