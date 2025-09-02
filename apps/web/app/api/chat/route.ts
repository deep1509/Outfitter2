import { runAgent } from '@agent/graph';

export async function POST(req: Request) {
  const body = await req.json();
  const result = await runAgent(body.messages);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}
