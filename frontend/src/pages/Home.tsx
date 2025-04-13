import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, GitFork, Star, Lock, Github } from 'lucide-react';
import { BASE_URL } from '../context/AuthContext';
import react,{ useEffect,useState } from 'react';
import { timeAgo } from '../lib/timeAlgo';
import CreateRepositoryModal from '../components/CreateRepositoryModal';

interface Repository {
  repo_id: number;
  creator_id: number;
  repo_name: string;
  description: string;
  visibility: 'Public' | 'Private';
  creation_date: string;
  license: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  tags: string[];
  User: {
    username: string;
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]|null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();


  const fetchRepos= async()=>{
    const response= await fetch(`${BASE_URL}/repo/all`,{
      credentials:'include'
    })
    const data = await response.json();
    console.log(data);
    setRepos(data.data);
  }
  
  
  useEffect(() => {
    fetchRepos(); 
  }, [isModalOpen])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">All Repositories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </button>
        </div>
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos?.map((repo) => (
            <div
              key={repo.repo_id}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 hover:text-indigo-300 flex items-center">
                    <button onClick={() => navigate(`/${repo.creator_id}/${repo.repo_name}/main`)}>
                      {repo.repo_name}
                    </button>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full flex items-center
                      ${repo.visibility === 'Private' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-green-900 text-green-300'}`}
                    >
                      {repo.visibility === 'Private' 
                        ? <><Lock size={12} className="mr-1" />Private</>
                        : <><Github size={12} className="mr-1" />Public</>
                      }
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{repo.description || "No description"}</p>
                  
                  <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                    {repo.language && (
                      <span className="flex items-center">
                        <span 
                          style={{ backgroundColor: repo.languageColor }} 
                          className="w-3 h-3 rounded-full inline-block mr-2">
                        </span>
                        {repo.language}
                      </span>
                    )}
                    <span>Created {timeAgo(repo.creation_date)}</span>
                    {repo.license && <span>License: {repo.license}</span>}
                  </div>

                  {repo.tags && repo.tags.length > 0 && (
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
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {repo.stars || 0}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repo.forks || 0}
                </div>
               
              </div>
            </div>
          ))}

          <CreateRepositoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </div>
  );
}
