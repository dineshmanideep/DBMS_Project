import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // Always default to dark mode
    document.documentElement.classList.add('dark');
    return 'dark';
  });

  // Save theme preference when it changes
  useEffect(() => {
    // Remove both classes first
    document.documentElement.classList.remove('dark', 'light');
    // Add the current theme class
    document.documentElement.classList.add(theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return newTheme;
    });
  }, []);

  // Your existing auth functions
  const login = async (email: string, password: string) => {
    // Implementation
  };

  const signup = async (username: string, email: string, password: string) => {
    // Implementation
  };

  const logout = () => {
    // Implementation
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      theme,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
