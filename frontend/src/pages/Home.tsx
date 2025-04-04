import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, GitFork, Star } from 'lucide-react';
import { BASE_URL } from '../context/AuthContext';

interface RepositoryCard {
  repo_name: string;
  description: string;
  stars: number;
  forks: number;
  username: string;
}

const mockRepositories: RepositoryCard[] = [
  {
    repo_name: 'react-starter',
    description: 'A modern React starter template with TypeScript and Tailwind CSS',
    stars: 128,
    forks: 45,
    username: 'johndoe',
  },
  {
    repo_name: 'node-api',
    description: 'RESTful API boilerplate using Node.js and Express',
    stars: 89,
    forks: 23,
    username: 'johndoe',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    console.log("userdetails",user);
    getAllrepos();
  

  }, [])

  const getAllrepos = async()=>{
    const response = await fetch(`${BASE_URL}/repo/all`,{
      method:'GET',
      credentials:'include'
    });
    const data= await response.json();
    console.log(data);

  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Repositories</h1>
          <button
            onClick={() => navigate('/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockRepositories.map((repo) => (
            <div
              key={`${repo.username}/${repo.repo_name}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 hover:underline">
                    <button onClick={() => navigate(`/${repo.username}/${repo.repo_name}/main`)}>
                      {repo.repo_name}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
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
  );
}