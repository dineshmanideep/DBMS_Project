// Replace content in UserProfile.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, MapPin, Link as LinkIcon, Calendar, GitFork, Star, Users, Book } from 'lucide-react';

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
    joined: 'January 2023',
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={mockUser.avatar} 
                  alt={`${mockUser.full_name}'s avatar`}
                  className="w-32 h-32 rounded-full mb-4 border-2 border-indigo-500"
                />
                <h1 className="text-2xl font-bold text-white">{mockUser.full_name}</h1>
                <p className="text-gray-400">@{mockUser.username}</p>
              </div>
              
              <div className="text-left space-y-3">
                <p className="text-gray-300">{mockUser.bio}</p>
                
                <div className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-2" />
                  <span>{mockUser.location}</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <LinkIcon size={16} className="mr-2" />
                  <a href={mockUser.website} className="text-indigo-400 hover:text-indigo-300">
                    {mockUser.website.replace('https://', '')}
                  </a>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <Mail size={16} className="mr-2" />
                  <span>{mockUser.email}</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <Calendar size={16} className="mr-2" />
                  <span>Joined {mockUser.joined}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">12</div>
                    <div className="text-xs text-gray-400">Repositories</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">148</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">67</div>
                    <div className="text-xs text-gray-400">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Book size={20} className="mr-2" />
                  Repositories
                </h2>
              </div>
              
              <div className="divide-y divide-gray-700">
                {mockRepositories.map((repo, index) => (
                  <div key={index} className="p-4 hover:bg-gray-750 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/${username}/${repo.name}`}
                        className="text-lg font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        {repo.name}
                      </Link>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Star size={16} className="text-yellow-400" />
                          <span>{repo.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <GitFork size={16} />
                          <span>{repo.forks}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{repo.description}</p>
                    <div className="flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: repo.languageColor }}
                      ></span>
                      <span className="text-sm text-gray-400">{repo.language}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users size={20} className="mr-2" />
                  Activity
                </h2>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-center h-40 text-gray-500">
                  No recent activity to show
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
