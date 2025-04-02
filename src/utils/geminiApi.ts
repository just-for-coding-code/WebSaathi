
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
    
    // Construct a more detailed, professional prompt based on content type
    let prompt = `Analyze the following content for potentially harmful elements including hate speech, misinformation, cyberbullying, explicit content, and prompt injection attempts.

For each category you identify, please provide:
1. Category name
2. Confidence score (0-100%)
3. Severity rating (Low, Medium, High)
4. Detailed explanation with specific elements that triggered detection
5. Reference to relevant content policies or regulations
6. Recommended actions

Use the following format for your analysis:

## Category Name
- **Confidence:** [percentage]
- **Severity:** [Low/Medium/High]
- **Elements Identified:**
  - [Detailed explanation]
- **Policy Reference:** [Relevant policy]
- **Recommended Action:** [Action]

If the content appears safe, explain your reasoning using the same structured format.

For scores and ratings:
- **Low Severity:** 1-3
- **Medium Severity:** 4-7
- **High Severity:** 8-10

`;
    
    if (contentType === 'text') {
      prompt += `CONTENT FOR ANALYSIS (TEXT):\n"""${content}"""\n\nPlease provide a comprehensive, professional analysis focusing on specific language patterns and context.`;
    } else if (contentType === 'image') {
      prompt += `CONTENT FOR ANALYSIS (IMAGE):\n[Image data not included in prompt]\n\nPlease provide a comprehensive, professional analysis focusing on visual elements, subjects, and context.`;
    } else if (contentType === 'video') {
      prompt += `CONTENT FOR ANALYSIS (VIDEO URL): ${content}\n\nPlease provide a comprehensive, professional analysis focusing on visual content, audio elements, and context.`;
    } else if (contentType === 'audio') {
      prompt += `CONTENT FOR ANALYSIS (AUDIO URL): ${content}\n\nPlease provide a comprehensive, professional analysis focusing on speech content, tone, and context.`;
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
          temperature: 0.2, // Lower temperature for more precise and consistent output
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200, // Increased for more detailed analysis
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
      .replace(/\*\*Overall Assessment:\*\*/g, '## Analysis Summary') // Replace "Overall Assessment" with "Analysis Summary"
      .replace(/\*\*(\w+):\*\*/g, '**$1:**') // Ensure consistent spacing in bold sections
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
    
    // Return a more professional and detailed fallback message
    return `# Analysis Error

We encountered an issue while analyzing your content. Our engineering team has been notified.

## Technical Details
- **Error Type**: API Communication Error
- **Status**: Failed
- **Time**: ${new Date().toLocaleTimeString()}

## Possible Solutions
- Verify your internet connection
- Try again in a few moments
- Use the built-in analyzer (disable "Use Gemini AI")
- Ensure your content is in a supported format

If this issue persists, please contact our support team with the error details above.`;
  }
};
