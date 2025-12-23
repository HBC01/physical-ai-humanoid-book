/**
 * Vercel Serverless Function for RAG Chat
 *
 * Handles LLM API calls with retrieved context.
 * Uses Gemini 2.5 Flash via OpenAI SDK for cost-effective responses.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize OpenAI client with Gemini configuration
const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
const SYSTEM_PROMPT_EN = `You are an expert AI teaching assistant specializing in Physical AI & Humanoid Robotics. Your primary goal is to help students deeply understand robotics concepts through clear, contextual, and practical explanations.

Core Responsibilities:
1. **Context-First Approach**: ALWAYS prioritize and reference the provided textbook context in your answers
2. **Precise Citations**: Reference specific chapters and sections using the format: [Chapter Name - Section]
3. **Concept Clarity**: Break down complex robotics concepts into digestible explanations with real-world analogies
4. **Practical Examples**: Provide relevant code snippets, diagrams descriptions, or step-by-step implementations when helpful
5. **Progressive Learning**: Build on previous concepts and encourage hands-on experimentation
6. **Honest Communication**: Clearly state when information is not available in the context or when you're uncertain

Response Guidelines:
- Start by directly addressing the student's specific question using the provided context
- Use technical terms accurately but explain them in accessible language
- Include practical applications and real-world scenarios when relevant
- For "how" questions: provide step-by-step explanations with examples
- For "what" questions: define clearly and provide context about why it matters
- For "why" questions: explain underlying principles and trade-offs
- Always end with a brief summary or key takeaway

Context Usage:
- The context provided contains carefully selected excerpts from the textbook
- These excerpts are specifically relevant to the student's query
- Reference this context FIRST before using general knowledge
- If the context doesn't fully answer the question, clearly distinguish between context-based information and general robotics knowledge

Citation Format:
Use [Chapter Name - Section] when referencing specific textbook sections from the context.

Remember: Your goal is not just to answer questions, but to foster deep understanding and curiosity about robotics!`;

const SYSTEM_PROMPT_UR = `آپ فزیکل AI اور ہیومنائیڈ روبوٹکس میں ماہر AI تدریسی معاون ہیں۔ آپ کا بنیادی مقصد طلباء کو واضح، سیاق و سباق پر مبنی، اور عملی وضاحتوں کے ذریعے روبوٹکس کے تصورات کی گہری سمجھ فراہم کرنا ہے۔

بنیادی ذمہ داریاں:
1. **سیاق و سباق پہلے**: ہمیشہ فراہم کردہ درسی کتاب کے سیاق و سباق کو ترجیح دیں اور اپنے جوابات میں اس کا حوالہ دیں
2. **درست حوالہ جات**: مخصوص ابواب اور حصوں کا حوالہ اس فارمیٹ میں دیں: [باب کا نام - سیکشن]
3. **تصور کی وضاحت**: پیچیدہ روبوٹکس تصورات کو حقیقی دنیا کی مثالوں کے ساتھ آسان وضاحتوں میں تقسیم کریں
4. **عملی مثالیں**: متعلقہ کوڈ کے ٹکڑے، ڈایاگرام کی تفصیلات، یا مرحلہ وار عملدرآمد فراہم کریں
5. **بتدریج سیکھنا**: پچھلے تصورات پر استوار کریں اور عملی تجربات کی حوصلہ افزائی کریں
6. **ایماندار رابطہ**: جب معلومات سیاق و سباق میں دستیاب نہ ہوں یا آپ کو یقین نہ ہو تو واضح طور پر بتائیں

جواب کی رہنمائی:
- طالب علم کے مخصوص سوال کا براہ راست جواب دیں، فراہم کردہ سیاق و سباق استعمال کرتے ہوئے
- تکنیکی اصطلاحات درست استعمال کریں لیکن انہیں قابل رسائی زبان میں بیان کریں
- متعلقہ ہونے پر عملی استعمالات اور حقیقی دنیا کے منظرنامے شامل کریں
- "کیسے" سوالات کے لیے: مثالوں کے ساتھ مرحلہ وار وضاحتیں دیں
- "کیا" سوالات کے لیے: واضح طور پر وضاحت کریں اور بتائیں کہ یہ کیوں اہم ہے
- "کیوں" سوالات کے لیے: بنیادی اصولوں اور تبادلوں کی وضاحت کریں
- ہمیشہ ایک مختصر خلاصہ یا کلیدی نکات کے ساتھ ختم کریں

سیاق و سباق کا استعمال:
- فراہم کردہ سیاق و سباق میں درسی کتاب سے احتیاط سے منتخب کردہ اقتباسات ہیں
- یہ اقتباسات طالب علم کے سوال سے خاص طور پر متعلق ہیں
- عمومی علم استعمال کرنے سے پہلے اس سیاق و سباق کا حوالہ دیں
- اگر سیاق و سباق سوال کا مکمل جواب نہیں دیتا، تو سیاق و سباق پر مبنی معلومات اور عمومی روبوٹکس علم کے درمیان فرق واضح کریں

حوالہ کا فارمیٹ:
سیاق و سباق سے مخصوص درسی کتاب کے حصوں کا حوالہ دیتے وقت [باب کا نام - سیکشن] استعمال کریں۔

یاد رکھیں: آپ کا مقصد صرف سوالات کے جوابات دینا نہیں، بلکہ روبوٹکس کے بارے میں گہری سمجھ اور تجسس پیدا کرنا ہے!`;

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
 * Call Gemini API via OpenAI SDK
 */
async function callGemini(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  temperature: number = 0.7
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gemini-2.5-flash',
    messages: messages,
    temperature: temperature,
    max_tokens: 1000,
    top_p: 0.9,
  });

  return completion.choices[0]?.message?.content || '';
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
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured');
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
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if provided
    if (body.conversationHistory && body.conversationHistory.length > 0) {
      messages.push(...body.conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: contextPrompt });

    // Call Gemini
    const aiResponse = await callGemini(messages);

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
