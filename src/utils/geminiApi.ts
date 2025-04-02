
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const analyzeWithGemini = async (
  content: string,
  contentType: 'text' | 'image' | 'video' | 'audio'
): Promise<string> => {
  try {
    console.info(`Starting analysis with Gemini for ${contentType} content...`);
    
    // Use supabase.functions.invoke to ensure proper authentication
    const { data: apiKeyData, error: apiKeyError } = await supabase.functions.invoke('get-gemini-key');
    
    if (apiKeyError) {
      console.error('Failed to retrieve API key:', apiKeyError);
      throw new Error(`Failed to retrieve API key: ${apiKeyError.message}`);
    }
    
    if (!apiKeyData?.key) {
      console.error('API key missing from response:', apiKeyData);
      throw new Error('API key missing from response');
    }
    
    const apiKey = apiKeyData.key;
    
    // Construct a more structured prompt for concise, professional output
    let prompt = `Analyze the following content for potentially harmful elements and provide a structured, professional assessment.

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

Content Analysis: "[content preview]"
[1-2 sentence summary of what's being analyzed]

Overall Assessment
[1-3 sentences giving the primary conclusion about whether this content is harmful or safe]

Safety Analysis
[If harmful, provide ONLY the categories detected as harmful with these details:
- Category: [Name]
- Confidence: [percentage]
- Severity: [Low/Medium/High] ([score]/10)
- Key Elements: [Very brief description of what triggered this category]
- Recommended Action: [Allow/Warn/Block]

If safe, provide a single concise paragraph explaining why it's considered safe]

BE EXTREMELY CONCISE. Focus on brevity and professional analysis. Avoid repetition.
`;
    
    if (contentType === 'text') {
      prompt += `CONTENT FOR ANALYSIS (TEXT):\n"""${content}"""\n\nProvide a professional analysis with specific elements that triggered each rating.`;
    } else if (contentType === 'image') {
      prompt += `CONTENT FOR ANALYSIS (IMAGE):\n[Image data not included in prompt]\n\nProvide a professional analysis of the image focusing on visual elements, subjects, and context.`;
    } else if (contentType === 'video') {
      prompt += `CONTENT FOR ANALYSIS (VIDEO URL): ${content}\n\nProvide a professional analysis of the video content, analyzing both visual and audio elements.`;
    } else if (contentType === 'audio') {
      prompt += `CONTENT FOR ANALYSIS (AUDIO URL): ${content}\n\nProvide a professional analysis of the audio content, focusing on speech, tone, and context.`;
    }
    
    console.info('Sending request to Gemini API with structured prompt...');
    
    // Use Gemini 2.0 Flash model for better analysis
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more precise and consistent output format
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800, // Reduced for more concise output
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      const statusCode = response.status;
      console.error(`Gemini API error (${statusCode}):`, errorData);
      
      // More specific error handling
      if (statusCode === 404) {
        throw new Error('API endpoint not found. The API version or model may have changed.');
      } else if (statusCode === 401 || statusCode === 403) {
        throw new Error('Authentication failed. Please verify API key permissions.');
      } else if (statusCode === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API error (${statusCode}): ${errorData.substring(0, 100)}`);
      }
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error('Invalid response from Gemini API:', data);
      throw new Error('Invalid response format from API');
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    
    // Post-process the response for better formatting and consistency 
    const processedContent = textContent
      .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines
      .replace(/\#\# (\w+)/g, '## $1') // Standardize heading level
      .trim();
      
    return processedContent;
    
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    
    let errorMessage = 'Analysis failed';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    
    toast({
      title: "Analysis Error",
      description: errorMessage,
      variant: "destructive"
    });
    
    // Return a structured fallback message using the same format
    return `Content Analysis: "Error"

Overall Assessment
The system encountered a technical error while analyzing the content.

Safety Analysis
- Category: Technical Error
- Confidence: 100%
- Severity: Medium (5/10)
- Key Elements: API communication failure - ${error instanceof Error ? error.message : "Unknown error"}
- Recommended Action: Try again or use built-in analyzer

Please try again in a few moments or disable "Use Gemini AI" to use the built-in analyzer.`;
  }
};
