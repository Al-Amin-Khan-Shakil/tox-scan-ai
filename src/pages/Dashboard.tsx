import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  History,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { analysisService } from '../services/api';
import BoltBadge from '../assets/white_circle_360x360.png';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { analysisHistory, setCurrentAnalysis } = useAnalysis();
  const [isLoading, setIsLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    safeProducts: 0,
    warningProducts: 0,
    dangerousProducts: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const history = await analysisService.getHistory();
        setRecentAnalyses(history);

        // Calculate stats
        const totalAnalyses = history.length;
        const safeProducts = history.filter((item: any) => item.riskLevel === 'low').length;
        const warningProducts = history.filter((item: any) => item.riskLevel === 'medium').length;
        const dangerousProducts = history.filter((item: any) => item.riskLevel === 'high').length;

        setStats({
          totalAnalyses,
          safeProducts,
          warningProducts,
          dangerousProducts
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-success-400';
      case 'medium': return 'text-warning-400';
      case 'high': return 'text-error-400';
      default: return 'text-white/70';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-xl text-white/70">
            Here's your ingredient analysis overview
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Analyses</p>
                  <p className="text-3xl font-bold text-white">{stats.totalAnalyses}</p>
                </div>
                <div className="p-3 bg-primary-600/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Safe Products</p>
                  <p className="text-3xl font-bold text-success-400">{stats.safeProducts}</p>
                </div>
                <div className="p-3 bg-success-600/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Caution Needed</p>
                  <p className="text-3xl font-bold text-warning-400">{stats.warningProducts}</p>
                </div>
                <div className="p-3 bg-warning-600/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-warning-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">High Risk</p>
                  <p className="text-3xl font-bold text-error-400">{stats.dangerousProducts}</p>
                </div>
                <div className="p-3 bg-error-600/20 rounded-lg">
                  <Shield className="h-6 w-6 text-error-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/analysis">
              <GlassCard className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Analyze New Product
                    </h3>
                    <p className="text-white/70">
                      Upload or take a photo of ingredient lists to get AI-powered safety analysis
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </GlassCard>
            </Link>

            <Link to="/recent-analysis">
              <GlassCard className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-secondary-600/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <History className="h-8 w-8 text-secondary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      View All Analyses
                    </h3>
                    <p className="text-white/70">
                      Browse and search through your complete ingredient analysis history
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </GlassCard>
            </Link>
          </div>
        </motion.div>

        {/* Recent Analysis History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Recent Analysis</h3>
            {recentAnalyses.length > 5 && (
              <Link
                to="/recent-analysis"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
              >
                View All
              </Link>
            )}
          </div>

          {recentAnalyses.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Camera className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">No analyses yet</h4>
              <p className="text-white/70 mb-6">
                Start by analyzing your first product to see results here
              </p>
              <Link
                to="/analysis"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Camera className="h-5 w-5" />
                <span>Analyze Now</span>
              </Link>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.slice(0, 5).map((analysis, index) => {
                const RiskIcon = getRiskIcon(analysis.riskLevel);
                return (
                  <Link key={analysis.id} to={`/analysis-details/${analysis.id}`}>
                    <GlassCard className="p-6 hover:bg-white/15 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] mb-2">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          analysis.riskLevel === 'low' ? 'bg-success-600/20' :
                          analysis.riskLevel === 'medium' ? 'bg-warning-600/20' :
                          'bg-error-600/20'
                        }`}>
                          <RiskIcon className={`h-5 w-5 ${getRiskColor(analysis.riskLevel)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              Analysis #{analysis.id.slice(0, 8)}
                            </h4>
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {analysis.originalText.substring(0, 100)}...
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              analysis.riskLevel === 'low' ? 'bg-success-600/20 text-success-300' :
                              analysis.riskLevel === 'medium' ? 'bg-warning-600/20 text-warning-300' :
                              'bg-error-600/20 text-error-300'
                            }`}>
                              {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-white/40" />
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;