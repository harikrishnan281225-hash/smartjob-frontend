import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import Profile from './pages/Profile';
import SearchJobs from './pages/SearchJobs';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import UserProfile from './pages/UserProfile'; // NEW: Imported UserProfile
import AdminInbox from './pages/AdminInbox';
import AdminPostJob from './pages/AdminPostJob';
import AdminSearchJobs from './pages/AdminSearchJobs';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import UserInbox from './pages/UserInbox';
import JobInbox from './pages/JobInbox'; 
import UserLayout from './components/UserLayout';
import SidebarLayout from './components/SidebarLayout';

// Wrapper for Private User Routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <UserLayout>{children}</UserLayout> : <Navigate to="/login" replace />;
};

// Wrapper for Admin Routes
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" replace />;
  
  return role === 'ADMIN' ? (
    <SidebarLayout>{children}</SidebarLayout>
  ) : <Navigate to="/dashboard" replace />;
};

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => { 
    setIsAuthChecked(true); 
  }, []);
  
  if (!isAuthChecked) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-job" element={<PrivateRoute><AddJob /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/search-jobs" element={<PrivateRoute><SearchJobs /></PrivateRoute>} />
        
        {/* Dedicated Inboxes */}
        <Route path="/job-inbox" element={<PrivateRoute><JobInbox /></PrivateRoute>} />
        <Route path="/inbox" element={<PrivateRoute><UserInbox /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/user-profile/:id" element={<AdminRoute><UserProfile /></AdminRoute>} /> {/* NEW: Route added */}
        <Route path="/admin/search-jobs" element={<AdminRoute><AdminSearchJobs /></AdminRoute>} />
        <Route path="/admin/inbox" element={<AdminRoute><AdminInbox /></AdminRoute>} />
        <Route path="/admin/post-job" element={<AdminRoute><AdminPostJob /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;