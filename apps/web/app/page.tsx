'use client';
import React, { useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role:string; content:string}[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const send = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: input }] })
    });
    const data = await res.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);
    setSuggestions(data.suggestions || []);
    setInput('');
  };

  return (
    <main>
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {suggestions.map((s, i) => (
          <div key={i}>
            <div>{s.product.title}</div>
            <div>${(s.product.priceCents / 100).toFixed(2)}</div>
            <a href={s.cartUrl}>Add to cart</a>
          </div>
        ))}
      </div>
    </main>
  );
}
