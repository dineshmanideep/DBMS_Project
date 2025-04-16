import React,{useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, LogOut, Plus, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
export default function Header() {
  const { user, logout,getCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, [navigate])
  

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Code Collaboration
            </Link>
            {/* when user is not logged in */}
            {/* !!data= true
                 !!null =false 
                  */}

            {!!user?(<>
              <div className="ml-10 hidden md:block">
              <div className="flex items-center space-x-4">
                <button onClick={()=>logout()} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  logout
                </button>
              </div>
            </div></>):
            (<>
              <div className="ml-10 hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/signup" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Signup
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                
              </div>
            </div></>)
            }

          </div>

          

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* <button className="text-gray-300 hover:text-white">
              <Bell size={20} />
            </button> */}
            {/* <div className="relative">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <Plus size={20} />
                <ChevronDown size={16} />
              </button>
            </div> */}
            {!!user&&(<>
              <div className="relative">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <img onClick={()=>navigate(`/profile/${user?.user_id}`)}
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name)}`}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {/* User dropdown menu */}
            </div>
            </>)}
            
          </div>
        </div>
      </div>
    </header>
  );
}
