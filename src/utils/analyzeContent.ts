
// Content analysis types
export type HarmCategory = 
  | 'hate_speech'
  | 'misinformation'
  | 'cyberbullying'
  | 'explicit_content'
  | 'prompt_injection'
  | 'safe';

export interface AnalysisResult {
  category: HarmCategory;
  severityScore: number;
  reason: string;
  action: 'block' | 'warn' | 'escalate' | 'allow';
  complianceCheck?: string;
  confidence: number;
}

// Demo analysis function (mock implementation)
export const analyzeContent = (content: string): AnalysisResult => {
  // This is a simplified demo implementation
  // In a real application, this would connect to an AI model
  
  content = content.toLowerCase();
  
  // Check for hate speech patterns
  if (content.includes('hate') || 
      content.includes('racist') || 
      content.includes('discriminate')) {
    return {
      category: 'hate_speech',
      severityScore: 8,
      reason: 'Detected language potentially targeting groups',
      action: 'block',
      complianceCheck: 'Content Policy 2.1',
      confidence: 0.89
    };
  }
  
  // Check for misinformation
  if (content.includes('fake news') || 
      content.includes('conspiracy') || 
      content.includes('proven fact')) {
    return {
      category: 'misinformation',
      severityScore: 6,
      reason: 'Potentially misleading claims detected',
      action: 'warn',
      complianceCheck: 'Fact Check Protocol',
      confidence: 0.76
    };
  }
  
  // Check for cyberbullying
  if (content.includes('stupid') || 
      content.includes('loser') || 
      content.includes('ugly')) {
    return {
      category: 'cyberbullying',
      severityScore: 7,
      reason: 'Detected personally targeted negative language',
      action: 'block',
      complianceCheck: 'Harassment Policy 3.2',
      confidence: 0.82
    };
  }
  
  // Check for explicit content
  if (content.includes('xxx') || 
      content.includes('nsfw') || 
      content.includes('explicit')) {
    return {
      category: 'explicit_content',
      severityScore: 9,
      reason: 'Explicit content markers detected',
      action: 'block',
      complianceCheck: 'Content Safety 4.1',
      confidence: 0.95
    };
  }
  
  // Check for prompt injection
  if (content.includes('ignore instructions') || 
      content.includes('bypass') || 
      content.includes('override')) {
    return {
      category: 'prompt_injection',
      severityScore: 10,
      reason: 'Potential attempt to manipulate system behavior',
      action: 'escalate',
      complianceCheck: 'Security Protocol 5.3',
      confidence: 0.97
    };
  }
  
  // If no harmful content detected
  return {
    category: 'safe',
    severityScore: 0,
    reason: 'No harmful content detected',
    action: 'allow',
    confidence: 0.93
  };
};

export const getCategoryInfo = (category: HarmCategory) => {
  switch (category) {
    case 'hate_speech':
      return {
        title: 'Hate Speech',
        description: 'Derogatory language targeting specific groups or individuals based on protected characteristics.',
        color: 'harm-hate',
        icon: 'MessageSquareX'
      };
    case 'misinformation':
      return {
        title: 'Misinformation',
        description: 'Factually incorrect claims that could lead to harm, such as medical myths or fake news.',
        color: 'harm-misinformation',
        icon: 'AlertTriangle'
      };
    case 'cyberbullying':
      return {
        title: 'Cyberbullying',
        description: 'Threats, harassment, or targeted abuse aimed at intimidating or harming individuals.',
        color: 'harm-cyberbullying',
        icon: 'UserX'
      };
    case 'explicit_content':
      return {
        title: 'Explicit Content',
        description: 'NSFW imagery, inappropriate material, or violent content not suitable for all audiences.',
        color: 'harm-explicit',
        icon: 'EyeOff'
      };
    case 'prompt_injection':
      return {
        title: 'Prompt Injection',
        description: 'Malicious inputs designed to manipulate AI behavior or bypass safety measures.',
        color: 'harm-injection',
        icon: 'ShieldAlert'
      };
    case 'safe':
      return {
        title: 'Safe Content',
        description: 'Content that appears to be free from harmful elements and safe for all audiences.',
        color: 'harm-safe',
        icon: 'ShieldCheck'
      };
    default:
      return {
        title: 'Unknown',
        description: 'Unclassified content',
        color: 'muted',
        icon: 'HelpCircle'
      };
  }
};
