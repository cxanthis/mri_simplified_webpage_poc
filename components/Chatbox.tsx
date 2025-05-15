// components/Chatbox.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbox() {
  // ← Clerk hook now at top level
  const { isSignedIn } = useUser();

  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(false);
  const [expanded, setExpanded]     = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleToggleOpen = () => {
    if (expanded) setIsMaximized(false);
    setExpanded(prev => !prev);
    if (!expanded) setShowTooltip(false);
  };

  const handleToggleSize = () => setIsMaximized(prev => !prev);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
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
      if (!res.ok) throw new Error('Network response was not ok');
      const data: Message[] = await res.json();
      setMessages(prev => [...prev, ...data]);
    } catch (err) {
      console.error('Chat error', err);
      setError(true);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  // Size classes: default 50% taller & 20% wider; expanded unchanged
  const sizeClasses = expanded
    ? isMaximized
      ? 'w-[640px] h-[768px]'
      : 'w-[384px] h-[576px]'
    : '';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`transition-all duration-300 ${sizeClasses}`}>
        {expanded ? (
          <div className="relative flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* ONLY REGISTERED USERS CAN CHAT */}
            {!isSignedIn && (
              <div className="absolute top-12 inset-x-0 bottom-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-2xl">
                <div className="text-center text-gray-800">
                  Please <b>register or login</b> <br/> to chat for free
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between bg-gray-100 p-3 border-b border-gray-200">
              <h2 className="text-xl font-semibold">💬 Chat with Dr. Bloch</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleSize}
                  aria-label={isMaximized ? 'Restore size' : 'Maximize'}
                >
                  {isMaximized ? (
                    <ArrowsPointingInIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                  )}
                </button>
                <button onClick={handleToggleOpen} aria-label="Minimize chat">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600 hover:text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div id="chat-messages" className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`${
                      m.role === 'assistant' ? 'bg-white text-gray-900' : 'bg-blue-600 text-white'
                    } rounded-lg p-3 max-w-[75%] shadow`}
                  >
                  <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 max-w-[75%] shadow flex items-center">
                    <span className="text-base text-gray-500 mr-2">Thinking</span>
                    <span className="flex space-x-1">
                      <span className="dot animate-pulse delay-0" />
                      <span className="dot animate-pulse delay-200" />
                      <span className="dot animate-pulse delay-400" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ask something..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || !isSignedIn}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base rounded-full px-4 py-2 disabled:opacity-50"
              >
                Send
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-center p-2">Something went wrong. Please try again.</p>
            )}
          </div>
        ) : (
          <div className="relative flex items-center">
            {showTooltip && (
              <div className="absolute bottom-full right-1 mb-4 w-48 bg-white text-gray-900 text-base rounded-2xl p-2 shadow-2xl border border-gray-200">
                Chat with Dr. Bloch about any topic covered in MRI Simplified
                <div
                  className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"
                />
              </div>
            )}
            <button
              onClick={handleToggleOpen}
              aria-label="Open chat"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #4b5563; /* gray-600 */
          border-radius: 9999px;
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          40% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
