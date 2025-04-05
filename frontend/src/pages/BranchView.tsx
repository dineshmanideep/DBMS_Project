import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { File, Folder, GitBranch, Plus, GitCommit, Clock } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  lastCommit: string;
  lastCommitDate: string;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
}

export default function BranchView() {
  const { username, repo_id, branch_name } = useParams();
  const navigate = useNavigate();
  const [showCommits, setShowCommits] = useState(false);

  // Mock files data
  const files: FileItem[] = [
    {
      name: 'src',
      type: 'folder',
      lastCommit: 'Update component structure',
      lastCommitDate: '2 days ago',
    },
    {
      name: 'README.md',
      type: 'file',
      lastCommit: 'Update documentation',
      lastCommitDate: '5 days ago',
    },
    {
      name: 'package.json',
      type: 'file',
      lastCommit: 'Bump dependencies',
      lastCommitDate: '1 week ago',
    },
  ];

  // Mock commits data
  const commits: Commit[] = [
    {
      id: '1234abc',
      message: 'Update component structure',
      author: 'johndoe',
      date: '2 days ago',
    },
    {
      id: '5678def',
      message: 'Fix styling issues',
      author: 'janedoe',
      date: '3 days ago',
    },
    {
      id: '91011ghi',
      message: 'Initial commit',
      author: 'johndoe',
      date: '1 week ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GitBranch className="h-6 w-6 text-indigo-400" />
              <h1 className="ml-3 text-2xl font-bold text-white">{branch_name}</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCommits(!showCommits)}
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                {showCommits ? 'Show Files' : 'Show Commits'}
              </button>
              {branch_name !== 'main' && (
                <button
                  onClick={() => navigate(`/${username}/${repo_id}/${branch_name}/pull-request`)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Create Pull Request
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Files or Commits List */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          {!showCommits ? (
            <div className="divide-y divide-gray-700">
              <div className="p-4 bg-gray-750 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">Files</h2>
                <button
                  onClick={() => {/* TODO: Implement add file */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add File
                </button>
              </div>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center">
                    {file.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-indigo-400 mr-3" />
                    ) : (
                      <File className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <button
                        onClick={() => navigate(`/${username}/${repo_id}/${branch_name}/${file.name}`)}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {file.name}
                      </button>
                      <p className="text-sm text-gray-400">
                        {file.lastCommit} • {file.lastCommitDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              <div className="p-4 bg-gray-750">
                <h2 className="text-lg font-medium text-white">Commits</h2>
              </div>
              {commits.map((commit) => (
                <div key={commit.id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start">
                    <GitCommit className="h-5 w-5 text-indigo-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{commit.message}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-400">
                        <span>{commit.author}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{commit.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
