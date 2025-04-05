import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitBranch, GitCommit, Clock } from 'lucide-react';

interface Branch {
  name: string;
  lastCommit: string;
  lastCommitDate: string;
  author: string;
}

export default function BranchList() {
  const { username, repo_id } = useParams();
  const navigate = useNavigate();

  // Mock branches data
  const branches: Branch[] = [
    {
      name: 'main',
      lastCommit: 'Initial commit',
      lastCommitDate: '2 days ago',
      author: 'johndoe',
    },
    {
      name: 'feature/user-auth',
      lastCommit: 'Add user authentication',
      lastCommitDate: '1 day ago',
      author: 'janedoe',
    },
    {
      name: 'bugfix/login',
      lastCommit: 'Fix login issues',
      lastCommitDate: '3 hours ago',
      author: 'johndoe',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-700 sm:px-6">
            <div className="flex items-center">
              <GitBranch className="h-6 w-6 text-indigo-400" />
              <h2 className="ml-3 text-lg font-medium text-white">Branches</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="px-4 py-4 hover:bg-gray-750 transition-colors sm:px-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GitBranch className="h-5 w-5 text-indigo-400" />
                    <button
                      onClick={() => navigate(`/${username}/${repo_id}/${branch.name}`)}
                      className="ml-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {branch.name}
                    </button>
                  </div>
                  {branch.name !== 'main' && (
                    <button
                      onClick={() => navigate(`/${username}/${repo_id}/${branch.name}/pull-request`)}
                      className="ml-4 px-3 py-1 text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-700 rounded-md transition-colors"
                    >
                      Create Pull Request
                    </button>
                  )}
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-400">
                      <GitCommit className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                      {branch.lastCommit}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                    <p>
                      Updated {branch.lastCommitDate} by {branch.author}
                    </p>
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
