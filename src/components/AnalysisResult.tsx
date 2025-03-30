
import React from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, AlertOctagon, Info, FileBarChart,
  AlertCircle, BarChart4, ExternalLink
} from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '../utils/analyzeContent';
import AnimatedTransition from './AnimatedTransition';
import CardSpotlight from './CardSpotlight';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  isAnalyzing: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  result, 
  isAnalyzing 
}) => {
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl bg-gray-800/60 shadow-glass p-4 sm:p-6 backdrop-blur-sm border border-gray-700/30 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center justify-center h-32 sm:h-40 gap-3">
          <div className="relative">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary/40 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-primary animate-ping" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-medium text-gray-300/60 text-center sm:text-left">
            Analyzing content...
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const getStatusIcon = () => {
    switch (result.action) {
      case 'block':
        return <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-harm-hate" aria-hidden="true" />;
      case 'warn':
        return <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-harm-misinformation" aria-hidden="true" />;
      case 'escalate':
        return <AlertOctagon className="h-6 w-6 sm:h-8 sm:w-8 text-harm-injection" aria-hidden="true" />;
      case 'allow':
        return <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-harm-safe" aria-hidden="true" />;
      default:
        return <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />;
    }
  };

  const getBgColor = () => {
    switch (result.category) {
      case 'hate_speech':
        return 'bg-gradient-to-br from-gray-800 to-harm-hate/10';
      case 'misinformation':
        return 'bg-gradient-to-br from-gray-800 to-harm-misinformation/10';
      case 'cyberbullying':
        return 'bg-gradient-to-br from-gray-800 to-harm-cyberbullying/10';
      case 'explicit_content':
        return 'bg-gradient-to-br from-gray-800 to-harm-explicit/10';
      case 'prompt_injection':
        return 'bg-gradient-to-br from-gray-800 to-harm-injection/10';
      case 'safe':
        return 'bg-gradient-to-br from-gray-800 to-harm-safe/10';
      default:
        return 'bg-gray-800';
    }
  };

  const getCategoryColor = () => {
    switch (result.category) {
      case 'hate_speech': return 'text-harm-hate';
      case 'misinformation': return 'text-harm-misinformation';
      case 'cyberbullying': return 'text-harm-cyberbullying';
      case 'explicit_content': return 'text-harm-explicit';
      case 'prompt_injection': return 'text-harm-injection';
      case 'safe': return 'text-harm-safe';
      default: return 'text-white';
    }
  };

  const getCategoryName = () => {
    switch (result.category) {
      case 'hate_speech': return 'Hate Speech';
      case 'misinformation': return 'Misinformation';
      case 'cyberbullying': return 'Cyberbullying';
      case 'explicit_content': return 'Explicit Content';
      case 'prompt_injection': return 'Prompt Injection';
      case 'safe': return 'Safe Content';
      default: return 'Unknown';
    }
  };

  const getActionText = () => {
    switch (result.action) {
      case 'block': return 'Content Blocked';
      case 'warn': return 'Warning Issued';
      case 'escalate': return 'Escalated for Review';
      case 'allow': return 'Content Approved';
      default: return 'Unknown Action';
    }
  };

  return (
    <AnimatedTransition show={!!result} type="scale" className="overflow-hidden">
      <CardSpotlight
        borderGlow
        spotlightColor={
          result.category === 'safe' 
            ? 'rgba(39, 174, 96, 0.15)' 
            : 'rgba(229, 57, 53, 0.15)'
        }
        className={cn(
          "rounded-2xl shadow-glass p-4 sm:p-6 backdrop-blur-sm border border-gray-700/30",
          getBgColor()
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center justify-center p-2 rounded-full bg-gray-800/50">
            {getStatusIcon()}
          </div>
          <div className="sm:ml-3">
            <h3 className="text-base sm:text-lg font-medium text-white">
              {getActionText()}
            </h3>
            <div className="flex flex-wrap items-center mt-1 gap-1">
              <span className={cn("text-xs sm:text-sm font-medium", getCategoryColor())}>
                {getCategoryName()}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                • Severity: {result.severityScore}/10
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-700/50">
            <h4 className="text-xs sm:text-sm font-medium text-white flex items-center">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary/70" />
              Analysis Summary
            </h4>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">{result.reason}</p>
          </div>

          {result.complianceCheck && (
            <div className="p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-700/50">
              <h4 className="text-xs sm:text-sm font-medium text-white flex items-center">
                <FileBarChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary/70" />
                Compliance Reference
              </h4>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">{result.complianceCheck}</p>
            </div>
          )}

          <div aria-label="Detection confidence meter">
            <h4 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2 flex items-center">
              <BarChart4 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary/70" />
              Detection Confidence
            </h4>
            <div className="relative w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "absolute left-0 top-0 h-full rounded-full",
                  result.category === 'safe' ? 'bg-harm-safe' : `bg-${getCategoryColor().split('-')[1]}`
                )}
                style={{ width: `${result.confidence * 100}%` }}
                role="progressbar" 
                aria-valuenow={Math.round(result.confidence * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="mt-1.5 sm:mt-2 flex justify-between text-2xs sm:text-xs text-gray-400">
              <span>Low confidence</span>
              <span aria-live="polite">{Math.round(result.confidence * 100)}%</span>
              <span>High confidence</span>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 border-t border-gray-700/30 pt-3 sm:pt-4 flex items-start">
            <Info className="h-3.5 w-3.5 mt-0.5 mr-1.5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            <p className="italic">
              This analysis was performed using our advanced content safety AI. Results should be reviewed by a human for final determination.
            </p>
          </div>
        </div>
      </CardSpotlight>
    </AnimatedTransition>
  );
};

export default AnalysisResult;
