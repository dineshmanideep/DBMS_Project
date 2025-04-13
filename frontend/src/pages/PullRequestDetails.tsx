import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitPullRequest, Check, X, MessageSquare, GitCommit, Clock, User, ArrowLeft, GitMerge } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../context/AuthContext';
import { timeAgo } from '../lib/timeAlgo';

interface PullRequestReview {
  pr_id: number;
  reviewer_id: number;
  review_comments: string;
  review_date: string;
  User: {
    username: string;
    avatar_url: string;
  };
}

interface PullRequest {
  pr_id: number;
  creator_id: number;
  pr_title: string;
  pr_description: string;
  pr_status: 'Open' | 'Merged' | 'Closed';
  base_branch_id: number;
  target_branch_id: number;
  creation_date: string;
  User: {
    username: string;
  };
  baseBranch: {
    name: string;
  };
  targetBranch: {
    name: string;
  };
}

export default function PullRequestDetail() {
  const { creator_id, repo_name, pr_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pullRequest, setPullRequest] = useState<PullRequest | null>(null);
  const [reviews, setReviews] = useState<PullRequestReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({
    comment: ''
  });

  const fetchPullRequest = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/pull-requests/${pr_id}/${creator_id}/${repo_name}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch pull request');
      }

      const data = await response.json();
      console.log("pullrequest", data);
      setPullRequest(data.pullRequest);
      setReviews(data.pull_Request_Reviews || []);
    } catch (error) {
      setError('Failed to load pull request details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}/pull-requests/${pr_id}/${creator_id}/${repo_name}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            comment: newReview.comment
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      await fetchPullRequest(); // Refresh reviews after submitting
      setNewReview({ comment: '' });
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'Merged' | 'Closed') => {
    try {
      const response = await fetch(
        `${BASE_URL}/pull-requests/status/${pr_id}/${creator_id}/${repo_name}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus.toLowerCase()} pull request`);
      }

      setPullRequest(prev => prev ? { ...prev, pr_status: newStatus } : null);
    } catch (error) {
      setError(`Failed to update pull request status`);
    }
  };

  useEffect(() => {
    fetchPullRequest();
  }, [pr_id, creator_id, repo_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!pullRequest) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Pull Request Not Found</h2>
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}/pulls`)}
            className="mt-4 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Back to Pull Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}/pulls`)}
            className="flex items-center text-gray-400 hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pull Requests
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{pullRequest.pr_title}</h1>
              <div className="flex items-center mt-2 text-gray-400">
                <span className="mr-4">#{pullRequest.pr_id}</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {pullRequest.User.username}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {pullRequest.pr_status === 'Open' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus('Merged')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <GitMerge className="h-4 w-4 mr-2 inline" />
                    Merge
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Closed')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2 inline" />
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{pullRequest.pr_description}</p>
            </div>

            {/* Reviews */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Reviews</h2>
              
              {/* Review Form */}
              {pullRequest.pr_status === 'Open' && (
                <form onSubmit={handleSubmitReview} className="mb-6">
                  <div className="space-y-4">
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ comment: e.target.value })}
                      placeholder="Leave a review comment..."
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                      required
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={`${review.pr_id}-${review.reviewer_id}-${review.review_date}`} className="bg-gray-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {review.User?.avatar_url && (
                          <img
                            src={review.User.avatar_url}
                            alt={review.User.username}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">{review.User.username}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {timeAgo(review.review_date)}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2">{review.review_comments}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-400">Status</dt>
                  <dd className={`mt-1 inline-flex px-2 py-1 rounded-full text-sm ${
                    pullRequest.pr_status === 'Open' 
                      ? 'bg-green-900 text-green-300'
                      : pullRequest.pr_status === 'Merged'
                      ? 'bg-purple-900 text-purple-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {pullRequest.pr_status}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Base Branch</dt>
                  <dd className="mt-1">{pullRequest.baseBranch.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Target Branch</dt>
                  <dd className="mt-1">{pullRequest.targetBranch.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Created</dt>
                  <dd className="mt-1">{timeAgo(pullRequest.creation_date)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}