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

// PRIMARY AGENT - Textbook RAG Agent (used when context is available)
const RAG_SYSTEM_PROMPT_EN = `
You are an expert AI teaching assistant for Physical AI & Humanoid Robotics.

Rules:
- ALWAYS prioritize textbook content when provided
- Give SHORT, CONCISE answers directly from the book (2-4 sentences max)
- Be precise and reference book content directly
- Provide structured explanations with clear sections
- End with a brief summary sentence
- NEVER ask "Would you like more detail?" - just answer confidently
`;

const RAG_SYSTEM_PROMPT_UR = `
آپ فزیکل AI اور ہیومنائیڈ روبوٹکس کے ماہر AI معاون ہیں۔

قوانین:
- ہمیشہ درسی کتاب کے مواد کو ترجیح دیں
- کتاب سے براہ راست مختصر جواب دیں (زیادہ سے زیادہ 2-4 جملے)
- درست رہیں اور کتاب کے مواد کا حوالہ دیں
- منظم وضاحت فراہم کریں
- مختصر خلاصہ جملے کے ساتھ ختم کریں
`;

// SECONDARY AGENT - General Knowledge Agent (used when context is empty)
const GENERAL_SYSTEM_PROMPT_EN = `
You are a knowledgeable robotics instructor specializing in Physical AI and Humanoid Robotics.

Your role:
- Answer questions confidently based on general robotics knowledge
- Provide clear, educational explanations (1-2 paragraphs)
- Stay within the domain of Physical AI, Robotics, Humanoid systems, and Embodied Intelligence
- Focus on conceptual clarity and technical accuracy
- Relate answers to practical applications when relevant
- NEVER mention missing data, embeddings, or textbook coverage
- NEVER ask permission to explain - just explain directly

Response structure:
1. Direct answer to the question (no filler)
2. Brief explanation (1-2 paragraphs)
3. Relation to Physical AI/Humanoids if relevant
4. Concise summary sentence

Start responses with: "Here is a general explanation based on robotics principles:"
`;

const GENERAL_SYSTEM_PROMPT_UR = `
آپ فزیکل AI اور ہیومنائیڈ روبوٹکس کے ماہر استاد ہیں۔

آپ کا کردار:
- عمومی روبوٹکس علم کی بنیاد پر اعتماد سے جواب دیں
- واضح، تعلیمی وضاحتیں فراہم کریں (1-2 پیراگراف)
- فزیکل AI، روبوٹکس، ہیومنائیڈ سسٹمز کے دائرے میں رہیں
- تصوراتی وضاحت اور تکنیکی درستگی پر توجہ دیں
- عملی استعمال سے متعلق بنائیں
- کبھی بھی گمشدہ ڈیٹا یا کتاب کا ذکر نہ کریں
- وضاحت کے لیے اجازت نہ مانگیں - براہ راست وضاحت کریں

جواب کی ساخت:
1. سوال کا براہ راست جواب
2. مختصر وضاحت (1-2 پیراگراف)
3. فزیکل AI/ہیومنائیڈز سے تعلق
4. مختصر خلاصہ
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

    // ROUTING DECISION: Choose agent based on context availability
    let systemPrompt: string;
    let userPrompt: string;

    if (hasContext) {
      // ========== PRIMARY AGENT: RAG Agent ==========
      // Use textbook-based RAG agent when context is available
      systemPrompt = language === 'ur' ? RAG_SYSTEM_PROMPT_UR : RAG_SYSTEM_PROMPT_EN;

      const contextText = formatContext(body.context);

      // Check if user is requesting detailed explanation
      const isDetailRequest = body.message.toLowerCase().includes('explain more') ||
                             body.message.toLowerCase().includes('detailed') ||
                             body.message.toLowerCase().includes('detail') ||
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
- Cite specific textbook sections when referencing them
`;
      } else {
        userPrompt = `
Textbook context:
${contextText}

Question:
${body.message}

Instructions:
- Answer directly using textbook content
- Be clear, structured, and educational
- Provide a complete answer (not intentionally brief)
- End with a summary sentence
`;
      }
    } else {
      // ========== SECONDARY AGENT: General Knowledge Agent ==========
      // Use general knowledge agent when no context is available
      systemPrompt = language === 'ur' ? GENERAL_SYSTEM_PROMPT_UR : GENERAL_SYSTEM_PROMPT_EN;

      // Check if question is robotics/AI related
      const isRoboticsRelated = /physical\s*ai|robot|humanoid|embodied|ros|control|sensor|actuator|perception|manipulation|locomotion|روبوٹ|فزیکل/i.test(body.message);

      if (!isRoboticsRelated) {
        // Politely refuse non-robotics questions
        const refusalMessage = language === 'ur'
          ? 'معذرت، میں صرف فزیکل AI اور ہیومنائیڈ روبوٹکس کے سوالات کا جواب دے سکتا ہوں۔ براہ کرم روبوٹکس سے متعلق سوال پوچھیں۔'
          : 'I specialize in Physical AI and Humanoid Robotics. Please ask questions related to robotics, AI, or embodied intelligence.';

        return res.status(200).json({
          response: refusalMessage,
          citations: [],
        });
      }

      userPrompt = `
Question:
${body.message}

Instructions:
- Provide a clear, educational explanation based on general robotics knowledge
- Answer confidently without mentioning textbook availability
- Keep it concise but complete (1-2 paragraphs)
- Focus on conceptual understanding
- Relate to Physical AI and Humanoid Robotics when relevant
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
