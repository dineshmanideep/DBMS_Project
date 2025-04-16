import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, GitFork, Plus, GitBranch, Settings, Folder, File, Clock, Download, Shield, Info, ExternalLink, GitPullRequest, Users, AlertCircle } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { BASE_URL, useAuth } from '../context/AuthContext';
import { Commit, Repository as repoType } from '../types/repository_types';
import { timeAgo } from '../lib/timeAlgo';
import AddFileModal from '../components/AddFileModal';
import { marked } from 'marked';

interface FileItem {
  file_name: string;
  file_id: number;
  type?: 'file' | 'folder';
  commit_message: string;
  commit_timestamp: string;
  commit_creator_id: number;
  username: string;
}

interface CommitItems extends Commit {
  User: {
    username: string
  }
}

export default function Repository() {
  const { creator_id, repo_name, branch_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [repo, setRepo] = useState<repoType | null>()
  const [currentPath, setCurrentPath] = useState('');
  const [starStatus, setStarStatus] = useState(false);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const { user, getCurrentContributer, contributer } = useAuth();
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    await fetchAllFiles();
    await fetchRepo();
    setLoading(false);
  }


  const handleAddFile = async (file: globalThis.File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/file/save/${creator_id}/${repo_name}/${branch_name}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Upload success:', result);
        await fetchAllFiles();
        setIsModalOpen(false);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    setIsModalOpen(false);
  };
  const fetchAllFiles = async () => {
    try {

      //fetch contributer
      await getCurrentContributer(creator_id as string, repo_name as string);

      const response = await fetch(`${BASE_URL}/file/all/${creator_id}/${repo_name}/${branch_name}/`, {
        credentials: 'include'
      });
      const data = await response.json();
     
      setFileItems(data.data);
      
      console.log("files data", data);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchReadmeContent = async () => {
    console.log("readme start")
    const readmeFile = fileItems?.find(file => file.file_name.toLowerCase() === 'readme.md');
    if (readmeFile) {
      console.log("redme file",readmeFile);
      try {
        const response = await fetch(
          `${BASE_URL}/file/get/${creator_id}/${repo_name}/${branch_name}/${readmeFile.file_name}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        if (response.ok) {
          setReadmeContent(data.content);
          console.log("readme content",data);
        }
      } catch (error) {
        console.error('Failed to fetch README content:', error);
      }
    }
  };


  const fetchRepo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/repo/get/${creator_id}/${repo_name}/`, {
        credentials: 'include'
      });
      const data = await response.json();
      setRepo(data.data);



    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fileItems?.some(file => file.file_name.toLowerCase() === 'readme.md')) {
     fetchReadmeContent();
   }
    
  }, [fileItems])
  

  const handleStar = () => {
    setStarStatus(!starStatus);
  };

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  const handlePullRequests = () => {
    navigate(`/${creator_id}/${repo_name}/pull`);
  };

  const handleIssues = () => {
    navigate(`/${creator_id}/${repo_name}/issues`);
  };

  const handleContributors = () => {
    navigate(`/${creator_id}/${repo_name}/contributors`);
  };
  const handleHistory = () => {
    navigate(`/${creator_id}/${repo_name}/${branch_name}/history`);
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
                  <h1 className="text-2xl font-bold text-white">{repo?.repo_name}</h1>
                  <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-gray-700">
                    {repo?.visibility}
                  </span>
                </div>
                <p className="text-gray-300">{repo?.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleStar}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-all ${starStatus ? 'bg-yellow-700/30 text-yellow-400 border border-yellow-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  <Star size={16} className={starStatus ? "text-yellow-400" : ""} />
                  {/* <span>{starStatus ? repo?.stars + 1 : repo?.stars}</span> */}
                  <span>{starStatus ? (repo?.stars ?? 0) + 1 : repo?.stars ?? 0}</span>
                </button>

                <button className="flex items-center space-x-1 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all">
                  <GitFork size={16} />
                  <span>{repo?.forks}</span>
                </button>


              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-400">
                <div className="flex-col">
                  <button onClick={() => navigate(`/${creator_id}/${repo_name}/branches`)}>
                    <GitBranch size={16} className="mr-2" />
                    Branches
                  </button>
                </div>
              </div>

              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Created {timeAgo(repo?.creation_date as string)}</span>
              </div>

              <div className="flex items-center text-gray-400">
                <Shield size={16} className="mr-2" />
                <span>{repo?.license} License</span>
              </div>
            </div>
          </div>
        )}

     

{/* // Replace the buttons section with this updated version */}
<div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
  <div className="flex flex-wrap items-center justify-between gap-4">
    {/* Left side buttons group */}
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleIssues}
        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-all"
      >
        <AlertCircle size={16} className="mr-1" />
        <span>Issues</span>
      </button>

      <button
        onClick={handleContributors}
        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
      >
        <Users size={16} className="mr-1" />
        <span>Contributors</span>
      </button>

      <button 
        onClick={handleHistory}
        className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-all"
      >
        <Clock size={16} className="mr-1" />
        <span>History</span>
      </button>

      
    </div>

    {/* Right side buttons group - Moved Add File here */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all"
      >
        <Plus size={16} className="mr-1" />
        <span>Add File</span>
      </button>

      {contributer?.role === 'Admin' && (
        <>
          {branch_name !== 'main' && (
            <button
              onClick={handlePullRequests}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-all"
            >
              <GitPullRequest size={16} className="mr-1" />
              <span>Pull Requests</span>
            </button>
          )}
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}/settings`)}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all"
          >
            <Settings size={16} className="mr-1" />
            <span>Settings</span>
          </button>
        </>
      )}
    </div>
  </div>
</div>

        {/* File list */}
        {loading ? (
          <SkeletonLoader type="table" />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="divide-y divide-gray-700">
              {fileItems?.map((file, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/${creator_id}/${repo_name}/${currentBranch}/${currentPath ? `${currentPath}/` : ''}${file.file_name}`);
                  }}
                  className="flex items-center justify-between p-4 hover:bg-gray-750 cursor-pointer transition-all"
                >
                  <div className="flex items-center">
                    <File size={20} className="text-gray-400 mr-3" />
                    <span className="font-medium">{file.file_name}</span>
                  </div>

                  <div className="hidden md:flex items-center text-sm text-gray-400">
                    <span className="mr-4">{file.commit_message}</span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {timeAgo(file.commit_timestamp)} by {file.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {fileItems?.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Info size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No files found</h3>
                <p className="text-center">This repository is empty or no files match your current filter.</p>
              </div>
            )}
          </div>
        )}

        {/* README preview (if exists) */}
        {fileItems?.some(file => file.file_name.toLowerCase() === 'readme.md') && (
          <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">README.md</h2>
              <button
                onClick={() => navigate(`/${creator_id}/${repo_name}/${currentBranch}/${fileItems?.find(file => file.file_name.toLowerCase() === 'readme.md')?.file_name}`)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                <ExternalLink size={16} className="mr-1" />
                <span>View full</span>
              </button>
            </div>
            <div className="p-6 prose prose-invert max-w-none">
              {readmeContent ? (
                <div dangerouslySetInnerHTML={{ __html: marked(readmeContent) }} />
              ) : (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                </div>
              )}
            </div>
          </div>
        )}
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