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
 * Retrieve chunks by keywords (simple text matching).
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

  // Normalize keywords
  const normalizedKeywords = keywords.toLowerCase().trim();
  const keywordTokens = normalizedKeywords.split(/\s+/);

  // Filter chunks
  let chunks = embeddingData.chunks;
  if (moduleFilter) {
    chunks = chunks.filter((chunk) => chunk.module === moduleFilter);
  }

  // Score based on keyword matches
  const results: RetrievalResult[] = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const section = chunk.section.toLowerCase();
    const chapter = chunk.chapter.toLowerCase();

    let score = 0;

    // Count keyword occurrences
    for (const token of keywordTokens) {
      const contentMatches = (content.match(new RegExp(token, 'g')) || []).length;
      const sectionMatches = (section.match(new RegExp(token, 'g')) || []).length;
      const chapterMatches = (chapter.match(new RegExp(token, 'g')) || []).length;

      score += contentMatches * 1.0;
      score += sectionMatches * 2.0; // Higher weight for section
      score += chapterMatches * 1.5; // Medium weight for chapter
    }

    // Normalize by content length
    const normalizedScore = score / (chunk.content.length / 100);

    return {
      chunk,
      similarity: Math.min(normalizedScore, 1.0), // Cap at 1.0
      rank: index,
    };
  });

  // Sort by score
  results.sort((a, b) => b.similarity - a.similarity);

  // Filter out zero scores
  const relevantResults = results.filter((r) => r.similarity > 0);

  // Update ranks
  relevantResults.forEach((result, index) => {
    result.rank = index + 1;
  });

  return relevantResults.slice(0, topK);
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
