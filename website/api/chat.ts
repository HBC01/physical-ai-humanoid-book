/**
 * Vercel Serverless Function for RAG Chat
 *
 * Handles LLM API calls with retrieved context.
 * Uses GPT-4o-mini for cost-effective responses.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatRequest {
  message: string;
  context: Array<{
    content: string;
    chapter: string;
    section: string;
    url: string;
  }>;
  language?: 'en' | 'ur';
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  response: string;
  citations: string[];
  error?: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SYSTEM_PROMPT_EN = `You are an AI teaching assistant for a Physical AI & Humanoid Robotics textbook. Your role is to:

1. Answer questions clearly and accurately using the provided context
2. Reference specific chapters and sections when relevant
3. Provide code examples when helpful
4. Explain complex concepts in simple terms
5. Encourage hands-on learning with practical suggestions
6. Admit when you don't know something

Context provided contains relevant excerpts from the textbook. Use this context to inform your answers, but also draw on your general robotics knowledge when appropriate.

Always cite your sources using the format: [Chapter Name - Section] when referencing the context.`;

const SYSTEM_PROMPT_UR = `آپ فزیکل AI اور ہیومنائیڈ روبوٹکس کی درسی کتاب کے لیے AI تدریسی معاون ہیں۔ آپ کا کردار یہ ہے:

1. فراہم کردہ سیاق و سباق کا استعمال کرتے ہوئے سوالات کے واضح اور درست جوابات دینا
2. متعلقہ ابواب اور حصوں کا حوالہ دینا
3. مفید ہونے پر کوڈ کی مثالیں فراہم کرنا
4. پیچیدہ تصورات کو آسان الفاظ میں بیان کرنا
5. عملی تجاویز کے ساتھ ہاتھ سے سیکھنے کی حوصلہ افزائی کرنا
6. جب آپ کچھ نہیں جانتے تو تسلیم کرنا

فراہم کردہ سیاق و سباق میں درسی کتاب سے متعلقہ اقتباسات ہیں۔ اپنے جوابات کو مطلع کرنے کے لیے اس سیاق و سباق کا استعمال کریں۔

ہمیشہ اپنے ذرائع کا حوالہ دیں: [باب کا نام - سیکشن]`;

/**
 * Format context for LLM prompt
 */
function formatContext(context: ChatRequest['context']): string {
  return context
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.chapter} - ${chunk.section}]\n${chunk.content}\n`
    )
    .join('\n---\n\n');
}

/**
 * Extract citations from LLM response
 */
function extractCitations(response: string, context: ChatRequest['context']): string[] {
  const citations: string[] = [];

  // Look for [Chapter Name - Section] patterns
  const citationPattern = /\[([^\]]+)\]/g;
  const matches = response.match(citationPattern);

  if (matches) {
    for (const match of matches) {
      // Find corresponding URL from context
      const chapterSection = match.slice(1, -1); // Remove brackets
      const contextItem = context.find(
        (c) => `${c.chapter} - ${c.section}` === chapterSection
      );

      if (contextItem && !citations.includes(contextItem.url)) {
        citations.push(contextItem.url);
      }
    }
  }

  return citations;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature,
      max_tokens: 1000,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Main handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check API key
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const body: ChatRequest = req.body;

    // Validate request
    if (!body.message || !body.context) {
      res.status(400).json({ error: 'Missing required fields: message, context' });
      return;
    }

    const language = body.language || 'en';
    const systemPrompt = language === 'ur' ? SYSTEM_PROMPT_UR : SYSTEM_PROMPT_EN;

    // Build context prompt
    const contextText = formatContext(body.context);
    const contextPrompt = `Here is relevant context from the textbook:\n\n${contextText}\n\nUser question: ${body.message}`;

    // Build messages array
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if provided
    if (body.conversationHistory && body.conversationHistory.length > 0) {
      messages.push(...body.conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: contextPrompt });

    // Call OpenAI
    const aiResponse = await callOpenAI(messages);

    // Extract citations
    const citations = extractCitations(aiResponse, body.context);

    // Return response
    const chatResponse: ChatResponse = {
      response: aiResponse,
      citations,
    };

    res.status(200).json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      response: '',
      citations: [],
      error: errorMessage,
    });
  }
}
