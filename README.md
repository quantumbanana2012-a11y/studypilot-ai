# SynapseDeck AI

Luxury AI study app with generated study kits, flashcards, quizzes, games, calculator, assistant chat, Obsidian export, beta accounts, saved kits, and Stripe-ready monetization.

## Run Locally

```bash
npm install
npm start
```

Open:

```text
http://127.0.0.1:4174
```

## Production Environment

Use a Node host such as Render, Railway, Fly.io, DigitalOcean App Platform, or a VPS.

Required for launch with free cloud AI:

```bash
PUBLIC_BASE_URL=https://your-domain.com
MODEL_PROVIDER=compatible
COMPATIBLE_API_BASE_URL=https://openrouter.ai/api/v1
COMPATIBLE_API_KEY=sk-or-v1_...
COMPATIBLE_MODEL=openrouter/free
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_SCHOOL_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
DATABASE_PATH=./data/synapsedeck-db.json
ADS_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-...
ADSENSE_SIDEBAR_SLOT=...
ADSENSE_WORKSPACE_SLOT=...
```

## Ads

Free users see AdSense placements when `ADS_ENABLED=true` and the AdSense client/slot IDs are configured. Pro and School users do not see ads.

Default hosted AI option:

```bash
MODEL_PROVIDER=compatible
COMPATIBLE_API_BASE_URL=https://openrouter.ai/api/v1
COMPATIBLE_API_KEY=sk-or-v1_...
COMPATIBLE_MODEL=openrouter/free
```

OpenAI option:

```bash
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-proj_...
OPENAI_MODEL=gpt-5-mini
```

## Deploy

Render Blueprint is included:

```text
render.yaml
```

Docker deploy is included:

```bash
docker build -t synapsedeck-ai .
docker run -p 4174:4174 --env-file .env synapsedeck-ai
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full launch checklist.
