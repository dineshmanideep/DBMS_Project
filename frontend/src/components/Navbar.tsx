import React ,{useEffect}from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, logout,getCurrentUser } = useAuth();
  useEffect(() => {
    getCurrentUser();
  
    
  }, [])
  

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">MyApp</Link>
      </div>

      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>

        {!!user ? (
             <>
             <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
             <button
               onClick={logout}
               className="text-gray-700 hover:text-red-500 transition duration-200"
             >
               Logout
             </button>
           </>
         
        ) : (
            <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">Signup</Link>
          </>
         
        )}
      </div>
    </nav>
  );
};

export default NavBar;
