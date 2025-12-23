/**
 * Vercel Serverless Function for RAG Chat
 * Uses Gemini 2.5 Flash via OpenAI-compatible SDK
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

// Gemini via OpenAI-compatible SDK
const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

/* ================= SYSTEM PROMPTS ================= */

const SYSTEM_PROMPT_EN = `
You are an expert AI teaching assistant for Physical AI & Humanoid Robotics.

Rules:
- ALWAYS prioritize textbook content when provided
- Give SHORT, CONCISE answers directly from the book (2-4 sentences max)
- If context is insufficient, say: "The book doesn't fully cover this. Would you like a detailed explanation?"
- NEVER give detailed explanations unless specifically requested
- Be precise and reference book content directly
`;

const SYSTEM_PROMPT_UR = `
آپ فزیکل AI اور ہیومنائیڈ روبوٹکس کے ماہر AI معاون ہیں۔

قوانین:
- ہمیشہ درسی کتاب کے مواد کو ترجیح دیں
- کتاب سے براہ راست مختصر جواب دیں (زیادہ سے زیادہ 2-4 جملے)
- اگر کتاب میں کافی معلومات نہیں تو کہیں: "کتاب میں یہ مکمل نہیں۔ کیا آپ تفصیلی وضاحت چاہتے ہیں؟"
- جب تک خاص طور پر نہ کہا جائے تفصیلی وضاحت نہ دیں
- درست رہیں اور کتاب کے مواد کا حوالہ دیں
`;

/* ================= HELPERS ================= */

function formatContext(context: ChatRequest['context']): string {
  return context
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.chapter} - ${chunk.section}]
${chunk.content}`
    )
    .join('\n\n---\n\n');
}

function extractCitations(
  response: string,
  context: ChatRequest['context']
): string[] {
  const citations: string[] = [];
  const pattern = /\[([^\]]+)\]/g;
  const matches = response.match(pattern);

  if (!matches) return citations;

  for (const match of matches) {
    const key = match.slice(1, -1);
    const found = context.find(
      (c) => `${c.chapter} - ${c.section}` === key
    );
    if (found && !citations.includes(found.url)) {
      citations.push(found.url);
    }
  }

  return citations;
}

async function callGemini(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gemini-2.5-flash',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9,
  });

  return completion.choices[0]?.message?.content ?? '';
}

/* ================= HANDLER ================= */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const body: ChatRequest = req.body;

    if (!body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const hasContext = Array.isArray(body.context) && body.context.length > 0;
    const language = body.language ?? 'en';

    const systemPrompt =
      language === 'ur' ? SYSTEM_PROMPT_UR : SYSTEM_PROMPT_EN;

    let userPrompt: string;

    if (hasContext) {
      const contextText = formatContext(body.context);

      // Check if user is requesting detailed explanation
      const isDetailRequest = body.message.toLowerCase().includes('explain more') ||
                             body.message.toLowerCase().includes('detailed') ||
                             body.message.toLowerCase().includes('تفصیل') ||
                             body.message.toLowerCase().includes('مزید');

      if (isDetailRequest) {
        userPrompt = `
Textbook context:
${contextText}

Question:
${body.message}

Instructions:
- Provide a DETAILED explanation using both textbook context and your knowledge
- Include examples, analogies, and deeper insights
- Make it comprehensive and educational
`;
      } else {
        userPrompt = `
Textbook context:
${contextText}

Question:
${body.message}

Instructions:
- Give a SHORT answer (2-4 sentences) directly from the book
- ONLY use textbook information
- If the book doesn't fully answer this, end with: "Would you like a more detailed explanation?"
`;
      }
    } else {
      userPrompt = `
Question:
${body.message}

Instructions:
- No textbook context found
- Give a brief 2-3 sentence answer
- Suggest: "This isn't covered in the book. Would you like a detailed explanation?"
`;
    }

    const messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }> = [{ role: 'system', content: systemPrompt }];

    if (body.conversationHistory?.length) {
      messages.push(...body.conversationHistory);
    }

    messages.push({ role: 'user', content: userPrompt });

    const aiResponse = await callGemini(messages);

    const citations = hasContext
      ? extractCitations(aiResponse, body.context)
      : [];

    const response: ChatResponse = {
      response: aiResponse,
      citations,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      response: '',
      citations: [],
      error: 'Internal server error',
    });
  }
}
