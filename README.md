# ZentraDeck AI

Free AI study workspace for turning notes, PDFs, and class material into recall cards, quizzes, games, visual references, review plans, and tutor chat.

## Run Locally

```bash
npm install
npm start
```

Open `http://127.0.0.1:4174/index.html`.

## Environment

```bash
PORT=4174
HOST=0.0.0.0
PUBLIC_BASE_URL=https://your-domain.com
DATABASE_PATH=./data/zentradeck-db.json

MODEL_PROVIDER=gemini
GEMINI_API_KEY=replace_me
GEMINI_MODEL=gemini-2.0-flash

MODEL_TIMEOUT_MS=35000
ADS_ENABLED=false
```

Gemini is the default hosted provider. OpenAI-compatible routers and Ollama are still supported for development through `MODEL_PROVIDER=compatible` or `MODEL_PROVIDER=ollama`.

## Features

- File import for notes, Markdown, text, and PDF material
- AI tutor chat with local fallback responses
- Summary, active-recall cards, quizzes, custom quizzes, and review plans
- Study games including match, order, type, rapid fire, and Quest Board
- Visual reference generation from study topics
- Web research lookup for related material
- Calculator workspace
- Free account sync for saved kits and progress
- Obsidian export and collaboration prep

## Deploy

Use `render.yaml` on Render or any Node-capable host.

Required for hosted AI:

```bash
MODEL_PROVIDER=gemini
GEMINI_API_KEY=your_key
PUBLIC_BASE_URL=https://your-live-site
```

The app currently ships as a free product. Payment and upgrade flows are intentionally removed.
