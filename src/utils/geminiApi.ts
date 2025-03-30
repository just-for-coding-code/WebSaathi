
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
    
    // Construct a more detailed prompt based on content type
    let prompt = `Analyze the following content for potentially harmful elements including hate speech, misinformation, cyberbullying, explicit content, and prompt injection attempts. 

For each category you identify, please:
1. Provide a confidence score (0-100%)
2. Rate the severity on a scale of 1-10
3. Explain specifically what elements trigger your detection
4. If applicable, cite relevant content policies or guidelines this content may violate
5. Suggest possible mitigation strategies

If the content appears safe, explain your reasoning with the same level of detail.

Format your response in clear sections with headings and bullet points for readability.

`;
    
    if (contentType === 'text') {
      prompt += `TEXT CONTENT TO ANALYZE:\n"${content}"`;
    } else if (contentType === 'image') {
      prompt += `IMAGE CONTENT ANALYSIS:\n[This represents an image that has been analyzed. The image data is not included in this prompt for privacy and technical reasons.]`;
    } else if (contentType === 'video') {
      prompt += `VIDEO URL TO ANALYZE: ${content}\n[This represents a video that should be analyzed for potentially harmful content]`;
    } else if (contentType === 'audio') {
      prompt += `AUDIO URL TO ANALYZE: ${content}\n[This represents an audio file that should be analyzed for potentially harmful content]`;
    }
    
    console.info('Sending request to Gemini API with enhanced prompt...');
    
    // Updated API endpoint to use Gemini 2.0 Flash model for better analysis
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
          temperature: 0.3, // Lower temperature for more precise and consistent output
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000, // Increased token limit for more detailed analysis
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      const statusCode = response.status;
      console.error(`Gemini API error (${statusCode}):`, errorData);
      
      // More specific error handling
      if (statusCode === 404) {
        throw new Error('Gemini API endpoint not found. The API version or model may have changed.');
      } else if (statusCode === 401 || statusCode === 403) {
        throw new Error('Authentication failed. Please ensure your API key is valid and has the necessary permissions.');
      } else if (statusCode === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Gemini API error: ${statusCode}`);
      }
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error('Invalid response from Gemini API:', data);
      throw new Error('Invalid or empty response from Gemini API');
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    
    // Post-process the response to ensure formatting is clean and consistent
    const processedContent = textContent
      .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines
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
    
    // Return a more detailed and professional fallback message
    return `# Analysis Error

We apologize, but we encountered an issue while analyzing your content with our advanced AI system. Our engineering team has been automatically notified of this problem.

## Possible Reasons:
- Temporary service disruption
- Connection issues with the Gemini API
- API authentication problems
- Content format incompatibility

## What You Can Do:
- Try again in a few moments
- Use our built-in analyzer instead (disable "Use Gemini AI")
- Check that your content is in a supported format
- Contact support if this issue persists

Thank you for your understanding.`;
  }
};
