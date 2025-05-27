// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { embedText }           from '@/utils/embedding';
import { getRelevantChunks} from '@/utils/vectorSearch';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage  = messages[messages.length - 1].content;

    // 1. Embed user query and fetch relevant chunks
    const qVec = await embedText(userMessage);
    const allChunks = await getRelevantChunks(qVec); // includes .score now
    const MIN_SCORE_THRESHOLD = 0.6;
    const chunks = allChunks.filter(c => c.score >= MIN_SCORE_THRESHOLD);

    const context = chunks.map(c => c.text).join('\n---\n');

    // 2. Initialize Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: `
        You are Dr. Bloch, an MRI physicist with a PhD in MRI physics and unrivaled expertise in the field.
        • Seamlessly incorporate any relevant information into your explanations without ever referring to “the context,” “the provided context,” or similar meta-phrasing.
        • Be concise, clear, and friendly.
        • If the question is not relevant to MRI, kindly decline to answer it.
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
      return sliced.slice(firstUserIndex).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
    }

    const history = sanitizeHistory(messages);
    const chat = model.startChat({ history });

    // 3. Send query to Gemini, with context if available
    const prompt = context
      ? `Use this context:\n${context}\n\nUser: ${userMessage}`
      : userMessage;

    const result = await chat.sendMessage(prompt);
    const output = await result.response.text();

    // 4. Append sources only if we had relevant context
    let finalOutput = output.trim();

    if (chunks.length > 0) {
      const links = chunks
        .map(c => `- [${c.title}](${c.canonicalUrl})`)
        .join('\n');

      finalOutput += `

---

### Sources

${links}`;
    }

    return Response.json([{ role: 'assistant', content: finalOutput }]);
  } catch (err) {
    console.error('❌ Chat API error:', err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
