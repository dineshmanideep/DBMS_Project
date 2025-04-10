import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, GitCommit, Eye, Clock, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface Commit {
  hash: string;
  shortHash: string;
  author: string;
  authorAvatar: string;
  date: string;
  message: string;
}

export default function FileHistory() {
  const { username, repo_id, branch, file_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCommits, setCompareCommits] = useState<{base: string | null, compare: string | null}>({
    base: null,
    compare: null
  });
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockCommits: Commit[] = [
        {
          hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
          shortHash: 'a1b2c3d',
          author: 'johndoe',
          authorAvatar: 'https://github.com/ghost.png',
          date: '2 days ago',
          message: 'Update component structure and fix styling issues'
        },
        {
          hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
          shortHash: 'b2c3d4e',
          author: 'janedoe',
          authorAvatar: 'https://github.com/ghost.png',
          date: '1 week ago',
          message: 'Add documentation and improve error handling'
        },
        {
          hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
          shortHash: 'c3d4e5f',
          author: 'johndoe',
          authorAvatar: 'https://github.com/ghost.png',
          date: '2 weeks ago',
          message: 'Initial commit with basic functionality'
        }
      ];
      setCommits(mockCommits);
      setLoading(false);
    }, 1000);
  }, [file_name, branch]);

  const handleViewCommit = (hash: string) => {
    setSelectedCommit(hash);
    // In a real app, you would navigate to a view showing the file at this commit
    navigate(`/${username}/${repo_id}/${hash}/${file_name}`);
  };

  const handleCompareSelect = (hash: string) => {
    if (!compareCommits.base) {
      setCompareCommits({ ...compareCommits, base: hash });
    } else if (!compareCommits.compare) {
      setCompareCommits({ ...compareCommits, compare: hash });
      // In a real app, you would navigate to a comparison view
      navigate(`/${username}/${repo_id}/compare/${compareCommits.base}...${hash}/${file_name}`);
    } else {
      // Reset and start over
      setCompareCommits({ base: hash, compare: null });
    }
  };

  const resetCompare = () => {
    setCompareCommits({ base: null, compare: null });
    setCompareMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/${username}/${repo_id}/${branch}/${file_name}`)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to file</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">History of {file_name}</h1>
              <p className="text-gray-400 mt-1">Showing {commits.length} commits</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  compareMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {compareMode ? (
                  <>
                    <span>Cancel Compare</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft size={16} className="mr-1" />
                    <ArrowRight size={16} className="mr-1" />
                    <span>Compare Versions</span>
                  </>
                )}
              </button>
              
              {compareMode && compareCommits.base && (
                <button
                  onClick={resetCompare}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all"
                >
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Commits list */}
        {loading ? (
          <SkeletonLoader type="table" />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="divide-y divide-gray-700">
              {commits.map((commit) => (
                <div key={commit.hash} className="p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <img 
                        src={commit.authorAvatar} 
                        alt={`${commit.author}'s avatar`} 
                        className="h-10 w-10 rounded-full mr-4 mt-1"
                      />
                      <div>
                        <div className="flex items-center">
                          <GitCommit size={16} className="text-indigo-400 mr-2" />
                          <span className="font-mono text-sm text-gray-300">{commit.shortHash}</span>
                        </div>
                        <h3 className="text-white font-medium mt-1">{commit.message}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-400">
                          <span className="mr-3">{commit.author}</span>
                          <Clock size={14} className="mr-1" />
                          <span>{commit.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {compareMode ? (
                        <button
                          onClick={() => handleCompareSelect(commit.hash)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            compareCommits.base === commit.hash || compareCommits.compare === commit.hash
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {compareCommits.base === commit.hash 
                            ? 'Base' 
                            : compareCommits.compare === commit.hash 
                              ? 'Compare' 
                              : 'Select'}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewCommit(commit.hash)}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm"
                          >
                            <Eye size={14} className="mr-1" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => navigate(`/${username}/${repo_id}/${commit.hash}/${file_name}/download`)}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm"
                          >
                            <Download size={14} className="mr-1" />
                            <span>Download</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {commits.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <GitCommit size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No commit history found for this file.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
