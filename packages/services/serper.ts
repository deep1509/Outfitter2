export async function serperSearch(query: string, site: string): Promise<string[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error('SERPER_API_KEY missing');
  }
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
    },
    body: JSON.stringify({ q: `${query} site:${site}` })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Serper error: ${res.status} ${text}`);
  }
  const data: any = await res.json();
  return (data.organic || []).map((o: any) => o.link);
}
