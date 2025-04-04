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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GitBranch className="h-6 w-6 text-gray-400" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">{branch_name}</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCommits(!showCommits)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {showCommits ? 'Show Files' : 'Show Commits'}
              </button>
              {branch_name !== 'main' && (
                <button
                  onClick={() => navigate(`/${username}/${repo_id}/${branch_name}/pull-request`)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Pull Request
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Files or Commits List */}
        <div className="bg-white shadow-sm rounded-lg">
          {!showCommits ? (
            <div className="divide-y divide-gray-200">
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Files</h2>
                <button
                  onClick={() => {/* TODO: Implement add file */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add File
                </button>
              </div>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {file.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-gray-400 mr-3" />
                    ) : (
                      <File className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <button
                        onClick={() => navigate(`/${username}/${repo_id}/${branch_name}/${file.name}`)}
                        className="text-sm font-medium text-indigo-600 hover:underline"
                      >
                        {file.name}
                      </button>
                      <p className="text-sm text-gray-500">
                        {file.lastCommit} • {file.lastCommitDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <div className="p-4 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Commits</h2>
              </div>
              {commits.map((commit) => (
                <div key={commit.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <GitCommit className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{commit.message}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
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