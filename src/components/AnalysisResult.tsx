
import React from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, AlertOctagon 
} from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '../utils/analyzeContent';
import AnimatedTransition from './AnimatedTransition';

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
      <div className="rounded-2xl bg-gray-800/60 shadow-glass p-6 backdrop-blur-sm border border-gray-700/30 animate-pulse">
        <div className="flex items-center justify-center h-40">
          <div className="relative">
            <Shield className="h-12 w-12 text-primary/40 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary animate-ping" />
            </div>
          </div>
          <div className="ml-4 text-xl font-medium text-gray-300/60">
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
        return <XCircle className="h-8 w-8 text-harm-hate" />;
      case 'warn':
        return <AlertTriangle className="h-8 w-8 text-harm-misinformation" />;
      case 'escalate':
        return <AlertOctagon className="h-8 w-8 text-harm-injection" />;
      case 'allow':
        return <CheckCircle className="h-8 w-8 text-harm-safe" />;
      default:
        return <Shield className="h-8 w-8 text-primary" />;
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
      case 'escalate': return 'Escalated to Review';
      case 'allow': return 'Content Allowed';
      default: return 'Unknown Action';
    }
  };

  return (
    <AnimatedTransition show={!!result} type="scale" className="overflow-hidden">
      <div className={`rounded-2xl shadow-glass p-6 backdrop-blur-sm border border-gray-700/30 ${getBgColor()}`}>
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-medium text-white">
              {getActionText()}
            </h3>
            <div className="flex items-center mt-1 space-x-1">
              <span className={`text-sm font-medium ${getCategoryColor()}`}>
                {getCategoryName()}
              </span>
              <span className="text-sm text-gray-400">
                • Severity: {result.severityScore}/10
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white">Reason</h4>
            <p className="mt-1 text-sm text-gray-400">{result.reason}</p>
          </div>

          {result.complianceCheck && (
            <div>
              <h4 className="text-sm font-medium text-white">Compliance Reference</h4>
              <p className="mt-1 text-sm text-gray-400">{result.complianceCheck}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-white">Confidence</h4>
            <div className="mt-2 relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full rounded-full ${
                  result.category === 'safe' ? 'bg-harm-safe' : `bg-${getCategoryColor().split('-')[1]}`
                }`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-right text-gray-400">
              {Math.round(result.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default AnalysisResult;
