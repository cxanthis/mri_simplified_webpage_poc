// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { embedText }             from '@/utils/embedding';
import { getRelevantChunks }     from '@/utils/vectorSearch';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages }          = await req.json();
    const userMessage           = messages[messages.length - 1].content;

    // 1. RAG: embed + fetch relevant context
    const qVec   = await embedText(userMessage);
    const chunks = await getRelevantChunks(qVec);
    const context = chunks.join('\n---\n');

    // 2. Call Gemini with a system prompt
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: `
        You are Dr. Bloch, an MRI physicist with a PhD in MRI physics and unrivaled expertise in the field.
        • Seamlessly incorporate any relevant information into your explanations without ever referring to “the context,” “the provided context,” or similar meta-phrasing.
        • Be concise, clear, and friendly.
        • If you lack enough detail to answer fully, that is fine.
        • You don't have to close your answer with more questions just to keep the flow.
        • When the user closes the discussion, don't try to engage in more.
        • If the user responds with vague or polite acknowledgments (e.g. "thanks", "okay", "sure", "got it"), do not introduce new topics. Instead, either say goodbye or await further specific input.
      `,
    }); 

    function sanitizeHistory(messages: ChatMessage[]) {
      const sliced = messages.slice(-6, -1);
      const firstUserIndex = sliced.findIndex(msg => msg.role === 'user');
      if (firstUserIndex === -1) return [];

      const trimmed = sliced.slice(firstUserIndex);
      return trimmed.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
    }

    const history = sanitizeHistory(messages);

    const chat = model.startChat({ history })
    
    // compose the user turn, grounding in RAG context
    const result = await chat.sendMessage(
      `Use this context:\n${context}\n\nUser: ${userMessage}`
    );
    const output = await result.response.text();

    // 3. Return assistant reply
    return Response.json([{ role: 'assistant', content: output }]);
  } catch (err) {
    console.error('❌ Chat API error:', err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
