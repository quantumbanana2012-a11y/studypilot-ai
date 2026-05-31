# Deployment

ZentraDeck AI is configured as a free public web app. The server handles accounts, saved kits, AI routing, research lookup, and static app hosting.

## Render

1. Connect the GitHub repository.
2. Use the included `render.yaml` blueprint.
3. Set these environment variables:

```bash
PUBLIC_BASE_URL=https://your-render-url.onrender.com
MODEL_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash
```

Optional:

```bash
ADS_ENABLED=false
ADSENSE_CLIENT_ID=
ADSENSE_SIDEBAR_SLOT=
ADSENSE_WORKSPACE_SLOT=
```

## Checks

Run before pushing:

```bash
npm run check
npm start
```

Then verify:

```bash
curl http://127.0.0.1:4174/api/health
curl http://127.0.0.1:4174/api/config
```

## Launch Notes

- Payment and upgrade flows are removed.
- The Upgrade button is removed from the app shell.
- Gemini is the default hosted AI provider.
- Render free instances can spin down after inactivity, so the first request after idle time may be slow.
