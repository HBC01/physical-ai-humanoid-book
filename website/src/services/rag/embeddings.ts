/**
 * RAG Embeddings Service
 *
 * Loads pre-computed embeddings for client-side retrieval.
 */

export interface ChunkMetadata {
  module: string;
  chapter: string;
  section: string;
  chunk_index: number;
  content: string;
  file_path: string;
  url: string;
  embedding: number[];
}

export interface EmbeddingData {
  model: string;
  embedding_dim: number;
  chunk_size: number;
  overlap: number;
  total_chunks: number;
  chunks: ChunkMetadata[];
}

let cachedEmbeddings: EmbeddingData | null = null;
let loadingPromise: Promise<EmbeddingData> | null = null;

/**
 * Load embeddings from static JSON file.
 * Uses singleton pattern to avoid multiple fetches.
 */
export async function loadEmbeddings(): Promise<EmbeddingData> {
  // Return cached if available
  if (cachedEmbeddings) {
    return cachedEmbeddings;
  }

  // Return existing promise if loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start new load
  loadingPromise = fetch('/embeddings.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load embeddings: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data: EmbeddingData) => {
      cachedEmbeddings = data;
      loadingPromise = null;
      console.log(`Loaded ${data.total_chunks} chunks with ${data.embedding_dim}D embeddings`);
      return data;
    })
    .catch((error) => {
      loadingPromise = null;
      console.error('Error loading embeddings:', error);
      throw error;
    });

  return loadingPromise;
}

/**
 * Get embeddings synchronously if already loaded.
 * Returns null if not loaded yet.
 */
export function getEmbeddingsSync(): EmbeddingData | null {
  return cachedEmbeddings;
}

/**
 * Check if embeddings are loaded.
 */
export function isEmbeddingsLoaded(): boolean {
  return cachedEmbeddings !== null;
}

/**
 * Clear cached embeddings (useful for testing).
 */
export function clearEmbeddingsCache(): void {
  cachedEmbeddings = null;
  loadingPromise = null;
}
