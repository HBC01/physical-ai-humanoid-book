import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am your Physical AI assistant. Ask me anything about robotics, ROS2, or Gazebo!' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.API_URL || 'https://hackathon1-humaniod-robotic-book.vercel.app';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendChat = async () => {
    if (!message.trim()) return;

    const userMsg = { role: 'user' as const, text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) throw new Error('Failed to connect');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Sorry, I could not connect to the server. Please make sure the backend is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  if (!isOpen) {
    return (
      <button
        className="chat-toggle-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <span className="chat-toggle-text">AI Chat</span>
      </button>
    );
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <span>Physical AI Assistant</span>
        <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="chat-message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="chat-message-content typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          rows={1}
        />
        <button
          className="chat-send"
          onClick={sendChat}
          disabled={loading || !message.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
