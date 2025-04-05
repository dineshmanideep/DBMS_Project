import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, GitFork, Star } from 'lucide-react';
import { BASE_URL } from '../context/AuthContext';
import react,{ useEffect,useState } from 'react';
import { Repository } from '../types/repository';
import CreateRepositoryModal from '../components/CreateRepositoryModal';


//mock data
// interface RepositoryCard {
//   repo_name: string;
//   description: string;
//   stars?: number ;
//   forks?: number;
//   username: string;
// }
// mock data
// const mockRepositories: RepositoryCard[] = [
//   {
//     repo_name: 'react-starter',
//     description: 'A modern React starter template with TypeScript and Tailwind CSS',
//     stars: 128,
//     forks: 45,
//     username: 'johndoe',
//   },
//   {
//     repo_name: 'node-api',
//     description: 'RESTful API boilerplate using Node.js and Express',
//     stars: 89,
//     forks: 23,
//     username: 'johndoe',
//   },
// ];




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
       {/* mockdata  */}
          {/* {mockRepositories.map((repo) => (
            <div
              key={`${repo.username}/${repo.repo_name}`}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 hover:text-indigo-300">
                    <button onClick={() => navigate(`/${repo.username}/${repo.repo_name}/main`)}>
                      {repo.repo_name}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {repo?.stars ||0}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repo?.forks||0}
                </div>
              </div>
            </div>
          ))} */}
          {repos?.map((repo) => (
            <div
              key={`${repo.creator_id}/${repo.repo_name}`}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 hover:text-indigo-300">
                    <button onClick={() => navigate(`/${repo.creator_id}/${repo.repo_name}/main`)}>
                      {repo.repo_name}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {repo?.stars ||0}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repo?.forks||0}
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
