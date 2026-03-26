import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Messenger from './pages/Messenger';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Explore from './pages/Explore';

// Layout
import Layout from './components/layout/Layout';

const RouteLoadingShell = () => (
  <div className="loading-screen">
    <div className="loading-shell loading-shell-simple">
      <div className="loading-surface loading-surface-wide" />
      <div className="loading-surface loading-surface-short" />
      <div className="loading-surface loading-surface-tall" />
      <div className="loading-surface loading-surface-card" />
      <div className="loading-surface loading-surface-card" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoadingShell />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoadingShell />;
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Layout><Friends /></Layout></ProtectedRoute>} />
        <Route path="/messenger" element={<ProtectedRoute><Layout noPadding><Messenger /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Layout><Explore /></Layout></ProtectedRoute>} />
        <Route path="/guide" element={<Navigate to="/explore" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
