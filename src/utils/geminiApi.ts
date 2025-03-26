
import { toast } from "@/hooks/use-toast";

// Types for Gemini API
export interface GeminiRequestBody {
  contents: {
    parts: {
      text: string;
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

export const analyzeWithGemini = async (text: string): Promise<string> => {
  try {
    // Store the API key in session storage for client-side use
    const apiKey = sessionStorage.getItem("gemini_api_key");
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please enter your Gemini API key in the settings.",
        variant: "destructive",
      });
      return "API key is required to analyze content.";
    }

    const requestBody: GeminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the following text for potential harmful content like hate speech, misinformation, cyberbullying, explicit content, or prompt injection. Return a detailed structured analysis with category, severity, confidence, and explanation.\n\nTEXT TO ANALYZE: ${text}`
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze content");
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
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
