// components/Chatbox.tsx
'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error();
      const data: Message[] = await res.json();
      setMessages(prev => [...prev, ...data]);
    } catch {
      console.error('Chat error');
      setError(true);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">💬 Ask about our content</h2>

      <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((m, i) => (
          <p key={i} className="whitespace-pre-wrap">
            <strong>{m.role === 'user' ? 'You' : 'Dr. Bloch'}:</strong> {m.content}
          </p>
        ))}
        {loading && <p><em>Thinking…</em></p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Ask something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || input.trim() === ''}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">Something went wrong.</p>}
    </div>
  );
}
