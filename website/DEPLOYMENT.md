# Deployment Guide

## Overview

This document provides instructions for deploying the Physical AI & Humanoid Robotics Book to Vercel with the Two-Agent AI Assistant.

---

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Gemini API key ([Get it here](https://aistudio.google.com/app/apikey))
- Git repository connected to Vercel

---

## Quick Deployment to Vercel

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub/GitLab/Bitbucket repository
4. Vercel will auto-detect **Docusaurus** framework

### 2. Configure Build Settings

Vercel will automatically use settings from `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "docusaurus"
}
```

**No manual configuration needed!**

### 3. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `your-api-key-here` | Required for AI Assistant |

**Get API Key:** https://aistudio.google.com/app/apikey

### 4. Deploy

Click **"Deploy"** - Vercel will:
1. Install dependencies (`npm install`)
2. Build the site (`npm run build`)
3. Deploy serverless functions (`api/chat.ts`)
4. Provide a production URL

**Deployment time:** ~2-3 minutes

---

## AI Assistant Configuration

### Two-Agent Architecture

The AI Assistant uses serverless functions deployed to Vercel Edge Network:

**API Endpoint:** `/api/chat`
**Function:** `website/api/chat.ts`
**Runtime:** Node.js 20.x
**Memory:** 1024 MB
**Timeout:** 10 seconds

### Agent Routing

```typescript
// Automatic routing based on context availability
if (context.length > 0) {
    // PRIMARY AGENT: RAG with textbook content
    systemPrompt = RAG_SYSTEM_PROMPT;
} else {
    // SECONDARY AGENT: General robotics knowledge
    systemPrompt = GENERAL_SYSTEM_PROMPT;
}
```

### Environment Variables

**Required:**
- `GEMINI_API_KEY` - Gemini 2.5 Flash API key

**Optional:**
- `MAX_REQUESTS_PER_MINUTE` - Rate limiting (default: 60)
- `NODE_ENV` - Set to `production` automatically by Vercel

---

## Serverless Function Configuration

### Function Settings (vercel.json)

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Memory:** 1024 MB (sufficient for Gemini API calls)
**Max Duration:** 10 seconds (enough for LLM responses)

### CORS Headers

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        }
      ]
    }
  ]
}
```

---

## Deployment Checklist

### Before Deployment

- [ ] Ensure `GEMINI_API_KEY` is set in Vercel environment variables
- [ ] Test locally with `npm run build && npm run serve`
- [ ] Verify `api/chat.ts` is present in repository
- [ ] Check `vercel.json` is in `website/` directory

### After Deployment

- [ ] Visit production URL
- [ ] Test AI Assistant with book-covered questions (should use RAG agent)
- [ ] Test AI Assistant with general questions (should use General agent)
- [ ] Verify bilingual support (English/Urdu)
- [ ] Check mobile responsiveness
- [ ] Monitor Vercel Function logs for errors

---

## Testing the AI Assistant

### Test Scenarios

#### 1. RAG Agent (Book-Covered)
**Query:** "What is ROS2?"
**Expected:** Textbook-based answer with citations

#### 2. General Agent (No Context)
**Query:** "What is Physical AI?"
**Expected:** Confident general explanation (no "not covered" message)

#### 3. Out-of-Domain
**Query:** "What is React?"
**Expected:** Polite refusal

#### 4. Urdu Support
**Query:** "ROS2 کیا ہے؟"
**Expected:** Works in both agents

---

## Monitoring & Debugging

### Vercel Dashboard

- **Deployments:** View build logs and deployment history
- **Functions:** Monitor serverless function invocations
- **Analytics:** Track page views and performance
- **Logs:** Real-time function logs

### Common Issues

#### Issue: "GEMINI_API_KEY not configured"
**Solution:** Add environment variable in Vercel dashboard

#### Issue: API timeout
**Solution:** Increase `maxDuration` in `vercel.json` (max: 10s on Hobby plan)

#### Issue: CORS errors
**Solution:** Check `vercel.json` headers configuration

#### Issue: Function not found
**Solution:** Ensure `api/chat.ts` is in correct directory structure

---

## Production URLs

### Primary (Vercel)
**URL:** https://physical-ai-humanoid-book-kappa.vercel.app/
**Status:** ✅ Production-ready
**Features:** Full AI Assistant with Two-Agent architecture

### Fallback (GitHub Pages)
**URL:** https://HBC01.github.io/physical-ai-humanoid-book/
**Status:** ✅ Static site
**Features:** No AI Assistant (serverless functions not supported)

---

## Cost Estimation

### Vercel (Hobby Plan - FREE)
- **Bandwidth:** 100 GB/month
- **Function Invocations:** 100 GB-hours
- **Build Minutes:** Unlimited

### Gemini API (FREE Tier)
- **Requests:** 1,500 requests/day
- **Tokens:** 1M tokens/day
- **Rate Limit:** 15 RPM

**Expected Cost:** $0/month for typical usage

---

## Custom Domain Setup

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain (e.g., `robotics-book.com`)
3. Update DNS records as instructed
4. Vercel will auto-provision SSL certificate
5. Domain will be live in ~24 hours

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- **Push to `main` branch** → Production
- **Push to other branches** → Preview deployments
- **Pull requests** → Preview URLs for testing

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## Environment-Specific Configuration

### Development
```bash
# .env.local (not committed)
GEMINI_API_KEY=your-dev-api-key
NODE_ENV=development
```

### Production (Vercel)
```bash
# Set in Vercel Dashboard
GEMINI_API_KEY=your-prod-api-key
NODE_ENV=production  # Set automatically
```

---

## Security Best Practices

- ✅ API keys stored in Vercel environment variables (never in code)
- ✅ CORS configured for security
- ✅ HTTPS enforced automatically
- ✅ Rate limiting on serverless functions
- ✅ Domain validation for robotics-only queries
- ✅ No sensitive data in client-side code

---

## Support & Troubleshooting

### Vercel Support
- **Documentation:** https://vercel.com/docs
- **Community:** https://vercel.com/community
- **Status:** https://vercel-status.com

### Project Support
- **Issues:** https://github.com/HBC01/physical-ai-humanoid-book/issues
- **Discussions:** https://github.com/HBC01/physical-ai-humanoid-book/discussions

---

## Quick Reference

### Vercel CLI Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls

# View function logs
vercel logs

# Link local project to Vercel
vercel link

# Pull environment variables
vercel env pull
```

### Useful URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Gemini API Console:** https://aistudio.google.com
- **Production Site:** https://physical-ai-humanoid-book-kappa.vercel.app/

---

**Last Updated:** December 2025
**Vercel Version:** Latest
**Node.js Version:** 20.x
