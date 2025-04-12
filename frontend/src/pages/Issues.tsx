import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, AlertCircle, CheckCircle, Clock, User,Edit, Search } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { BASE_URL, useAuth } from '../context/AuthContext';
import { User as User_template } from '../types/auth';
import { Issue } from '../types/repository_types';
import { timeAgo } from '../lib/timeAlgo';

interface Issueitems extends Issue {
  assignee: User_template;
  creator: User_template
}



export default function Issues() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issueitems[]>([]);
  const [filter, setFilter] = useState<'All' | 'Open' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIssues, setFilteredIssues] = useState<Issueitems[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issueitems | null>(null);
  const [contributors, setContributors] = useState<User_template[]>([]);
  const { user } = useAuth();
  const fetchContributors = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contributer/all/${creator_id}/${repo_name}/`,
        { credentials: 'include' }
      );
      const data = await response.json();
      console.log("contributers deatils", data.data);
      if (data.message === "Successfully retrieved contributors") {
        setContributors(data.data.contributors);
      }
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }
  };
  const canEditIssue = (issue: Issueitems) => {
    return (
      user?.user_id === issue.creator_id || // Creator
      user?.user_id === issue.assignee_id 
    );
  };
  
  

  useEffect(() => {
    fetchContributors();
  }, [creator_id, repo_name]);

  const handleAssign = async (userId: string | null) => {
    if (!selectedIssue) return;

    try {
      console.log("userid", userId)
      const response = await fetch(
        `${BASE_URL}/issues/${creator_id}/${repo_name}/${selectedIssue.issue_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ assignee_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to assign issue');
      }

      // Refresh issues list
      await fetchIssues();
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning issue:', error);
    }
  };
  useEffect(() => {
    fetchIssues();
  }, [creator_id, repo_name, filter]);


  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/issues/${creator_id}/${repo_name}`,
        { method: 'GET', credentials: 'include' }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to fetch issues ,${data.error}`);
      }
      console.log("issue data", data.data);
      setIssues(data.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add create issue function
  const handleCreateIssue = () => {
    navigate(`/${creator_id}/${repo_name}/issues/new`);
  };

  // Add search functionality
  useEffect(() => {
    const filteredIssues = issues.filter(issue =>
      (issue.issue_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.issue_description.toLowerCase().includes(searchQuery.toLowerCase())) && (filter == 'All' || issue.status == filter)
    )

    setFilteredIssues(filteredIssues);
  }, [searchQuery, issues, filter]);





  // Add this component inside your Issues component, before the return statement
  const AssigneeModal = () => {
    if (!showAssignModal) return null;



    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          {user?.user_id == selectedIssue?.creator_id ? (
            <>
              <div className="flex justify-between items-center mb-4">

                <h3 className="text-lg font-medium">Assign Issue</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleAssign(null);
                    setShowAssignModal(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md flex items-center"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>Unassigned</span>
                </button>
                {contributors?.map((contributor) => (
                  <button
                    key={contributor.user_id}
                    onClick={() => handleAssign(contributor.user_id)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md flex items-center"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        contributor.full_name || contributor.username
                      )}`}
                      alt={contributor.username}
                      className="h-5 w-5 rounded-full mr-2"
                    />
                    <span>{contributor.username}</span>
                  </button>
                ))}
              </div>
            </>
          ):(
            <>
             <div className="flex justify-between items-center mb-4">
              Only Creator of the Issue can assign the issue to a User
              <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-white px-9"
                >
                  ×
                </button>
             </div>
            </>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/${creator_id}/${repo_name}/main`)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Issues</h1>
          </div>
          <button
            onClick={handleCreateIssue}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>New Issue</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('All')}
                  className={`px-3 py-1 rounded-md ${filter === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('Open')}
                  className={`px-3 py-1 rounded-md ${filter === 'Open' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilter('Closed')}
                  className={`px-3 py-1 rounded-md ${filter === 'Closed' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  Closed
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="w-full md:w-64 p-2 pl-8 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="table" />
          ) : (
            <div className="divide-y divide-gray-700">
              {issues.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No issues found</h3>
                  <p>There are no issues matching your current filter.</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.issue_id}
                    className="p-4 hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {issue.status === 'Open' ? (
                          <AlertCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">{issue.issue_title}</h3>
                          {/* // Update the issue card's assignee section in your existing JSX */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIssue(issue);
                                setShowAssignModal(true);
                              }}
                              className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full hover:bg-gray-600"
                            >
                              {issue?.assignee_id ? (
                                <>
                                  <img
                                    src={issue.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(issue.assignee?.full_name as string)}`}
                                    alt={issue.assignee.username}
                                    className="h-5 w-5 rounded-full"
                                  />
                                  <span className="text-sm">{issue.assignee.username}</span>
                                </>
                              ) : (
                                <>
                                  <User className="h-4 w-4" />
                                  <span className="text-sm">Unassigned</span>
                                </>
                              )}
                            </button>
                            {canEditIssue(issue) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${creator_id}/${repo_name}/issues/${issue.issue_id}/edit`);
              }}
              className="p-1 text-gray-400 hover:text-white"
              title="Edit issue"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
                          </div>
                        </div>
                        <p className="mt-1 text-gray-400 line-clamp-2">{issue.issue_description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {issue?.labels?.map((label, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                            >
                              {label}
                            </span>
                          ))}
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Opened {timeAgo(issue.creation_date)} by {issue.creator.username}</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {showAssignModal && <AssigneeModal />}
    </div>

  );
}