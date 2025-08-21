import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Microscope, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = React.memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50">
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="p-2 rounded-lg bg-gradient-primary group-hover:scale-110 transition-transform duration-200">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                ToxScan<span className="text-primary-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/dashboard')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analysis"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/analysis')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Analyze
                  </Link>
                  <Link
                    to="/recent-analysis"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/recent-analysis')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Recent Analysis
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-error-600 hover:bg-error-700 transition-colors duration-200 text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white hover:text-primary-400 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-black/20 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/dashboard')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analysis"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/analysis')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Analyze
                  </Link>
                  <Link
                    to="/recent-analysis"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/recent-analysis')
                        ? 'text-primary-400 bg-white/10'
                        : 'text-white hover:text-primary-400 hover:bg-white/5'
                    }`}
                  >
                    Recent Analysis
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary-400 hover:bg-white/5 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error-400 hover:bg-white/5 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-4 pt-4 border-t border-white/20">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary-400 hover:bg-white/5 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-3 bg-gradient-primary text-white font-medium rounded-lg text-center transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;