import React, { useState } from 'react';
import { Pencil, Save, X, Lock, Github, MapPin, Mail, Globe, Calendar } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: 'johndoe',
    full_name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    bio: 'Full-stack developer passionate about open source.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    createdAt: 'January 2023',
  });

  const [editedDetails, setEditedDetails] = useState({ ...userDetails });

  // Repository data from your desired profile
  const publicRepositories = [
    {
      name: 'react-starter',
      description: 'A modern React starter template with TypeScript and Tailwind CSS.',
      stars: 128,
      forks: 45,
      language: 'TypeScript',
      languageColor: '#2b7489',
      updated: '3 days ago',
      isPrivate: false,
      tags: ['frontend', 'template', 'react']
    },
    {
      name: 'node-api',
      description: 'RESTful API boilerplate using Node.js and Express.',
      stars: 89,
      forks: 23,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      updated: '1 week ago',
      isPrivate: false,
      tags: ['backend', 'api', 'nodejs']
    },
  ];

  const privateRepositories = [
    {
      name: 'personal-blog',
      description: 'My personal blog built with Next.js and MDX.',
      stars: 0,
      forks: 0,
      language: 'TypeScript',
      languageColor: '#2b7489',
      updated: '2 days ago',
      isPrivate: true,
      tags: ['blog', 'nextjs', 'personal']
    },
    {
      name: 'finance-tracker',
      description: 'Personal finance tracking application with data visualization.',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      updated: '5 days ago',
      isPrivate: true,
      tags: ['finance', 'dashboard', 'visualization']
    },
    {
      name: 'portfolio-v2',
      description: 'My updated portfolio website with Three.js animations.',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      updated: '2 weeks ago',
      isPrivate: true,
      tags: ['portfolio', 'threejs', 'webgl']
    },
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      setUserDetails(editedDetails);
    } else {
      setEditedDetails({ ...userDetails });
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDetails({ ...userDetails });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDetails({
      ...editedDetails,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="relative">
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <img
                    src={userDetails.avatar}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-gray-800"
                  />
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    title="Edit profile"
                  >
                    <Pencil size={16} className="text-gray-300" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="pt-16 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={editedDetails.full_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={editedDetails.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={editedDetails.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editedDetails.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editedDetails.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={editedDetails.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleEditToggle}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors"
                      >
                        <Save size={16} className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-16 p-6 text-center">
                  <h1 className="text-xl font-bold text-white">{userDetails.full_name}</h1>
                  <p className="text-gray-400">@{userDetails.username}</p>
                  <p className="text-gray-300 mt-4">{userDetails.bio}</p>
                  <div className="mt-6 space-y-2 text-sm text-gray-400">
                    <p><MapPin size={16} className="inline mr-2" /> {userDetails.location}</p>
                    <p><Mail size={16} className="inline mr-2" /> {userDetails.email}</p>
                    <p>
                      <Globe size={16} className="inline mr-2" />{' '}
                      <a href={userDetails.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                        {userDetails.website.replace(/^https?:\/\//, '')}
                      </a>
                    </p>
                    <p><Calendar size={16} className="inline mr-2" /> Joined {userDetails.createdAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Private Repositories */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <Lock size={18} className="mr-2 text-indigo-400" />
                  Private Repositories
                </h2>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded-md text-gray-300">
                  {privateRepositories.length} repos
                </span>
              </div>
              <div className="divide-y divide-gray-700">
                {privateRepositories.map((repo, index) => (
                  <div key={index} className="p-5 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                            {repo.name}
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                              <Lock size={12} className="mr-1" />
                              Private
                            </span>
                          </a>
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{repo.description}</p>
                        <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                          <span className="flex items-center">
                            <span style={{ backgroundColor: repo.languageColor }} className="w-3 h-3 rounded-full inline-block mr-2"></span>
                            {repo.language}
                          </span>
                          <span>Updated {repo.updated}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {repo.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Repositories */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <Github size={18} className="mr-2 text-indigo-400" />
                  Public Repositories
                </h2>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded-md text-gray-300">
                  {publicRepositories.length} repos
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicRepositories.map((repo, index) => (
                  <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <h3 className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer flex items-center">
                      {repo.name}
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-900 text-green-300 flex items-center">
                        <Github size={12} className="mr-1" />
                        Public
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{repo.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <span style={{ backgroundColor: repo.languageColor }} className="w-3 h-3 rounded-full inline-block mr-2"></span>
                        {repo.language}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {repo.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-700">
                <div className="p-6 flex items-start space-x-4">
                  <span>⭐</span>
                  <div>
                    <p>You starred react-starter 3 days ago.</p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-900 text-green-300 flex items-center inline-flex">
                        <Github size={10} className="mr-1" />
                        Public
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-start space-x-4">
                  <span>🔒</span>
                  <div>
                    <p>You created a private repository personal-blog 2 days ago.</p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center inline-flex">
                        <Lock size={10} className="mr-1" />
                        Private
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-start space-x-4">
                  <span>🔒</span>
                  <div>
                    <p>You updated the private repository finance-tracker 5 days ago.</p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center inline-flex">
                        <Lock size={10} className="mr-1" />
                        Private
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-start space-x-4">
                  <span>🍴</span>
                  <div>
                    <p>You forked node-api 1 week ago.</p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-900 text-green-300 flex items-center inline-flex">
                        <Github size={10} className="mr-1" />
                        Public
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Graph */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Contribution Activity</h2>
              </div>
              <div className="p-6 grid grid-cols-[repeat(7,_minmax(0,_1fr))] gap-x-[5px] gap-y-[5px]">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor:
                        Math.random() > 0.7
                          ? Math.random() > 0.9
                            ? '#16a34a'
                            : '#22c55e'
                          : '#374151',
                    }}
                    className="block w-full h-[12px] rounded-sm"
                  />
                ))}
              </div>
              <div className="mt-[10px] flex justify-end pr-[10px] space-x-[5px] items-center text-xs text-[#9ca3af]">
                Less
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor:
                        i === 0 ? '#374151' : i === 1 ? '#22c55e' : i === 2 ? '#16a34a' : '#15803d',
                    }}
                    className={`block w-[12px] h-[12px] rounded-sm`}
                  ></span>
                ))}
                More
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}