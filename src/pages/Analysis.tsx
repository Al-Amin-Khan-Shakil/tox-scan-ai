import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Camera, 
  Upload, 
  FileImage, 
  Loader, 
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Eye,
  Languages,
  Shield,
  Crop
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageCapture from '../components/ImageCapture';
import ImageCropper from '../components/ImageCropper';
import { useAnalysis } from '../contexts/AnalysisContext';
import { analysisService } from '../services/api';

const Analysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
  
  const { 
    currentAnalysis, 
    setCurrentAnalysis, 
    isAnalyzing, 
    setIsAnalyzing,
    addToHistory 
  } = useAnalysis();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setUploadMethod('upload');
      setShowCropper(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDropRejected: () => {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
    }
  });

  const handleCameraCapture = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setUploadMethod('camera');
    setShowCamera(false);
    setShowCropper(true);
  }, []);

  const handleCropComplete = useCallback((croppedFile: File) => {
    setSelectedFile(croppedFile);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  }, [previewUrl]);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const result = await analysisService.uploadAndAnalyze(formData);
      
      setCurrentAnalysis(result);
      addToHistory(result);
      
      // Clean up preview
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setUploadMethod(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadMethod(null);
    setError(null);
  }, [previewUrl]);

  // Function to filter out recommendations section from analysis
  const getFilteredAnalysis = (analysis: string) => {
    // Split the analysis by common recommendation section headers
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

    let filteredAnalysis = analysis;

    // Find and remove the recommendations section
    for (const header of recommendationHeaders) {
      const headerIndex = filteredAnalysis.indexOf(header);
      if (headerIndex !== -1) {
        // Find the next major section or end of text
        const nextSectionRegex = /\n#{1,3}\s/g;
        nextSectionRegex.lastIndex = headerIndex + header.length;
        const nextMatch = nextSectionRegex.exec(filteredAnalysis);
        
        if (nextMatch) {
          // Remove from header to next section
          filteredAnalysis = filteredAnalysis.substring(0, headerIndex) + 
                           filteredAnalysis.substring(nextMatch.index);
        } else {
          // Remove from header to end of text
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

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI Ingredient Analysis
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Upload an image or take a photo of ingredient lists to detect harmful substances and get safety recommendations
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-8">
            {!selectedFile ? (
              <>
                {/* Upload Methods */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* File Upload */}
                  <div {...getRootProps()} className={`
                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
                    ${isDragActive 
                      ? 'border-primary-400 bg-primary-600/10' 
                      : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                    }
                  `}>
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-gradient-primary rounded-full">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Upload Image
                        </h3>
                        <p className="text-white/70 mb-2">
                          Drag and drop or click to browse
                        </p>
                        <p className="text-white/50 text-sm">
                          JPEG, PNG, GIF, WebP
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Camera Capture */}
                  <div 
                    onClick={() => setShowCamera(true)}
                    className="border-2 border-dashed border-white/30 hover:border-white/50 hover:bg-white/5 rounded-xl p-6 text-center cursor-pointer transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-secondary-600/20 rounded-full">
                          <Camera className="h-8 w-8 text-secondary-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Take Photo
                        </h3>
                        <p className="text-white/70 mb-2">
                          Use your device camera
                        </p>
                        <p className="text-white/50 text-sm">
                          Best for mobile devices
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Preview and Actions */}
                <div className="space-y-6">
                  <div className="text-center">
                    <img 
                      src={previewUrl!} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-white font-medium mt-4">
                      {selectedFile?.name || 'Captured Image'}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <Crop className="h-4 w-4 text-primary-400" />
                      <span className="text-primary-400 text-sm">Image cropped and ready</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowCropper(true)}
                      className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Crop className="h-5 w-5" />
                      <span>Crop Again</span>
                    </button>
                    <button
                      onClick={resetUpload}
                      className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
                    >
                      Choose Different Image
                    </button>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-8 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-5 w-5" />
                          <span>Analyze Ingredients</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 p-4 bg-error-600/20 border border-error-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-error-300" />
                  <p className="text-error-300">{error}</p>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Analysis Results */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8">
              <LoadingSpinner text="Analyzing ingredients with AI..." />
              <div className="mt-6 space-y-2 text-center">
                <p className="text-white/70 text-sm">✓ Extracting text from image</p>
                <p className="text-white/70 text-sm">✓ Detecting language and translating</p>
                <p className="text-white/70 text-sm">⏳ Analyzing ingredients for safety</p>
                <p className="text-white/70 text-sm">⏳ Generating recommendations</p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {currentAnalysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Risk Level Summary */}
            <GlassCard className={`p-6 border-2 ${getRiskBg(currentAnalysis.riskLevel)}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getRiskBg(currentAnalysis.riskLevel)}`}>
                  {React.createElement(getRiskIcon(currentAnalysis.riskLevel), {
                    className: `h-6 w-6 ${getRiskColor(currentAnalysis.riskLevel)}`
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Risk Level: <span className={getRiskColor(currentAnalysis.riskLevel)}>
                      {currentAnalysis.riskLevel.charAt(0).toUpperCase() + currentAnalysis.riskLevel.slice(1)}
                    </span>
                  </h3>
                  <p className="text-white/70">
                    Analysis completed on {new Date(currentAnalysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Extracted Text */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileImage className="h-5 w-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-white/80 whitespace-pre-wrap">
                  {currentAnalysis.originalText}
                </p>
              </div>
            </GlassCard>

            {/* Translation (if available) */}
            {currentAnalysis.translatedText && currentAnalysis.translatedText !== currentAnalysis.originalText && (
              <GlassCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Languages className="h-5 w-5 text-secondary-400" />
                  <h3 className="text-lg font-semibold text-white">English Translation</h3>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/80 whitespace-pre-wrap">
                    {currentAnalysis.translatedText}
                  </p>
                </div>
              </GlassCard>
            )}

            {/* AI Analysis (without recommendations) */}
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
                  {getFilteredAnalysis(currentAnalysis.analysis)}
                </ReactMarkdown>
              </div>
            </GlassCard>

            {/* Recommendations */}
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
                  {currentAnalysis.recommendations}
                </ReactMarkdown>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentAnalysis(null);
                  setSelectedFile(null);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                  setUploadMethod(null);
                }}
                className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                Analyze Another Product
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <ImageCapture
          onCapture={handleCameraCapture}
          onCancel={() => setShowCamera(false)}
        />
      )}

      {/* Cropper Modal */}
      {showCropper && previewUrl && (
        <ImageCropper
          imageUrl={previewUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default Analysis;