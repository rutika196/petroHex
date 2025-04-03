import { useState, useEffect, useRef } from 'react'
import './App.css'
import { generateChatResponse, formatMessagesForOpenAI } from './services/openaiService'

// Types
interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm PatroHex. How can I help you today?",
      isUser: false,
      timestamp: getCurrentTime()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApiMode, setIsApiMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: getCurrentTime()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);

    try {
      let botResponse = '';
      
      if (isApiMode) {
        // Use OpenAI API for dynamic responses
        const formattedMessages = formatMessagesForOpenAI(
          [...messages, userMessage],
          'You are PatroHex, a friendly AI assistant. Keep your responses concise (under 100 words) and helpful. Maintain a cheerful tone.'
        );
        
        botResponse = await generateChatResponse(formattedMessages);
      } else {
        // Simple keyword-based responses (fallback when API is not available)
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        
        const lowercaseInput = inputValue.toLowerCase();
        if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
          botResponse = "Hello! How are you doing today?";
        } else if (lowercaseInput.includes('how are you')) {
          botResponse = "I'm doing great, thanks for asking! How about you?";
        } else if (lowercaseInput.includes('thank')) {
          botResponse = "You're welcome! Is there anything else I can help with?";
        } else if (lowercaseInput.includes('bye') || lowercaseInput.includes('goodbye')) {
          botResponse = "Goodbye! Have a great day!";
        } else if (lowercaseInput.includes('weather')) {
          botResponse = "I don't have access to real-time weather data, but I hope it's nice where you are!";
        } else if (lowercaseInput.includes('name')) {
          botResponse = "My name is PatroHex, your friendly AI assistant!";
        } else if (lowercaseInput.includes('help')) {
          botResponse = "I can chat with you about various topics. Just type your question or comment!";
        } else {
          botResponse = "I'm not sure how to respond to that. Can you try something else?";
        }
      }
      
      // Add bot message
      const botMessage: Message = {
        text: botResponse,
        isUser: false,
        timestamp: getCurrentTime()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        text: "Sorry, I couldn't generate a response. Please try again.",
        isUser: false,
        timestamp: getCurrentTime()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile chat container */}
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="bot-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h1 className="bot-title">PatroHex</h1>
          
          {/* API Mode Toggle */}
          <div className="api-toggle">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={isApiMode}
                onChange={() => setIsApiMode(!isApiMode)}
              />
              <span className="toggle-text">AI Mode</span>
            </label>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="messages-area">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message-container ${message.isUser ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                <div className={`message-bubble ${message.isUser ? 'user' : 'bot'}`}>
                  {message.text}
                </div>
                <span className={`message-time ${message.isUser ? 'user' : ''}`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="typing-indicator">
              PatroHex is typing
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="input-area">
          <button className="mic-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Write here..."
            className="message-input"
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="send-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
