# AI Assistant Setup with OpenAI SDK & Gemini 2.5 Flash

## Overview

The AI Assistant now uses the **OpenAI SDK** to communicate with **Google's Gemini 2.5 Flash** model. This provides a standardized interface while using Google's cost-effective and powerful model.

## Architecture

### Technology Stack
- **SDK**: OpenAI Node.js SDK (v4.77.3)
- **Model**: Gemini 2.5 Flash
- **API Endpoint**: Google's Gemini API via OpenAI-compatible interface
- **Deployment**: Vercel Serverless Functions

### Key Changes

1. **OpenAI SDK Integration**
   - Replaced direct Gemini REST API calls with OpenAI SDK
   - Uses OpenAI's chat completions interface
   - Maintains compatibility with Gemini's features

2. **Configuration**
   ```typescript
   const openai = new OpenAI({
     apiKey: GEMINI_API_KEY,
     baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
   });
   ```

3. **Model Selection**
   - Model: `gemini-2.5-flash`
   - Max tokens: 1000
   - Temperature: 0.7
   - Top P: 0.9

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `website` directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key from**: https://aistudio.google.com/app/apikey

### 2. Install Dependencies

```bash
cd website
npm install
```

This will install:
- `openai@^4.77.3` - OpenAI SDK for Node.js
- All other project dependencies

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add: GEMINI_API_KEY = your_key
```

## API Endpoint

**Endpoint**: `/api/chat`
**Method**: POST

### Request Format

```json
{
  "message": "What is physical AI?",
  "context": [
    {
      "content": "Physical AI refers to...",
      "chapter": "Introduction",
      "section": "What is Physical AI?",
      "url": "/docs/modules/01-intro/chapter1"
    }
  ],
  "language": "en",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous question"
    },
    {
      "role": "assistant",
      "content": "Previous answer"
    }
  ]
}
```

### Response Format

```json
{
  "response": "Physical AI is...",
  "citations": [
    "/docs/modules/01-intro/chapter1"
  ]
}
```

## Features

### 1. RAG (Retrieval Augmented Generation)
- Receives context from embeddings search
- Formats context with chapter and section metadata
- Generates responses based on textbook content

### 2. Multilingual Support
- English (`en`) and Urdu (`ur`) system prompts
- Language-specific teaching assistant behavior

### 3. Citation Tracking
- Automatically extracts citations from responses
- Links back to source chapters and sections

### 4. Conversation History
- Maintains context across multiple turns
- Supports follow-up questions

## Code Structure

```
website/
├── api/
│   └── chat.ts              # Main API handler with OpenAI SDK
├── src/
│   ├── components/
│   │   └── AIChatbot.tsx    # Frontend chatbot component
│   └── services/
│       └── rag/
│           ├── embeddings.ts # Embeddings loader
│           └── retrieval.ts  # Context retrieval
├── static/
│   └── embeddings.json      # Pre-generated embeddings
└── scripts/
    └── generate-embeddings.py # Python script for embeddings
```

## Benefits of OpenAI SDK

1. **Standardized Interface**: Familiar chat completions API
2. **Type Safety**: Full TypeScript support
3. **Error Handling**: Built-in retry logic and error handling
4. **Streaming Support**: Easy to add streaming responses
5. **Future Flexibility**: Easy to switch between models

## Cost Efficiency

**Gemini 2.5 Flash Pricing**:
- Input: $0.075 / 1M tokens
- Output: $0.30 / 1M tokens
- **128K context window**
- **Extremely fast responses**

Compared to other models:
- ~15x cheaper than GPT-4
- ~5x cheaper than Claude
- Similar quality for RAG tasks

## Testing the Assistant

### Local Testing (Frontend)

```bash
cd website
npm start
# Visit http://localhost:3000
# Click AI Assistant icon in bottom right
```

### API Testing (cURL)

```bash
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is physical AI?",
    "context": [
      {
        "content": "Physical AI combines artificial intelligence...",
        "chapter": "Introduction",
        "section": "Overview",
        "url": "/docs/modules/01-intro"
      }
    ],
    "language": "en"
  }'
```

## Troubleshooting

### Issue: "API key not configured"
**Solution**: Ensure `GEMINI_API_KEY` is set in environment variables

### Issue: "Model not found"
**Solution**: Verify the baseURL is correct and API key has access to Gemini models

### Issue: "No response from API"
**Solution**: Check Vercel logs and ensure the function hasn't timed out

### Issue: OpenAI SDK throws errors
**Solution**: Ensure you're using OpenAI SDK v4.77.3 or later

## Future Enhancements

1. **Streaming Responses**: Add real-time response streaming
2. **Function Calling**: Use tool/function calling for structured outputs
3. **Image Support**: Add diagram/image analysis with Gemini's vision capabilities
4. **Audio Input**: Voice-to-text for questions
5. **Caching**: Implement prompt caching for repeated context

## Resources

- [OpenAI SDK Documentation](https://github.com/openai/openai-node)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [RAG Implementation Guide](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API key with direct Gemini API call
4. Review OpenAI SDK error messages

---

**Last Updated**: 2025-12-22
**Version**: 1.0.0
**OpenAI SDK**: v4.77.3
**Model**: gemini-2.5-flash
