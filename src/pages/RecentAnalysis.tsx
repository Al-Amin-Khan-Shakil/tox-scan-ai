import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  Calendar, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Shield,
  Search,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { analysisService } from '../services/api';

interface AnalysisItem {
  id: string;
  originalText: string;
  translatedText?: string;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string;
  createdAt: string;
  imageUrl?: string;
}

const RecentAnalysis: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const data = await analysisService.getHistory();
        setAnalyses(data);
      } catch (error) {
        console.error('Error loading analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyses();
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-success-400';
      case 'medium': return 'text-warning-400';
      case 'high': return 'text-error-400';
      default: return 'text-white/70';
    }
  };

  const getRiskBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-success-600/20 border-success-500/30';
      case 'medium': return 'bg-warning-600/20 border-warning-500/30';
      case 'high': return 'bg-error-600/20 border-error-500/30';
      default: return 'bg-white/10 border-white/20';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertCircle;
      default: return Shield;
    }
  };

  // Filter analyses based on search term and risk level
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (analysis.translatedText && analysis.translatedText.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = filterRisk === 'all' || analysis.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading your analysis history..." />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <History className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Recent Analysis
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            View and manage all your ingredient analysis history
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Risk Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-white/40" />
                </div>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">All Risk Levels</option>
                  <option value="low" className="bg-slate-800">Low Risk</option>
                  <option value="medium" className="bg-slate-800">Medium Risk</option>
                  <option value="high" className="bg-slate-800">High Risk</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-white/70 text-center">
            Showing {filteredAnalyses.length} of {analyses.length} analyses
          </p>
        </motion.div>

        {/* Analysis List */}
        {filteredAnalyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-12 text-center">
              <History className="h-16 w-16 text-white/40 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                {searchTerm || filterRisk !== 'all' ? 'No matching analyses found' : 'No analyses yet'}
              </h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                {searchTerm || filterRisk !== 'all' 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Start by analyzing your first product to see results here.'
                }
              </p>
              {!searchTerm && filterRisk === 'all' && (
                <Link
                  to="/analysis"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Shield className="h-5 w-5" />
                  <span>Analyze Now</span>
                </Link>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredAnalyses.map((analysis, index) => {
              const RiskIcon = getRiskIcon(analysis.riskLevel);
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link to={`/analysis-details/${analysis.id}`}>
                    <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                      <div className="flex items-start space-x-4">
                        {/* Risk Indicator */}
                        <div className={`flex-shrink-0 p-3 rounded-lg ${getRiskBg(analysis.riskLevel)}`}>
                          <RiskIcon className={`h-6 w-6 ${getRiskColor(analysis.riskLevel)}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                Analysis #{analysis.id.slice(0, 8)}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-white/60">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                                </div>
                                {analysis.imageUrl && (
                                  <div className="flex items-center space-x-1">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Image available</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-white/40 flex-shrink-0 mt-1" />
                          </div>

                          {/* Preview Text */}
                          <p className="text-white/80 text-sm mb-3 line-clamp-2">
                            {analysis.originalText.length > 150 
                              ? `${analysis.originalText.substring(0, 150)}...`
                              : analysis.originalText
                            }
                          </p>

                          {/* Risk Badge */}
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              analysis.riskLevel === 'low' ? 'bg-success-600/20 text-success-300' :
                              analysis.riskLevel === 'medium' ? 'bg-warning-600/20 text-warning-300' :
                              'bg-error-600/20 text-error-300'
                            }`}>
                              {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                            </span>
                            <span className="text-white/50 text-xs">
                              Click to view details
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Action */}
        {filteredAnalyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              to="/analysis"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Shield className="h-5 w-5" />
              <span>Analyze New Product</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecentAnalysis;