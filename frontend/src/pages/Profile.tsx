import React from 'react';

export default function Profile() {
  // Static user data
  const user = {
    username: 'johndoe',
    full_name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: 'https://github.com/ghost.png',
    bio: 'Full-stack developer passionate about open source.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    createdAt: 'January 2023',
  };

  // Static repositories data
  const repositories = [
    {
      name: 'react-starter',
      description: 'A modern React starter template with TypeScript and Tailwind CSS.',
      stars: 128,
      forks: 45,
      language: 'TypeScript',
      languageColor: '#2b7489',
      updated: '3 days ago',
    },
    {
      name: 'node-api',
      description: 'RESTful API boilerplate using Node.js and Express.',
      stars: 89,
      forks: 23,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      updated: '1 week ago',
    },
  ];

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
                    src={user.avatar}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-gray-800"
                  />
                </div>
              </div>
              <div className="pt-16 p-6 text-center">
                <h1 className="text-xl font-bold text-white">{user.full_name}</h1>
                <p className="text-gray-400">@{user.username}</p>
                <p className="text-gray-300 mt-4">{user.bio}</p>
                <div className="mt-6 space-y-2 text-sm text-gray-400">
                  <p>📍 {user.location}</p>
                  <p>✉️ {user.email}</p>
                  <p>
                    🔗{' '}
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                  <p>📅 Joined {user.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pinned Repositories */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Pinned Repositories</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {repositories.map((repo, index) => (
                  <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <h3 className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer">{repo.name}</h3>
                    <p className="text-gray-400 text-sm mt-2">{repo.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <span style={{ backgroundColor: repo.languageColor }} className="w-3 h-3 rounded-full inline-block mr-2"></span>
                      {repo.language}
                      <span>⭐ {repo.stars}</span>
                      <span>🍴 {repo.forks}</span>
                      <span>Updated {repo.updated}</span>
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
                {/* Static Activity Items */}
                <div className="p-6 flex items-start space-x-4">
                  <span>⭐</span>
                  <p>You starred react-starter 3 days ago.</p>
                </div>
                <div className="p-6 flex items-start space-x-4">
                  <span>🍴</span>
                  <p>You forked node-api 1 week ago.</p>
                </div>
              </div>
            </div>

            {/* Contribution Graph */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Contribution Activity</h2>
              </div>
              {/* Static Contribution Graph */}
              <div className="p-6 grid grid-cols-[repeat(7,_minmax(0,_1fr))] gap-x-[5px] gap-y-[5px]">
                {Array.from({ length: 49 }).map((_, i) => (
                  // Randomly generate contribution colors
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
                    className={`block w-full h-[12px] rounded-sm`}
                  ></span>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-[10px] flex justify-end pr-[10px] space-x-[5px] items-center text-xs text-[#9ca3af]">
                Less
                {[...Array(4)].map((_, i) => (
                  // Contribution legend colors
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
