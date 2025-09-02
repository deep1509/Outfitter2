export async function httpGet(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      'User-Agent': 'outfitter-agent',
      ...(init?.headers || {})
    }
  });
}
