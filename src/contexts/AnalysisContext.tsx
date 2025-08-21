import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisResult {
  id: string;
  originalText: string;
  translatedText?: string;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string;
  createdAt: string;
  imageUrl?: string;
}

interface AnalysisContextType {
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  isAnalyzing: boolean;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = React.memo(({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addToHistory = (analysis: AnalysisResult) => {
    setAnalysisHistory(prev => [analysis, ...prev]);
  };

  const value = {
    currentAnalysis,
    analysisHistory,
    isAnalyzing,
    setCurrentAnalysis,
    addToHistory,
    setIsAnalyzing
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
});