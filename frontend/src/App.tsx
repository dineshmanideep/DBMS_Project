import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import NavBar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/:username" element={<UserProfile />} />
          <Route path="/:username/:repo_id/branches" element={<BranchList />} />
          <Route path="/:username/:repo_id/:branch_name" element={<BranchView />} />
          <Route path="/:username/:repo_id/:branch_name/pull-request" element={<PullRequest />} />
          <Route path="/:username/:repo_id/:branch_name/:file_name" element={<FileView />} />
          <Route path="/:username/:repo_id/settings" element={<RepositorySettings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;