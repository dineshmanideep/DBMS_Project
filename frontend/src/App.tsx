import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Repository from './pages/Repository';
import RepositorySettings from './pages/RepositorySettings';
import BranchList from './pages/BranchList';
import BranchView from './pages/BranchView';
import FileView from './pages/FileView';
import PullRequest from './pages/PullRequest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/:user_id" element={<UserProfile />} />
              <Route path="/:creator_id/:repo_name" element={<Repository />} />
              <Route path="/:creator_id/:repo_name/settings" element={<RepositorySettings />} />
              <Route path="/:creator_id/:repo_name/branches" element={<BranchList />} />
              <Route path="/:creator_id/:repo_name/:branch_name" element={<BranchView />} />
              <Route path="/:creator_id/:repo_name/:branch_name/:file_name" element={<FileView />} />
              <Route path="/:creator_id/:repo_name/pull/:pr_id" element={<PullRequest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
