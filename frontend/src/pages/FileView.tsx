import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Edit, MessageSquare, History, Clock } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

export default function FileView() {
  const { username, repo_id, branch_name, file_name } = useParams();
  const [showHistory, setShowHistory] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Mock file content
  const fileContent = `# Example File Content
This is a sample file content.
It could be any type of text or code.
`;

  // Mock comments
  const comments: Comment[] = [
    {
      id: 1,
      author: 'johndoe',
      content: 'We should add more documentation here.',
      date: '2 days ago',
    },
    {
      id: 2,
      author: 'janedoe',
      content: 'Looks good to me!',
      date: '1 day ago',
    },
  ];

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file_name || 'file';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add comment
    setShowCommentForm(false);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{file_name}</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <History className="h-4 w-4 mr-2" />
                History
              </button>
            </div>
          </div>
        </div>

        {/* File Content */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {fileContent}
            </pre>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Comments</h2>
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </button>
          </div>

          {showCommentForm && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Write your comment..."
                />
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${comment.author}`}
                    alt={comment.author}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {comment.date}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
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