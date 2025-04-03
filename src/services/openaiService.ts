import OpenAI from 'openai';

// Initialize the OpenAI client
const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim();

// Log whether we have an API key (but don't log the actual key)
console.log(`OpenAI API Key ${apiKey ? 'is present' : 'is missing'}`);
console.log(`Key format check: starts with sk-proj: ${apiKey?.startsWith('sk-proj')}`);

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // For client-side use (in production, use a backend)
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generates a response from OpenAI based on the conversation history
 * @param messages Array of messages representing the conversation history
 * @returns Promise with the AI's response
 */
export const generateChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  if (!apiKey) {
    console.error('Missing OpenAI API key. Please check your .env file.');
    return 'API key is missing. Please add your OpenAI API key to the .env file.';
  }

  try {
    console.log('Sending request to OpenAI...');
    
    // For debugging - don't log the full messages to avoid cluttering the console
    console.log(`Sending ${messages.length} messages to OpenAI`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log('Received response from OpenAI');
    return response.choices[0].message.content || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    // Log the full error object but safely
    console.error('Error calling OpenAI API:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // More detailed error reporting
    if (error.status === 401 || (error.response && error.response.status === 401)) {
      return 'Authentication error: Your API key may be invalid or expired.';
    } else if (error.status === 429 || (error.response && error.response.status === 429)) {
      return 'Rate limit exceeded: Too many requests or you have exceeded your quota.';
    } else if (error.status >= 500 || (error.response && error.response.status >= 500)) {
      return 'OpenAI server error. Please try again later.';
    }
    
    return `Error: ${error.message || 'Unknown error occurred'}`;
  }
};

// Helper function to convert our app messages to OpenAI format
export const formatMessagesForOpenAI = (
  messages: Array<{ text: string; isUser: boolean }>, 
  systemPrompt: string = 'You are PatroHex, a helpful assistant. Be friendly, concise, and helpful.'
): ChatMessage[] => {
  // Add the system message as the first message
  const formattedMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt }
  ];
  
  // Add the conversation history
  messages.forEach(msg => {
    formattedMessages.push({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    });
  });
  
  return formattedMessages;
}; 