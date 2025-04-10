import React,{useState,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitBranch, GitCommit, Clock } from 'lucide-react';
import { BASE_URL } from '../context/AuthContext';
import { timeAgo } from '../lib/timeAlgo';

interface BranchList {
  User:{username:string},
  branch_id:number,
  name: string;
  lastCommit: {commit_message:string,commit_timestamp:string,User:{username:string}};
}
interface Branch {
  name: string;
  lastCommit: string;
  lastCommitDate: string;
  author: string;
}
export default function BranchList() {
  const { creator_id, repo_name } = useParams();
  const [branchList, setBranchList] = useState<BranchList[]|null>(null)
  const navigate = useNavigate();
useEffect(() => {
fetchAllBranches();
  
}, [])

const fetchAllBranches= async()=>{
  const response = await fetch(`${BASE_URL}/branch/list/${creator_id}/${repo_name}`,{
    credentials:'include'
  })
  const data= await response.json();
  setBranchList(data.data);
  console.log(data);
}

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
            {/* {branches.map((branch) => (
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
            ))} */}
            {branchList?.map((branch) => (
              <div
                key={branch.name}
                className="px-4 py-4 hover:bg-gray-750 transition-colors sm:px-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GitBranch className="h-5 w-5 text-indigo-400" />
                    <button
                      onClick={() => navigate(`/${creator_id}/${repo_name}/${branch.name}`)}
                      className="ml-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {branch.name}
                    </button>
                  </div>
                  {branch.name !== 'main' && (
                    <button
                      onClick={() => navigate(`/${creator_id}/${repo_name}/${branch.name}/pull-request`)}
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
                      {branch.lastCommit.commit_message}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                    <p>
                      Updated {timeAgo(branch.lastCommit.commit_timestamp) } by {branch.lastCommit.User.username}
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
