import React,{useState,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitBranch, GitCommit, Clock ,X} from 'lucide-react';
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
  const [branchList, setBranchList] = useState<BranchList[]|null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState('main');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
  console.log("branchs",data);
}

const handleCreateBranch = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/branch/create/${creator_id}/${repo_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: newBranchName,
        base_branch: baseBranch
      }),
    });

    const data = await response.json();

    if (response.ok) {
      await fetchAllBranches();
      setShowCreateModal(false);
      setNewBranchName('');
      setBaseBranch('main');
    } else {
      setError(data.message || 'Failed to create branch');
    }
  } catch (err) {
    setError('Failed to create branch');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-700 sm:px-6 flex justify-around">
            <div className="flex items-center ">
              <GitBranch className="h-6 w-6 text-indigo-400" />
              <h2 className="ml-3 text-lg font-medium text-white">Branches</h2>
            </div>

            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New
            </button>
          </div>

          <div className="divide-y divide-gray-700">
           
            {branchList?.map((branch) => (
              <div
                key={branch.branch_id}
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
                      onClick={() => navigate(`/${creator_id}/${repo_name}/pull`)}
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
                      {branch.lastCommit?.commit_message||"last commit"}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                    <p>
                      Updated {timeAgo(branch?.lastCommit?.commit_timestamp||'2025-04-12T15:08:23.769Z') } by {branch.lastCommit?.User.username||"last commit user"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Branch</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="my-new-branch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Base Branch
                </label>
                <select
                  value={baseBranch}
                  onChange={(e) => setBaseBranch(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {branchList?.map((branch) => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
