# outfitter-agent

Local-first demo of a friendly Culture Kings retail associate. The agent runs entirely on public Shopify data and builds cart permalinks while respecting guardrails on category, color, size and budget.

## Persona & flow
- Opens every session with a warm greeting.
- Asks at most two discovery questions per intent to clarify style, size or budget and remembers answers for the session.
- Presents 2–3 verified options and lets the user pick by number.
- After the first pick the agent offers a single upsell (cargo pants, caps or sneakers) and can build a multi-item cart.
- Only Culture Kings (`culturekings.com.au`) data is queried and only in-stock variants are shown.

## Getting started
```bash
pnpm i
cp .env.example .env
pnpm chat
```

## Testing
```bash
pnpm test
```
The test suite covers guardrail verification, selection parsing, cart link generation and an end-to-end shirt→upsell flow.

## Limitations
Public product data only. No private APIs, checkout or payment logic. Use politely and respect site terms of service.
