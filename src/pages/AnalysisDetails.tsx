import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  FileImage,
  Languages,
  Shield,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Eye,
  Download,
  Share2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { analysisService } from '../services/api';

interface AnalysisDetails {
  id: string;
  originalText: string;
  translatedText?: string;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string;
  createdAt: string;
  imageUrl?: string;
}

const AnalysisDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id) {
        setError('Analysis ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const data = await analysisService.getAnalysis(id);
        setAnalysis(data);
      } catch (err: any) {
        console.error('Error loading analysis:', err);
        setError(err.response?.data?.message || 'Failed to load analysis details');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  // Function to filter out recommendations section from analysis
  const getFilteredAnalysis = (analysisText: string) => {
    const recommendationHeaders = [
      '## Usage Recommendations',
      '# Usage Recommendations',
      '### Usage Recommendations',
      '## Recommendations',
      '# Recommendations',
      '### Recommendations',
      '## Usage Guidelines',
      '# Usage Guidelines',
      '### Usage Guidelines'
    ];

    let filteredAnalysis = analysisText;

    for (const header of recommendationHeaders) {
      const headerIndex = filteredAnalysis.indexOf(header);
      if (headerIndex !== -1) {
        const nextSectionRegex = /\n#{1,3}\s/g;
        nextSectionRegex.lastIndex = headerIndex + header.length;
        const nextMatch = nextSectionRegex.exec(filteredAnalysis);

        if (nextMatch) {
          filteredAnalysis = filteredAnalysis.substring(0, headerIndex) +
                           filteredAnalysis.substring(nextMatch.index);
        } else {
          filteredAnalysis = filteredAnalysis.substring(0, headerIndex);
        }
        break;
      }
    }

    return filteredAnalysis.trim();
  };

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

  const handleShare = async () => {
    if (navigator.share && analysis) {
      try {
        await navigator.share({
          title: `Ingredient Analysis #${analysis.id.slice(0, 8)}`,
          text: `Risk Level: ${analysis.riskLevel.toUpperCase()}\n\nIngredients: ${analysis.originalText.substring(0, 100)}...`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading analysis details..." />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-error-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Analysis Not Found</h3>
            <p className="text-white/70 mb-8">
              {error || 'The requested analysis could not be found.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                Go Back
              </button>
              <Link
                to="/recent-analysis"
                className="px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                View All Analyses
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Analysis #{analysis.id.slice(0, 8)}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-white/60">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <span>{new Date(analysis.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                title="Share analysis"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Risk Level Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className={`p-6 border-2 ${getRiskBg(analysis.riskLevel)}`}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getRiskBg(analysis.riskLevel)}`}>
                  {React.createElement(getRiskIcon(analysis.riskLevel), {
                    className: `h-6 w-6 ${getRiskColor(analysis.riskLevel)}`
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Risk Level: <span className={getRiskColor(analysis.riskLevel)}>
                      {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}
                    </span>
                  </h3>
                  <p className="text-white/70">
                    Comprehensive ingredient safety analysis completed
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Extracted Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileImage className="h-5 w-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-white/80 whitespace-pre-wrap">
                  {analysis.originalText}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Translation (if available) */}
          {analysis.translatedText && analysis.translatedText !== analysis.originalText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Languages className="h-5 w-5 text-secondary-400" />
                  <h3 className="text-lg font-semibold text-white">English Translation</h3>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/80 whitespace-pre-wrap">
                    {analysis.translatedText}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* AI Analysis (without recommendations) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-accent-400" />
                <h3 className="text-lg font-semibold text-white">AI Safety Analysis</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  className="text-white/80"
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-bold text-white mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-white/80 mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                    li: ({children}) => <li className="text-white/80">{children}</li>,
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {getFilteredAnalysis(analysis.analysis)}
                </ReactMarkdown>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-success-400" />
                <h3 className="text-lg font-semibold text-white">Usage Recommendations</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  className="text-white/80"
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-bold text-white mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-white/80 mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                    li: ({children}) => <li className="text-white/80">{children}</li>,
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {analysis.recommendations}
                </ReactMarkdown>
              </div>
            </GlassCard>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Link
              to="/recent-analysis"
              className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300 text-center"
            >
              Back to All Analyses
            </Link>
            <Link
              to="/analysis"
              className="px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
            >
              Analyze New Product
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;