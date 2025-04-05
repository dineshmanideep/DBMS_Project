import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { History, Download, Edit, MessageSquare, Clock, ChevronLeft, Share2, Clipboard, Check, Save } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { BASE_URL } from '../context/AuthContext';

export default function FileView() {
  const { creator_id, repo_name, branch_name, file_name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchFileContent();
  }, [file_name, branch_name]);

  const fetchFileContent = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/file/get/${creator_id}/${repo_name}/${branch_name}/${file_name}`, {
      credentials: 'include'
    });
    const data = await response.json();
    setFileContent(data.content);
    setOriginalContent(data.content);
    setLoading(false);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = file_name || 'file.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = async () => {
    const response = await fetch(`${BASE_URL}/file/update/${creator_id}/${repo_name}/${branch_name}/${file_name}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: fileContent,
        commit_message: commitMessage || `Updated ${file_name}`
      })
    });

    const result = await response.json();
    if (response.ok) {
      setOriginalContent(fileContent);
      setIsEditing(false);
      setCommitMessage('');
      console.log("Saved successfully:", result);
    } else {
      alert("Failed to save: " + result.error);
    }
  };

  // const handleAddComment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     setComments([
  //       ...comments,
  //       {
  //         id: comments.length + 1,
  //         author: 'currentuser',
  //         avatar: 'https://github.com/ghost.png',
  //         content: newComment,
  //         date: 'Just now',
  //       },
  //     ]);
  //     setNewComment('');
  //     setShowCommentForm(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <SkeletonLoader type="code" />
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={() => navigate(`/${creator_id}/${repo_name}/${branch_name}`)}
                className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                <span>Back to repository</span>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-700">
                <h1 className="text-xl font-semibold mb-2 md:mb-0">{file_name}</h1>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowHistory(!showHistory)} className="flex items-center px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600">
                    <History size={16} /><span className="ml-1">History</span>
                  </button>
                  <button onClick={handleDownload} className="flex items-center px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600">
                    <Download size={16} /><span className="ml-1">Download</span>
                  </button>
                  <button onClick={handleCopyCode} className="flex items-center px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600">
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                    <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1 bg-indigo-600 rounded-md hover:bg-indigo-700">
                      <Edit size={16} /><span className="ml-1">Edit</span>
                    </button>
                  ) : (
                    <button onClick={handleSaveChanges} className="flex items-center px-3 py-1 bg-green-600 rounded-md hover:bg-green-700">
                      <Save size={16} /><span className="ml-1">Save</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 border-b border-gray-700">
                {isEditing ? (
                  <>
                    <textarea
                      className="w-full h-72 p-3 font-mono text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                    />
                    <input
                      type="text"
                      className="mt-2 w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Commit message"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                    />
                  </>
                ) : (
                  <div className="relative overflow-hidden">
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left">
                        <tbody>
                          {fileContent.split('\n').map((line, index) => (
                            <tr key={index} className="hover:bg-gray-750">
                              <td className="py-0.5 px-4 text-gray-500 select-none text-right border-r border-gray-700 bg-gray-850 w-10">
                                {index + 1}
                              </td>
                              <td className="py-0.5 px-4 font-mono whitespace-pre-wrap">{line || ' '}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments section (same as before) */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="flex items-center px-3 py-1 bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  <MessageSquare size={16} /><span className="ml-1">{showCommentForm ? 'Cancel' : 'Add comment'}</span>
                </button>
              </div>

              {showCommentForm && (
                <div className="p-4 border-b border-gray-700">
                  <form 
                  // onSubmit={handleAddComment}
                  >
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                      placeholder="Write a comment..."
                      rows={3}
                    ></textarea>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCommentForm(false)}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm text-white hover:bg-indigo-700"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* <div className="divide-y divide-gray-700">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 hover:bg-gray-750">
                      <div className="flex items-start">
                        <img src={comment.avatar} alt="avatar" className="h-10 w-10 rounded-full mr-4" />
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="font-medium text-indigo-400">{comment.author}</div>
                            <div className="ml-2 text-sm text-gray-400 flex items-center">
                              <Clock size={14} className="mr-1" />
                              {comment.date}
                            </div>
                          </div>
                          <div className="text-gray-300">{comment.content}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
