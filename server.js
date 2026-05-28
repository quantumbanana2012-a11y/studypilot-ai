const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = __dirname;
const dataDir = path.join(root, "data");
const databasePath = process.env.DATABASE_PATH || path.join(dataDir, "synapsedeck-db.json");
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "0.0.0.0";
const modelProvider = process.env.MODEL_PROVIDER
  || (process.env.OPENAI_API_KEY ? "openai" : "compatible");
const openaiModel = process.env.OPENAI_MODEL || "gpt-5-mini";
const openaiApiKey = process.env.OPENAI_API_KEY || "";
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
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID || "";
const stripeSchoolPriceId = process.env.STRIPE_SCHOOL_PRICE_ID || "";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const razorpayProAmount = Number(process.env.RAZORPAY_PRO_AMOUNT || 19900);
const razorpaySchoolAmount = Number(process.env.RAZORPAY_SCHOOL_AMOUNT || 9900);
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
    stripeCustomerId: user.stripeCustomerId || "",
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
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Stripe-Signature",
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
    "You are SynapseDeck's always-on AI tutor.",
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
          "X-Title": "SynapseDeck AI"
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

async function handleAssistant(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const sessionId = body.sessionId || "default";
  const history = conversations.get(sessionId) || [];
  const result = modelProvider === "openai"
    ? await runOpenAiAssistant(body, history)
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
    stripeCustomerId: "",
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

async function createStripeCheckoutSession(plan, user) {
  const priceId = plan === "school" ? stripeSchoolPriceId : stripeProPriceId;
  if (!stripeSecretKey || !priceId) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY and Stripe price IDs.");
  }

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${publicBaseUrl}/index.html?billing=success&plan=${encodeURIComponent(plan)}`);
  params.set("cancel_url", `${publicBaseUrl}/index.html?billing=cancelled`);
  params.set("metadata[plan]", plan);
  params.set("metadata[userId]", user?.id || "");
  params.set("client_reference_id", user?.id || "");
  params.set("allow_promotion_codes", "true");
  if (user?.email) {
    params.set("customer_email", user.email);
  }

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const payload = await stripeResponse.json();
  if (!stripeResponse.ok) {
    throw new Error(payload.error?.message || "Stripe Checkout failed.");
  }
  return payload;
}

async function handleCheckout(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const plan = body.plan === "school" ? "school" : "pro";
  const { user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Create an account before starting checkout." });
    return;
  }
  const session = await createStripeCheckoutSession(plan, user);
  sendJson(response, 200, {
    url: session.url,
    id: session.id
  });
}

async function createRazorpayOrder(plan, user) {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  const amount = plan === "school" ? razorpaySchoolAmount : razorpayProAmount;
  const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: randomId("receipt").slice(0, 40),
      notes: {
        userId: user.id,
        plan,
        email: user.email
      }
    })
  });
  const payload = await razorpayResponse.json();
  if (!razorpayResponse.ok) {
    throw new Error(payload.error?.description || "Razorpay order creation failed.");
  }
  return payload;
}

async function handleRazorpayOrder(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const plan = body.plan === "school" ? "school" : "pro";
  const { user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Create an account before starting checkout." });
    return;
  }
  const order = await createRazorpayOrder(plan, user);
  sendJson(response, 200, {
    keyId: razorpayKeyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    plan,
    name: "SynapseDeck AI",
    description: plan === "school" ? "SynapseDeck School access" : "SynapseDeck Pro access",
    prefill: {
      email: user.email
    }
  });
}

function verifyRazorpayPaymentSignature(orderId, paymentId, signature) {
  if (!razorpayKeySecret || !orderId || !paymentId || !signature) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (expected.length !== signature.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function handleRazorpayVerify(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const { database, user } = findSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: "Sign in required." });
    return;
  }
  const verified = verifyRazorpayPaymentSignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature
  );
  if (!verified) {
    sendJson(response, 400, { error: "Payment signature could not be verified." });
    return;
  }
  user.plan = body.plan === "school" ? "school" : "pro";
  user.razorpayPaymentId = body.razorpay_payment_id;
  user.razorpayOrderId = body.razorpay_order_id;
  writeDatabase(database);
  sendJson(response, 200, { ok: true, user: publicUser(user) });
}

function verifyStripeSignature(rawBody, signatureHeader) {
  if (!stripeWebhookSecret) {
    return true;
  }
  const parts = Object.fromEntries(String(signatureHeader || "")
    .split(",")
    .map((item) => item.split("=").map((value) => value.trim()))
    .filter((item) => item.length === 2));
  if (!parts.t || !parts.v1) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", stripeWebhookSecret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  if (expected.length !== parts.v1.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
}

async function handleStripeWebhook(request, response) {
  const rawBody = await readBody(request);
  if (!verifyStripeSignature(rawBody, request.headers["stripe-signature"])) {
    sendJson(response, 400, { error: "Invalid Stripe signature." });
    return;
  }
  const event = JSON.parse(rawBody || "{}");
  const object = event.data?.object || {};
  const database = readDatabase();
  const userId = object.metadata?.userId || object.client_reference_id || "";
  const email = String(object.customer_email || object.customer_details?.email || "").toLowerCase();
  const user = database.users.find((item) => item.id === userId)
    || database.users.find((item) => item.email === email);

  if (user) {
    if (event.type === "checkout.session.completed") {
      user.plan = object.metadata?.plan === "school" ? "school" : "pro";
      user.stripeCustomerId = object.customer || user.stripeCustomerId || "";
    }
    if (event.type === "customer.subscription.deleted" || event.type === "invoice.payment_failed") {
      user.plan = "free";
    }
    if (event.type === "customer.subscription.updated" && object.status && object.status !== "active") {
      user.plan = "free";
    }
    writeDatabase(database);
  }

  sendJson(response, 200, { received: true, userUpdated: Boolean(user) });
}

async function handleRazorpayWebhook(request, response) {
  const rawBody = await readBody(request);
  if (razorpayWebhookSecret) {
    const received = request.headers["x-razorpay-signature"] || "";
    const expected = crypto
      .createHmac("sha256", razorpayWebhookSecret)
      .update(rawBody)
      .digest("hex");
    if (expected.length !== received.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
      sendJson(response, 400, { error: "Invalid Razorpay signature." });
      return;
    }
  }

  const event = JSON.parse(rawBody || "{}");
  const payment = event.payload?.payment?.entity || {};
  const notes = payment.notes || {};
  const database = readDatabase();
  const user = database.users.find((item) => item.id === notes.userId)
    || database.users.find((item) => item.email === String(notes.email || "").toLowerCase());

  if (user && ["payment.captured", "order.paid"].includes(event.event)) {
    user.plan = notes.plan === "school" ? "school" : "pro";
    user.razorpayPaymentId = payment.id || user.razorpayPaymentId || "";
    user.razorpayOrderId = payment.order_id || user.razorpayOrderId || "";
    writeDatabase(database);
  }

  sendJson(response, 200, { received: true, userUpdated: Boolean(user) });
}

async function handleResearch(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  const terms = (body.kit?.terms || []).map((item) => item.term || item).filter(Boolean);
  const query = String(body.query || terms.slice(0, 3).join(" ") || body.kit?.focus || "study topic").trim();
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=6&prop=extracts|info&exintro=1&explaintext=1&inprop=url&format=json&origin=*`;
  const apiResponse = await fetch(url, {
    headers: {
      "User-Agent": "SynapseDeckAI/0.1 educational reference lookup"
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
        app: "SynapseDeck AI",
        provider: modelProvider,
        model: modelProvider === "openai" ? openaiModel : modelProvider === "compatible" ? compatibleModel : ollamaModel,
        modelReady: modelProvider === "openai"
          ? Boolean(openaiApiKey)
          : modelProvider === "compatible"
            ? Boolean(compatibleApiKey)
            : false,
        billingReady: Boolean(stripeSecretKey && stripeProPriceId),
        razorpayReady: Boolean(razorpayKeyId && razorpayKeySecret),
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

    if (request.url === "/api/billing/config") {
      sendJson(response, 200, {
        provider: "stripe",
        ready: Boolean(stripeSecretKey && stripeProPriceId),
        proReady: Boolean(stripeSecretKey && stripeProPriceId),
        schoolReady: Boolean(stripeSecretKey && stripeSchoolPriceId),
        razorpayReady: Boolean(razorpayKeyId && razorpayKeySecret),
        razorpayKeyId: razorpayKeyId || "",
        razorpayAmounts: {
          pro: razorpayProAmount,
          school: razorpaySchoolAmount,
          currency: "INR"
        }
      });
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

    if (request.url === "/api/billing/checkout" && request.method === "POST") {
      await handleCheckout(request, response);
      return;
    }

    if (request.url === "/api/billing/razorpay/order" && request.method === "POST") {
      await handleRazorpayOrder(request, response);
      return;
    }

    if (request.url === "/api/billing/razorpay/verify" && request.method === "POST") {
      await handleRazorpayVerify(request, response);
      return;
    }

    if (request.url === "/api/billing/webhook" && request.method === "POST") {
      await handleStripeWebhook(request, response);
      return;
    }

    if (request.url === "/api/billing/razorpay/webhook" && request.method === "POST") {
      await handleRazorpayWebhook(request, response);
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
    sendJson(response, 500, {
      error: error.message || "Server error.",
      model: modelProvider === "openai" ? openaiModel : modelProvider === "compatible" ? compatibleModel : ollamaModel,
      provider: modelProvider
    });
  }
});

server.listen(port, host, () => {
  console.log(`SynapseDeck server running on ${host}:${port}`);
  console.log(`Model provider: ${modelProvider}`);
  console.log(`OpenAI model: ${openaiModel}`);
  console.log(`Compatible model: ${compatibleModel}`);
  console.log(`Ollama model: ${ollamaModel}`);
  console.log(`Ollama host: ${ollamaHost}`);
});
