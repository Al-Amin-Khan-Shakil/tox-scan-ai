import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Eye,
  AlertTriangle
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Camera,
      title: 'Smart Image Recognition',
      description: 'Upload or take photos of ingredient lists. Our advanced OCR technology extracts text from any image with high accuracy.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Analyze ingredients in any language. Our AI automatically translates foreign text to provide comprehensive analysis.'
    },
    {
      icon: Shield,
      title: 'Harmful Substance Detection',
      description: 'Identify carcinogens, neurotoxins, hormone disruptors, and other potentially harmful substances in your products.'
    },
    {
      icon: Eye,
      title: 'Detailed Analysis',
      description: 'Get comprehensive explanations of why ingredients are dangerous, with scientific sources and recommendations.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Powered by Google AI for lightning-fast analysis and recommendations tailored to your safety needs.'
    },
    {
      icon: CheckCircle,
      title: 'Usage Guidelines',
      description: 'Receive personalized recommendations on how to safely use products, including warnings for specific groups.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Products Analyzed' },
    { number: '10K+', label: 'Users Protected' },
    { number: '99.9%', label: 'Accuracy Rate' },
    { number: '30+', label: 'Languages Supported' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-secondary-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex justify-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/20 border border-primary-500/30">
                  <Sparkles className="h-4 w-4 text-primary-400 mr-2" />
                  <span className="text-primary-300 text-sm font-medium">AI-Powered Ingredient Analysis</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Protect Your Health with
                <span className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  AI-Powered Analysis
                </span>
              </h1>
              
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-white/70 leading-relaxed">
                Upload ingredient lists from food, cosmetics, or household products. 
                Our AI instantly identifies harmful substances and provides safety recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link
                  to={isAuthenticated ? "/analysis" : "/register"}
                  className="group px-8 py-4 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Start Analyzing Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                
                <Link
                  to="#features"
                  className="px-8 py-4 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <GlassCard className="p-6">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/70 font-medium">
                    {stat.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Powerful Features for
                <span className="block text-primary-400">Your Safety</span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-white/70">
                Advanced AI technology combined with comprehensive safety databases 
                to protect you and your family from harmful ingredients.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-primary rounded-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-primary rounded-full">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Don't Risk Your Health
                </h2>
                
                <p className="text-xl text-white/70 mb-8 leading-relaxed">
                  Join thousands of users who trust our AI to keep them safe. 
                  Start analyzing your products today and make informed decisions about what you use.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={isAuthenticated ? "/analysis" : "/register"}
                    className="group px-8 py-4 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;