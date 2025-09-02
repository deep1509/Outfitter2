# outfitter-agent

Local-first demo of an agentic shopper for apparel. The agent queries public Shopify data and builds cart permalinks while respecting guardrails on category, color, size and budget.

## Getting started

```bash
pnpm i
cp .env.example .env
pnpm dev
```

For a local chatbot interface powered by Gardio (using Gradio under the hood), run:

```bash
pip install -r apps/gardio/requirements.txt
python apps/gardio/app.py
```

## What's included
- LangGraph-style workflow with guardrails
- Serper discovery (Google results)
- Shopify JSON/HTML parsing
- Cart permalink generation
- Vitest unit tests

## Limitations
Public product data only. Structure may change. No checkout or payment logic. Use politely and respect site terms of service.
