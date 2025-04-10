import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitPullRequest, Check, X, MessageSquare, GitCommit, Clock, User, ArrowLeft, GitMerge, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';

interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface PullRequestDetail {
  id: number;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  status: 'Open' | 'Merged' | 'Closed';
  createdAt: string;
  updatedAt: string;
  sourceBranch: string;
  targetBranch: string; 
  commits: number;
  commentsCount: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  comments: Comment[];
}

export default function PullRequestDetail() {
  const { creator_id, repo_name, pr_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pullRequest, setPullRequest] = useState<PullRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockPR: PullRequestDetail = {
        id: Number(pr_id),
        title: 'Add user authentication',
        description: 'This pull request implements user authentication using JWT tokens.\n\nIt includes:\n- Login form\n- Registration form\n- Password reset\n- Session management',
        author: 'johndoe',
        authorAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
        status: 'Open',
        createdAt: '2 days ago',
        updatedAt: '5 hours ago',
        sourceBranch: 'feature/user-auth',
        targetBranch: 'main',
        commits: 3,
        commentsCount: 2,
        filesChanged: 8,
        additions: 240,
        deletions: 35,
        comments: [
          {
            id: 1,
            author: 'janedoe',
            authorAvatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random',
            content: 'Could you add more comments to the authentication service?',
            createdAt: '1 day ago'
          },
          {
            id: 2,
            author: 'johndoe',
            authorAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
            content: 'Added more comments as requested. Also improved the error handling.',
            createdAt: '12 hours ago'
          }
        ]
      };
      setPullRequest(mockPR);
      setLoading(false);
    }, 1000);
  }, [pr_id, creator_id, repo_name]);

  const handleMergePR = () => {
    console.log(`Merging PR #${pr_id}`);
    if (pullRequest) {
      setPullRequest({
        ...pullRequest,
        status: 'Merged'
      });
    }
  };

  const handleClosePR = () => {
    console.log(`Closing PR #${pr_id}`);
    if (pullRequest) {
      setPullRequest({
        ...pullRequest,
        status: 'Closed'
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    setTimeout(() => {
      if (pullRequest) {
        const newCommentObj: Comment = {
          id: pullRequest.comments.length + 1,
          author: user?.username || 'you',
          authorAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
          content: newComment,
          createdAt: 'just now'
        };
        setPullRequest({
          ...pullRequest,
          comments: [...pullRequest.comments, newCommentObj],
          commentsCount: pullRequest.commentsCount + 1
        });
      }
      setNewComment('');
      setSubmittingComment(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/${creator_id}/${repo_name}/pull`)}
          className="flex items-center text-gray-400 hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Pull Requests
        </button>
        
        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : pullRequest ? (
          <>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <GitPullRequest className="h-6 w-6 text-indigo-400 mr-2" />
                    <h1 className="text-2xl font-bold text-white">{pullRequest.title}</h1>
                    <span
                      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pullRequest.status === 'Open'
                          ? 'bg-green-900 text-green-300'
                          : pullRequest.status === 'Merged'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {pullRequest.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <span className="flex items-center mr-4">
                      <User size={14} className="mr-1" />
                      {pullRequest.author}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      Created {pullRequest.createdAt}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <GitCommit size={14} className="mr-1" />
                      <span>{pullRequest.commits} commits</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MessageSquare size={14} className="mr-1" />
                      <span>{pullRequest.commentsCount} comments</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="text-green-500 mr-1">+{pullRequest.additions}</span>
                      <span className="text-red-500 mr-1">-{pullRequest.deletions}</span>
                      <span>{pullRequest.filesChanged} files changed</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center bg-gray-700 rounded-md px-3 py-1 text-sm">
                    <span className="text-gray-400 mr-2">Merge:</span>
                    <span className="font-medium text-indigo-400">{pullRequest.sourceBranch}</span>
                    <ArrowLeft size={14} className="mx-2 text-gray-500" />
                    <span className="font-medium text-gray-300">{pullRequest.targetBranch}</span>
                  </div>
                </div>
                {pullRequest.status === 'Open' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleMergePR}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-600 transition-colors"
                    >
                      <GitMerge className="h-4 w-4 mr-2" />
                      Merge
                    </button>
                    <button
                      onClick={handleClosePR}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
              <div className="flex items-start space-x-3">
                <img
                  src={pullRequest.authorAvatar}
                  alt={pullRequest.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-medium text-white">{pullRequest.author}</span>
                        <span className="ml-2 text-sm text-gray-500">commented {pullRequest.createdAt}</span>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {pullRequest.description.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Comments ({pullRequest.commentsCount})</h2>
              <div className="space-y-4">
                {pullRequest.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="font-medium text-white">{comment.author}</span>
                            <span className="ml-2 text-sm text-gray-500">commented {comment.createdAt}</span>
                          </div>
                          <button className="p-1 text-gray-500 hover:text-gray-300 transition-colors">
                            <ThumbsUp size={14} />
                          </button>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-white mb-3">Add a comment</h3>
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-gray-750 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Write a comment..."
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Submitting...' : 'Comment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-700">
            <GitPullRequest size={48} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-medium text-white mb-2">Pull Request Not Found</h2>
            <p className="text-gray-400">The pull request you're looking for doesn't exist or you don't have permission to view it.</p>
          </div>
        )}
      </div>
    </div>
  );
}