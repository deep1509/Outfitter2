export async function chat(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return 'OpenAI API key missing.';
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI error: ${res.status}`);
  }
  const data: any = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
