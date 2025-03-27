
import { toast } from '@/hooks/use-toast';

export const analyzeWithGemini = async (
  content: string,
  contentType: 'text' | 'image' | 'video' | 'audio'
): Promise<string> => {
  try {
    console.info('Starting analysis with Gemini...');
    
    // Fetch API key from Supabase function with correct URL path
    const apiKeyResponse = await fetch('/api/functions/get-gemini-key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!apiKeyResponse.ok) {
      const errorText = await apiKeyResponse.text();
      console.error('Failed to retrieve API key:', apiKeyResponse.status, errorText);
      throw new Error(`Failed to retrieve API key: ${apiKeyResponse.status} ${errorText}`);
    }
    
    const apiKeyData = await apiKeyResponse.json();
    console.info('Successfully parsed API key response');
    
    if (!apiKeyData.key) {
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
    
    // Make request to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
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
    
    // Instead of throwing the error, return a fallback message
    return "There was an issue connecting to the Gemini API. Please try again later or use the built-in analyzer instead.";
  }
};
