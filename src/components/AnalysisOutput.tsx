
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisOutputProps {
  content: string | null;
  isAnalyzing: boolean;
  type?: 'regular' | 'error' | 'success';
}

const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ 
  content, 
  isAnalyzing,
  type = 'regular'
}) => {
  if (isAnalyzing) {
    return (
      <Card className="bg-gray-800/70 border-gray-700/50 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700/50"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="text-gray-300 text-lg font-medium">Analyzing with Gemini AI...</p>
            <p className="text-gray-400 text-sm">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="bg-gray-800/70 border-gray-700/50">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center space-y-2 py-10">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No analysis results yet</p>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Select your content type, enter or upload your content, and click "Analyze Content" to begin
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine if content contains potential warnings or issues
  const hasWarnings = content.toLowerCase().includes('harmful') || 
                      content.toLowerCase().includes('warning') ||
                      content.toLowerCase().includes('inappropriate') ||
                      content.toLowerCase().includes('risk');
                      
  const isError = type === 'error' || content.toLowerCase().includes('error') || 
                  content.toLowerCase().includes('unavailable') ||
                  content.toLowerCase().includes('failed');
                  
  const isSuccess = type === 'success' || 
                    (content.toLowerCase().includes('safe') && !hasWarnings && !isError);

  // Get icon and styles based on content type
  const getIconAndStyles = () => {
    if (isError) {
      return {
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        titleColor: "text-red-400",
        borderColor: "border-red-700/30"
      };
    }
    
    if (isSuccess) {
      return {
        icon: <CheckCircle className="h-6 w-6 text-green-400" />,
        titleColor: "text-green-400",
        borderColor: "border-green-700/30"
      };
    }
    
    if (hasWarnings) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
        titleColor: "text-yellow-400",
        borderColor: "border-yellow-700/30"
      };
    }
    
    return {
      icon: <Info className="h-6 w-6 text-blue-400" />,
      titleColor: "text-blue-400",
      borderColor: "border-blue-700/30"
    };
  };
  
  const { icon, titleColor, borderColor } = getIconAndStyles();

  // Parse content into sections if possible
  const formatContent = () => {
    if (!content) return [];
    
    // Try to split by common section headers
    const sections = content
      .split(/\n(?=Analysis:|Results:|Summary:|Conclusion:|Category:|Severity:|Risk:|Confidence:)/g)
      .filter(section => section.trim().length > 0);
      
    if (sections.length > 1) {
      return sections.map((section, i) => {
        const [title, ...body] = section.split("\n");
        return (
          <div key={i} className={cn(
            "mb-4 pb-4", 
            i < sections.length - 1 && "border-b border-gray-700/30"
          )}>
            <h3 className="font-semibold text-white mb-2">{title.trim()}</h3>
            <div className="text-gray-300 whitespace-pre-line">{body.join("\n")}</div>
          </div>
        );
      });
    }
    
    // If no sections detected, return the raw text
    return <div className="whitespace-pre-line text-gray-200">{content}</div>;
  };

  return (
    <Card className={cn(
      "bg-gray-800/70 border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm", 
      borderColor
    )}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        {icon}
        <div>
          <CardTitle className={cn("text-xl", titleColor)}>
            {isError ? "Analysis Error" : (isSuccess ? "Analysis Complete" : "Content Analysis")}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isError 
              ? "There was an issue analyzing the content" 
              : (isSuccess 
                ? "Content has been successfully analyzed" 
                : "Gemini AI has analyzed your content")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg bg-gray-900/60 p-6 overflow-auto max-h-96 text-gray-200 leading-relaxed prose prose-sm prose-invert max-w-none">
          {formatContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisOutput;
