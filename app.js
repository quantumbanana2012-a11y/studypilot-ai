const notesInput = document.querySelector("#notesInput");
const focusSelect = document.querySelector("#focusSelect");
const difficultySelect = document.querySelector("#difficultySelect");
const sessionSelect = document.querySelector("#sessionSelect");
const cardCountSelect = document.querySelector("#cardCountSelect");
const quizModeSelect = document.querySelector("#quizModeSelect");
const examDateInput = document.querySelector("#examDateInput");
const generateBtn = document.querySelector("#generateBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const fileDropZone = document.querySelector("#fileDropZone");
const fileInput = document.querySelector("#fileInput");
const chooseFileBtn = document.querySelector("#chooseFileBtn");
const fileList = document.querySelector("#fileList");
const saveBtn = document.querySelector("#saveBtn");
const exportBtn = document.querySelector("#exportBtn");
const obsidianBtn = document.querySelector("#obsidianBtn");
const clearBtn = document.querySelector("#clearBtn");
const upgradeBtn = document.querySelector("#upgradeBtn");
const upgradeModal = document.querySelector("#upgradeModal");
const closeUpgradeBtn = document.querySelector("#closeUpgradeBtn");
const planBadge = document.querySelector("#planBadge");
const planStrip = document.querySelector("#planStrip");
const accountBadge = document.querySelector("#accountBadge");
const sidebarAd = document.querySelector("#sidebarAd");
const workspaceAd = document.querySelector("#workspaceAd");
const accountStatus = document.querySelector("#accountStatus");
const authFields = document.querySelector("#authFields");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const loginBtn = document.querySelector("#loginBtn");
const signupBtn = document.querySelector("#signupBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const upgradeNote = document.querySelector("#upgradeNote");
const resetMasteryBtn = document.querySelector("#resetMasteryBtn");
const emptyState = document.querySelector("#emptyState");
const kitTitle = document.querySelector("#kitTitle");
const readinessScore = document.querySelector("#readinessScore");
const wordCount = document.querySelector("#wordCount");
const readingTime = document.querySelector("#readingTime");
const keyTermCount = document.querySelector("#keyTermCount");
const coachBrief = document.querySelector("#coachBrief");
const targetList = document.querySelector("#targetList");
const weakList = document.querySelector("#weakList");
const sourceCheckList = document.querySelector("#sourceCheckList");
const summaryList = document.querySelector("#summaryList");
const termList = document.querySelector("#termList");
const conceptMap = document.querySelector("#conceptMap");
const flashcardGrid = document.querySelector("#flashcardGrid");
const quizList = document.querySelector("#quizList");
const quizScore = document.querySelector("#quizScore");
const gameXp = document.querySelector("#gameXp");
const gameStreak = document.querySelector("#gameStreak");
const gameModeLabel = document.querySelector("#gameModeLabel");
const lessonPath = document.querySelector("#lessonPath");
const gameBoard = document.querySelector("#gameBoard");
const gameFeedback = document.querySelector("#gameFeedback");
const assistantMessages = document.querySelector("#assistantMessages");
const assistantForm = document.querySelector("#assistantForm");
const assistantInput = document.querySelector("#assistantInput");
const assistantStatus = document.querySelector("#assistantStatus");
const calcInput = document.querySelector("#calcInput");
const calcResult = document.querySelector("#calcResult");
const formulaHelp = document.querySelector("#formulaHelp");
const calcHistory = document.querySelector("#calcHistory");
const generateVisualsBtn = document.querySelector("#generateVisualsBtn");
const referenceGallery = document.querySelector("#referenceGallery");
const visualHelp = document.querySelector("#visualHelp");
const researchBtn = document.querySelector("#researchBtn");
const researchInput = document.querySelector("#researchInput");
const researchResults = document.querySelector("#researchResults");
const dueReviewList = document.querySelector("#dueReviewList");
const knownCount = document.querySelector("#knownCount");
const needsWorkCount = document.querySelector("#needsWorkCount");
const nextReviewDate = document.querySelector("#nextReviewDate");
const planList = document.querySelector("#planList");
const reviewList = document.querySelector("#reviewList");
const integrationAiStatus = document.querySelector("#integrationAiStatus");
const integrationBillingStatus = document.querySelector("#integrationBillingStatus");
const integrationGrid = document.querySelector("#integrationGrid");
const copyIntegrationPayloadBtn = document.querySelector("#copyIntegrationPayloadBtn");
const collabRoomCode = document.querySelector("#collabRoomCode");
const collabMemberCount = document.querySelector("#collabMemberCount");
const collabModeLabel = document.querySelector("#collabModeLabel");
const createRoomBtn = document.querySelector("#createRoomBtn");
const collabModeSelect = document.querySelector("#collabModeSelect");
const collabInviteInput = document.querySelector("#collabInviteInput");
const copyInviteBtn = document.querySelector("#copyInviteBtn");
const peerChallengeBtn = document.querySelector("#peerChallengeBtn");
const exportGroupReportBtn = document.querySelector("#exportGroupReportBtn");
const collabRoomPanel = document.querySelector("#collabRoomPanel");
const collabProgressList = document.querySelector("#collabProgressList");
const timerDisplay = document.querySelector("#timerDisplay");
const timerLabel = document.querySelector("#timerLabel");
const timerStartBtn = document.querySelector("#timerStartBtn");
const timerResetBtn = document.querySelector("#timerResetBtn");

const stopWords = new Set([
  "about", "after", "again", "also", "because", "between", "could", "during", "every",
  "from", "have", "into", "more", "most", "other", "over", "such", "than", "that",
  "their", "there", "these", "this", "through", "under", "when", "where", "which",
  "while", "with", "would", "your", "they", "them", "then", "were", "what", "how",
  "and", "are", "but", "for", "if", "not", "the", "was", "you", "its", "can", "has",
  "had", "use", "used", "uses", "using", "will", "may", "each", "many", "make", "made"
]);

const termEdgeStopWords = new Set([
  "affect", "become", "captures", "concentration", "convert", "create", "effective",
  "factors", "growth", "happens", "limited", "mainly", "plants", "process", "produce",
  "rate", "release", "slow", "split", "stores", "where"
]);

const sampleNotes = `Photosynthesis is the process plants use to convert light energy into chemical energy. It happens mainly in chloroplasts, where chlorophyll captures sunlight. The light-dependent reactions split water, release oxygen, and produce ATP and NADPH. The Calvin cycle uses carbon dioxide, ATP, and NADPH to create glucose. Glucose stores energy that plants use for growth and cellular respiration. Factors such as light intensity, carbon dioxide concentration, and temperature affect the rate of photosynthesis. If light is limited, the light-dependent reactions slow down. If temperature is too high, enzymes in the Calvin cycle can become less effective.`;

let currentKit = null;
let currentPlan = localStorage.getItem("studyPilotPlan") || "free";
let authToken = localStorage.getItem("studyPilotAuthToken") || "";
let currentUser = null;
let assistantHistory = [];
let assistantSessionId = localStorage.getItem("studyPilotAssistantSession");
let modelConfig = {
  ready: false,
  model: "Cloud model",
  provider: "compatible",
  apiBase: ""
};
let billingConfig = {
  ready: false,
  apiBase: ""
};
let adsConfig = {
  enabled: false,
  clientId: "",
  sidebarSlot: "",
  workspaceSlot: "",
  apiBase: ""
};
let visualStyle = "diagram";
let calcEntries = [];
let importedFiles = [];
let pdfJsLibPromise = null;
let collabRoom = JSON.parse(localStorage.getItem("studyPilotCollabRoom") || "null");
if (!assistantSessionId) {
  assistantSessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem("studyPilotAssistantSession", assistantSessionId);
}
let gameState = {
  mode: "match",
  xp: 0,
  streak: 0,
  selected: null,
  matched: [],
  sprintIndex: 0,
  typeIndex: 0
};
let timer = {
  secondsLeft: Number(sessionSelect.value) * 60,
  intervalId: null
};

function getSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 18);
}

function getWords(text) {
  return text.toLowerCase().match(/[a-z][a-z-]{2,}/g) || [];
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[character]));
}

function truncate(value, limit = 118) {
  const text = String(value || "");
  return text.length > limit ? `${text.slice(0, limit - 3)}...` : text;
}

function normalizeAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAnswerMatch(answer, expected) {
  const normalizedAnswer = normalizeAnswer(answer);
  const normalizedExpected = normalizeAnswer(expected);

  if (!normalizedAnswer || normalizedAnswer.length < 2) {
    return false;
  }

  return normalizedAnswer === normalizedExpected
    || normalizedAnswer.includes(normalizedExpected)
    || normalizedExpected.includes(normalizedAnswer);
}

function calculateExpression(expression) {
  const cleaned = String(expression || "")
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100")
    .trim();

  if (!cleaned) {
    return "0";
  }

  if (!/^[\d+\-*/().\sMathPIsqrtcologtan]+$/.test(cleaned)) {
    throw new Error("Use numbers and math operators only.");
  }

  const value = Function(`"use strict"; return (${cleaned});`)();
  if (!Number.isFinite(value)) {
    throw new Error("Result is not finite.");
  }
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8)));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function isoDate(daysAhead = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function friendlyDate(isoValue) {
  if (!isoValue) {
    return "None";
  }
  const [year, month, day] = isoValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "study-kit";
}

function yamlSafe(value) {
  return String(value).replace(/"/g, "\\\"");
}

function wikilinkTerm(value) {
  return `[[${titleCase(value)}]]`;
}

function downloadTextFile(filename, contents, type = "text/plain") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function stripHtml(value) {
  const container = document.createElement("div");
  container.innerHTML = value;
  container.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
  return container.textContent.replace(/\s+/g, " ").trim();
}

function isReadableStudyFile(file) {
  const name = file.name.toLowerCase();
  return file.type.startsWith("text/")
    || file.type === "application/json"
    || file.type === "application/pdf"
    || /\.(txt|md|markdown|csv|json|html|htm|pdf)$/i.test(name);
}

async function loadPdfJs() {
  if (!pdfJsLibPromise) {
    pdfJsLibPromise = import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs")
      .then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";
        return pdfjsLib;
      });
  }
  return pdfJsLibPromise;
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) {
      pages.push(`Page ${pageNumber}: ${pageText}`);
    }
  }

  return pages.join("\n\n");
}

function renderFileList() {
  fileList.innerHTML = importedFiles.length
    ? importedFiles.map((file, index) => `
      <article>
        <div>
          <strong>${escapeHtml(file.name)}</strong>
          <span>${escapeHtml(file.meta)}</span>
        </div>
        <button type="button" aria-label="Remove ${escapeHtml(file.name)}" data-remove-file="${index}">Remove</button>
      </article>
    `).join("")
    : "";
}

function appendImportedText(fileName, text) {
  const cleanText = text.trim();
  if (!cleanText) {
    return "";
  }
  const block = `--- Imported from ${fileName} ---\n${cleanText}`;
  notesInput.value = `${notesInput.value.trim()}\n\n${block}`.trim();
  return block;
}

async function addStudyFiles(files) {
  const pickedFiles = Array.from(files || []);
  if (!pickedFiles.length) {
    return;
  }

  const imported = [];
  const skipped = [];

  for (const file of pickedFiles) {
    if (!isReadableStudyFile(file)) {
      skipped.push(file.name);
      continue;
    }

    try {
      const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      const rawText = isPdf ? await extractPdfText(file) : await file.text();
      const text = /\.(html|htm)$/i.test(file.name) ? stripHtml(rawText) : rawText;
      const block = appendImportedText(file.name, text);
      if (!block) {
        skipped.push(`${file.name} (no selectable text)`);
        continue;
      }
      imported.push({
        name: file.name,
        meta: `${Math.max(1, Math.round(file.size / 1024))} KB imported${isPdf ? " from PDF" : ""}`,
        block
      });
    } catch (error) {
      skipped.push(file.name);
    }
  }

  importedFiles = [...importedFiles, ...imported].slice(-8);
  if (skipped.length) {
    importedFiles.push({
      name: "Unsupported files skipped",
      meta: skipped.join(", "),
      block: ""
    });
  }
  renderFileList();
}

function removeImportedFile(index) {
  const file = importedFiles[index];
  if (!file) {
    return;
  }
  if (file.block) {
    notesInput.value = notesInput.value.replace(file.block, "").replace(/\n{3,}/g, "\n\n").trim();
  }
  importedFiles.splice(index, 1);
  renderFileList();
}

function hasProAccess() {
  return currentPlan === "pro" || currentPlan === "school";
}

function planName() {
  return currentPlan === "school" ? "School" : currentPlan === "pro" ? "Pro Trial" : "Free";
}

function showUpgrade(reason = "Upgrade to unlock this study feature.") {
  upgradeNote.textContent = reason;
  upgradeModal.hidden = false;
}

function hideUpgrade() {
  upgradeModal.hidden = true;
}

function replayMotion(element, className) {
  if (!element) {
    return;
  }
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function triggerWorkspaceMotion() {
  replayMotion(document.querySelector(".workspace"), "is-revealing");
  document.querySelectorAll(".coach-strip article").forEach((item) => replayMotion(item, "is-pulsing"));
}

function apiBase() {
  return modelConfig.apiBase || billingConfig.apiBase || "";
}

function authHeaders(extra = {}) {
  return authToken
    ? { ...extra, Authorization: `Bearer ${authToken}` }
    : extra;
}

function renderAccount() {
  const signedIn = Boolean(currentUser);
  accountBadge.textContent = signedIn ? currentUser.email : "Guest mode";
  accountStatus.textContent = signedIn
    ? `${currentUser.email} - ${planName()} account`
    : "Sign in to sync kits and unlock paid plans.";
  authFields.hidden = signedIn;
  logoutBtn.hidden = !signedIn;
}

async function loadAccount() {
  if (!authToken) {
    renderAccount();
    return;
  }
  try {
    const response = await fetch(`${apiBase()}/api/account`, {
      headers: authHeaders()
    });
    if (!response.ok) {
      throw new Error("Session expired.");
    }
    const payload = await response.json();
    currentUser = payload.user;
    currentPlan = currentUser.plan || "free";
    localStorage.setItem("studyPilotPlan", currentPlan);
    applyPlanState();
    await loadRemoteKit();
  } catch {
    authToken = "";
    currentUser = null;
    localStorage.removeItem("studyPilotAuthToken");
    renderAccount();
  }
}

async function submitAuth(mode) {
  const email = authEmail.value.trim();
  const password = authPassword.value;
  accountStatus.textContent = mode === "signup" ? "Creating account..." : "Signing in...";
  try {
    const response = await fetch(`${apiBase()}/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Account request failed.");
    }
    authToken = payload.token;
    currentUser = payload.user;
    currentPlan = currentUser.plan || "free";
    localStorage.setItem("studyPilotAuthToken", authToken);
    localStorage.setItem("studyPilotPlan", currentPlan);
    authPassword.value = "";
    applyPlanState();
    await loadRemoteKit();
  } catch (error) {
    accountStatus.textContent = error.message;
  }
}

async function logout() {
  if (authToken) {
    try {
      await fetch(`${apiBase()}/api/auth/logout`, {
        method: "POST",
        headers: authHeaders()
      });
    } catch {
      // Local sign-out still clears the browser session.
    }
  }
  authToken = "";
  currentUser = null;
  currentPlan = "free";
  localStorage.removeItem("studyPilotAuthToken");
  localStorage.setItem("studyPilotPlan", currentPlan);
  applyPlanState();
}

async function loadBillingConfig() {
  const endpoints = ["/api/billing/config", "http://127.0.0.1:4174/api/billing/config", "http://127.0.0.1:4175/api/billing/config"];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        continue;
      }
      billingConfig = await response.json();
      billingConfig.apiBase = endpoint.replace("/api/billing/config", "");
      renderIntegrations();
      return;
    } catch {
      // Try the next endpoint.
    }
  }
  billingConfig = { ready: false, apiBase: "" };
  renderIntegrations();
}

function loadAdSenseScript() {
  if (!adsConfig.enabled || !adsConfig.clientId || document.querySelector("#adsenseScript")) {
    return;
  }
  const script = document.createElement("script");
  script.id = "adsenseScript";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsConfig.clientId)}`;
  document.head.appendChild(script);
}

function adMarkup(slot, format = "auto") {
  if (!adsConfig.enabled || !adsConfig.clientId || !slot) {
    return "";
  }
  return `
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="${escapeHtml(adsConfig.clientId)}"
      data-ad-slot="${escapeHtml(slot)}"
      data-ad-format="${escapeHtml(format)}"
      data-full-width-responsive="true"></ins>
  `;
}

function pushAds() {
  if (!adsConfig.enabled || !hasFreeAds()) {
    return;
  }
  window.adsbygoogle = window.adsbygoogle || [];
  document.querySelectorAll(".adsbygoogle").forEach(() => {
    try {
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers and unapproved domains can block ad rendering during beta.
    }
  });
}

function hasFreeAds() {
  return currentPlan === "free";
}

function renderAds() {
  const showAds = hasFreeAds();
  [sidebarAd, workspaceAd].forEach((slot) => {
    if (slot) {
      slot.hidden = !showAds;
    }
  });

  if (!showAds) {
    return;
  }

  if (adsConfig.enabled && adsConfig.clientId) {
    sidebarAd.innerHTML = adMarkup(adsConfig.sidebarSlot, "auto") || `<span>Sponsored</span><strong>AdSense connected</strong><p>Add an ad slot ID to show this placement.</p>`;
    workspaceAd.innerHTML = adMarkup(adsConfig.workspaceSlot, "horizontal") || `<span>Sponsored</span><p>Add a workspace banner slot ID to show ads here.</p>`;
    loadAdSenseScript();
    window.setTimeout(pushAds, 500);
  } else {
    sidebarAd.innerHTML = `<span>Sponsored</span><strong>Ad slot ready</strong><p>Set ADSENSE_CLIENT_ID after Google approves the site.</p>`;
    workspaceAd.innerHTML = `<span>Sponsored</span><p>Free users will see a banner here after AdSense approval.</p>`;
  }
}

async function loadAdsConfig() {
  const endpoints = ["/api/ads/config", "http://127.0.0.1:4174/api/ads/config", "http://127.0.0.1:4175/api/ads/config"];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        continue;
      }
      adsConfig = await response.json();
      adsConfig.apiBase = endpoint.replace("/api/ads/config", "");
      renderAds();
      return;
    } catch {
      // Try the next endpoint.
    }
  }
  adsConfig = { enabled: false, clientId: "", sidebarSlot: "", workspaceSlot: "", apiBase: "" };
  renderAds();
}

async function startCheckout(plan) {
  if (!billingConfig.ready) {
    setPlan(plan);
    upgradeNote.textContent = "Demo mode: Stripe is not configured yet, so this plan was unlocked locally.";
    return;
  }

  if (!currentUser) {
    upgradeNote.textContent = "Create an account first so Stripe can attach the subscription to your StudyPilot plan.";
    authEmail.focus();
    return;
  }

  const response = await fetch(`${billingConfig.apiBase}/api/billing/checkout`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ plan })
  });
  const payload = await response.json();
  if (!response.ok) {
    upgradeNote.textContent = payload.error || "Checkout failed. Check Stripe environment variables.";
    return;
  }
  window.location.href = payload.url;
}

function setPlan(plan) {
  currentPlan = plan;
  if (currentUser) {
    currentUser.plan = plan;
  }
  localStorage.setItem("studyPilotPlan", plan);
  applyPlanState();
  hideUpgrade();
}

function applyPlanState() {
  const isPro = hasProAccess();
  planBadge.textContent = planName();
  planStrip.textContent = planName();
  obsidianBtn.classList.toggle("is-locked", !isPro);
  cardCountSelect.classList.toggle("is-limited", !isPro && Number(cardCountSelect.value) > 8);
  difficultySelect.classList.toggle("is-limited", !isPro && difficultySelect.value === "challenge");
  document.querySelectorAll(".game-mode").forEach((button) => {
    const isPremiumGame = button.dataset.gameMode === "sprint" || button.dataset.gameMode === "type";
    button.classList.toggle("is-locked", !isPro && isPremiumGame);
  });
  renderAccount();
  renderAds();
  renderIntegrations();
}

function integrationPayload() {
  return {
    app: "StudyPilot AI",
    generatedAt: new Date().toISOString(),
    plan: currentPlan,
    model: {
      provider: modelConfig.provider,
      name: modelConfig.model,
      ready: modelConfig.ready
    },
    kit: currentKit ? {
      title: `${titleCase(currentKit.focus)} kit`,
      focus: currentKit.focus,
      difficulty: currentKit.difficulty,
      words: currentKit.words,
      terms: currentKit.terms.map(({ term }) => term),
      summary: currentKit.summary,
      reviewPlan: currentKit.plan
    } : null
  };
}

function makeCalendarExport() {
  if (!currentKit) {
    return "";
  }
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const events = [1, 3, 7].map((days, index) => {
    const start = new Date(now);
    start.setDate(now.getDate() + days);
    start.setHours(18, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 30);
    const dateValue = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return [
      "BEGIN:VEVENT",
      `UID:studypilot-${Date.now()}-${index}@studypilot.ai`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dateValue(start)}`,
      `DTEND:${dateValue(end)}`,
      `SUMMARY:StudyPilot review - ${titleCase(currentKit.focus)}`,
      `DESCRIPTION:${currentKit.plan.join("\\n").replace(/[,;]/g, " ")}`,
      "END:VEVENT"
    ].join("\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//StudyPilot AI//Study Review//EN", ...events, "END:VCALENDAR"].join("\n");
}

function renderIntegrations() {
  if (!integrationGrid) {
    return;
  }

  integrationAiStatus.textContent = modelConfig.ready ? modelConfig.model : "Needs key";
  integrationBillingStatus.textContent = billingConfig.ready ? "Stripe ready" : "Demo mode";

  const hasKit = Boolean(currentKit);
  const integrations = [
    {
      name: "OpenRouter Cloud AI",
      status: modelConfig.ready ? "Connected" : "Needs API key",
      detail: modelConfig.ready
        ? `Assistant is routed through ${modelConfig.model}.`
        : "Add COMPATIBLE_API_KEY on the server to enable cloud AI.",
      action: "Setup",
      type: "docs",
      premium: false
    },
    {
      name: "Obsidian",
      status: hasProAccess() ? "Export ready" : "Pro export",
      detail: "Export a Markdown study kit with summary, cards, quiz, and source notes.",
      action: "Export",
      type: "obsidian",
      premium: true
    },
    {
      name: "Google Calendar",
      status: hasKit ? "Export ready" : "Needs kit",
      detail: "Download spaced-review sessions as an .ics calendar file.",
      action: "Download ICS",
      type: "calendar",
      premium: false
    },
    {
      name: "Notion",
      status: "Payload ready",
      detail: "Copy structured kit data for a future Notion database integration.",
      action: "Copy JSON",
      type: "payload",
      premium: false
    },
    {
      name: "Google Drive",
      status: "OAuth next",
      detail: "Import Docs and PDFs after accounts and Google login are added.",
      action: "Roadmap",
      type: "roadmap",
      premium: true
    },
    {
      name: "Canvas / Classroom",
      status: "School plan",
      detail: "Pull assignment materials and push practice tasks for classes.",
      action: "Roadmap",
      type: "roadmap",
      premium: true
    },
    {
      name: "Quizlet / Anki",
      status: hasKit ? "Exportable" : "Needs kit",
      detail: "Export flashcards as TSV that can be imported into flashcard tools.",
      action: "Export TSV",
      type: "cards",
      premium: false
    },
    {
      name: "Stripe",
      status: billingConfig.ready ? "Checkout ready" : "Keys needed",
      detail: "Stripe checkout is scaffolded; webhooks are the next money step.",
      action: "Pricing",
      type: "pricing",
      premium: false
    }
  ];

  integrationGrid.innerHTML = integrations.map((item) => `
    <article class="integration-card">
      <div>
        <span>${escapeHtml(item.status)}${item.premium ? " / Pro" : ""}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.detail)}</p>
      </div>
      <button type="button" data-integration-action="${escapeHtml(item.type)}">${escapeHtml(item.action)}</button>
    </article>
  `).join("");
}

function makeRoomCode() {
  return `SP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function getCollabMembers() {
  const typed = collabInviteInput?.value || collabRoom?.invitees || "";
  return typed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function renderCollaboration() {
  if (!collabRoomPanel) {
    return;
  }

  const modeLabel = {
    study: "Study Group",
    teacher: "Teacher Review",
    tutor: "Tutor Session"
  }[collabRoom?.mode || collabModeSelect.value] || "Study Group";
  const members = collabRoom?.members || getCollabMembers();

  collabRoomCode.textContent = collabRoom?.code || "Not created";
  collabMemberCount.textContent = String(members.length);
  collabModeLabel.textContent = modeLabel;

  collabRoomPanel.innerHTML = collabRoom
    ? `
      <article>
        <span>Invite code</span>
        <strong>${escapeHtml(collabRoom.code)}</strong>
        <p>${escapeHtml(collabRoom.inviteText)}</p>
      </article>
    `
    : `<article><span>Demo room</span><strong>Create a room</strong><p>Generate a kit, add classmates, then create a shareable study room.</p></article>`;

  const baseCards = currentKit?.flashcards || [];
  const displayMembers = members.length ? members : ["You", "Study Partner", "Tutor"];
  collabProgressList.innerHTML = displayMembers.map((member, index) => {
    const due = baseCards[index % Math.max(1, baseCards.length)]?.term || "No kit yet";
    const readiness = Math.min(96, Math.max(18, calculateReadiness() + (index * 11) - 8));
    return `
      <article>
        <div>
          <strong>${escapeHtml(member)}</strong>
          <span>${escapeHtml(due)}</span>
        </div>
        <div class="collab-meter"><span style="width: ${readiness}%"></span></div>
        <em>${readiness}% ready</em>
      </article>
    `;
  }).join("");
}

function createCollabRoom() {
  const members = getCollabMembers();
  const code = makeRoomCode();
  const mode = collabModeSelect.value;
  const title = currentKit ? `${titleCase(currentKit.focus)} kit` : "StudyPilot kit";
  const inviteText = `Join my StudyPilot room ${code} for ${title}. Goal: review cards, quiz each other, and fix weak spots.`;
  collabRoom = {
    code,
    mode,
    members,
    invitees: collabInviteInput.value,
    inviteText,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem("studyPilotCollabRoom", JSON.stringify(collabRoom));
  renderCollaboration();
}

async function copyCollabInvite() {
  const text = collabRoom?.inviteText || "Create a StudyPilot room first.";
  try {
    await navigator.clipboard.writeText(text);
    copyInviteBtn.textContent = "Copied";
    window.setTimeout(() => {
      copyInviteBtn.textContent = "Copy Invite";
    }, 900);
  } catch {
    downloadTextFile("studypilot-room-invite.txt", text);
  }
}

function exportGroupReport() {
  const payload = {
    room: collabRoom || null,
    kit: currentKit ? `${titleCase(currentKit.focus)} kit` : null,
    readiness: calculateReadiness(),
    weakSpots: currentKit?.weakSpots || [],
    dueCards: getDueCards()
  };
  downloadTextFile("studypilot-group-report.json", JSON.stringify(payload, null, 2), "application/json");
}

function createPeerChallenge() {
  if (!currentKit) {
    showUpgrade("Generate a kit before creating a peer challenge.");
    return;
  }
  const challenge = [
    `StudyPilot Peer Challenge: ${collabRoom?.code || "Demo Room"}`,
    "",
    "Answer these without looking:",
    ...currentKit.quiz.slice(0, 5).map((item, index) => `${index + 1}. ${item.question}`),
    "",
    `Beat my readiness score: ${calculateReadiness()}%`
  ].join("\n");
  downloadTextFile("studypilot-peer-challenge.txt", challenge);
}

function applyBillingRedirectState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("billing") !== "success") {
    return;
  }
  upgradeNote.textContent = "Payment completed. Refreshing account plan from the server...";
  upgradeModal.hidden = false;
  window.history.replaceState({}, "", window.location.pathname);
}

function enforcePlanLimits() {
  if (hasProAccess()) {
    return true;
  }

  if (Number(cardCountSelect.value) > 8) {
    cardCountSelect.value = "8";
    showUpgrade("Pro unlocks 12-card and 16-card kits for deeper study sessions.");
    return false;
  }

  if (difficultySelect.value === "challenge") {
    difficultySelect.value = "balanced";
    showUpgrade("Challenge mode is a Pro study setting for harder questions and tougher recall.");
    return false;
  }

  return true;
}

function extractTerms(text, limit = 16) {
  const counts = new Map();
  const cleanWords = getWords(text);

  text.split(/\n+/).forEach((line) => {
    const match = line.match(/^\s*[-*]?\s*([A-Za-z][A-Za-z\s-]{3,45})\s*[:\-]/);
    if (match) {
      const term = normalizeAnswer(match[1]);
      if (term && !stopWords.has(term)) {
        counts.set(term, (counts.get(term) || 0) + 12);
      }
    }
  });

  getSentences(text).forEach((sentence) => {
    const match = sentence.match(/^\s*(?:the\s+)?([A-Za-z][A-Za-z\s-]{3,45})\s+(?:is|are|means|refers)\b/i);
    if (match) {
      const term = normalizeAnswer(match[1]);
      if (term && !stopWords.has(term)) {
        counts.set(term, (counts.get(term) || 0) + 10);
      }
    }
  });

  cleanWords.forEach((word) => {
    if (!stopWords.has(word) && !termEdgeStopWords.has(word) && word.length > 3) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  });

  getSentences(text).flatMap((sentence) => sentence.split(/[,:;()]/)).forEach((segment) => {
    const sentenceWords = getWords(segment);
    for (let size = 2; size <= 3; size += 1) {
      for (let index = 0; index <= sentenceWords.length - size; index += 1) {
        const phraseWords = sentenceWords.slice(index, index + size);
        if (phraseWords.some((word) => stopWords.has(word) || word.length < 4)) {
          continue;
        }
        if (phraseWords.some((word) => termEdgeStopWords.has(word))) {
          continue;
        }
        const phrase = phraseWords.join(" ");
        const score = (counts.get(phrase) || 0) + size + 1;
        counts.set(phrase, score);
      }
    }
  });

  const sorted = Array.from(counts.entries())
    .map(([term, count]) => ({ term, count, words: term.split(" ").length }))
    .filter((item) => item.term.split(" ").every((word) => !stopWords.has(word) && !termEdgeStopWords.has(word)))
    .sort((a, b) => b.count - a.count || b.words - a.words || b.term.length - a.term.length);

  const picked = [];
  sorted.forEach((candidate) => {
    const isContained = picked.some((item) => item.term.includes(candidate.term) || candidate.term.includes(item.term));
    if (!isContained || candidate.words > 1) {
      picked.push(candidate);
    }
  });

  return picked
    .slice(0, limit)
    .map(({ term, count }) => ({ term, count }));
}

function rankSentences(sentences, terms, difficulty) {
  const termValues = terms.map((item) => item.term);
  const summaryCount = difficulty === "challenge" ? 6 : difficulty === "gentle" ? 4 : 5;

  return sentences
    .map((sentence, index) => {
      const lower = sentence.toLowerCase();
      const score = termValues.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
      return { sentence, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, summaryCount)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

function makeLearningTargets(terms, focus) {
  const picked = terms.slice(0, 4).map((item) => titleCase(item.term));
  const lead = {
    exam: "Answer application questions about",
    concepts: "Explain how ideas connect across",
    memorize: "Recall definitions and examples for",
    teach: "Teach the topic clearly using"
  }[focus];

  if (!picked.length) {
    return ["Identify the main ideas.", "Convert notes into recall questions.", "Review missed answers after the quiz."];
  }

  return picked.map((term) => `${lead} ${term}.`);
}

function makeFlashcards(sentences, terms, count, difficulty) {
  const promptTypes = difficulty === "challenge"
    ? ["apply", "compare", "why", "teach", "predict"]
    : difficulty === "gentle"
      ? ["define", "clue", "teach", "why"]
      : ["clue", "why", "teach", "apply", "compare"];

  return terms.slice(0, count).map(({ term }, index) => {
    const source = sentenceForTerm(sentences, term);
    const keywords = extractSourceKeywords(source, term, 3);
    const type = promptTypes[index % promptTypes.length];
    const displayTerm = titleCase(term);
    const prompt = {
      define: `Define ${displayTerm} using the source clue, not a memorized dictionary answer.`,
      clue: `Which source clue proves what ${displayTerm} means?`,
      why: `Why does ${displayTerm} matter in this topic?`,
      teach: `Teach ${displayTerm} to a beginner in one clear sentence.`,
      apply: `Apply ${displayTerm}: what would change if this part was missing or limited?`,
      compare: `Separate ${displayTerm} from a nearby idea in the notes.`
    }[type];

    return {
      term: displayTerm,
      prompt,
      answer: source || "Add more detail to your notes to build a stronger answer.",
      clue: keywords.join(" / "),
      type,
      mastery: "new",
      nextReview: isoDate(0),
      source
    };
  });
}

function stripTermPrefix(value) {
  return String(value || "").replace(/^[A-Z][A-Za-z\s-]{1,40}:\s*/, "").trim();
}

function sentenceForTerm(sentences, term, fallback = "") {
  return sentences.find((sentence) => sentence.toLowerCase().includes(term.toLowerCase())) || fallback || sentences[0] || "";
}

function extractSourceKeywords(sentence, term, limit = 4) {
  const termWords = new Set(getWords(term));
  const base = getWords(sentence)
    .filter((word) => !stopWords.has(word) && !termWords.has(word))
    .filter((word, index, list) => list.indexOf(word) === index)
    .sort((a, b) => b.length - a.length)
    .slice(0, limit);
  return base.length ? base.map(titleCase) : ["Definition", "Evidence", "Example"];
}

function pickChoices(correct, flashcards) {
  const distractors = flashcards
    .map((card) => card.term)
    .filter((term) => term.toLowerCase() !== correct.toLowerCase())
    .slice(0, 3);
  return [correct, ...distractors].sort((a, b) => a.localeCompare(b));
}

function makeRubric(card) {
  const keywords = extractSourceKeywords(card.answer, card.term, 3);
  return `Strong answer mentions ${keywords.join(", ")} and connects back to ${card.term}.`;
}

function makeQuizQuestion(card, index, difficulty, flashcards) {
  const clue = stripTermPrefix(card.answer);
  const questionTypes = difficulty === "challenge"
    ? ["scenario", "misconception", "cause", "choice", "typed", "truefalse"]
    : difficulty === "gentle"
      ? ["typed", "choice", "cause", "truefalse"]
      : ["typed", "scenario", "choice", "cause", "truefalse", "misconception"];
  const type = questionTypes[index % questionTypes.length];
  const falseCard = flashcards.find((item) => item.term !== card.term) || card;

  if (type === "scenario") {
    return {
      question: `A classmate remembers this clue: "${truncate(clue, 130)}" Which idea should they connect it to, and why?`,
      answer: card.term.toLowerCase(),
      displayAnswer: card.term,
      mode: "typed",
      rubric: makeRubric(card)
    };
  }

  if (type === "misconception") {
    return {
      question: `Fix the misconception: "${falseCard.term} and ${card.term} mean the same thing."`,
      answer: card.term.toLowerCase(),
      displayAnswer: card.term,
      mode: "typed",
      rubric: `Explain what ${card.term} does, then separate it from ${falseCard.term}.`
    };
  }

  if (type === "cause") {
    return {
      question: `Use the source notes to explain why ${card.term} matters in this topic.`,
      answer: card.term.toLowerCase(),
      displayAnswer: card.term,
      mode: "typed",
      rubric: makeRubric(card)
    };
  }

  if (type === "choice") {
    return {
      question: `Which key term best matches this source clue: ${truncate(clue, 170)}`,
      answer: card.term.toLowerCase(),
      displayAnswer: card.term,
      mode: "choice",
      choices: pickChoices(card.term, flashcards),
      rubric: makeRubric(card)
    };
  }

  if (type === "truefalse") {
    const statementIsTrue = index % 2 === 0;
    return {
      question: "Decide whether the statement is supported by the notes.",
      answer: card.term.toLowerCase(),
      displayAnswer: card.term,
      mode: "truefalse",
      statement: statementIsTrue
        ? `${card.term}: ${truncate(clue, 170)}`
        : `${card.term} is best explained by this unrelated clue: ${truncate(stripTermPrefix(falseCard.answer), 130)}`,
      statementIsTrue,
      rubric: statementIsTrue ? makeRubric(card) : `The clue belongs closer to ${falseCard.term}, not ${card.term}.`
    };
  }

  return {
    question: `In one sentence, what should you remember about ${card.term}?`,
    answer: card.term.toLowerCase(),
    displayAnswer: card.term,
    mode: "typed",
    rubric: makeRubric(card)
  };
}

function makeQuiz(flashcards, difficulty, mode) {
  const quizCount = difficulty === "challenge" ? 8 : difficulty === "gentle" ? 4 : 6;
  return flashcards.slice(0, quizCount).map((card, index) => {
    const item = makeQuizQuestion(card, index, difficulty, flashcards);
    if (mode !== "mixed") {
      item.mode = mode;
      if (mode === "choice") {
        item.choices = pickChoices(card.term, flashcards);
      }
      if (mode === "truefalse" && !item.statement) {
        item.statement = `${card.term}: ${truncate(stripTermPrefix(card.answer), 170)}`;
        item.statementIsTrue = true;
      }
    }
    return item;
  });
}

function makeCoachBrief(words, terms, focus, difficulty) {
  const strongest = terms.slice(0, 3).map((item) => titleCase(item.term)).join(", ") || "your main ideas";
  const mode = {
    exam: "prioritize fast recall and mixed practice",
    concepts: "slow down for explanations and connections",
    memorize: "use repeated short card cycles",
    teach: "say answers out loud as if tutoring someone"
  }[focus];
  const pressure = {
    gentle: "Keep the first pass light and confidence-building.",
    balanced: "Alternate reading with active recall.",
    challenge: "Expect the quiz to push beyond direct definitions."
  }[difficulty];

  return `This kit found ${words} study words and is centered on ${strongest}. For this goal, ${mode}. ${pressure}`;
}

function makePlan(minutes, focus, difficulty, terms) {
  const reviewMinutes = Math.max(5, Math.round(minutes * 0.2));
  const learnMinutes = Math.max(10, Math.round(minutes * 0.42));
  const practiceMinutes = Math.max(8, minutes - reviewMinutes - learnMinutes - 3);
  const emphasis = {
    exam: "answer quiz items without looking, then correct from the cards",
    concepts: "explain relationships between the biggest ideas",
    memorize: "cycle cards using missed, shaky, known marks",
    teach: "teach the summary from memory in plain language"
  }[focus];
  const challenge = difficulty === "challenge" ? " Add one self-made example for each weak term." : "";
  const selectedTerms = terms.slice(0, 4).map((item) => titleCase(item.term)).join(", ") || "the core terms";

  return [
    `${reviewMinutes} min: skim the summary and name the three highest-value ideas.`,
    `${learnMinutes} min: study ${selectedTerms} with active-recall cards.`,
    `${practiceMinutes} min: ${emphasis}.${challenge}`,
    "3 min: write one sentence about what still feels unclear."
  ];
}

function makeWeakList(terms) {
  return terms.slice(0, 5).map((item, index) => ({
    term: titleCase(item.term),
    reason: index < 2
      ? "High-frequency term, likely central to the topic."
      : "Worth checking because it may support a larger idea."
  }));
}

function makeSourceChecks(sentences, terms) {
  const enoughNotes = sentences.length >= 4
    ? "Enough source sentences were found to build a useful kit."
    : "Add more source sentences if you want more reliable cards and quiz variety.";
  const termCoverage = terms.length >= 8
    ? "The notes contain enough repeated terms for a focused review list."
    : "The term list is thin, so check generated cards against your original notes.";

  return [
    enoughNotes,
    termCoverage,
    "Review AI-generated questions before relying on them for a high-stakes exam.",
    "Prefer cards that quote or closely trace back to your source notes."
  ];
}

function makeConceptMap(terms, sentences) {
  return terms.slice(0, 8).map(({ term }) => {
    const related = terms
      .map((item) => item.term)
      .filter((candidate) => candidate !== term)
      .filter((candidate) => sentences.some((sentence) => {
        const lower = sentence.toLowerCase();
        return lower.includes(term) && lower.includes(candidate);
      }))
      .slice(0, 3);

    return {
      term: titleCase(term),
      related: related.length ? related.map(titleCase) : ["Review source context"]
    };
  });
}

function scheduleForQuality(quality) {
  return {
    missed: 0,
    hard: 1,
    shaky: 2,
    known: 4,
    easy: 7,
    new: 0
  }[quality] ?? 0;
}

function getDueCards() {
  if (!currentKit) {
    return [];
  }
  const today = isoDate(0);
  return currentKit.flashcards.filter((card) => !card.nextReview || card.nextReview <= today);
}

function getNextReview() {
  if (!currentKit || !currentKit.flashcards.length) {
    return "";
  }
  return currentKit.flashcards
    .map((card) => card.nextReview)
    .filter(Boolean)
    .sort()[0] || "";
}

function resetGames() {
  gameState = {
    mode: "match",
    xp: 0,
    streak: 0,
    selected: null,
    matched: [],
    sprintIndex: 0,
    typeIndex: 0
  };
}

function resetAssistant() {
  assistantHistory = [];
}

function calculateReadiness() {
  if (!currentKit || !currentKit.flashcards.length) {
    return 0;
  }

  const values = { easy: 1, known: 0.85, shaky: 0.55, hard: 0.32, missed: 0.15, new: 0.25 };
  const total = currentKit.flashcards.reduce((sum, card) => sum + values[card.mastery], 0);
  return Math.round((total / currentKit.flashcards.length) * 100);
}

function renderFlashcardFace(card, index, isAnswer = false) {
  const qualityLabel = {
    missed: "New",
    hard: "Hard",
    shaky: "Shaky",
    known: "Known",
    easy: "Easy",
    new: "New"
  }[card.mastery] || "New";
  const typeLabel = {
    define: "Definition",
    clue: "Source Clue",
    why: "Why It Matters",
    teach: "Teach Back",
    apply: "Apply",
    compare: "Compare"
  }[card.type] || "Recall";

  if (isAnswer) {
    return `
      <span class="card-kicker">${escapeHtml(typeLabel)} answer</span>
      <strong class="card-title">${escapeHtml(card.term)}</strong>
      <p class="card-answer">${escapeHtml(stripTermPrefix(card.answer))}</p>
      <div class="card-clue-row">
        <span>${escapeHtml(card.clue || "Source backed")}</span>
        <span>${escapeHtml(qualityLabel)}</span>
      </div>
    `;
  }

  return `
    <span class="card-kicker">${escapeHtml(typeLabel)}</span>
    <strong class="card-title">${escapeHtml(card.term)}</strong>
    <p class="card-prompt">${escapeHtml(card.prompt)}</p>
    <div class="card-clue-row">
      <span>${escapeHtml(card.clue || "Find the clue")}</span>
      <span>Tap to reveal</span>
    </div>
  `;
}

function buildKit() {
  const text = notesInput.value.trim();
  if (!text) {
    notesInput.focus();
    return;
  }

  enforcePlanLimits();

  const words = getWords(text);
  const sentences = getSentences(text);
  const focus = focusSelect.value;
  const difficulty = difficultySelect.value;
  const minutes = Number(sessionSelect.value);
  const cardCount = Number(cardCountSelect.value);
  const terms = extractTerms(text, Math.max(cardCount, 16));
  const summary = rankSentences(sentences, terms, difficulty);
  const flashcards = makeFlashcards(sentences, terms, cardCount, difficulty);
  const quiz = makeQuiz(flashcards, difficulty, quizModeSelect.value);

  currentKit = {
    createdAt: new Date().toISOString(),
    focus,
    difficulty,
    minutes,
    words: words.length,
    examDate: examDateInput.value,
    quizMode: quizModeSelect.value,
    terms,
    summary,
    targets: makeLearningTargets(terms, focus),
    flashcards,
    quiz,
    weakSpots: makeWeakList(terms),
    sourceChecks: makeSourceChecks(sentences, terms),
    conceptMap: makeConceptMap(terms, sentences),
    coach: makeCoachBrief(words.length, terms, focus, difficulty),
    plan: makePlan(minutes, focus, difficulty, terms)
  };

  resetGames();
  resetAssistant();
  resetTimer();
  renderKit();
}

function renderKit() {
  const workspace = document.querySelector(".workspace");

  if (!currentKit) {
    emptyState.classList.remove("is-hidden");
    workspace.classList.remove("has-kit");
    kitTitle.textContent = "Ready when your notes are";
    readinessScore.textContent = "0%";
    wordCount.textContent = "0";
    readingTime.textContent = "0 min";
    keyTermCount.textContent = "0";
    applyPlanState();
    return;
  }

  emptyState.classList.add("is-hidden");
  workspace.classList.add("has-kit");
  kitTitle.textContent = `${titleCase(currentKit.focus)} kit`;
  readinessScore.textContent = `${calculateReadiness()}%`;
  wordCount.textContent = currentKit.words;
  readingTime.textContent = `${Math.max(1, Math.ceil(currentKit.words / 220))} min`;
  keyTermCount.textContent = currentKit.terms.length;
  coachBrief.textContent = currentKit.coach;
  applyPlanState();

  targetList.innerHTML = currentKit.targets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  weakList.innerHTML = currentKit.weakSpots.map((item) => `
    <article>
      <strong>${escapeHtml(item.term)}</strong>
      <p>${escapeHtml(item.reason)}</p>
    </article>
  `).join("");
  sourceCheckList.innerHTML = (currentKit.sourceChecks || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  summaryList.innerHTML = currentKit.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  termList.innerHTML = currentKit.terms.map(({ term }) => `<span>${escapeHtml(titleCase(term))}</span>`).join("");
  conceptMap.innerHTML = (currentKit.conceptMap || []).map((item) => `
    <article>
      <strong>${escapeHtml(item.term)}</strong>
      <p>${escapeHtml(item.related.join(" -> "))}</p>
    </article>
  `).join("");

  flashcardGrid.innerHTML = currentKit.flashcards.map((card, index) => `
    <article class="flashcard">
      <button class="flip-button" type="button" data-card="${index}" aria-expanded="false">
        ${renderFlashcardFace(card, index)}
      </button>
      <div class="quality-row" aria-label="Recall quality">
        <button class="quality-button ${card.mastery === "missed" ? "is-selected" : ""}" data-quality="missed" data-quality-card="${index}" type="button" title="Forgot">1</button>
        <button class="quality-button ${card.mastery === "hard" ? "is-selected" : ""}" data-quality="hard" data-quality-card="${index}" type="button" title="Hard">2</button>
        <button class="quality-button ${card.mastery === "shaky" ? "is-selected" : ""}" data-quality="shaky" data-quality-card="${index}" type="button" title="Shaky">3</button>
        <button class="quality-button ${card.mastery === "known" ? "is-selected" : ""}" data-quality="known" data-quality-card="${index}" type="button" title="Known">4</button>
        <button class="quality-button ${card.mastery === "easy" ? "is-selected" : ""}" data-quality="easy" data-quality-card="${index}" type="button" title="Easy">5</button>
      </div>
    </article>
  `).join("");

  quizList.innerHTML = currentKit.quiz.map((item, index) => `
    <article class="quiz-card">
      <p>${index + 1}. ${escapeHtml(item.question)}</p>
      ${renderQuizAnswer(item, index)}
      <div class="feedback" data-feedback="${index}"></div>
      <small class="quiz-rubric">${escapeHtml(item.rubric || "Check your answer against the source notes.")}</small>
    </article>
  `).join("");
  quizScore.textContent = `0 / ${currentKit.quiz.length}`;
  renderGames();
  renderAssistant();
  renderReviewProgress();
  renderIntegrations();
  renderCollaboration();

  planList.innerHTML = currentKit.plan.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  reviewList.innerHTML = [
    { label: formatDate(1), detail: "Repeat missed quiz answers and mark shaky cards." },
    { label: formatDate(3), detail: "Review all flashcards, then rewrite the summary from memory." },
    { label: formatDate(7), detail: "Take the quiz cold and rebuild the weak spot list." }
  ].map((item) => `
    <article>
      <strong>${escapeHtml(item.label)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `).join("");
  triggerWorkspaceMotion();
}

function renderQuizAnswer(item, index) {
  if (item.mode === "choice") {
    return `
      <div class="choice-grid">
        ${item.choices.map((choice) => `<button type="button" data-choice="${index}" data-value="${escapeHtml(choice.toLowerCase())}">${escapeHtml(choice)}</button>`).join("")}
      </div>
    `;
  }

  if (item.mode === "truefalse") {
    return `
      <p class="feedback">${escapeHtml(item.statement)}</p>
      <div class="choice-grid">
        <button type="button" data-choice="${index}" data-value="__true__">True</button>
        <button type="button" data-choice="${index}" data-value="__false__">False</button>
      </div>
    `;
  }

  return `
    <div class="answer-row">
      <input type="text" autocomplete="off" data-answer-input="${index}" placeholder="Type the key term" />
      <button type="button" data-check="${index}">Check</button>
    </div>
  `;
}

function renderReviewProgress() {
  if (!currentKit) {
    return;
  }

  const known = currentKit.flashcards.filter((card) => card.mastery === "known" || card.mastery === "easy").length;
  const needsWork = currentKit.flashcards.filter((card) => ["missed", "hard", "shaky", "new"].includes(card.mastery)).length;
  const dueCards = getDueCards();

  knownCount.textContent = known;
  needsWorkCount.textContent = needsWork;
  nextReviewDate.textContent = friendlyDate(getNextReview());
  dueReviewList.innerHTML = dueCards.length
    ? dueCards.map((card) => `
      <article>
        <strong>${escapeHtml(card.term)}</strong>
        <p>${escapeHtml(card.prompt)} Due ${escapeHtml(friendlyDate(card.nextReview))}.</p>
      </article>
    `).join("")
    : `<article><strong>Nothing due</strong><p>Your next card review is ${escapeHtml(friendlyDate(getNextReview()))}.</p></article>`;
}

function renderGames() {
  if (!currentKit || !currentKit.flashcards.length) {
    gameBoard.innerHTML = `<div class="type-clue">Generate a kit with key terms to unlock games.</div>`;
    return;
  }

  gameXp.textContent = gameState.xp;
  gameStreak.textContent = gameState.streak;
  gameModeLabel.textContent = titleCase(gameState.mode);
  document.querySelectorAll(".game-mode").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gameMode === gameState.mode);
  });

  lessonPath.innerHTML = [
    { label: "Read", detail: "Skim summary", complete: currentKit.summary.length > 0 },
    { label: "Match", detail: "Pair terms", complete: gameState.matched.length >= Math.min(4, currentKit.flashcards.length) },
    { label: "Sprint", detail: "Fast choices", complete: gameState.sprintIndex >= Math.min(5, currentKit.flashcards.length) },
    { label: "Type", detail: "Recall terms", complete: gameState.typeIndex >= Math.min(4, currentKit.flashcards.length) },
    { label: "Review", detail: "Schedule weak cards", complete: calculateReadiness() >= 70 }
  ].map((step, index) => `
    <article class="path-step ${step.complete ? "is-complete" : ""}">
      <div class="path-node">${step.complete ? "OK" : index + 1}</div>
      <div>
        <strong>${escapeHtml(step.label)}</strong>
        <p>${escapeHtml(step.detail)}</p>
      </div>
      <span>${step.complete ? "Done" : "Next"}</span>
    </article>
  `).join("");

  if (gameState.mode === "sprint") {
    renderSprintGame();
    return;
  }

  if (gameState.mode === "type") {
    renderTypeGame();
    return;
  }

  renderMatchGame();
}

function renderMatchGame() {
  const cards = currentKit.flashcards.slice(0, Math.min(5, currentKit.flashcards.length));
  const prompts = cards.map((card, index) => ({
    id: `term-${index}`,
    term: card.term,
    pair: card.term,
    type: "term",
    text: card.term
  }));
  const answers = cards.map((card, index) => ({
    id: `answer-${index}`,
    term: card.term,
    pair: card.term,
    type: "answer",
    text: truncate(card.answer, 86)
  }));
  const items = shuffle([...prompts, ...answers]);

  gameBoard.innerHTML = `
    <div class="game-prompt">
      <strong>Match terms to their source clues</strong>
      <p>Works with any topic because it uses your generated terms and notes.</p>
    </div>
    <div class="match-grid">
      ${items.map((item) => `
        <button class="game-card ${gameState.matched.includes(item.pair) ? "is-matched" : ""} ${gameState.selected?.id === item.id ? "is-selected" : ""}"
          data-match-id="${escapeHtml(item.id)}"
          data-match-term="${escapeHtml(item.term)}"
          data-match-type="${escapeHtml(item.type)}"
          type="button">
          ${escapeHtml(item.text)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderSprintGame() {
  const cards = currentKit.flashcards;
  const card = cards[gameState.sprintIndex % cards.length];

  gameBoard.innerHTML = `
    <div class="game-prompt">
      <strong>XP Sprint</strong>
      <p>${escapeHtml(card.prompt)}</p>
    </div>
    <div class="sprint-grid">
      ${pickChoices(card.term, cards).map((choice) => `
        <button class="sprint-choice" data-sprint-choice="${escapeHtml(choice.toLowerCase())}" type="button">${escapeHtml(choice)}</button>
      `).join("")}
    </div>
  `;
}

function renderTypeGame() {
  const cards = currentKit.flashcards;
  const card = cards[gameState.typeIndex % cards.length];

  gameBoard.innerHTML = `
    <div class="game-prompt">
      <strong>Type Recall</strong>
      <p>Type the key term that matches the clue.</p>
    </div>
    <div class="type-game">
      <div class="type-clue">${escapeHtml(truncate(card.answer, 180))}</div>
      <div class="answer-row">
        <input id="typeGameInput" type="text" autocomplete="off" placeholder="Type the term" />
        <button id="typeGameCheck" type="button">Check</button>
      </div>
    </div>
  `;
}

function awardGameResult(term, isCorrect, points = 10) {
  const card = currentKit.flashcards.find((item) => item.term.toLowerCase() === term.toLowerCase());
  if (isCorrect) {
    gameState.xp += points + Math.min(gameState.streak, 5);
    gameState.streak += 1;
  } else {
    gameState.streak = 0;
  }

  if (card) {
    card.mastery = isCorrect ? "known" : "hard";
    card.nextReview = isoDate(scheduleForQuality(card.mastery));
  }

  gameFeedback.className = `game-feedback ${isCorrect ? "correct" : "missed"}`;
  gameFeedback.textContent = isCorrect
    ? `Nice. +${points} XP for ${titleCase(term)}.`
    : `Almost. Review ${titleCase(term)} and try again.`;
  readinessScore.textContent = `${calculateReadiness()}%`;
  renderReviewProgress();
}

function renderAssistant() {
  if (!currentKit) {
    assistantStatus.textContent = modelConfig.ready ? modelConfig.model : "Model setup needed";
    assistantMessages.innerHTML = `
      <article class="message assistant">
        <strong>Study Coach</strong>
        <p>Generate a study kit first, then I can answer from your notes with ${escapeHtml(modelConfig.model)}.</p>
      </article>
    `;
    return;
  }

  assistantStatus.textContent = modelConfig.ready ? modelConfig.model : "Cloud setup needed";
  const starter = {
    role: "assistant",
    text: modelConfig.ready
      ? `I am connected to ${modelConfig.model} and can tutor from your notes. Ask me to generate notes, explain concepts, quiz you, or build a study plan.`
      : "Cloud AI is not connected yet, so I am using local fallback coaching. Add a hosted model API key on the server for real AI responses."
  };
  const messages = assistantHistory.length ? assistantHistory : [starter];
  assistantMessages.innerHTML = messages.map((message) => `
    <article class="message ${message.role}">
      <strong>${message.role === "user" ? "You" : "Study Coach"}</strong>
      <p>${escapeHtml(message.text)}</p>
    </article>
  `).join("");
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

async function loadModelConfig() {
  const endpoints = ["/api/config", "http://127.0.0.1:4174/api/config", "http://127.0.0.1:4175/api/config"];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        continue;
      }
      modelConfig = await response.json();
      modelConfig.apiBase = endpoint.replace("/api/config", "");
      renderAssistant();
      renderIntegrations();
      return;
    } catch {
      // Try the next endpoint.
    }
  }
  modelConfig = { ready: false, model: "Cloud model", provider: "compatible", apiBase: "" };
  renderAssistant();
  renderIntegrations();
}

function findRelevantCard(prompt) {
  if (!currentKit || !currentKit.flashcards.length) {
    return null;
  }

  const query = normalizeAnswer(prompt);
  const queryWords = query.split(" ").filter((word) => word.length > 2);
  const scored = currentKit.flashcards.map((card) => {
    const haystack = normalizeAnswer(`${card.term} ${card.prompt} ${card.answer}`);
    const score = queryWords.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0)
      + (haystack.includes(normalizeAnswer(card.term)) ? 0.5 : 0);
    return { card, score };
  });

  return scored.sort((a, b) => b.score - a.score)[0]?.card || currentKit.flashcards[0];
}

function getWeakestCard() {
  if (!currentKit || !currentKit.flashcards.length) {
    return null;
  }
  const priority = { missed: 0, hard: 1, shaky: 2, new: 3, known: 4, easy: 5 };
  return [...currentKit.flashcards].sort((a, b) => priority[a.mastery] - priority[b.mastery])[0];
}

function makeAssistantResponse(prompt) {
  if (!currentKit) {
    return "Generate a study kit first so I can stay grounded in your notes.";
  }

  const lower = prompt.toLowerCase();
  const relevant = findRelevantCard(prompt);
  const weak = getWeakestCard();

  if (lower.includes("hint")) {
    const card = weak || relevant;
    return `Hint: focus on what ${card.term} does in the source notes. Do not try to memorize the full sentence yet. First say the role of ${card.term} in your own words.`;
  }

  if (lower.includes("quiz") || lower.includes("question")) {
    const card = weak || relevant;
    return `Try this: ${card.prompt} Answer in one sentence, then check whether your answer mentions ${card.term}.`;
  }

  if (lower.includes("weak") || lower.includes("next")) {
    const card = weak || relevant;
    return `Study ${card.term} next. It is marked ${card.mastery}, so do one slow recall attempt, then play Match once. Source clue: ${truncate(card.answer, 150)}`;
  }

  if (lower.includes("teach") || lower.includes("simple") || lower.includes("explain")) {
    const card = relevant || weak;
    return `${card.term}, simply: ${truncate(card.answer, 170)} Now teach it back without reading, using one example from your notes.`;
  }

  if (lower.includes("plan")) {
    return `Use this flow: ${currentKit.plan.join(" ")} Your readiness is ${calculateReadiness()}%, so start with the weakest card before doing a full quiz.`;
  }

  if (relevant) {
    return `From your kit: ${relevant.term} connects to this source clue: ${truncate(relevant.answer, 180)} A good recall question is: ${relevant.prompt}`;
  }

  return `I can help, but I only see this generated kit. Ask about one of these terms: ${currentKit.terms.slice(0, 5).map(({ term }) => titleCase(term)).join(", ")}.`;
}

async function askAssistant(prompt) {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    return;
  }
  assistantHistory.push({ role: "user", text: cleanPrompt });
  assistantHistory.push({ role: "assistant", text: "Thinking..." });
  renderAssistant();

  const thinkingIndex = assistantHistory.length - 1;
  if (modelConfig.ready) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 42000);
    try {
      const response = await fetch(`${modelConfig.apiBase}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId: assistantSessionId,
          message: cleanPrompt,
          notes: notesInput.value,
          kit: currentKit
        })
      });
      window.clearTimeout(timeoutId);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Model request failed.");
      }
      assistantHistory[thinkingIndex] = { role: "assistant", text: payload.text };
      renderAssistant();
      return;
    } catch (error) {
      window.clearTimeout(timeoutId);
      const reason = error.name === "AbortError"
        ? "The model took too long to answer."
        : error.message;
      assistantHistory[thinkingIndex] = {
        role: "assistant",
        text: `The model call failed, so I used local fallback. Setup issue: ${reason}\n\n${makeAssistantResponse(cleanPrompt)}`
      };
      renderAssistant();
      return;
    }
  }

  assistantHistory[thinkingIndex] = {
    role: "assistant",
    text: `Cloud AI is not connected yet. Add a hosted model API key on the server for full AI tutoring.\n\nLocal fallback: ${makeAssistantResponse(cleanPrompt)}`
  };
  renderAssistant();
}

function savedKitPayload() {
  return {
    notes: notesInput.value,
    focus: focusSelect.value,
    difficulty: difficultySelect.value,
    session: sessionSelect.value,
    cardCount: cardCountSelect.value,
    quizMode: quizModeSelect.value,
    examDate: examDateInput.value,
    kit: currentKit
  };
}

function applySavedKit(saved) {
  notesInput.value = saved.notes || "";
  focusSelect.value = saved.focus || "exam";
  difficultySelect.value = saved.difficulty || "balanced";
  sessionSelect.value = saved.session || "25";
  cardCountSelect.value = saved.cardCount || "8";
  quizModeSelect.value = saved.quizMode || saved.kit?.quizMode || "mixed";
  examDateInput.value = saved.examDate || saved.kit?.examDate || "";
  currentKit = saved.kit || null;
  resetTimer();
  renderKit();
}

async function saveKit() {
  if (!currentKit) {
    return;
  }

  const payload = savedKitPayload();
  localStorage.setItem("studyPilotKit", JSON.stringify(payload));

  if (currentUser) {
    try {
      const response = await fetch(`${apiBase()}/api/kits/latest`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Cloud save failed.");
      }
      saveBtn.textContent = "Synced";
    } catch {
      saveBtn.textContent = "Saved local";
    }
  } else {
    saveBtn.textContent = "Saved";
  }
  window.setTimeout(() => {
    saveBtn.textContent = "Save";
  }, 900);
}

async function loadRemoteKit() {
  if (!currentUser) {
    return;
  }
  try {
    const response = await fetch(`${apiBase()}/api/kits/latest`, {
      headers: authHeaders()
    });
    if (!response.ok) {
      return;
    }
    const payload = await response.json();
    if (payload.kit) {
      localStorage.setItem("studyPilotKit", JSON.stringify(payload.kit));
      applySavedKit(payload.kit);
    }
  } catch {
    // Keep the local kit if cloud sync is not reachable.
  }
}

function loadKit() {
  const stored = localStorage.getItem("studyPilotKit");
  if (!stored) {
    return;
  }

  try {
    const saved = JSON.parse(stored);
    applySavedKit(saved);
  } catch {
    localStorage.removeItem("studyPilotKit");
  }
}

function exportKit() {
  if (!currentKit) {
    return;
  }

  const lines = [
    "StudyPilot AI Kit",
    `Goal: ${currentKit.focus}`,
    `Difficulty: ${currentKit.difficulty}`,
    `Quiz mode: ${currentKit.quizMode}`,
    `Readiness: ${calculateReadiness()}%`,
    "",
    "Coach Brief",
    currentKit.coach,
    "",
    "Summary",
    ...currentKit.summary.map((item) => `- ${item}`),
    "",
    "Flashcards",
    ...currentKit.flashcards.map((card) => `- ${card.prompt} Answer: ${card.answer} Next review: ${friendlyDate(card.nextReview)}`),
    "",
    "Plan",
    ...currentKit.plan.map((item, index) => `${index + 1}. ${item}`)
  ];

  downloadTextFile("studypilot-kit.txt", lines.join("\n"));
}

function exportFlashcardsTsv() {
  if (!currentKit) {
    showUpgrade("Generate a study kit before exporting flashcards.");
    return;
  }
  const rows = currentKit.flashcards.map((card) => [
    card.prompt.replace(/\t|\n/g, " "),
    card.answer.replace(/\t|\n/g, " "),
    card.term.replace(/\t|\n/g, " ")
  ].join("\t"));
  downloadTextFile("studypilot-flashcards.tsv", ["Question\tAnswer\tTerm", ...rows].join("\n"), "text/tab-separated-values");
}

async function copyIntegrationPayload() {
  const payload = JSON.stringify(integrationPayload(), null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    copyIntegrationPayloadBtn.textContent = "Copied";
    window.setTimeout(() => {
      copyIntegrationPayloadBtn.textContent = "Copy Payload";
    }, 900);
  } catch {
    downloadTextFile("studypilot-integration-payload.json", payload, "application/json");
  }
}

function handleIntegrationAction(action) {
  if (action === "obsidian") {
    exportObsidianKit();
    return;
  }
  if (action === "calendar") {
    if (!currentKit) {
      showUpgrade("Generate a study kit before exporting review events.");
      return;
    }
    downloadTextFile("studypilot-review-calendar.ics", makeCalendarExport(), "text/calendar");
    return;
  }
  if (action === "cards") {
    exportFlashcardsTsv();
    return;
  }
  if (action === "payload") {
    copyIntegrationPayload();
    return;
  }
  if (action === "pricing") {
    showUpgrade("Stripe checkout is scaffolded. Add live Stripe keys and webhooks before charging users.");
    return;
  }
  if (action === "docs") {
    downloadTextFile("studypilot-cloud-ai-env.txt", [
      "MODEL_PROVIDER=compatible",
      "COMPATIBLE_API_BASE_URL=https://openrouter.ai/api/v1",
      "COMPATIBLE_API_KEY=sk-or-v1_...",
      "COMPATIBLE_MODEL=openrouter/free"
    ].join("\n"));
    return;
  }
  showUpgrade("This integration needs accounts/OAuth before it can connect for real users.");
}

function exportObsidianKit() {
  if (!currentKit) {
    return;
  }

  if (!hasProAccess()) {
    showUpgrade("Obsidian export is a Pro feature because it creates reusable vault-ready study notes.");
    return;
  }

  const created = new Date(currentKit.createdAt);
  const noteTitle = `StudyPilot ${titleCase(currentKit.focus)} Kit`;
  const tags = ["study", "studypilot", currentKit.focus, currentKit.difficulty]
    .map((tag) => tag.replace(/[^a-z0-9-]/gi, "").toLowerCase());
  const termLinks = currentKit.terms.slice(0, 12).map(({ term }) => wikilinkTerm(term));
  const reviewDates = [1, 3, 7].map(formatDate);

  const markdown = [
    "---",
    `title: "${yamlSafe(noteTitle)}"`,
    `created: ${created.toISOString().slice(0, 10)}`,
    `goal: ${currentKit.focus}`,
    `difficulty: ${currentKit.difficulty}`,
    `quiz_mode: ${currentKit.quizMode}`,
    `session_minutes: ${currentKit.minutes}`,
    `exam_date: ${currentKit.examDate || ""}`,
    `readiness: ${calculateReadiness()}`,
    `tags: [${tags.join(", ")}]`,
    "---",
    "",
    `# ${noteTitle}`,
    "",
    "> [!summary] Coach Brief",
    `> ${currentKit.coach}`,
    "",
    "## Learning Targets",
    ...currentKit.targets.map((item) => `- [ ] ${item}`),
    "",
    "## Key Terms",
    termLinks.join(", "),
    "",
    "## Core Summary",
    ...currentKit.summary.map((item) => `- ${item}`),
    "",
    "## Active Recall Cards",
    ...currentKit.flashcards.flatMap((card) => [
      `### ${card.term}`,
      `Question:: ${card.prompt}`,
      `Answer:: ${card.answer}`,
      `Status:: ${card.mastery}`,
      `Next review:: ${card.nextReview || isoDate(0)}`,
      ""
    ]),
    "## Source Check",
    ...currentKit.sourceChecks.map((item) => `- ${item}`),
    "",
    "## Quick Check",
    ...currentKit.quiz.map((item, index) => `${index + 1}. ${item.question}\n   - Answer: ${titleCase(item.answer)}`),
    "",
    "## Study Flow",
    ...currentKit.plan.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Spaced Review",
    `- [ ] ${reviewDates[0]}: Repeat missed quiz answers and mark shaky cards.`,
    `- [ ] ${reviewDates[1]}: Review all flashcards, then rewrite the summary from memory.`,
    `- [ ] ${reviewDates[2]}: Take the quiz cold and rebuild the weak spot list.`,
    "",
    "## Source Notes",
    "```text",
    notesInput.value.trim(),
    "```"
  ].join("\n");

  const filename = `${slugify(noteTitle)}-${created.toISOString().slice(0, 10)}.md`;
  downloadTextFile(filename, markdown, "text/markdown");
}

function resetTimer() {
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.secondsLeft = Number(sessionSelect.value) * 60;
  timerStartBtn.textContent = "Start";
  timerLabel.textContent = "Ready";
  renderTimer();
}

function renderTimer() {
  const minutes = Math.floor(timer.secondsLeft / 60);
  const seconds = timer.secondsLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toggleTimer() {
  if (timer.intervalId) {
    window.clearInterval(timer.intervalId);
    timer.intervalId = null;
    timerStartBtn.textContent = "Resume";
    timerLabel.textContent = "Paused";
    return;
  }

  timerStartBtn.textContent = "Pause";
  timerLabel.textContent = "Focus running";
  timer.intervalId = window.setInterval(() => {
    timer.secondsLeft = Math.max(0, timer.secondsLeft - 1);
    renderTimer();
    if (timer.secondsLeft === 0) {
      window.clearInterval(timer.intervalId);
      timer.intervalId = null;
      timerStartBtn.textContent = "Start";
      timerLabel.textContent = "Session complete";
    }
  }, 1000);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("is-active");
  });
});

document.querySelectorAll("[data-tab-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tabJump;
    const tab = document.querySelector(`.tab[data-tab="${target}"]`);
    if (tab) {
      tab.click();
    }
  });
});

flashcardGrid.addEventListener("click", (event) => {
  const qualityButton = event.target.closest("button[data-quality-card]");
  if (qualityButton && currentKit) {
    const index = Number(qualityButton.dataset.qualityCard);
    const quality = qualityButton.dataset.quality;
    currentKit.flashcards[index].mastery = quality;
    currentKit.flashcards[index].nextReview = isoDate(scheduleForQuality(quality));
    renderKit();
    return;
  }

  const button = event.target.closest("button[data-card]");
  if (!button || !currentKit) {
    return;
  }

  const card = currentKit.flashcards[Number(button.dataset.card)];
  const isAnswer = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isAnswer));
  button.innerHTML = renderFlashcardFace(card, Number(button.dataset.card), !isAnswer);
});

quizList.addEventListener("click", (event) => {
  const choiceButton = event.target.closest("button[data-choice]");
  if (choiceButton && currentKit) {
    const index = Number(choiceButton.dataset.choice);
    const item = currentKit.quiz[index];
    const selected = choiceButton.dataset.value;
    const expectedValue = item.mode === "truefalse"
      ? (item.statementIsTrue ? "__true__" : "__false__")
      : item.answer;
    const isCorrect = selected === expectedValue;
    const feedback = quizList.querySelector(`[data-feedback="${index}"]`);

    feedback.className = `feedback ${isCorrect ? "correct" : "missed"}`;
    feedback.textContent = isCorrect ? "Correct. Keep it moving." : `Review this one: ${titleCase(item.answer)}.`;
    updateCardFromQuiz(item.answer, isCorrect);
    updateQuizScore();
    return;
  }

  const button = event.target.closest("button[data-check]");
  if (!button || !currentKit) {
    return;
  }

  const index = Number(button.dataset.check);
  const input = quizList.querySelector(`[data-answer-input="${index}"]`);
  const feedback = quizList.querySelector(`[data-feedback="${index}"]`);
  const expected = currentKit.quiz[index].answer;
  const isCorrect = isAnswerMatch(input.value, expected);

  feedback.className = `feedback ${isCorrect ? "correct" : "missed"}`;
  feedback.textContent = isCorrect ? "Correct. Keep it moving." : `Review this one: ${titleCase(expected)}.`;

  updateCardFromQuiz(expected, isCorrect);
  updateQuizScore();
});

document.querySelectorAll(".game-mode").forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentKit) {
      return;
    }
    const premiumGame = button.dataset.gameMode === "sprint" || button.dataset.gameMode === "type";
    if (premiumGame && !hasProAccess()) {
      showUpgrade("Pro unlocks Sprint and Type Recall games for faster, more varied practice.");
      return;
    }
    gameState.mode = button.dataset.gameMode;
    gameState.selected = null;
    gameFeedback.className = "game-feedback";
    gameFeedback.textContent = "";
    renderGames();
  });
});

gameBoard.addEventListener("click", (event) => {
  const matchButton = event.target.closest("button[data-match-id]");
  if (matchButton && currentKit) {
    const selected = {
      id: matchButton.dataset.matchId,
      term: matchButton.dataset.matchTerm,
      type: matchButton.dataset.matchType
    };

    if (gameState.matched.includes(selected.term)) {
      return;
    }

    if (!gameState.selected) {
      gameState.selected = selected;
      renderGames();
      return;
    }

    const previous = gameState.selected;
    const isPair = previous.term === selected.term && previous.type !== selected.type;
    gameState.selected = null;
    if (isPair) {
      gameState.matched = Array.from(new Set([...gameState.matched, selected.term]));
      awardGameResult(selected.term, true, 12);
    } else {
      awardGameResult(previous.term, false, 0);
    }
    renderGames();
    return;
  }

  const sprintButton = event.target.closest("button[data-sprint-choice]");
  if (sprintButton && currentKit) {
    const cards = currentKit.flashcards;
    const card = cards[gameState.sprintIndex % cards.length];
    const isCorrect = sprintButton.dataset.sprintChoice === card.term.toLowerCase();
    awardGameResult(card.term, isCorrect, 10);
    gameState.sprintIndex += 1;
    renderGames();
    return;
  }

  const typeButton = event.target.closest("#typeGameCheck");
  if (typeButton && currentKit) {
    checkTypeGameAnswer();
  }
});

gameBoard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches("#typeGameInput")) {
    checkTypeGameAnswer();
  }
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  askAssistant(assistantInput.value);
  assistantInput.value = "";
});

document.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    askAssistant(button.dataset.assistantPrompt);
  });
});

chooseFileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileDropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  addStudyFiles(fileInput.files);
  fileInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  fileDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    fileDropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  fileDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    fileDropZone.classList.remove("is-dragging");
  });
});

fileDropZone.addEventListener("drop", (event) => {
  addStudyFiles(event.dataTransfer.files);
});

fileList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove-file]");
  if (!button) {
    return;
  }
  removeImportedFile(Number(button.dataset.removeFile));
});

integrationGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-integration-action]");
  if (!button) {
    return;
  }
  handleIntegrationAction(button.dataset.integrationAction);
});

copyIntegrationPayloadBtn.addEventListener("click", copyIntegrationPayload);
createRoomBtn.addEventListener("click", createCollabRoom);
copyInviteBtn.addEventListener("click", copyCollabInvite);
peerChallengeBtn.addEventListener("click", createPeerChallenge);
exportGroupReportBtn.addEventListener("click", exportGroupReport);
collabModeSelect.addEventListener("change", () => {
  if (collabRoom) {
    collabRoom.mode = collabModeSelect.value;
    localStorage.setItem("studyPilotCollabRoom", JSON.stringify(collabRoom));
  }
  renderCollaboration();
});
collabInviteInput.addEventListener("input", renderCollaboration);

function updateCalculator() {
  try {
    const result = calculateExpression(calcInput.value);
    calcResult.textContent = result;
    return result;
  } catch (error) {
    calcResult.textContent = error.message;
    return "";
  }
}

function pushCalcHistory() {
  const expression = calcInput.value.trim();
  const result = updateCalculator();
  if (!expression || !result || result.includes("Use numbers")) {
    return;
  }
  calcEntries = [{ expression, result }, ...calcEntries].slice(0, 6);
  calcHistory.innerHTML = calcEntries.map((entry) => `
    <article>
      <span>${escapeHtml(entry.expression)}</span>
      <strong>${escapeHtml(entry.result)}</strong>
    </article>
  `).join("");
}

document.querySelectorAll("[data-calc-value]").forEach((button) => {
  button.addEventListener("click", () => {
    calcInput.value += button.dataset.calcValue;
    updateCalculator();
    calcInput.focus();
  });
});

document.querySelectorAll("[data-calc-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.calcAction === "clear") {
      calcInput.value = "";
    }
    if (button.dataset.calcAction === "back") {
      calcInput.value = calcInput.value.slice(0, -1);
    }
    if (button.dataset.calcAction === "equals") {
      pushCalcHistory();
      return;
    }
    updateCalculator();
    calcInput.focus();
  });
});

document.querySelectorAll("[data-formula]").forEach((button) => {
  button.addEventListener("click", () => {
    const formulas = {
      percent: {
        expression: "((120-100)/100)*100",
        help: "Percent change: replace 120 with new value and 100 with old value."
      },
      average: {
        expression: "(85+90+95)/3",
        help: "Average: replace the sample numbers with your values."
      },
      distance: {
        expression: "60*2",
        help: "Distance = rate x time. Replace 60 and 2 with your numbers."
      },
      compound: {
        expression: "1000*(1+0.05)^3",
        help: "Compound interest: principal x (1 + rate)^years."
      }
    };
    const formula = formulas[button.dataset.formula];
    calcInput.value = formula.expression;
    formulaHelp.textContent = formula.help;
    updateCalculator();
    calcInput.focus();
  });
});

calcInput.addEventListener("input", updateCalculator);
calcInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    pushCalcHistory();
  }
});

function visualSvg(card, index) {
  const term = escapeHtml(card.term);
  const rawAnswer = stripTermPrefix(card.answer);
  const answer = escapeHtml(truncate(rawAnswer, 145));
  const accent = ["#e6c66f", "#83b9ff", "#bfa7ff", "#9ff0bd"][index % 4];
  const keywords = extractSourceKeywords(rawAnswer, card.term, 4).map(escapeHtml);
  const subtitle = visualStyle === "process" ? "PROCESS MAP" : visualStyle === "memory" ? "MEMORY ANCHOR" : "REFERENCE DIAGRAM";
  const nodes = visualStyle === "process"
    ? `<path d="M86 188 H374" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity=".8"/>
      ${keywords.slice(0, 3).map((keyword, stepIndex) => {
        const x = 90 + stepIndex * 140;
        return `<circle cx="${x}" cy="188" r="28" fill="${stepIndex === 0 ? accent : "#17202d"}" stroke="${accent}" stroke-width="3"/>
          <text x="${x}" y="195" text-anchor="middle" fill="${stepIndex === 0 ? "#101018" : accent}" font-size="18" font-weight="900">${stepIndex + 1}</text>
          <text x="${x}" y="245" text-anchor="middle" fill="#f6efe0" font-size="13" font-weight="800">${keyword}</text>`;
      }).join("")}`
    : visualStyle === "memory"
      ? `<circle cx="230" cy="185" r="78" fill="rgba(230,198,111,.1)" stroke="${accent}" stroke-width="4"/>
        <path d="M184 185 C198 145 262 145 276 185 C262 225 198 225 184 185Z" fill="none" stroke="${accent}" stroke-width="5"/>
        <circle cx="230" cy="185" r="16" fill="${accent}"/>
        ${keywords.slice(0, 4).map((keyword, keyIndex) => {
          const x = keyIndex % 2 === 0 ? 72 : 318;
          const y = keyIndex < 2 ? 148 : 234;
          return `<rect x="${x}" y="${y}" width="92" height="34" rx="17" fill="rgba(255,255,255,.08)" stroke="${accent}" opacity=".95"/>
            <text x="${x + 46}" y="${y + 22}" text-anchor="middle" fill="#f6efe0" font-size="12" font-weight="800">${keyword}</text>`;
        }).join("")}`
      : `<rect x="58" y="142" width="344" height="124" rx="22" fill="rgba(255,255,255,.075)" stroke="${accent}" stroke-width="3"/>
        <line x1="230" y1="142" x2="230" y2="266" stroke="${accent}" opacity=".35"/>
        <text x="92" y="178" fill="${accent}" font-size="14" font-weight="900">TERM</text>
        <text x="268" y="178" fill="${accent}" font-size="14" font-weight="900">SOURCE CLUES</text>
        ${keywords.slice(0, 3).map((keyword, clueIndex) => `<text x="268" y="${206 + clueIndex * 25}" fill="#f6efe0" font-size="15" font-weight="800">- ${keyword}</text>`).join("")}
        <circle cx="145" cy="218" r="38" fill="${accent}" opacity=".18"/>
        <text x="145" y="225" text-anchor="middle" fill="${accent}" font-size="28" font-weight="900">${term.slice(0, 2).toUpperCase()}</text>`;

  return `<svg viewBox="0 0 460 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${term} reference image">
    <defs>
      <linearGradient id="g${index}" x1="0" x2="1"><stop stop-color="#0b111a"/><stop offset="1" stop-color="#211827"/></linearGradient>
      <radialGradient id="r${index}" cx="78%" cy="8%" r="80%"><stop stop-color="${accent}" stop-opacity=".24"/><stop offset=".72" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="460" height="380" rx="26" fill="url(#g${index})"/>
    <rect width="460" height="380" rx="26" fill="url(#r${index})"/>
    <path d="M34 110 H426" stroke="${accent}" stroke-width="1" opacity=".28"/>
    <text x="34" y="44" fill="${accent}" font-size="13" font-weight="900" letter-spacing="2">${subtitle}</text>
    <text x="34" y="88" fill="#fff4c9" font-size="30" font-weight="900">${term}</text>
    ${nodes}
    <foreignObject x="34" y="298" width="392" height="58">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font: 700 13.5px Inter, Arial; color:#f6efe0; line-height:1.35">${answer}</div>
    </foreignObject>
  </svg>`;
}

function renderReferenceImages() {
  if (!currentKit || !currentKit.flashcards.length) {
    referenceGallery.innerHTML = `<article class="reference-card"><p>Generate a kit first, then create reference images.</p></article>`;
    return;
  }
  referenceGallery.innerHTML = currentKit.flashcards.slice(0, 6).map((card, index) => `
    <article class="reference-card">
      ${visualSvg(card, index)}
      <strong>${escapeHtml(card.term)}</strong>
      <button type="button" data-download-visual="${index}">Download SVG</button>
    </article>
  `).join("");
}

document.querySelectorAll("[data-visual-style]").forEach((button) => {
  button.addEventListener("click", () => {
    visualStyle = button.dataset.visualStyle;
    visualHelp.textContent = `Style set to ${button.textContent}.`;
    renderReferenceImages();
  });
});

generateVisualsBtn.addEventListener("click", renderReferenceImages);

referenceGallery.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-download-visual]");
  if (!button || !currentKit) {
    return;
  }
  const index = Number(button.dataset.downloadVisual);
  const card = currentKit.flashcards[index];
  downloadTextFile(`${slugify(card.term)}-reference.svg`, visualSvg(card, index), "image/svg+xml");
});

async function runResearch() {
  if (!currentKit) {
    researchResults.innerHTML = `<article class="research-card"><p>Generate a kit first so the app knows what to search for.</p></article>`;
    return;
  }
  researchResults.innerHTML = `<article class="research-card"><p>Checking related public references...</p></article>`;
  const endpoints = ["/api/research", "http://127.0.0.1:4174/api/research", "http://127.0.0.1:4175/api/research"];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: researchInput.value, kit: currentKit })
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        continue;
      }
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Research failed.");
      }
      researchResults.innerHTML = payload.results.length
        ? payload.results.map((item) => `
          <article class="research-card">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.snippet)}</p>
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">Open source</a>
          </article>
        `).join("")
        : `<article class="research-card"><p>No related sources found for ${escapeHtml(payload.query)}.</p></article>`;
      return;
    } catch {
      // Try the next research endpoint.
    }
  }

  researchResults.innerHTML = `<article class="research-card"><p>Web research needs the StudyPilot Node server. Run <strong>npm start</strong> and open the app from that server before checking related sources.</p></article>`;
}

researchBtn.addEventListener("click", runResearch);

function checkTypeGameAnswer() {
  const cards = currentKit.flashcards;
  const card = cards[gameState.typeIndex % cards.length];
  const input = document.querySelector("#typeGameInput");
  const isCorrect = isAnswerMatch(input.value, card.term);
  awardGameResult(card.term, isCorrect, 14);
  if (isCorrect) {
    gameState.typeIndex += 1;
    renderGames();
  } else {
    input.select();
  }
}

function updateCardFromQuiz(expected, isCorrect) {
  const matchingCard = currentKit.flashcards.find((card) => card.term.toLowerCase() === expected);
  if (matchingCard) {
    matchingCard.mastery = isCorrect ? "known" : "missed";
    matchingCard.nextReview = isoDate(scheduleForQuality(matchingCard.mastery));
  }
  readinessScore.textContent = `${calculateReadiness()}%`;
  renderReviewProgress();
}

function updateQuizScore() {
  const correctCount = Array.from(quizList.querySelectorAll(".feedback.correct")).length;
  quizScore.textContent = `${correctCount} / ${currentKit.quiz.length}`;
}

generateBtn.addEventListener("click", buildKit);
sampleBtn.addEventListener("click", () => {
  notesInput.value = sampleNotes;
  buildKit();
});
saveBtn.addEventListener("click", saveKit);
exportBtn.addEventListener("click", exportKit);
obsidianBtn.addEventListener("click", exportObsidianKit);
loginBtn.addEventListener("click", () => submitAuth("login"));
signupBtn.addEventListener("click", () => submitAuth("signup"));
logoutBtn.addEventListener("click", logout);
authPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitAuth("login");
  }
});
upgradeBtn.addEventListener("click", () => showUpgrade("Choose a plan to unlock deeper study sessions."));
closeUpgradeBtn.addEventListener("click", hideUpgrade);
upgradeModal.addEventListener("click", (event) => {
  if (event.target === upgradeModal) {
    hideUpgrade();
  }
  const choice = event.target.closest("button[data-plan-choice]");
  if (choice) {
    const plan = choice.dataset.planChoice;
    if (plan === "free") {
      setPlan(plan);
      return;
    }
    startCheckout(plan);
  }
});
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("studyPilotKit");
  notesInput.value = "";
  currentKit = null;
  resetTimer();
  renderKit();
});
resetMasteryBtn.addEventListener("click", () => {
  if (!currentKit) {
    return;
  }
  currentKit.flashcards.forEach((card) => {
    card.mastery = "new";
    card.nextReview = isoDate(0);
  });
  renderKit();
});
sessionSelect.addEventListener("change", resetTimer);
cardCountSelect.addEventListener("change", () => {
  enforcePlanLimits();
  applyPlanState();
});
difficultySelect.addEventListener("change", () => {
  enforcePlanLimits();
  applyPlanState();
});
quizModeSelect.addEventListener("change", () => {
  if (!currentKit) {
    return;
  }
  currentKit.quizMode = quizModeSelect.value;
  currentKit.quiz = makeQuiz(currentKit.flashcards, currentKit.difficulty, quizModeSelect.value);
  renderKit();
});
timerStartBtn.addEventListener("click", toggleTimer);
timerResetBtn.addEventListener("click", resetTimer);

async function boot() {
  loadKit();
  applyPlanState();
  applyBillingRedirectState();
  await loadModelConfig();
  await loadBillingConfig();
  await loadAdsConfig();
  await loadAccount();
  renderCollaboration();
  renderTimer();
}

boot();
