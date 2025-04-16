import React, { useEffect, useState } from 'react';
import { Pencil, Save, X, Lock, Github, MapPin, Mail, Globe, Calendar ,GitFork} from 'lucide-react';
import { BASE_URL, useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { User } from '../types/auth';
import { timeAgo } from '../lib/timeAlgo';
import toast from 'react-hot-toast';
// import { Repository,ContributerDetails } from '../types/repository_types';
// import Repository from './Repository';
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

interface ContributerDetails {
  repo_id: number;
  user_id: number;
  role: 'Admin' | 'Write' | 'Read';
  Repository: Repository;
}
interface RepoItems extends ContributerDetails {
  Repository: Repository

}

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [authorized, setAuthorized] = useState<Boolean>(false);
  const { user } = useAuth();
  const [repos, setRepos] = useState<RepoItems[] | null>(null)




  useEffect(() => {
    fetchUser();
    fetchRepos();

  }, [])


  const [userDetails, setUserDetails] = useState<User | null>(null);
  useEffect(() => {
    if (id == user?.user_id) {
      setAuthorized(true);
    }

  }, [userDetails, id]);

  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}/user/${id}`, {
      credentials: 'include'
    })
    const data = await res.json();
    console.log("user data", data);
    setUserDetails({ ...data.data });

  };

  const fetchRepos = async () => {
    const res = await fetch(`${BASE_URL}/repo/specific/${id}`, {

      credentials: 'include'
    });
    const data = await res.json();
    console.log("repo details", data)
    setRepos(data.data)

  }

  const [editedDetails, setEditedDetails] = useState({ ...userDetails });

  // Repository data from your desired profile



  const handleEditToggle = () => {
    if (isEditing) {
      setUserDetails(editedDetails as User);
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

  const handleEdit = async () => {
    try {
      console.log("hit edit");
      console.log(editedDetails);
      const res = await fetch(`${BASE_URL}/user/update/${userDetails?.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedDetails),
      })
      const data = await res.json();
      console.log("updated data", data);
      setUserDetails(editedDetails as User);

      toast.success("Updated Profile")
      

    } catch (error) {
      console.log(error);
      toast.error("Failed to Update Profile")
    }
    finally {

      setIsEditing(false)
    }



  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="relative">
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                {(authorized && !isEditing) ? <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <img
                    src={userDetails?.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.full_name)}`}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-gray-800"
                  />
                </div> 
                :
                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <img
                    src={editedDetails.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.full_name)}`}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-gray-800"
                  />
                </div>}
                
                {(authorized && !isEditing) && (
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
                        value={editedDetails?.location}
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
                        value={editedDetails?.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Avatar Url
                      </label>
                      <input
                        type="url"
                        name="avatar"
                        value={editedDetails?.avatar}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => { handleEditToggle(), handleEdit() }}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors"
                      >
                        <Save size={16} className="mr-2" onClick={handleEdit} />
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
                  <h1 className="text-xl font-bold text-white">{userDetails?.full_name}</h1>
                  <p className="text-gray-400">@{userDetails?.username}</p>
                  {userDetails?.bio &&<p className="text-gray-300 mt-4">{userDetails?.bio}</p> }
                  
                  <div className="mt-6 space-y-2 text-sm text-gray-400">
                    {userDetails?.location && <p><MapPin size={16} className="inline mr-2" /> {userDetails?.location}</p>}
                    {userDetails?.email && <p><Mail size={16} className="inline mr-2" /> {userDetails?.email}</p>}
                    {userDetails?.website &&<p>
                      <Globe size={16} className="inline mr-2" />{' '}
                      <a href={userDetails?.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                        {userDetails?.website}
                      </a>
                    </p>}
                    
                    <p><Calendar size={16} className="inline mr-2" /> Joined {timeAgo(userDetails?.registration_date as string)}</p>
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
                  {repos?.filter(repo => repo.Repository.visibility === 'Private').length || 0} repos
                </span>
              </div>
              <div className="divide-y divide-gray-700">
                {repos?.filter(repo => repo.Repository.visibility === 'Private').map((repo) => (
                  <div key={repo.Repository.repo_id} className="p-5 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          <a href={`/${repo.Repository.creator_id}/${repo.Repository.repo_name}/main`}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                            {repo.Repository.repo_name}
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                              <Lock size={12} className="mr-1" />
                              Private
                            </span>
                          </a>
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{repo.Repository.description || "No description"}</p>
                        <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                          {repo.Repository.language && (
                            <span className="flex items-center">
                              <span
                                style={{ backgroundColor: repo.Repository.languageColor }}
                                className="w-3 h-3 rounded-full inline-block mr-2">
                              </span>
                              {repo.Repository.language}
                            </span>
                          )}
                          <span>Created {timeAgo(repo.Repository.creation_date)}</span>
                          <span>License: {repo.Repository.license || 'None'}</span>
                        </div>
                        {repo.Repository.tags && repo.Repository.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {repo.Repository.tags.map((tag, tagIndex) => (
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
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <GitFork className="h-4 w-4 mr-1" />
                          {repo.Repository.forks}
                        </span>
                        <span className="flex items-center">
                          ⭐ {repo.Repository.stars}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {repos?.filter(repo => repo.Repository.visibility === 'Private').length === 0 && (
                  <div className="p-6 text-center text-gray-400">
                    No private repositories
                  </div>
                )}
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
                  {repos?.filter(repo => repo.Repository.visibility === 'Public').length || 0} repos
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos?.filter(repo => repo.Repository.visibility === 'Public').map((repo) => (
                  <div key={repo.Repository.repo_id}
                    className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <h3 className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer flex items-center">
                      <a href={`/${repo.Repository.creator_id}/${repo.Repository.repo_name}/main`}>
                        {repo.Repository.repo_name}
                      </a>
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-900 text-green-300 flex items-center">
                        <Github size={12} className="mr-1" />
                        Public
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{repo.Repository.description || "No description"}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      {repo.Repository.language && (
                        <div className="flex items-center">
                          <span
                            style={{ backgroundColor: repo.Repository.languageColor }}
                            className="w-3 h-3 rounded-full inline-block mr-2">
                          </span>
                          {repo.Repository.language}
                        </div>
                      )}
                      <div className="flex items-center space-x-4">
                        <span>⭐ {repo.Repository.stars}</span>
                        <span className="flex items-center">
                          <GitFork className="h-4 w-4 mr-1" />
                          {repo.Repository.forks}
                        </span>
                      </div>
                    </div>
                    {repo.Repository.tags && repo.Repository.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {repo.Repository.tags.map((tag, tagIndex) => (
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
                ))}
                {repos?.filter(repo => repo.Repository.visibility === 'Public').length === 0 && (
                  <div className="col-span-2 text-center text-gray-400 py-8">
                    No public repositories
                  </div>
                )}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}