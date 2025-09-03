import { chat } from './openai.js';
import { serperSearch } from './serper.js';

export async function healthCheck() {
  const results: Record<string, { ok: boolean; error?: string }> = {};

  // Check OpenAI
  try {
    await chat([{ role: 'user', content: 'ping' }]);
    results.openai = { ok: true };
  } catch (err: any) {
    results.openai = { ok: false, error: err.message };
  }

  // Check Serper
  try {
    const site = process.env.ALLOWED_SHOPS?.split(',')[0] || 'example.com';
    await serperSearch('test', site);
    results.serper = { ok: true };
  } catch (err: any) {
    results.serper = { ok: false, error: err.message };
  }

  return results;
}
