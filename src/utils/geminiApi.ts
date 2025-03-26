
import { toast } from "@/hooks/use-toast";

// Types for Gemini API
export interface GeminiRequestBody {
  contents: {
    parts: {
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }[];
    role: "user";
  }[];
  generationConfig: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
    index: number;
  }[];
}

export const analyzeWithGemini = async (content: string, contentType: 'text' | 'image' | 'video' | 'audio'): Promise<string> => {
  try {
    // Get the API key from Supabase Edge Function
    // Use the correct URL for the edge function
    const response = await fetch('https://hardtowtofuuzejggihn.supabase.co/functions/v1/get-gemini-key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API key retrieval failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.key) {
      toast({
        title: "API Key Missing",
        description: "Please check if Gemini API key is configured in Supabase secrets.",
        variant: "destructive",
      });
      return "API key is required to analyze content.";
    }
    
    const apiKey = data.key;

    // Prepare request body based on content type
    let requestBody: GeminiRequestBody;
    
    if (contentType === 'text') {
      requestBody = createTextAnalysisRequest(content);
    } else if (contentType === 'image' && isBase64Image(content)) {
      requestBody = createImageAnalysisRequest(content);
    } else if (contentType === 'video' || contentType === 'audio' || isURL(content)) {
      requestBody = createLinkAnalysisRequest(content, contentType);
    } else {
      // Default to text analysis
      requestBody = createTextAnalysisRequest(content);
    }

    console.log("Sending request to Gemini API...");
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-exp-03-25:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(errorData.error?.message || `Failed to analyze content: ${geminiResponse.status} ${geminiResponse.statusText}`);
    }

    const responseData: GeminiResponse = await geminiResponse.json();
    return responseData.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error analyzing content with Gemini:", error);
    toast({
      title: "Analysis Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return "Failed to analyze content. Please try again later.";
  }
};

const createTextAnalysisRequest = (text: string): GeminiRequestBody => {
  return {
    contents: [
      {
        parts: [
          {
            text: `Analyze the following text for potential harmful content like hate speech, misinformation, cyberbullying, explicit content, or prompt injection. 
            
            Return a detailed structured analysis with the following format:
            
            ## Content Analysis Report
            
            ### Category: [The primary harmful category detected, or "SAFE" if none]
            ### Severity: [Score from 1-10]
            ### Confidence: [Percentage from 0-100%]
            
            ### Detailed Analysis:
            [Provide a detailed explanation of why the content was flagged, including specific phrases or elements that triggered the detection. If safe, explain why it appears harmless.]
            
            ### Recommendations:
            [Suggest actions like block, flag, warn, or allow, and provide reasoning]
            
            ### Additional Notes:
            [Any other observations about the content that might be relevant]
            
            TEXT TO ANALYZE: ${text}`
          }
        ],
        role: "user"
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048
    }
  };
};

const createImageAnalysisRequest = (imageBase64: string): GeminiRequestBody => {
  // Extract just the base64 data without the prefix
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  
  return {
    contents: [
      {
        parts: [
          {
            text: "Analyze this image for potentially harmful, explicit, or inappropriate content. Detect any hate speech, violent imagery, adult content, misleading information, or unsafe material. Provide a detailed analysis including category, severity rating (1-10), confidence level, and specific elements causing concern. If the image appears safe, explain why."
          },
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG format, adjust as needed
              data: base64Data
            }
          }
        ],
        role: "user"
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048
    }
  };
};

const createLinkAnalysisRequest = (url: string, contentType: 'image' | 'video' | 'audio' | 'text'): GeminiRequestBody => {
  let analysisPrompt = "";
  
  switch(contentType) {
    case 'video':
      analysisPrompt = `Analyze the following video URL for potentially harmful content:
      
      URL: ${url}
      
      Without being able to directly access the video, please analyze the URL and any available metadata to determine if this could potentially link to harmful, explicit, or inappropriate content. Consider the domain reputation, URL patterns associated with harmful content, and any visible URL components.
      
      Provide a detailed structured analysis following this format:
      
      ## URL Analysis Report
      
      ### Initial Assessment: [Potentially Harmful/Appears Safe/Requires Human Review]
      ### Confidence: [Low/Medium/High]
      
      ### URL Reputation Analysis:
      [Analyze the domain and path components for signs of suspicious patterns]
      
      ### Potential Concerns:
      [List any red flags or concerning elements about this URL]
      
      ### Recommendations:
      [Suggest appropriate actions like block, allow with warning, or allow]
      
      ### Additional Notes:
      [Any other observations that might be relevant]`;
      break;
    
    case 'audio':
      analysisPrompt = `Analyze the following audio content URL for potentially harmful content:
      
      URL: ${url}
      
      Without being able to directly access the audio, please analyze the URL and any available metadata to determine if this could potentially link to harmful, explicit, or inappropriate content. Consider the domain reputation, URL patterns associated with harmful content, and any visible URL components.
      
      Provide a detailed structured analysis following the format specified above.`;
      break;
    
    case 'image':
      analysisPrompt = `Analyze the following image URL for potentially harmful content:
      
      URL: ${url}
      
      Without being able to directly access the image, please analyze the URL and any available metadata to determine if this could potentially link to harmful, explicit, or inappropriate visual content. Consider the domain reputation, URL patterns associated with harmful content, and any visible URL components.
      
      Provide a detailed structured analysis following the format specified above.`;
      break;
      
    default:
      analysisPrompt = `Analyze the following URL for potentially harmful content:
      
      URL: ${url}
      
      Without being able to directly access the content, please analyze the URL and any available metadata to determine if this could potentially link to harmful, explicit, or inappropriate content. Consider the domain reputation, URL patterns associated with harmful content, and any visible URL components.
      
      Provide a detailed structured analysis following the format specified above.`;
  }
  
  return {
    contents: [
      {
        parts: [
          {
            text: analysisPrompt
          }
        ],
        role: "user"
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048
    }
  };
};

// Helper functions
const isBase64Image = (str: string): boolean => {
  return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(str) || 
         /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(str);
};

const isURL = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};
