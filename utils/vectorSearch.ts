// utils/vectorSearch.ts
import rawData from '../public/embeddings.json';

type Entry = {
  text: string;
  embedding: number[];
  canonicalUrl: string;
  title: string;
};

// This is what getRelevantChunks returns
export type ScoredChunk = {
  text: string;
  title: string;
  canonicalUrl: string;
  score: number;
};

const vectorData = rawData as Entry[];

function cosine(a: number[], b: number[]) {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const mag = (v: number[]) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return dot / (mag(a) * mag(b));
}

export async function getRelevantChunks(
  queryEmbedding: number[],
  topK = 3
): Promise<ScoredChunk[]> {
  return vectorData
    .map(e => ({
      text: e.text,
      score: cosine(e.embedding, queryEmbedding),
      canonicalUrl: e.canonicalUrl,
      title: e.title,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
