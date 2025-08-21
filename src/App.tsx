import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnalysisProvider } from './contexts/AnalysisContext';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const RecentAnalysis = lazy(() => import('./pages/RecentAnalysis'));
const AnalysisDetails = lazy(() => import('./pages/AnalysisDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <ProtectedRoute>
                      <Analysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recent-analysis"
                  element={
                    <ProtectedRoute>
                      <RecentAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis-details/:id"
                  element={
                    <ProtectedRoute>
                      <AnalysisDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AnalysisProvider>
    </AuthProvider>
  );
}

export default App;