import React from 'react';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Link as LinkIcon, Calendar, GitFork, Star } from 'lucide-react';

export default function UserProfile() {
  const { username } = useParams();

  // Mock user data - replace with API call
  const mockUser = {
    username: username,
    full_name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Full-stack developer passionate about open source',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joined: '2023-01-01',
  };

  const mockRepositories = [
    {
      name: 'react-starter',
      description: 'A modern React starter template',
      stars: 128,
      forks: 45,
      language: 'TypeScript',
      languageColor: '#2b7489',
    },
    {
      name: 'node-api',
      description: 'RESTful API boilerplate',
      stars: 89,
      forks: 23,
      language: 'JavaScript',
      languageColor: '#f1e05a',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <img
                src={mockUser.avatar}
                alt={mockUser.full_name}
                className="w-64 h-64 rounded-full mx-auto lg:mx-0"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockUser.full_name}</h1>
                <p className="text-lg text-gray-600">@{mockUser.username}</p>
              </div>
              <p className="text-gray-700">{mockUser.bio}</p>
              <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Profile
              </button>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {mockUser.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {mockUser.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  <a href={mockUser.website} className="text-indigo-600 hover:underline">
                    {mockUser.website}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(mockUser.joined).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Repository List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg divide-y divide-gray-200">
              {mockRepositories.map((repo) => (
                <div key={repo.name} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-600 hover:underline">
                        <a href={`/${mockUser.username}/${repo.name}/main`}>{repo.name}</a>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center">
                      <span
                        className="h-3 w-3 rounded-full mr-1"
                        style={{ backgroundColor: repo.languageColor }}
                      ></span>
                      <span className="text-sm text-gray-600">{repo.language}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stars}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repo.forks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}