import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitCommit, Clock, ArrowLeft } from 'lucide-react';
import { timeAgo } from '../lib/timeAlgo';
import { BASE_URL } from '../context/AuthContext';
import { Commit } from '../types/repository_types';

interface CommitItem extends Commit {
  User: {
    username: string;
  };
}

export default function BranchHistory() {
  const { creator_id, repo_name, branch_name } = useParams();
  const [commits, setCommits] = useState<CommitItem[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommits();
  }, []);

  const fetchCommits = async () => {
    try {
      const response = await fetch(`${BASE_URL}/commit/all/${creator_id}/${repo_name}/${branch_name}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCommits(data.data);
    } catch (err) {
      console.error('Error fetching commits:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-400 hover:text-indigo-300 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Branch
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Commits for branch: <span className="text-indigo-400">{branch_name}</span>
          </h2>

          {commits && commits.length > 0 ? (
            <div className="space-y-4">
              {commits.map((commit) => (
                <div
                  key={commit.commit_id}
                  className="flex items-start p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                >
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
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No commits found for this branch.</p>
          )}
        </div>
      </div>
    </div>
  );
}
