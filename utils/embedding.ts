// utils/embedding.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = 'models/embedding-001';

/** Return an embedding vector for a single text chunk. */
export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const res = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
  });

  return res.embedding.values;
}
