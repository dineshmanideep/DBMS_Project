import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Github, Lock, GitCommit, Clock, Star } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface Contributor {
  id: number;
  username: string;
  avatar: string;
  contributions: number;
  role: 'Owner' | 'Collaborator' | 'Contributor' | null;
  profile_url: string;
  last_contribution: string;
  firstContribution: string;
}

export default function RepoContributors() {
  const { creator_id, repo_name } = useParams();
  const navigate = useNavigate();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [repoIsPrivate, setRepoIsPrivate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockContributors: Contributor[] = [
        {
          id: 1,
          username: 'johndoe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
          contributions: 127,
          role: 'Owner',
          profile_url: `/${creator_id}`,
          last_contribution: '2 days ago',
          firstContribution: '6 months ago'
        },
        {
          id: 2,
          username: 'janedoe',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random',
          contributions: 84,
          role: 'Collaborator',
          profile_url: '/janedoe',
          last_contribution: '1 week ago',
          firstContribution: '5 months ago'
        },
        {
          id: 3,
          username: 'mike_smith',
          avatar: 'https://ui-avatars.com/api/?name=Mike+Smith&background=random',
          contributions: 52,
          role: 'Collaborator',
          profile_url: '/mike_smith',
          last_contribution: '2 weeks ago',
          firstContribution: '4 months ago'
        },
        {
          id: 4,
          username: 'alex_johnson',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random',
          contributions: 23,
          role: 'Contributor',
          profile_url: '/alex_johnson',
          last_contribution: '1 month ago',
          firstContribution: '3 months ago'
        },
        {
          id: 5,
          username: 'sarah_parker',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Parker&background=random',
          contributions: 19,
          role: 'Contributor',
          profile_url: '/sarah_parker',
          last_contribution: '1 month ago',
          firstContribution: '2 months ago'
        },
        {
          id: 6,
          username: 'david_brown',
          avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=random',
          contributions: 8,
          role: 'Contributor',
          profile_url: '/david_brown',
          last_contribution: '2 months ago',
          firstContribution: '3 months ago'
        },
        {
          id: 7,
          username: 'lisa_jones',
          avatar: 'https://ui-avatars.com/api/?name=Lisa+Jones&background=random',
          contributions: 5,
          role: 'Contributor',
          profile_url: '/lisa_jones',
          last_contribution: '3 months ago',
          firstContribution: '3 months ago'
        }
      ];

      setRepoIsPrivate(Math.random() > 0.5);
      setContributors(mockContributors);
      setLoading(false);
    }, 1000);
  }, [creator_id, repo_name]);

  const filteredContributors = contributors.filter(contributor => 
    contributor.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/${creator_id}/${repo_name}`)}
            className="flex items-center text-gray-400 hover:text-gray-300 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to repository
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white mr-2">{creator_id}/{repo_name}</h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
              {repoIsPrivate ? (
                <>
                  <Lock size={12} className="mr-1" />
                  Private
                </>
              ) : (
                <>
                  <Github size={12} className="mr-1" />
                  Public
                </>
              )}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white flex items-center">
              <Users size={18} className="mr-2 text-indigo-400" />
              Contributors
            </h2>
            <span className="text-sm bg-gray-700 px-2 py-1 rounded-md text-gray-300">
              {contributors.length} people
            </span>
          </div>

          <div className="px-6 py-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Find a contributor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 pl-10 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Users size={16} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <SkeletonLoader type="card" count={5} />
            </div>
          ) : filteredContributors.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {filteredContributors.map((contributor) => (
                <div key={contributor.id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={contributor.avatar}
                        alt={contributor.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          <a href={contributor.profile_url} className="hover:text-indigo-400 transition-colors">
                            {contributor.username}
                          </a>
                        </h3>
                        {contributor.role && (
                          <span className="text-xs text-gray-400">
                            {contributor.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm mb-1">
                        <GitCommit size={14} className="mr-1 text-green-500" />
                        <span className="text-white font-medium">{contributor.contributions}</span>
                        <span className="text-gray-400 ml-1">commits</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>Last active {contributor.last_contribution}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pl-14 text-xs text-gray-400">
                    <p>First contributed {contributor.firstContribution}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No matching contributors found</p>
              <p className="mt-1">Try searching with a different username</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Contribution Statistics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <div className="text-lg font-bold text-white">{contributors.reduce((sum, contributor) => sum + contributor.contributions, 0)}</div>
                <div className="text-sm text-gray-400">Total Commits</div>
              </div>
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <div className="text-lg font-bold text-white">{contributors.length}</div>
                <div className="text-sm text-gray-400">Total Contributors</div>
              </div>
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <div className="text-lg font-bold text-white">{Math.round(contributors.reduce((sum, contributor) => sum + contributor.contributions, 0) / contributors.length)}</div>
                <div className="text-sm text-gray-400">Average Commits per Contributor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}