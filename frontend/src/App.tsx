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
import BranchHistory from './pages/BranchHistory';
import FileView from './pages/FileView';
import PullRequest from './pages/PullRequest';
import FileHistory from './pages/FileHistory';
import Issues from './pages/Issues';
import PullRequestDetail from './pages/PullRequestDetails';
import RepoContributors from './pages/RepoContributors';
import IssueForm from './pages/IssueForm';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster/>
        <div className="min-h-screen bg-gray-900 text-gray-100  ">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/:creator_id/:repo_name/settings" element={<RepositorySettings />} />
              <Route path="/:creator_id/:repo_name/branches" element={<BranchList />} />
              <Route path="/:creator_id/:repo_name/issues" element={<Issues />} />
              <Route path="/:creator_id/:repo_name/issues/new" element={<IssueForm />} />
              <Route path="/:creator_id/:repo_name/issues/:issue_id/edit" element={<IssueForm />} />
              <Route path="/:creator_id/:repo_name/:branch_name" element={<Repository />} />
              <Route path="/:creator_id/:repo_name/:branch_name/history" element={<BranchHistory />} />

              {/* <Route path="/:creator_id/:repo_name/:branch_name" element={<BranchView />} /> */}
              <Route path="/:creator_id/:repo_name/:branch_name/:file_name/" element={<FileView />} />
              <Route path="/:creator_id/:repo_name/:branch_name/:file_name/:commit_id" element={<FileView />} />
              <Route path="/:creator_id/:repo_name/pull" element={<PullRequest />} />
              <Route path="/:creator_id/:repo_name/pull/:pr_id" element={<PullRequestDetail />} />
              <Route path="/:creator_id/:repo_name/:branch_name/:file_name/history" element={<FileHistory />} />
              <Route path="/:creator_id/:repo_name/contributors" element={<RepoContributors />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;