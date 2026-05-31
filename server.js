const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = __dirname;
const dataDir = path.join(root, "data");

function loadDotenvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotenvFile(path.join(root, ".env"));

const databasePath = process.env.DATABASE_PATH || path.join(dataDir, "zentradeck-db.json");
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "0.0.0.0";
const modelProvider = process.env.MODEL_PROVIDER
  || (process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "compatible");
const openaiModel = process.env.OPENAI_MODEL || "gpt-5-mini";
const openaiApiKey = process.env.OPENAI_API_KEY || "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const compatibleApiBaseUrl = process.env.COMPATIBLE_API_BASE_URL || "https://openrouter.ai/api/v1";
const compatibleApiKey = process.env.COMPATIBLE_API_KEY || process.env.OPENROUTER_API_KEY || process.env.HUGGINGFACE_API_KEY || "";
const compatibleModel = process.env.COMPATIBLE_MODEL || "openrouter/free";
const compatibleFallbackModels = (process.env.COMPATIBLE_FALLBACK_MODELS || "google/gemma-3-27b-it:free,meta-llama/llama-3.3-70b-instruct:free,mistralai/mistral-7b-instruct:free")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const modelTimeoutMs = Number(process.env.MODEL_TIMEOUT_MS || 35000);
const ollamaModel = process.env.OLLAMA_MODEL || "qwen3:8b-q4_K_M";
const ollamaHost = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${port}`;
const adsenseClientId = process.env.ADSENSE_CLIENT_ID || "";
const adsenseSidebarSlot = process.env.ADSENSE_SIDEBAR_SLOT || "";
const adsenseWorkspaceSlot = process.env.ADSENSE_WORKSPACE_SLOT || "";
const adsEnabled = process.env.ADS_ENABLED === "true" || Boolean(adsenseClientId);
const conversations = new Map();

function ensureDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify({ users: [], sessions: [], kits: [] }, null, 2));
  }
}

function readDatabase() {
  ensureDatabase();
  try {
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
  } catch {
    return { users: [], sessions: [], kits: [] };
  }
}

function writeDatabase(database) {
  ensureDatabase();
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

function randomId(prefix) {
  return `${prefix}_${crypto.randomBytes(16).toString("hex")}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || "").split(":");
  if (!salt || !hash) {
    return false;
  }
  const candidate = hashPassword(password, salt).split(":")[1];
  if (candidate.length !== hash.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

function publicUser(user) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    plan: user.plan || "free",
    createdAt: user.createdAt
  };
}

function getBearerToken(request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

function findSessionUser(request, database = readDatabase()) {
  const token = getBearerToken(request);
  if (!token) {
    return { database, user: null, session: null };
  }
  const session = database.sessions.find((item) => item.token === token);
  if (!session) {
    return { database, user: null, session: null };
  }
  const user = database.users.find((item) => item.id === session.userId);
  return { database, user, session };
}

function fetchWithTimeout(url, options = {}, timeoutMs = modelTimeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

function activeModelName() {
  if (modelProvider === "openai") {
    return openaiModel;
  }
  if (modelProvider === "gemini") {
    return geminiModel;
  }
  if (modelProvider === "compatible") {
    return compatibleModel;
  }
  return ollamaModel;
}

function activeModelReady() {
  if (modelProvider === "openai") {
    return Boolean(openaiApiKey);
  }
  if (modelProvider === "gemini") {
    return Boolean(geminiApiKey);
  }
  if (modelProvider === "compatible") {
    return Boolean(compatibleApiKey);
  }
  return false;
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, text, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType
  });
  response.end(text);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body too large."));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function studyPrompt({ message, notes, kit }) {
  const terms = (kit?.terms || []).slice(0, 12).map((item) => item.term || item).join(", ");
  const summary = (kit?.summary || []).join("\n- ");
  const weak = (kit?.flashcards || [])
    .filter((card) => ["missed", "hard", "shaky", "new"].includes(card.mastery))
    .slice(0, 6)
    .map((card) => `${card.term}: ${card.answer}`)
    .join("\n");

  return [
    `Student request: ${message}`,
    "",
    "Generated kit context:",
    `Goal: ${kit?.focus || "unknown"}`,
    `Difficulty: ${kit?.difficulty || "unknown"}`,
    `Terms: ${terms || "none"}`,
    summary ? `Summary:\n- ${summary}` : "Summary: none",
    weak ? `Weak/new cards:\n${weak}` : "Weak/new cards: none",
    "",
    `Source notes:\n${String(notes || "").slice(0, 12000)}`
  ].join("\n");
}

function systemPrompt() {
  return [
    "You are ZentraDeck's always-on AI tutor.",
    "Act like a patient study coach, not a generic chatbot.",
    "Ground answers in the user's notes and generated kit whenever possible.",
    "If asked to generate notes, produce useful study notes, headings, bullets, and recall prompts.",
    "If the notes do not contain enough information, say what is missing and offer a useful next study action.",
    "Prefer concise explanations, hints, practice questions, and step-by-step teaching.",
    "Do not invent facts beyond the provided study material unless clearly labeled as general background."
  ].join(" ");
}

function compactHistory(history) {
  return history.slice(-10);
}

function openAiText(payload) {
  if (payload.output_text) {
    return payload.output_text;
  }
  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}

async function runOpenAiAssistant(body, history) {
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const input = [
    { role: "system", content: systemPrompt() },
    ...compactHistory(history),
    { role: "user", content: studyPrompt(body) }
  ];

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openaiModel,
      input,
      reasoning: { effort: "minimal" },
      text: { verbosity: "medium" },
      max_output_tokens: 900
    })
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(payload.error?.message || "OpenAI request failed.");
  }

  return {
    text: openAiText(payload) || "I could not produce a response.",
    model: openaiModel,
    provider: "openai"
  };
}

async function runOllamaAssistant(body, history) {
  const messages = [
    { role: "system", content: systemPrompt() },
    ...compactHistory(history),
    { role: "user", content: studyPrompt(body) }
  ];

  const apiResponse = await fetch(`${ollamaHost}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: ollamaModel,
      messages,
      stream: false,
      keep_alive: "30m",
      options: {
        temperature: 0.35,
        num_ctx: 8192
      }
    })
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(payload.error || "Ollama request failed.");
  }

  return {
    text: payload.message?.content || "I could not produce a response.",
    model: ollamaModel,
    provider: "ollama"
  };
}

async function runCompatibleAssistant(body, history) {
  if (!compatibleApiKey) {
    throw new Error("COMPATIBLE_API_KEY is not configured.");
  }

  const messages = [
    { role: "system", content: systemPrompt() },
    ...compactHistory(history),
    { role: "user", content: studyPrompt(body) }
  ];

  const models = Array.from(new Set([compatibleModel, ...compatibleFallbackModels]));
  const errors = [];

  for (const model of models) {
    try {
      const apiResponse = await fetchWithTimeout(`${compatibleApiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${compatibleApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": publicBaseUrl,
          "X-Title": "ZentraDeck AI"
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.35,
          max_tokens: 900,
          route: "fallback",
          models
        })
      });

      const payload = await apiResponse.json().catch(() => ({}));
      if (!apiResponse.ok) {
        throw new Error(payload.error?.message || payload.error || `Model ${model} failed.`);
      }

      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) {
        throw new Error(`Model ${model} returned an empty response.`);
      }

      return {
        text,
        model: payload.model || model,
        provider: "compatible"
      };
    } catch (error) {
      errors.push(`${model}: ${error.name === "AbortError" ? "timeout" : error.message}`);
    }
  }

  throw new Error(`All cloud models failed. ${errors.join(" | ")}`);
}

async function runGeminiAssistant(body, history) {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const historyText = compactHistory(history)
    .map((item) => `${item.role === "assistant" ? "Assistant" : "Student"}: ${item.content}`)
    .join("\n");
  const prompt = [
    systemPrompt(),
    historyText ? `Recent conversation:\n${historyText}` : "",
    studyPrompt(body)
  ].filter(Boolean).join("\n\n");

  const apiResponse = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 900
        }
      })
    }
  );

  const payload = await apiResponse.json().catch(() => ({}));
  if (!apiResponse.ok) {
    const message = payload.error?.message || "Gemini request failed.";
    const error = new Error(message.includes("quota") || payload.error?.status === "RESOURCE_EXHAUSTED"
      ? "Gemini quota is exhausted for this API key/project. Check Google AI Studio billing or use another model/key."
      : message);
    error.statusCode = apiResponse.status;
    throw error;
  }

  const text = (payload.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();

  return {
    text: text || "I could not produce a response.",
    model: geminiModel,
    provider: "gemini"
  };
}

async function handleAssistant(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const sessionId = body.sessionId || "default";
  const history = conversations.get(sessionId) || [];
  const result = modelProvider === "openai"
    ? await runOpenAiAssistant(body, history)
    : modelProvider === "gemini"
      ? await runGeminiAssistant(body, history)
    : modelProvider === "compatible"
      ? await runCompatibleAssistant(body, history)
      : await runOllamaAssistant(body, history);

  conversations.set(sessionId, [
    ...history,
    { role: "user", content: body.message || "" },
    { role: "assistant", content: result.text }
  ].slice(-16));
  sendJson(response, 200, {
    text: result.text,
    model: result.model,
    provider: result.provider
  });
}

async function handleSignup(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(response, 400, { error: "Enter a valid email address." });
    return;
  }
  if (password.length < 8) {
    sendJson(response, 400, { error: "Password must be at least 8 characters." });
    return;
  }

  const database = readDatabase();
  if (database.users.some((user) => user.email === email)) {
    sendJson(response, 409, { error: "That email already has an account. Sign in instead." });
    return;
  }

  const user = {
    id: randomId("user"),
    email,
    passwordHash: hashPassword(password),
    plan: "free",
    createdAt: new Date().toISOString()
  };
  const session = {
    token: randomId("session"),
    userId: user.id,
    createdAt: new Date().toISOString()
  };
  database.users.push(user);
  database.sessions.push(session);
  writeDatabase(database);
  sendJson(response, 200, { token: session.token, user: publicUser(user) });
}

async function handleLogin(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const database = readDatabase();
  const user = database.users.find((item) => item.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    sendJson(response, 401, { error: "Email or password is wrong." });
    return;
  }
  const session = {
    token: randomId("session"),
    userId: user.id,
    createdAt: new Date().toISOString()
  };
  database.sessions.push(session);
  writeDatabase(database);
  sendJson(response, 200, { token: session.token, user: publicUser(user) });
}

function handleMe(request, response) {
  const { user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Sign in required." });
    return;
  }
  sendJson(response, 200, { user: publicUser(user) });
}

async function handleLogout(request, response) {
  const token = getBearerToken(request);
  const database = readDatabase();
  database.sessions = database.sessions.filter((session) => session.token !== token);
  writeDatabase(database);
  sendJson(response, 200, { ok: true });
}

function handleGetKit(request, response) {
  const { database, user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Sign in required." });
    return;
  }
  const latest = database.kits
    .filter((kit) => kit.userId === user.id)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
  sendJson(response, 200, { kit: latest?.payload || null, updatedAt: latest?.updatedAt || "" });
}

async function handleSaveKit(request, response) {
  const { database, user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Sign in required." });
    return;
  }
  const body = JSON.parse(await readBody(request) || "{}");
  const existing = database.kits.find((kit) => kit.userId === user.id);
  const payload = {
    notes: String(body.notes || "").slice(0, 200000),
    focus: body.focus || "exam",
    difficulty: body.difficulty || "balanced",
    session: body.session || "25",
    cardCount: body.cardCount || "8",
    quizMode: body.quizMode || "mixed",
    examDate: body.examDate || "",
    kit: body.kit || null
  };
  if (existing) {
    existing.payload = payload;
    existing.updatedAt = new Date().toISOString();
  } else {
    database.kits.push({
      id: randomId("kit"),
      userId: user.id,
      payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  writeDatabase(database);
  sendJson(response, 200, { ok: true, savedAt: new Date().toISOString() });
}

async function handleResearch(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const terms = (body.kit?.terms || []).map((item) => item.term || item).filter(Boolean);
  const query = String(body.query || terms.slice(0, 3).join(" ") || body.kit?.focus || "study topic").trim();
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=6&prop=extracts|info&exintro=1&explaintext=1&inprop=url&format=json&origin=*`;
  const apiResponse = await fetch(url, {
    headers: {
      "User-Agent": "ZentraDeckAI/0.1 educational reference lookup"
    }
  });
  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(payload.error?.info || "Research lookup failed.");
  }
  const pages = Object.values(payload.query?.pages || {})
    .sort((a, b) => (a.index || 0) - (b.index || 0))
    .map((page) => ({
      title: page.title,
      url: page.fullurl,
      snippet: String(page.extract || "No summary available.").slice(0, 360)
    }));
  sendJson(response, 200, {
    query,
    provider: "wikipedia",
    results: pages
  });
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requestedPath));

  const relativePath = path.relative(root, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 200, {});
      return;
    }

    if (request.url === "/ads.txt") {
      if (!adsenseClientId) {
        sendText(response, 200, "# Add ADSENSE_CLIENT_ID after Google AdSense approval.\n");
        return;
      }
      const publisherId = adsenseClientId.replace(/^ca-/, "");
      sendText(response, 200, `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`);
      return;
    }

    if (request.url === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        app: "ZentraDeck AI",
        provider: modelProvider,
        model: activeModelName(),
        modelReady: activeModelReady(),
        adsReady: Boolean(adsEnabled && adsenseClientId),
        accountsReady: true,
        database: path.basename(databasePath),
        uptimeSeconds: Math.round(process.uptime())
      });
      return;
    }

    if (request.url === "/api/auth/signup" && request.method === "POST") {
      await handleSignup(request, response);
      return;
    }

    if (request.url === "/api/auth/login" && request.method === "POST") {
      await handleLogin(request, response);
      return;
    }

    if (request.url === "/api/auth/logout" && request.method === "POST") {
      await handleLogout(request, response);
      return;
    }

    if (request.url === "/api/account" && request.method === "GET") {
      handleMe(request, response);
      return;
    }

    if (request.url === "/api/kits/latest" && request.method === "GET") {
      handleGetKit(request, response);
      return;
    }

    if (request.url === "/api/kits/latest" && request.method === "POST") {
      await handleSaveKit(request, response);
      return;
    }

    if (request.url === "/api/config") {
      if (modelProvider === "compatible") {
        sendJson(response, 200, {
          model: compatibleModel,
          fallbackModels: compatibleFallbackModels,
          provider: "compatible",
          ready: Boolean(compatibleApiKey),
          websiteReady: Boolean(compatibleApiKey),
          baseUrl: compatibleApiBaseUrl,
          timeoutMs: modelTimeoutMs
        });
        return;
      }

      if (modelProvider === "openai") {
        sendJson(response, 200, {
          model: openaiModel,
          provider: "openai",
          ready: Boolean(openaiApiKey),
          websiteReady: Boolean(openaiApiKey)
        });
        return;
      }

      if (modelProvider === "gemini") {
        sendJson(response, 200, {
          model: geminiModel,
          provider: "gemini",
          ready: Boolean(geminiApiKey),
          websiteReady: Boolean(geminiApiKey),
          timeoutMs: modelTimeoutMs
        });
        return;
      }

      try {
        const tags = await fetch(`${ollamaHost}/api/tags`);
        const payload = await tags.json();
        const available = (payload.models || []).some((item) => item.name === ollamaModel || item.model === ollamaModel);
        sendJson(response, 200, {
          model: ollamaModel,
          provider: "ollama",
          ready: tags.ok && available,
          available,
          websiteReady: false
        });
      } catch (error) {
        sendJson(response, 200, {
          model: ollamaModel,
          provider: "ollama",
          ready: false,
          websiteReady: false,
          error: error.message
        });
      }
      return;
    }

    if (request.url === "/api/ads/config") {
      sendJson(response, 200, {
        provider: "adsense",
        enabled: adsEnabled && Boolean(adsenseClientId),
        clientId: adsenseClientId,
        sidebarSlot: adsenseSidebarSlot,
        workspaceSlot: adsenseWorkspaceSlot
      });
      return;
    }

    if (request.url === "/api/research" && request.method === "POST") {
      await handleResearch(request, response);
      return;
    }

    if (request.url === "/api/assistant" && request.method === "POST") {
      await handleAssistant(request, response);
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    sendJson(response, statusCode, {
      error: error.message || "Server error.",
      model: activeModelName(),
      provider: modelProvider
    });
  }
});

server.listen(port, host, () => {
  console.log(`ZentraDeck server running on ${host}:${port}`);
  console.log(`Model provider: ${modelProvider}`);
  console.log(`OpenAI model: ${openaiModel}`);
  console.log(`Gemini model: ${geminiModel}`);
  console.log(`Compatible model: ${compatibleModel}`);
  console.log(`Ollama model: ${ollamaModel}`);
  console.log(`Ollama host: ${ollamaHost}`);
});
