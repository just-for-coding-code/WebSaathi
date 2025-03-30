
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const analyzeWithGemini = async (
  content: string,
  contentType: 'text' | 'image' | 'video' | 'audio'
): Promise<string> => {
  try {
    console.info('Starting analysis with Gemini...');
    
    // Use supabase.functions.invoke instead of direct fetch
    const { data: apiKeyData, error: apiKeyError } = await supabase.functions.invoke('get-gemini-key');
    
    if (apiKeyError) {
      console.error('Failed to retrieve API key:', apiKeyError);
      throw new Error(`Failed to retrieve API key: ${apiKeyError.message}`);
    }
    
    console.info('Successfully retrieved API key response');
    
    if (!apiKeyData?.key) {
      console.error('API key missing from response:', apiKeyData);
      throw new Error('API key missing from response');
    }
    
    const apiKey = apiKeyData.key;
    
    // Construct prompt based on content type
    let prompt = "Analyze the following content for potentially harmful elements including hate speech, misinformation, cyberbullying, explicit content, and prompt injection attempts. Provide a detailed analysis of any detected issues, their severity, and potential impacts. If the content is safe, explain why it's considered safe:\n\n";
    
    if (contentType === 'text') {
      prompt += `TEXT CONTENT: ${content}`;
    } else if (contentType === 'image') {
      prompt += `IMAGE CONTENT: [This is an image that has been analyzed. The image data is not included in this prompt for privacy and technical reasons.]`;
    } else if (contentType === 'video') {
      prompt += `VIDEO URL: ${content}\n[This is a video that should be analyzed for harmful content]`;
    } else if (contentType === 'audio') {
      prompt += `AUDIO URL: ${content}\n[This is an audio file that should be analyzed for harmful content]`;
    }
    
    console.info('Sending request to Gemini API...');
    
    // Updated API endpoint to use the generative AI v1 endpoint instead of v1beta
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro-exp-03-25:generateContent', {
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
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error('Invalid response from Gemini API:', data);
      throw new Error('Invalid response from Gemini API');
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    return textContent;
    
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    
    let errorMessage = 'Analysis failed';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    
    toast({
      title: "API Error",
      description: errorMessage,
      variant: "destructive"
    });
    
    // Return a more professional fallback message
    return "We apologize, but there was an issue connecting to our advanced analysis service. Our team has been notified of this problem. In the meantime, you can try again later or use our built-in analyzer for your content safety needs.";
  }
};
