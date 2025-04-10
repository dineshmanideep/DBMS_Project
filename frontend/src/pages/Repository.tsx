import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, GitFork, Eye, GitBranch, Settings, Folder, File, Clock, Download, Shield, Info, ExternalLink, GitPullRequest, Users, AlertCircle } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface RepoFile {
  name: string;
  type: 'file' | 'folder';
  lastCommit: string;
  lastCommitDate: string;
  lastCommitAuthor: string;
}

export default function Repository() {
  const { username, repo_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [currentPath, setCurrentPath] = useState('');
  const [starStatus, setStarStatus] = useState(false);

  // Mock repository data - replace with API call
  const mockRepo = {
    name: repo_id,
    description: 'A modern React starter template with TypeScript and Tailwind CSS',
    visibility: 'Public',
    stars: 128,
    forks: 45,
    watchers: 67,
    branches: ['main', 'develop', 'feature/user-auth', 'bugfix/login'],
    license: 'MIT',
    language: 'TypeScript',
    languageColor: '#2b7489',
    lastUpdated: '3 days ago',
  };

  // Mock files data - replace with API call
  const mockFiles: RepoFile[] = [
    {
      name: 'src',
      type: 'file',
      lastCommit: 'Update component structure',
      lastCommitDate: '3 days ago',
      lastCommitAuthor: 'johndoe',
    },
    {
      name: 'package.json',
      type: 'file',
      lastCommit: 'Update dependencies',
      lastCommitDate: '1 week ago',
      lastCommitAuthor: 'janedoe',
    },
    {
      name: 'README.md',
      type: 'file',
      lastCommit: 'Add installation instructions',
      lastCommitDate: '2 weeks ago',
      lastCommitAuthor: 'johndoe',
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      lastCommit: 'Configure TypeScript options',
      lastCommitDate: '1 month ago',
      lastCommitAuthor: 'johndoe',
    },
  ];

  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [repo_id, currentBranch, currentPath]);

  const handleStar = () => {
    setStarStatus(!starStatus);
  };

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  const handlePullRequests = () => {
    navigate(`/${username}/${repo_id}/pull`);
  };

  const handleIssues = () => {
    navigate(`/${username}/${repo_id}/issues`);
  };

  const handleContributors = () => {
    navigate(`/${username}/${repo_id}/contributors`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <SkeletonLoader type="card" count={1} />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-white">{username} / {mockRepo.name}</h1>
                  <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-gray-700">
                    {mockRepo.visibility}
                  </span>
                </div>
                <p className="text-gray-300">{mockRepo.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleStar}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-all ${
                    starStatus ? 'bg-yellow-700/30 text-yellow-400 border border-yellow-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Star size={16} className={starStatus ? "text-yellow-400" : ""} />
                  <span>{starStatus ? mockRepo.stars + 1 : mockRepo.stars}</span>
                </button>
                
                <button className="flex items-center space-x-1 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all">
                  <GitFork size={16} />
                  <span>{mockRepo.forks}</span>
                </button>
                
                <button className="flex items-center space-x-1 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all">
                  <Eye size={16} />
                  <span>{mockRepo.watchers}</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-400">
                <GitBranch size={16} className="mr-2" />
                <span>{mockRepo.branches.length} branches</span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Updated {mockRepo.lastUpdated}</span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <Shield size={16} className="mr-2" />
                <span>{mockRepo.license} License</span>
              </div>
            </div>
          </div>
        )}

        {/* Branch and path navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <select
                value={currentBranch}
                onChange={(e) => setCurrentBranch(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {mockRepo.branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              <GitBranch size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Breadcrumb navigation */}
            <div className="flex items-center overflow-x-auto whitespace-nowrap py-2 px-3 bg-gray-800 rounded-md border border-gray-700">
              <button 
                onClick={() => handlePathChange('')}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {repo_id}
              </button>
              
              {pathParts.map((part, i) => (
                <React.Fragment key={i}>
                  <span className="mx-2 text-gray-500">/</span>
                  <button
                    onClick={() => handlePathChange(pathParts.slice(0, i + 1).join('/'))}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {part}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePullRequests}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-all"
            >
              <GitPullRequest size={16} />
              <span>Pull Requests</span>
            </button>

            <button
              onClick={handleIssues}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-all"
            >
              <AlertCircle size={16} />
              <span>Issues</span>
            </button>

            <button
              onClick={handleContributors}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
            >
              <Users size={16} />
              <span>Contributors</span>
            </button>

            <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all">
              <Download size={16} />
              <span>Clone</span>
            </button>
            
            <button
              onClick={() => navigate(`/${username}/${repo_id}/settings`)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* File list */}
        {loading ? (
          <SkeletonLoader type="table" />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="divide-y divide-gray-700">
              {mockFiles.map((file, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/${username}/${repo_id}/${currentBranch}/${currentPath ? `${currentPath}/` : ''}${file.name}`);
                  }}
                  className="flex items-center justify-between p-4 hover:bg-gray-750 cursor-pointer transition-all"
                >
                  <div className="flex items-center">
                    <File size={20} className="text-gray-400 mr-3" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  
                  <div className="hidden md:flex items-center text-sm text-gray-400">
                    <span className="mr-4">{file.lastCommit}</span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {file.lastCommitDate} by {file.lastCommitAuthor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {mockFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Info size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No files found</h3>
                <p className="text-center">This repository is empty or no files match your current filter.</p>
              </div>
            )}
          </div>
        )}
        
        {/* README preview (if exists) */}
        {mockFiles.some(file => file.name.toLowerCase() === 'readme.md') && (
          <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">README.md</h2>
              <button 
                onClick={() => navigate(`/${username}/${repo_id}/${currentBranch}/README.md`)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                <ExternalLink size={16} className="mr-1" />
                <span>View full</span>
              </button>
            </div>
            <div className="p-6 prose prose-invert max-w-none">
              <h1>Project Title</h1>
              <p>A brief description of what this project does and who it's for.</p>
              
              <h2>Installation</h2>
              <p>Install dependencies with npm:</p>
              <pre className="bg-gray-900 p-3 rounded-md">npm install</pre>
              
              <h2>Usage</h2>
              <p>Start the development server:</p>
              <pre className="bg-gray-900 p-3 rounded-md">npm run dev</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}