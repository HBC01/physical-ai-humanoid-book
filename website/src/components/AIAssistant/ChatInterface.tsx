import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../services/rag/llm-client';
import CitationParser from './CitationParser';
import styles from './styles.module.css';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClearChat?: () => void;
  isLoading: boolean;
  error?: string;
  language?: 'en' | 'ur';
  suggestions?: string[];
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  error,
  language = 'en',
  suggestions = [],
}: ChatInterfaceProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [showDetailButton, setShowDetailButton] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Detail button logic: ONLY show for intentionally brief answers
    // DO NOT show after full answers, chapter definitions, or introductory concepts
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        const content = lastMsg.content.toLowerCase();

        // Check if this is an intentionally brief answer that suggests more detail
        // This should be rare - most answers should be complete
        const isIntentionallyBrief = (
          content.length < 200 && // Very short answer
          messages.length >= 2 && // Has previous context
          (
            content.includes('in brief') ||
            content.includes('short answer') ||
            content.includes('مختصر')
          )
        );

        setShowDetailButton(isIntentionallyBrief);

        // Store last user question
        if (messages.length >= 2) {
          const lastUserMsg = messages[messages.length - 2];
          if (lastUserMsg.role === 'user') {
            setLastQuestion(lastUserMsg.content);
          }
        }
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    onSendMessage(trimmedMessage);
    setInputValue('');
    setShowDetailButton(false);

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleDetailedExplanation = () => {
    if (lastQuestion) {
      const detailRequest = language === 'ur'
        ? `${lastQuestion} - اس کی تفصیلی وضاحت دیں`
        : `${lastQuestion} - explain in detail`;
      onSendMessage(detailRequest);
      setShowDetailButton(false);
    }
  };

  const handleClearChat = () => {
    if (onClearChat && window.confirm(
      language === 'ur'
        ? 'کیا آپ واقعی چیٹ صاف کرنا چاہتے ہیں؟'
        : 'Are you sure you want to clear the chat?'
    )) {
      onClearChat();
      setShowDetailButton(false);
      setLastQuestion('');
    }
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
      {/* Header with Clear Chat button */}
      {messages.length > 0 && (
        <div className={styles.chatHeader}>
          <button
            className={styles.clearChatButton}
            onClick={handleClearChat}
            disabled={isLoading}
            aria-label={language === 'ur' ? 'چیٹ صاف کریں' : 'Clear chat'}
          >
            🗑️ {language === 'ur' ? 'چیٹ صاف کریں' : 'Clear Chat'}
          </button>
        </div>
      )}

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

        {/* Detailed Explanation Button */}
        {showDetailButton && !isLoading && (
          <div className={styles.detailButtonContainer}>
            <button
              className={styles.detailButton}
              onClick={handleDetailedExplanation}
            >
              {language === 'ur' ? '📚 مزید تفصیلی وضاحت چاہیے' : '📚 Get Detailed Explanation'}
            </button>
          </div>
        )}

        {/* Intelligent Suggestions */}
        {!isLoading && suggestions.length > 0 && (
          <div className={styles.suggestionsContainer}>
            <p className={styles.suggestionsTitle}>
              {language === 'ur'
                ? (messages.length === 0 ? '💡 تجویز کردہ سوالات:' : '💡 متعلقہ سوالات:')
                : (messages.length === 0 ? '💡 Suggested questions:' : '💡 Related questions:')}
            </p>
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionChip}
                  onClick={() => {
                    onSendMessage(suggestion);
                  }}
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
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
