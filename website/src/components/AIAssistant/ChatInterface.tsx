import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../services/rag/llm-client';
import CitationParser from './CitationParser';
import styles from './styles.module.css';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error?: string;
  language?: 'en' | 'ur';
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  error,
  language = 'en',
}: ChatInterfaceProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    onSendMessage(trimmedMessage);
    setInputValue('');

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholderText = language === 'ur'
    ? 'اپنا سوال یہاں ٹائپ کریں...'
    : 'Ask a question about the textbook...';

  const sendButtonText = language === 'ur' ? 'بھیجیں' : 'Send';
  const thinkingText = language === 'ur' ? 'سوچ رہا ہے...' : 'Thinking...';

  return (
    <div className={styles.chatInterface} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyText}>
              {language === 'ur'
                ? 'اپنا پہلا سوال پوچھیں!'
                : 'Ask your first question!'}
            </p>
            <p className={styles.emptySubtext}>
              {language === 'ur'
                ? 'میں آپ کی Physical AI اور Humanoid Robotics سیکھنے میں مدد کروں گا۔'
                : "I'll help you learn about Physical AI and Humanoid Robotics."}
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            }`}
          >
            <div className={styles.messageAvatar}>
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className={styles.messageContent}>
              {message.role === 'assistant' ? (
                <CitationParser content={message.content} language={language} />
              ) : (
                <p>{message.content}</p>
              )}
              <span className={styles.messageTimestamp}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.messageAvatar}>🤖</div>
            <div className={styles.messageContent}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.loadingText}>{thinkingText}</span>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <strong>{language === 'ur' ? 'خرابی:' : 'Error:'}</strong> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.inputField}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
          disabled={isLoading}
          aria-label={placeholderText}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isLoading || !inputValue.trim()}
          aria-label={sendButtonText}
        >
          {isLoading ? '⏳' : '📤'}
          <span className={styles.sendButtonText}>{sendButtonText}</span>
        </button>
      </form>
    </div>
  );
}
