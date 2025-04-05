import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, LogOut, Plus, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Code Collaboration
            </Link>
            <div className="ml-10 hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/explore" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Explore
                </Link>
                <Link to="/pulls" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Pull Requests
                </Link>
                <Link to="/issues" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Issues
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="text-gray-300 hover:text-white">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <Plus size={20} />
                <ChevronDown size={16} />
              </button>
              {/* Dropdown menu for creating new repo, etc. */}
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full"
                />
                <ChevronDown size={16} />
              </button>
              {/* User dropdown menu */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
