import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import type { Message } from '../../packages/agent/types.js';
import { runAgent } from '../../packages/agent/graph.js';
import { healthCheck } from '../../packages/services/health.js';

async function main() {
  const rl = readline.createInterface({ input, output });
  const messages: Message[] = [];
  console.log('Welcome to outfitter-agent CLI. Type your request, or Ctrl+C to exit.');

  // Pre-flight check for external services
  const health = await healthCheck();
  for (const [service, result] of Object.entries(health)) {
    if (result.ok) {
      console.log(`${service}: ok`);
    } else {
      console.log(`${service}: error - ${result.error}`);
    }
  }

  while (true) {
    const user = await rl.question('You: ');
    messages.push({ role: 'user', content: user });
    const res = await runAgent(messages);
    console.log('Agent:', res.message);
    messages.push({ role: 'assistant', content: res.message });
    if (res.debug?.length) {
      console.log('Debug:');
      for (const d of res.debug) console.log(' ', d);
    }
    if (res.suggestions?.length) {
      console.log('Suggestions:');
      for (const s of res.suggestions) {
        console.log(`- ${s.product.title} - ${s.cartUrl}`);
      }
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
