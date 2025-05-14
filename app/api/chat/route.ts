// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { embedText }             from '@/utils/embedding';
import { getRelevantChunks }     from '@/utils/vectorSearch';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage    = messages[messages.length - 1].content;

    // 1. RAG: embed + fetch relevant context
    const qVec   = await embedText(userMessage);
    const chunks = await getRelevantChunks(qVec);
    const context = chunks.join('\n---\n');

    // 2. Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const chat  = model.startChat({ history: [] });
    const result= await chat.sendMessage(
      `Use this context:\n${context}\n\nUser: ${userMessage}`
    );
    const output = await result.response.text();

    // 3. Return JSON array for one or more assistant messages
    return Response.json([
      { role: 'assistant', content: output }
    ]);

  } catch (err) {
    console.error('❌ Chat API error:', err);
    return new Response(
      JSON.stringify([]),
      { status: 500 }
    );
  }
}
