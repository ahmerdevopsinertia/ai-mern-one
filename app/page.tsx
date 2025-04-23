'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...newMessages,
        { role: 'bot', content: data.reply || 'No reply from AI.' },
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...newMessages,
        { role: 'bot', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">💬 AI Staff Assistant</h1>

      <div className="space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">AI is thinking...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 p-2 rounded"
          type="text"
          placeholder="Ask about staff policy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </main>
  );
}
