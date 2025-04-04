import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { File, Folder, GitBranch, Plus, Star, GitFork, Eye, Settings } from 'lucide-react';

export default function Repository() {
  const { username, repo_id } = useParams();
  const navigate = useNavigate();
  const [currentBranch, setCurrentBranch] = useState('main');

  // Mock repository data - replace with API call
  const mockRepo = {
    name: 'awesome-project',
    description: 'A revolutionary project that changes everything',
    visibility: 'Public',
    stars: 128,
    forks: 45,
    watchers: 89,
  };

  const mockFiles = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Repository Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {username}/{mockRepo.name}
              </h1>
              <p className="text-gray-600 mt-1">{mockRepo.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/${username}/${repo_id}/settings`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Star className="h-4 w-4 mr-2" />
                Star
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <GitFork className="h-4 w-4 mr-2" />
                Fork
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {mockRepo.stars} stars
            </div>
            <div className="flex items-center">
              <GitFork className="h-4 w-4 mr-1" />
              {mockRepo.forks} forks
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {mockRepo.watchers} watching
            </div>
          </div>
        </div>

        {/* Branch Selection and Add File Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="relative">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <GitBranch className="h-4 w-4 mr-2" />
                {currentBranch}
              </button>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add file
          </button>
        </div>

        {/* File List */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="divide-y divide-gray-200">
            {mockFiles.map((file) => (
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
                    <a
                      href={`/${username}/${repo_id}/${currentBranch}/${file.name}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {file.name}
                    </a>
                    <p className="text-sm text-gray-500">
                      {file.lastCommit} • {file.lastCommitDate}
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