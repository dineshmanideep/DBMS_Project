import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { File as File_image, Folder, GitBranch, Plus, GitCommit, Clock, History } from 'lucide-react';
import { Commit, File as RepoFile } from '../types/repository_types';
import { timeAgo } from '../lib/timeAlgo';
import AddFileModal from '../components/AddFileModal';

// Mock data configuration
export const MOCK_DATA = {
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
interface FileItem {
  file_name: string;
  file_id: number;
  type?: 'file' | 'folder';
  commit_message: string;
  commit_timestamp: string;
  commit_creator_id: number;
}

interface CommitItems extends Commit {
  User: {
    username: string
  }
}

export default function BranchView() {
  const { creator_id, repo_name, branch_name } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commits, setCommits] = useState<CommitItems[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Use mock data instead of fetching from backend
    const mockFiles: FileItem[] = [
      {
        file_name: 'README.md',
        file_id: 1,
        type: 'file',
        commit_message: 'Initial commit',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      },
      {
        file_name: 'index.html',
        file_id: 2,
        type: 'file',
        commit_message: 'Add HTML structure',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      },
      {
        file_name: 'styles.css',
        file_id: 3,
        type: 'file',
        commit_message: 'Add styling',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      },
      {
        file_name: 'script.js',
        file_id: 4,
        type: 'file',
        commit_message: 'Add JavaScript functionality',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      },
      {
        file_name: 'package.json',
        file_id: 5,
        type: 'file',
        commit_message: 'Add dependencies',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      },
      {
        file_name: 'tsconfig.json',
        file_id: 6,
        type: 'file',
        commit_message: 'Configure TypeScript',
        commit_timestamp: new Date().toISOString(),
        commit_creator_id: 1,
      }
    ];

    const mockCommits: CommitItems[] = [
      {
        commit_id: 1,
        commit_message: 'Initial commit',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        branch_id: 1,
        User: {
          username: 'demo',
        },
      },
      {
        commit_id: 2,
        commit_message: 'Add HTML structure',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        branch_id: 1,
        User: {
          username: 'demo',
        },
      },
      {
        commit_id: 3,
        commit_message: 'Add styling and JavaScript',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        branch_id: 1,
        User: {
          username: 'demo',
        },
      },
      {
        commit_id: 4,
        commit_message: 'Configure TypeScript',
        creator_id: 1,
        commit_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        branch_id: 1,
        User: {
          username: 'demo',
        },
      }
    ];

    setFiles(mockFiles);
    setCommits(mockCommits);
  }, [creator_id, repo_name, branch_name]);

  const handleFileSelected = (file: FileItem) => {
    navigate(`/${creator_id}/${repo_name}/${branch_name}/${file.file_name}`);
  };

  const handleHistoryClick = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation(); // Prevent file selection when clicking history
    navigate(`/${creator_id}/${repo_name}/${branch_name}/${file.file_name}/history`);
  };

  const handleAddFile = (file: globalThis.File) => {
    // In a real app, this would upload the file to the backend
    console.log('File to add:', file.name);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{repo_name}</h1>
            <p className="text-gray-400 mt-1">Branch: {branch_name}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add File
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Files</h2>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.file_id}
                    onClick={() => handleFileSelected(file)}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <div className="flex items-center">
                      <File_image className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{file.file_name}</span>
                    </div>
                    <button
                      onClick={(e) => handleHistoryClick(e, file)}
                      className="p-1 hover:bg-gray-600 rounded-full"
                      title="View History"
                    >
                      <History className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Commits</h2>
              <div className="space-y-4">
                {commits.map((commit) => (
                  <div key={commit.commit_id} className="border-b border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400">{commit.User.username}</span>
                      <span className="text-sm text-gray-400">
                        {timeAgo(commit.commit_timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{commit.commit_message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddFileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFileSelected={handleAddFile}
        />
      )}
    </div>
  );
}