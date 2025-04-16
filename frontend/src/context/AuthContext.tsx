import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types/auth';
import { ContributerDetails } from '../types/repository_types';
interface AuthContextType {
  user: User | null;
  contributer:ContributerDetails|null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, full_name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  getCurrentContributer: (creator_id:string,repo_name:string) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const BASE_URL = 'http://localhost:3000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [contributer, setContributer] = useState<ContributerDetails|null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    document.documentElement.classList.add('dark'); // default to dark
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('from login', data);
      if (res.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      throw new Error(err.message ||'Failed to login');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (username: string, full_name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, full_name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      console.log("get current user",data.user);
        console.log("user getcurrent user",user)
      } else {
        // setUser(null);
      }
    } catch (err) {
      console.error('Get current user error:', err);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getCurrentContributer= useCallback( async(creator_id:string,repo_name:string) => {
      setLoading(true);
      try {
        const res= await fetch(`${BASE_URL}/contributer/${creator_id}/${repo_name}/me`,{
          method:'GET',
          credentials:'include'
        })

        const data=await res.json();
        console.log("contirbuter data",data);
        setContributer(data.data);
        
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    },[]
  );
  

  return (
    <AuthContext.Provider value={{ user,contributer, loading, login, signup, logout, getCurrentUser, theme, toggleTheme,getCurrentContributer }}>
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
