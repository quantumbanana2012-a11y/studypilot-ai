# ZentraDeck AI Release Plan

## What Is Production-Ready Now

- Static app served by `server.js`
- Hosted cloud model endpoint for production
- Stripe Checkout endpoint for Pro and School subscriptions
- Stripe webhook endpoint at `/api/billing/webhook`
- Razorpay Checkout endpoint for India-friendly payments
- Email/password accounts for private beta
- Server-side saved latest kit per account
- AdSense-ready ad slots for Starter users
- Starter / Pro / School pricing UI
- Paid plans unlock only after a payment provider is configured and checkout succeeds

## Monetization Setup

Use Stripe Checkout for subscriptions. Stripe Checkout creates a hosted payment page from a server-created Checkout Session, and Stripe recommends creating a new Session each time a customer attempts to pay.

Required Stripe objects:

- Product: `ZentraDeck Pro`
- Recurring monthly Price for Pro
- Product: `ZentraDeck School`
- Recurring monthly Price for School

Set these environment variables:

```bash
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
PUBLIC_BASE_URL=https://your-domain.com
DATABASE_PATH=./data/zentradeck-db.json
ADS_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-...
ADSENSE_SIDEBAR_SLOT=...
ADSENSE_WORKSPACE_SLOT=...
DONATION_URL=https://...
DONATION_UPI_ID=name@bank
```

The current checkout flow redirects to:

- `https://your-domain.com/index.html?billing=success&plan=pro`
- `https://your-domain.com/index.html?billing=cancelled`

Webhook URL:

```text
https://your-domain.com/api/billing/webhook
```

Razorpay webhook URL:

```text
https://your-domain.com/api/billing/razorpay/webhook
```

Listen for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

Razorpay can be used instead of Stripe for India payments. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`; the frontend will prefer Razorpay checkout when it is configured.

If KYC is blocked, use donations temporarily:

```bash
DONATION_URL=https://your-support-link
DONATION_UPI_ID=name@bank
DONATION_LABEL=Support ZentraDeck
```

## Must Add Before Real Launch

1. Durable database
   The beta build uses a JSON file database. Move users, kits, sessions, and Stripe customer records to Postgres/Supabase/Neon before real traffic.

2. Customer portal
   Add a billing management button so users can update payment methods, download invoices, change plans, and cancel.

3. Hosted model provider
   For a free cloud setup, use `MODEL_PROVIDER=compatible` with OpenRouter's free model router. You can also swap to Groq or Hugging Face with the same OpenAI-compatible backend shape, or use `MODEL_PROVIDER=openai` with `OPENAI_MODEL=gpt-5-mini` when you are ready to pay for steadier production capacity.

No-cost compatible model example:

```bash
MODEL_PROVIDER=compatible
COMPATIBLE_API_BASE_URL=https://openrouter.ai/api/v1
COMPATIBLE_API_KEY=sk-or-v1_...
COMPATIBLE_MODEL=openrouter/free
```

Groq-compatible example:

```bash
MODEL_PROVIDER=compatible
COMPATIBLE_API_BASE_URL=https://api.groq.com/openai/v1
COMPATIBLE_API_KEY=gsk_...
COMPATIBLE_MODEL=llama-3.1-8b-instant
```

4. Usage limits
   Add monthly assistant/message counters server-side so free cloud model usage does not become unlimited cost or abuse.

5. AdSense approval
   Deploy on a real domain, add privacy/contact pages, submit the domain to AdSense, then turn on `ADS_ENABLED=true` after Google approves the site and gives you slot IDs.

## Ad Revenue Setup

The app is wired for AdSense Auto/manual placements:

- Sidebar ad for Starter users
- Workspace banner ad for Starter users
- No ads for Pro and School users
- `/api/ads/config` exposes the public AdSense client and slot IDs
- `/ads.txt` is generated from `ADSENSE_CLIENT_ID`

Google says AdSense requires access to your page HTML and you add the ad code to the site; Auto ads can be set up from the AdSense Ads page. See:

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724)
- [Set up Auto ads](https://support.google.com/adsense/answer/9261307)

## Suggested Paywall

Starter:
- 8 cards per kit
- Match game
- basic quiz
- plain export

Pro:
- 16 cards per kit
- assistant chat
- Sprint and Type games
- Obsidian export
- challenge mode
- saved kit history

School:
- everything in Pro
- class workspaces
- teacher dashboard
- roster import
- cohort analytics

## Local Run

```bash
npm start
```

Open:

```text
http://127.0.0.1:4174
```

For the AI assistant, use a hosted cloud key even in local testing:

```bash
MODEL_PROVIDER=compatible
COMPATIBLE_API_BASE_URL=https://openrouter.ai/api/v1
COMPATIBLE_API_KEY=sk-or-v1_...
COMPATIBLE_MODEL=openrouter/free
```

## Deployment Target

Use a Node-capable host because the Stripe secret key and model routing must live on the server, not in browser JavaScript.

Good fits:
- Render
- Railway
- Fly.io
- DigitalOcean App Platform
- VPS with Caddy or Nginx

Static-only hosting is not enough for monetization because Checkout Sessions must be created server-side.

## Render Deploy

This repo includes `render.yaml`.

1. Push the project to GitHub.
2. In Render, choose **New Blueprint**.
3. Select the GitHub repo.
4. Set these environment variables:
   - `PUBLIC_BASE_URL`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_SCHOOL_PRICE_ID`
5. Deploy.

## Docker Deploy

This repo includes a `Dockerfile`.

```bash
docker build -t zentradeck-ai .
docker run -p 4174:4174 --env-file .env zentradeck-ai
```
