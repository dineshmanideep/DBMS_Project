import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-indigo-400" />
      )}
    </button>
  );
}
