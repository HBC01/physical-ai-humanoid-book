/**
 * AI Assistant Component
 *
 * Main component that integrates all RAG functionality.
 * Can be embedded in documentation pages or displayed as a floating widget.
 */

import React, { useState } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import ChatInterface from './ChatInterface';
import styles from './styles.module.css';

interface AIAssistantProps {
  language?: 'en' | 'ur';
  mode?: 'inline' | 'floating';
  defaultOpen?: boolean;
}

export default function AIAssistant({
  language = 'en',
  mode = 'inline',
  defaultOpen = false,
}: AIAssistantProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const {
    messages,
    isLoading,
    error,
    isEmbeddingsReady,
    sendMessage,
    clearMessages,
  } = useAIAssistant({ language, useChapterContext: true });

  // Inline mode: always visible
  if (mode === 'inline') {
    return (
      <div className={styles.aiAssistantInline}>
        <div className={styles.assistantHeader}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>🤖</span>
            <div>
              <h3 className={styles.headerTitle}>
                {language === 'ur' ? 'AI تدریسی معاون' : 'AI Teaching Assistant'}
              </h3>
              <p className={styles.headerSubtitle}>
                {language === 'ur'
                  ? 'اپنے سوالات پوچھیں'
                  : 'Ask questions about the textbook'}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className={styles.clearButton}
              title={language === 'ur' ? 'چیٹ صاف کریں' : 'Clear chat'}
            >
              🗑️
            </button>
          )}
        </div>


        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          error={error || undefined}
          language={language}
        />
      </div>
    );
  }

  // Floating mode: collapsible widget
  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.floatingButton}
          aria-label={language === 'ur' ? 'AI معاون کھولیں' : 'Open AI Assistant'}
        >
          🤖
          <span className={styles.floatingButtonText}>
            {language === 'ur' ? 'مدد چاہیے؟' : 'Need help?'}
          </span>
        </button>
      )}

      {isOpen && (
        <div className={styles.floatingWidget}>
          <div className={styles.floatingHeader}>
            <div className={styles.headerContent}>
              <span className={styles.headerIcon}>🤖</span>
              <div>
                <h3 className={styles.headerTitle}>
                  {language === 'ur' ? 'AI معاون' : 'AI Assistant'}
                </h3>
              </div>
            </div>
            <div className={styles.floatingActions}>
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className={styles.iconButton}
                  title={language === 'ur' ? 'چیٹ صاف کریں' : 'Clear chat'}
                >
                  🗑️
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={styles.iconButton}
                title={language === 'ur' ? 'بند کریں' : 'Close'}
              >
                ✕
              </button>
            </div>
          </div>


          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            error={error || undefined}
            language={language}
          />
        </div>
      )}
    </>
  );
}
