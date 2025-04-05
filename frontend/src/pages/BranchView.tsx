import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { File as File_image, Folder, GitBranch, Plus, GitCommit, Clock } from 'lucide-react';
import { Commit, File } from '../types/repository';
import { BASE_URL } from '../context/AuthContext';
import { timeAgo } from '../lib/timeAlgo';
import AddFileModal from '../components/AddFileModal';
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
  const [FileItems, setFileItems] = useState<FileItem[] | null>(null)
  const [commitItems, setCommitItems] = useState<CommitItems[] | null>(null)
  const [showCommits, setShowCommits] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchAllFiles();
    fetchAllCommits();
  }, [isModalOpen])


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

  const fetchAllFiles = async () => {
    try {
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

  const fetchAllCommits = async () => {
    try {
      const response = await fetch(`${BASE_URL}/commit/all/${creator_id}/${repo_name}/${branch_name}`, {
        credentials: 'include'
      })
      const data = await response.json();
      console.log("comments_data", data);
      setCommitItems(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFileSelected = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`${BASE_URL}/file/save/${creator_id}/${repo_name}/${branch_name}`, {
        method: 'POST',
       credentials:'include',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Upload success:', result);
        // You can close modal or refresh file list here
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  

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
            <div className="flex items-center">
              <button onClick={()=>navigate(`/${creator_id}/${repo_name}/branches`)}>
                show all
              </button>
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
                  onClick={ () => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add File
                </button>
              </div>
              {/* files start here */}
              {/* {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center">
                    {file.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-indigo-400 mr-3" />
                    ) : (
                      <File_image className="h-5 w-5 text-gray-400 mr-3" />
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
              ))} */}

              {/* actual file code */}
              {FileItems?.map((file) => (
                <div
                  key={file.file_id}
                  className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center">
                    {file.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-indigo-400 mr-3" />
                    ) : (
                      <File_image className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <button
                        onClick={() => navigate(`/${creator_id}/${repo_name}/${branch_name}/${file?.file_name}`)}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {file.file_name}
                      </button>
                      <p className="text-sm text-gray-400">
                        {file.commit_message} • {timeAgo(file?.commit_timestamp)}
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
              {/* {commits.map((commit) => (
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
              ))} */}

              {/* commit messagesx */}
              {commitItems?.map((commit) => (
                <div key={commit.commit_id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start">
                    <GitCommit className="h-5 w-5 text-indigo-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{commit.commit_message}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-400">
                        <span>{commit.User.username}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{timeAgo(commit.commit_timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <AddFileModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onFileSelected={handleFileSelected}
/>

      </div>
    </div>
  );
}
