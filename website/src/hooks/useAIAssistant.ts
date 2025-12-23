/**
 * useAIAssistant Hook
 *
 * React hook for managing AI assistant state and interactions.
 */

import { useState, useCallback, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import {
  sendChatMessage,
  generateQueryEmbedding,
  formatConversationHistory,
  type Message,
  type ContextChunk,
} from '../services/rag/llm-client';
import {
  retrieveChunks,
  retrieveByKeywords,
  getChapterContext,
  generateSuggestions,
} from '../services/rag/retrieval';
import { loadEmbeddings, isEmbeddingsLoaded } from '../services/rag/embeddings';

interface UseAIAssistantOptions {
  language?: 'en' | 'ur';
  maxHistory?: number;
  useChapterContext?: boolean;
}

interface UseAIAssistantReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isEmbeddingsReady: boolean;
  suggestions: string[];
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
}

/**
 * Hook for AI assistant functionality
 */
export function useAIAssistant(
  options: UseAIAssistantOptions = {}
): UseAIAssistantReturn {
  const {
    language = 'en',
    maxHistory = 5,
    useChapterContext = true,
  } = options;

  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmbeddingsReady, setIsEmbeddingsReady] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load embeddings on mount (optional - fallback to keyword search if unavailable)
  useEffect(() => {
    if (!isEmbeddingsLoaded()) {
      loadEmbeddings()
        .then(() => {
          setIsEmbeddingsReady(true);
          console.log('Embeddings loaded successfully - using semantic search');
        })
        .catch((err) => {
          console.warn('Embeddings not available, using keyword-based search:', err);
          // Don't set error - keyword fallback will work fine
          setIsEmbeddingsReady(false);
        });
    } else {
      setIsEmbeddingsReady(true);
    }
  }, []);

  /**
   * Retrieve relevant context for a user query
   */
  const retrieveContext = useCallback(
    async (query: string): Promise<ContextChunk[]> => {
      try {
        // Try embedding-based retrieval first
        if (isEmbeddingsReady) {
          // Generate query embedding (simplified client-side version)
          const queryEmbedding = generateQueryEmbedding(query);

          // Get module filter from current URL if using chapter context
          let moduleFilter: string | undefined;
          if (useChapterContext) {
            const moduleMatch = location.pathname.match(/\/modules\/([\w-]+)\//);
            moduleFilter = moduleMatch ? moduleMatch[1] : undefined;
          }

          // Retrieve top chunks
          const results = await retrieveChunks(queryEmbedding, 3, moduleFilter);

          // Convert to ContextChunk format
          return results.map((result) => ({
            content: result.chunk.content,
            chapter: result.chunk.chapter,
            section: result.chunk.section,
            url: result.chunk.url,
          }));
        }

        // Fallback to keyword-based retrieval
        const results = await retrieveByKeywords(query, 3);
        return results.map((result) => ({
          content: result.chunk.content,
          chapter: result.chunk.chapter,
          section: result.chunk.section,
          url: result.chunk.url,
        }));
      } catch (err) {
        console.error('Context retrieval error:', err);

        // Final fallback: try to get chapter context if available
        if (useChapterContext) {
          try {
            const chapterChunks = await getChapterContext(location.pathname, 2);
            return chapterChunks.map((chunk) => ({
              content: chunk.content,
              chapter: chunk.chapter,
              section: chunk.section,
              url: chunk.url,
            }));
          } catch (chapterErr) {
            console.error('Chapter context retrieval error:', chapterErr);
          }
        }

        return [];
      }
    },
    [isEmbeddingsReady, location.pathname, useChapterContext]
  );

  /**
   * Send a message to the AI assistant
   */
  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);
      setLastUserMessage(message);

      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Retrieve relevant context
        const context = await retrieveContext(message);

        if (context.length === 0) {
          throw new Error(
            'No relevant context found. Try asking about specific topics from the textbook.'
          );
        }

        // Format conversation history
        const history = formatConversationHistory(messages, maxHistory);

        // Send to API
        const response = await sendChatMessage({
          message,
          context,
          language,
          conversationHistory: history,
        });

        // Add assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Generate intelligent suggestions based on context
        const newSuggestions = generateSuggestions(
          message,
          context.map((c) => ({
            content: c.content,
            chapter: c.chapter,
            section: c.section,
            url: c.url,
            module: '', // Not needed for suggestions
            embedding: [], // Not needed for suggestions
          })),
          language
        );
        setSuggestions(newSuggestions);
      } catch (err) {
        console.error('Send message error:', err);

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to get response. Please try again.';

        setError(errorMessage);

        // Remove user message if error occurred
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, retrieveContext, language, maxHistory]
  );

  /**
   * Retry the last failed message
   */
  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage) {
      await sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastUserMessage('');
    setSuggestions([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    isEmbeddingsReady,
    suggestions,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}
