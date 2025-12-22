/**
 * LLM Client Service
 *
 * Client-side service for calling the Vercel chat API.
 */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ContextChunk {
  content: string;
  chapter: string;
  section: string;
  url: string;
}

export interface ChatRequest {
  message: string;
  context: ContextChunk[];
  language?: 'en' | 'ur';
  conversationHistory?: Message[];
}

export interface ChatResponse {
  response: string;
  citations: string[];
  error?: string;
}

/**
 * Call the chat API with retry logic
 */
export async function sendChatMessage(
  request: ChatRequest,
  retries: number = 2
): Promise<ChatResponse> {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? '/api/chat'
      : 'http://localhost:3000/api/chat';

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      // Validate response
      if (!data.response) {
        throw new Error('Invalid response from API');
      }

      return data;
    } catch (error) {
      // If this was the last attempt, throw the error
      if (attempt === retries) {
        console.error('Chat API error (all retries failed):', error);
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`Chat API error (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but TypeScript needs this
  throw new Error('Unexpected error in sendChatMessage');
}

/**
 * Generate embedding for a query (client-side)
 * Uses a simple heuristic-based embedding for lightweight implementation
 */
export function generateQueryEmbedding(query: string, dimension: number = 384): number[] {
  // Simple keyword-based embedding
  // For production, you'd use a real embedding model via API

  const embedding = new Array(dimension).fill(0);

  // Normalize query
  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery.split(/\s+/);

  // Generate pseudo-embedding based on token hashes
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const hash = simpleHash(token);

    // Distribute hash across dimensions
    for (let j = 0; j < dimension; j++) {
      const index = (hash + j) % dimension;
      embedding[index] += Math.sin(hash + j) * (1 / Math.sqrt(tokens.length));
    }
  }

  // Normalize to unit vector
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < dimension; i++) {
      embedding[i] /= norm;
    }
  }

  return embedding;
}

/**
 * Simple string hash function
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Format conversation history for API
 */
export function formatConversationHistory(
  messages: Message[],
  maxMessages: number = 5
): Array<{ role: 'user' | 'assistant'; content: string }> {
  // Take last N messages
  const recentMessages = messages.slice(-maxMessages);

  return recentMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Check if API is available
 */
export async function checkAPIAvailability(): Promise<boolean> {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? '/api/chat'
      : 'http://localhost:3000/api/chat';

  try {
    const response = await fetch(apiUrl, {
      method: 'HEAD',
    });
    return response.status !== 404;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
}
