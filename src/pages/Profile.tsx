import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-white/70">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
              <p className="text-white/70">{user?.email}</p>
            </div>

            <div className="space-y-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Information</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                    <User className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white/60 text-sm">Full Name</p>
                      <p className="text-white font-medium">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                    <Mail className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white/60 text-sm">Email Address</p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                    <Calendar className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white/60 text-sm">Member Since</p>
                      <p className="text-white font-medium">
                        {new Date(user?.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;