/**
 * RAG Retrieval Service
 *
 * Implements cosine similarity search for finding relevant chunks.
 */

import { type ChunkMetadata, loadEmbeddings } from './embeddings';

export interface RetrievalResult {
  chunk: ChunkMetadata;
  similarity: number;
  rank: number;
}

/**
 * Compute cosine similarity between two vectors.
 *
 * @param a First vector
 * @param b Second vector
 * @returns Cosine similarity score (0-1)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Retrieve top-k most similar chunks for a query embedding.
 *
 * @param queryEmbedding Query vector
 * @param topK Number of results to return (default: 3)
 * @param moduleFilter Optional module filter (e.g., "02-ros2")
 * @returns Top-k retrieval results with similarity scores
 */
export async function retrieveChunks(
  queryEmbedding: number[],
  topK: number = 3,
  moduleFilter?: string
): Promise<RetrievalResult[]> {
  // Load embeddings
  const embeddingData = await loadEmbeddings();

  // Filter chunks if module specified
  let chunks = embeddingData.chunks;
  if (moduleFilter) {
    chunks = chunks.filter((chunk) => chunk.module === moduleFilter);
  }

  // Compute similarities
  const results: RetrievalResult[] = chunks.map((chunk, index) => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    rank: index,
  }));

  // Sort by similarity (descending)
  results.sort((a, b) => b.similarity - a.similarity);

  // Update ranks
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  // Return top-k
  return results.slice(0, topK);
}

/**
 * Retrieve chunks by keywords (advanced text matching with TF-IDF style scoring).
 * Useful as fallback when embeddings are not available.
 *
 * @param keywords Search keywords
 * @param topK Number of results
 * @param moduleFilter Optional module filter
 * @returns Top-k matching chunks
 */
export async function retrieveByKeywords(
  keywords: string,
  topK: number = 3,
  moduleFilter?: string
): Promise<RetrievalResult[]> {
  const embeddingData = await loadEmbeddings();

  // Normalize keywords and extract meaningful tokens
  const normalizedKeywords = keywords.toLowerCase().trim();
  const keywordTokens = normalizedKeywords
    .split(/\s+/)
    .filter((token) => token.length > 2); // Filter out very short words

  // Stop words to ignore
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'what', 'how', 'why',
    'کیا', 'ہے', 'میں', 'کے', 'اور', 'یا', 'سے', 'کو', 'پر'
  ]);

  const meaningfulTokens = keywordTokens.filter((token) => !stopWords.has(token));

  // Use meaningful tokens if available, otherwise use all tokens
  const searchTokens = meaningfulTokens.length > 0 ? meaningfulTokens : keywordTokens;

  if (searchTokens.length === 0) {
    return []; // No valid search terms
  }

  // Filter chunks
  let chunks = embeddingData.chunks;
  if (moduleFilter) {
    chunks = chunks.filter((chunk) => chunk.module === moduleFilter);
  }

  // Calculate IDF (Inverse Document Frequency) for each token
  const idf: Map<string, number> = new Map();
  for (const token of searchTokens) {
    const docsWithToken = chunks.filter((chunk) =>
      chunk.content.toLowerCase().includes(token)
    ).length;

    // IDF formula: log(total_docs / docs_with_token)
    const idfScore = Math.log((chunks.length + 1) / (docsWithToken + 1));
    idf.set(token, idfScore);
  }

  // Score based on TF-IDF style matching
  const results: RetrievalResult[] = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const section = chunk.section.toLowerCase();
    const chapter = chunk.chapter.toLowerCase();

    let score = 0;

    // Calculate score for each token
    for (const token of searchTokens) {
      const tokenIdf = idf.get(token) || 1.0;

      // Term Frequency in different fields
      const contentMatches = (content.match(new RegExp(token, 'gi')) || []).length;
      const sectionMatches = (section.match(new RegExp(token, 'gi')) || []).length;
      const chapterMatches = (chapter.match(new RegExp(token, 'gi')) || []).length;

      // Exact phrase bonus
      const exactPhraseBonus = content.includes(normalizedKeywords) ? 5.0 : 0;

      // Weighted TF-IDF score
      score += contentMatches * tokenIdf * 1.0;
      score += sectionMatches * tokenIdf * 3.0; // Higher weight for section titles
      score += chapterMatches * tokenIdf * 2.0; // Medium weight for chapter titles
      score += exactPhraseBonus; // Bonus for exact phrase match
    }

    // Normalize by content length (to avoid bias towards longer documents)
    const lengthNorm = Math.sqrt(chunk.content.length / 100);
    const normalizedScore = score / Math.max(lengthNorm, 1);

    // Boost score if multiple keywords found
    const uniqueTokensFound = searchTokens.filter((token) =>
      content.includes(token)
    ).length;
    const coverageBonus = (uniqueTokensFound / searchTokens.length) * 0.5;

    return {
      chunk,
      similarity: Math.min((normalizedScore + coverageBonus) / 10, 1.0), // Normalize to 0-1
      rank: index,
    };
  });

  // Sort by score (descending)
  results.sort((a, b) => b.similarity - a.similarity);

  // Filter out very low scores (threshold: 0.05)
  const relevantResults = results.filter((r) => r.similarity > 0.05);

  // Update ranks
  relevantResults.forEach((result, index) => {
    result.rank = index + 1;
  });

  // Return top-k results (increase to topK + 2 for better coverage)
  return relevantResults.slice(0, Math.max(topK, 5));
}

/**
 * Get chunks for current chapter context.
 *
 * @param currentUrl Current page URL
 * @param topK Number of chunks to return
 * @returns Chunks from current chapter
 */
export async function getChapterContext(
  currentUrl: string,
  topK: number = 5
): Promise<ChunkMetadata[]> {
  const embeddingData = await loadEmbeddings();

  // Extract module and chapter from URL
  // Example: /docs/modules/02-ros2/chapter-01-intro
  const urlMatch = currentUrl.match(/\/modules\/([\w-]+)\/([\w-]+)/);
  if (!urlMatch) {
    return [];
  }

  const [, module, chapterSlug] = urlMatch;

  // Find chunks matching module and chapter
  const chunks = embeddingData.chunks.filter(
    (chunk) => chunk.module === module && chunk.url.includes(chapterSlug)
  );

  // Return first topK chunks
  return chunks.slice(0, topK);
}

/**
 * Generate intelligent question suggestions based on user query and retrieved context.
 *
 * @param userQuery Original user query
 * @param retrievedChunks Context chunks retrieved for the query
 * @param language Language preference
 * @returns Array of suggested follow-up questions
 */
export function generateSuggestions(
  userQuery: string,
  retrievedChunks: ChunkMetadata[],
  language: 'en' | 'ur' = 'en'
): string[] {
  const suggestions: string[] = [];

  if (retrievedChunks.length === 0) {
    return suggestions;
  }

  // Extract topics from chunks
  const topics = new Set<string>();
  const sections = new Set<string>();

  retrievedChunks.forEach((chunk) => {
    sections.add(chunk.section);

    // Extract key technical terms (words with capital letters or hyphens)
    const technicalTerms = chunk.content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (technicalTerms) {
      technicalTerms.slice(0, 3).forEach((term) => topics.add(term));
    }
  });

  // Generate question templates based on language
  const templates = language === 'ur' ? {
    how: (topic: string) => `${topic} کیسے کام کرتا ہے؟`,
    what: (topic: string) => `${topic} کیا ہے؟`,
    why: (topic: string) => `${topic} کیوں استعمال کیا جاتا ہے؟`,
    example: (topic: string) => `${topic} کی مثال دیں`,
    compare: (topic: string) => `${topic} کا موازنہ کریں`,
  } : {
    how: (topic: string) => `How does ${topic} work?`,
    what: (topic: string) => `What is ${topic}?`,
    why: (topic: string) => `Why use ${topic}?`,
    example: (topic: string) => `Can you show an example of ${topic}?`,
    compare: (topic: string) => `Compare different ${topic} approaches`,
  };

  // Generate suggestions from topics
  const topicArray = Array.from(topics).slice(0, 2);
  const sectionArray = Array.from(sections).slice(0, 2);

  // Type 1: Direct topic questions
  topicArray.forEach((topic, idx) => {
    const templateKeys = Object.keys(templates);
    const templateKey = templateKeys[idx % templateKeys.length] as keyof typeof templates;
    suggestions.push(templates[templateKey](topic));
  });

  // Type 2: Section-based questions
  sectionArray.forEach((section) => {
    if (language === 'ur') {
      suggestions.push(`${section} کے بارے میں مزید بتائیں`);
    } else {
      suggestions.push(`Tell me more about ${section}`);
    }
  });

  // Type 3: Related practical questions
  if (language === 'ur') {
    if (userQuery.includes('کیسے') || userQuery.includes('how')) {
      suggestions.push('اس کے عملی استعمال کیا ہیں؟');
    } else if (userQuery.includes('کیا') || userQuery.includes('what')) {
      suggestions.push('اس کے فوائد اور نقصانات کیا ہیں؟');
    }
  } else {
    if (userQuery.toLowerCase().includes('how')) {
      suggestions.push('What are practical applications of this?');
    } else if (userQuery.toLowerCase().includes('what')) {
      suggestions.push('What are the advantages and disadvantages?');
    } else if (userQuery.toLowerCase().includes('code') || userQuery.toLowerCase().includes('example')) {
      suggestions.push('Show me a code example');
    }
  }

  // Return unique suggestions (limit to 4)
  return Array.from(new Set(suggestions)).slice(0, 4);
}
