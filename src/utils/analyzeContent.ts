
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
      reason: 'The content contains language potentially targeting specific groups. Pattern analysis detected hate-related terminology that violates platform community guidelines. Such content can create a harmful environment for users from marginalized communities.',
      action: 'block',
      complianceCheck: 'Content Policy 2.1 - Prohibition of content that promotes discrimination, hatred, or violence against groups based on protected characteristics',
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
      reason: 'The content contains potentially misleading claims that could lead to harm. False information, particularly regarding health, safety, or civic processes can impact public welfare and decision-making. Further investigation is recommended.',
      action: 'warn',
      complianceCheck: 'Fact-Check Protocol 3.4 - Content containing unverified claims requires warning labels and context',
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
      reason: 'The content contains personally targeted negative language that may constitute harassment or bullying. Derogatory terms directed at individuals can cause emotional harm and create an unsafe environment for communication.',
      action: 'block',
      complianceCheck: 'Harassment Prevention Policy 3.2 - Protection against targeted abuse, insults, and intimidation',
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
      reason: 'Explicit content markers detected in text. Content appears to reference or describe material not suitable for all audiences, particularly minors. This violates platform guidelines for appropriate content.',
      action: 'block',
      complianceCheck: 'Content Safety Policy 4.1 - Standards for age-appropriate content and NSFW material',
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
      reason: 'The content contains language patterns consistent with attempts to manipulate, override, or bypass system safeguards. Such techniques pose security risks and may be used to generate harmful content by circumventing built-in protections.',
      action: 'escalate',
      complianceCheck: 'Security Protocol 5.3 - Prevention of instruction manipulation and system compromise',
      confidence: 0.97
    };
  }
  
  // If no harmful content detected
  return {
    category: 'safe',
    severityScore: 0,
    reason: 'Analysis complete. No harmful content patterns were detected in the provided text. The content appears to conform to platform guidelines and safety standards.',
    action: 'allow',
    confidence: 0.93
  };
};

export const getCategoryInfo = (category: HarmCategory) => {
  switch (category) {
    case 'hate_speech':
      return {
        title: 'Hate Speech',
        description: 'Content targeting specific groups based on protected characteristics such as race, religion, gender, or sexual orientation.',
        color: 'harm-hate',
        icon: 'MessageSquareX'
      };
    case 'misinformation':
      return {
        title: 'Misinformation',
        description: 'Factually incorrect claims that could lead to harmful outcomes, such as health misinformation or false civic information.',
        color: 'harm-misinformation',
        icon: 'AlertTriangle'
      };
    case 'cyberbullying':
      return {
        title: 'Cyberbullying',
        description: 'Targeted harassment, threats, or abusive language aimed at intimidating or causing emotional harm to individuals.',
        color: 'harm-cyberbullying',
        icon: 'UserX'
      };
    case 'explicit_content':
      return {
        title: 'Explicit Content',
        description: 'Material not suitable for all audiences, including sexually explicit content, graphic violence, or other age-restricted content.',
        color: 'harm-explicit',
        icon: 'EyeOff'
      };
    case 'prompt_injection':
      return {
        title: 'Prompt Injection',
        description: 'Attempts to manipulate AI systems by bypassing safety measures or inserting instructions to override intended behaviors.',
        color: 'harm-injection',
        icon: 'ShieldAlert'
      };
    case 'safe':
      return {
        title: 'Safe Content',
        description: 'Content that complies with platform policies and appears free from harmful elements.',
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
