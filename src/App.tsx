import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/recent-analysis" element={<RecentAnalysis />} />
                <Route path="/analysis-details/:id" element={<AnalysisDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AnalysisProvider>
    </AuthProvider>
  );
}

export default App;