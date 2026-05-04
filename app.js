/* ============================================================
   app.js — Thai Letter Master  (v1.1)
   Single-file SPA. State machine + render loop.
   ============================================================ */

// ---------- Configuration ----------

// If your audio files use a different format, change this (mp3 / ogg / wav / m4a).
const AUDIO_EXTENSION = 'mp3';
const AUDIO_FOLDER    = 'Sound/';
const APP_VERSION     = '1.1';
const STORAGE_KEY     = 'thai-letter-master:state:v1';
const SETTINGS_KEY    = 'thai-letter-master:settings:v1';
const MAX_CUSTOM      = 99;

// Topic / mode / category configuration
const TOPICS = [
  {
    id: 'thai-alphabet',
    title: 'Master the Thai Alphabet',
    subtitle: 'พยัญชนะและสระไทย',
    description: 'Learn Thai consonants and vowels through three engaging modes — listen, see, and connect each letter to its description.',
    available: true,
  },
];

const CONSONANT_CATEGORIES = [
  { id: 'middle',          title: 'Middle Consonants',     subtitle: 'อักษรกลาง' },
  { id: 'high',            title: 'High Consonants',       subtitle: 'อักษรสูง' },
  { id: 'lowPair',         title: 'Low Consonants (Pair)', subtitle: 'อักษรต่ำคู่' },
  { id: 'lowSingle',       title: 'Low Consonants (Single)', subtitle: 'อักษรต่ำเดี่ยว' },
  { id: 'mixedConsonants', title: 'Mixed 3 Consonant Groups', subtitle: '3 กลุ่มรวม' },
  { id: 'vowels',          title: 'Vowels',                subtitle: 'สระ' },
  { id: 'all',             title: 'Mixed Consonants + Vowels', subtitle: 'พยัญชนะ + สระ' },
];

const DESCRIPTION_CATEGORIES = [
  { id: 'mixedConsonants', title: 'Mixed 3 Consonant Groups', subtitle: '3 กลุ่มรวม' },
  { id: 'vowels',          title: 'Vowels',                subtitle: 'สระ' },
  { id: 'all',             title: 'Mixed Consonants + Vowels', subtitle: 'พยัญชนะ + สระ' },
];

const MODES = [
  {
    id: 'listen',
    title: 'Listen & Choose',
    subtitle: 'ฟังและเลือกตัวอักษร',
    description: 'Hear a sound, then pick the letter that matches.',
    icon: 'ear',
    categories: CONSONANT_CATEGORIES,
  },
  {
    id: 'see',
    title: 'See the Letter, Choose the Sound',
    subtitle: 'ดูตัวอักษรและเลือกเสียง',
    description: 'Look at a Thai letter, then choose its correct sound.',
    icon: 'eye',
    categories: CONSONANT_CATEGORIES,
  },
  {
    id: 'description',
    title: 'Match the Description',
    subtitle: 'จับคู่คำอธิบายกับตัวอักษร',
    description: 'Read the description, then pick the matching Thai letter.',
    icon: 'book',
    categories: DESCRIPTION_CATEGORIES,
  },
];

// ---------- State ----------

const state = {
  view: 'home',          // 'home' | 'modes' | 'categories' | 'count-select' | 'quiz' | 'results'
  topicId: null,
  modeId: null,
  categoryId: null,
  questionMode: 'fixed',  // 'fixed' (numeric count) | 'all' | 'endless'
  questionCount: 10,      // numeric count when fixed; ignored otherwise
  customCount: 10,        // last custom value entered
  questions: [],          // pre-built (fixed/all) or [] for endless (built on the fly)
  questionIndex: 0,
  correctCount: 0,
  hasAnswered: false,
  selectedChoiceIdx: null,
  // For 'all' mode bookkeeping
  allPool: [],            // shuffled queue of correct entries to use
  // Endless current question (built on demand)
  endlessCurrent: null,
};

const settings = {
  font: 'sarabun',        // 'sarabun' | 'noto'
  timerOn: true,
};

// Stopwatch
const stopwatch = {
  startedAt: null,        // ms epoch
  accumulated: 0,         // ms accumulated when paused/off
  running: false,
  intervalId: null,
};

let currentAudio = null;  // currently playing Audio element

// ---------- Utility ----------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(array, n) {
  return shuffle(array).slice(0, n);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Wrap "(Obsolete)" markers in red span. Returns HTML string (already-escaped input passed in).
function highlightObsolete(escapedHtml) {
  return escapedHtml.replace(/\(Obsolete\)/gi, '<span class="obsolete-tag">(Obsolete)</span>');
}

function formatAudioName(audioName) {
  // Turn "ค_ค_ฅ_ฆ" into "ค ฅ ฆ" (deduped, space-separated) for display.
  const parts = String(audioName).split('_');
  const seen = new Set();
  const unique = [];
  for (const p of parts) {
    if (!seen.has(p)) { seen.add(p); unique.push(p); }
  }
  return unique.join(' ');
}

function audioPath(audioName) {
  return encodeURI(AUDIO_FOLDER + audioName + '.' + AUDIO_EXTENSION);
}

function isObsolete(text) {
  return /\(Obsolete\)/i.test(String(text || ''));
}

// ---------- Audio (race-safe) ----------

function stopAudio() {
  if (currentAudio) {
    currentAudio._aborted = true;            // mark to suppress error toast from teardown
    try { currentAudio.pause(); } catch (_) {}
    currentAudio = null;
  }
  $$('.audio-play.playing, .audio-only-btn.playing, .preview-btn.playing')
    .forEach(el => el.classList.remove('playing'));
}

function playAudio(audioName, button) {
  if (!audioName) return;
  stopAudio();
  const audio = new Audio(audioPath(audioName));
  currentAudio = audio;
  audio._aborted = false;
  if (button) button.classList.add('playing');

  audio.addEventListener('ended', () => {
    if (button) button.classList.remove('playing');
    if (currentAudio === audio) currentAudio = null;
  });

  audio.addEventListener('error', () => {
    if (button) button.classList.remove('playing');
    if (audio._aborted) return;              // we paused it on purpose — stay silent
    if (currentAudio === audio) currentAudio = null;
    showToast(`Couldn't load audio "${audioName}.${AUDIO_EXTENSION}". Make sure the file is in the Sound folder.`);
  });

  audio.play().catch(() => {
    // Autoplay can fail without a user gesture; ignore quietly.
    if (button) button.classList.remove('playing');
  });
}

// ---------- Toast ----------

let toastTimer = null;
function showToast(msg, variant) {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.remove('success');
  if (variant === 'success') toast.classList.add('success');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ---------- Question building ----------

// Build one question for the given mode using a specific correct entry, drawing distractors from `pool`.
function buildQuestionFromCorrect(modeId, pool, correct) {
  if (modeId === 'listen') {
    const distractorPool = pool.filter(e => e.audio !== correct.audio);
    const distractors = pickRandom(distractorPool, 3);
    const choices = shuffle([correct, ...distractors]).map(c => ({
      kind: 'letter',
      letter: c.letter,
      isCorrect: c === correct,
    }));
    return { mode: 'listen', correct, choices, questionAudio: correct.audio };
  }

  if (modeId === 'see') {
    // Choices are anonymous play buttons (audio names). Distractors must have unique audio names != correct's.
    const uniqueAudios = [...new Set(pool.map(e => e.audio))];
    const distractorAudios = uniqueAudios.filter(a => a !== correct.audio);
    const distractors = pickRandom(distractorAudios, 3);
    const allAudios = shuffle([correct.audio, ...distractors]);
    const choices = allAudios.map(a => ({
      kind: 'sound',
      audio: a,
      display: formatAudioName(a),
      isCorrect: a === correct.audio,
    }));
    return { mode: 'see', correct, choices, questionLetter: correct.letter };
  }

  if (modeId === 'description') {
    const distractorPool = pool.filter(e => e.description !== correct.description);
    const distractors = pickRandom(distractorPool, 3);
    const choices = shuffle([correct, ...distractors]).map(c => ({
      kind: 'letter',
      letter: c.letter,
      isCorrect: c === correct,
    }));
    return { mode: 'description', correct, choices, questionDescription: correct.description };
  }
}

function buildRandomQuestion(modeId, pool) {
  const correct = pool[Math.floor(Math.random() * pool.length)];
  return buildQuestionFromCorrect(modeId, pool, correct);
}

function buildFixedRound(modeId, categoryId, count) {
  const pool = getEntriesForCategory(categoryId);
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(buildRandomQuestion(modeId, pool));
  }
  return questions;
}

function buildAllRound(modeId, categoryId) {
  // For mode "see" or "listen", iterate by unique audio (since multiple letters share audio).
  // For "description", iterate by unique description. For "listen-letters" we walk the pool entries.
  const pool = getEntriesForCategory(categoryId);
  let correctEntries;
  if (modeId === 'listen' || modeId === 'see') {
    const seen = new Set();
    correctEntries = [];
    for (const e of pool) {
      if (!seen.has(e.audio)) { seen.add(e.audio); correctEntries.push(e); }
    }
  } else if (modeId === 'description') {
    const seen = new Set();
    correctEntries = [];
    for (const e of pool) {
      if (!seen.has(e.description)) { seen.add(e.description); correctEntries.push(e); }
    }
  } else {
    correctEntries = pool.slice();
  }
  const order = shuffle(correctEntries);
  return order.map(c => buildQuestionFromCorrect(modeId, pool, c));
}

function nextEndlessQuestion() {
  const pool = getEntriesForCategory(state.categoryId);
  return buildRandomQuestion(state.modeId, pool);
}

// ---------- SVG icons ----------

const ICONS = {
  ear:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5a6.5 6.5 0 0 1 13 0c0 6-6 5-6 9a3.5 3.5 0 0 1-7-1"/><path d="M9 9a3 3 0 1 1 6 0c0 2-3 2-3 4"/></svg>',
  eye:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  book:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/></svg>',
  play:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowLeft:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-6h-4v6a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
  check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  flag:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="22" x2="4" y2="15"/><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/></svg>',
};

// ---------- Renderers ----------

const root = () => $('#app');

function render() {
  stopAudio();

  // Apply body classes for view-aware UI
  document.body.classList.toggle('quiz-active', state.view === 'quiz');

  const r = root();
  let html = '';
  switch (state.view) {
    case 'home':         html = renderHome(); break;
    case 'modes':        html = renderModes(); break;
    case 'categories':   html = renderCategories(); break;
    case 'count-select': html = renderCountSelect(); break;
    case 'quiz':         html = renderQuiz(); break;
    case 'results':      html = renderResults(); break;
  }
  r.innerHTML = html;

  // Update timer display in header
  refreshTimerUI();

  // Auto-play audio on listen-mode question entry
  if (state.view === 'quiz') {
    const q = currentQuestion();
    if (q && q.mode === 'listen') {
      const playBtn = $('#main-audio-play');
      setTimeout(() => playAudio(q.questionAudio, playBtn), 120);
    }
  }
}

// ---------- View: Home ----------

function renderHome() {
  const topicCards = TOPICS.map(t => {
    const disabled = t.available ? '' : 'disabled aria-disabled="true"';
    return `
      <button class="card featured" data-action="open-topic" data-topic="${t.id}" ${disabled}>
        <div class="card-icon">${ICONS.book}</div>
        <p class="card-thai">${escapeHtml(t.subtitle)}</p>
        <h3 class="card-title">${escapeHtml(t.title)}</h3>
        <p class="card-desc">${escapeHtml(t.description)}</p>
        <div class="card-meta">
          <span class="pill">3 modes · ${ALPHABET_DATA.length} letters</span>
          <span class="card-arrow">${ICONS.arrowRight}</span>
        </div>
      </button>
    `;
  }).join('');

  return `
    <div class="container view">
      <section class="font-picker" aria-label="Font selection">
        <div class="font-picker-head">
          <p class="font-picker-title">Choose your Thai font</p>
          <span class="font-picker-hint">You can switch any time</span>
        </div>
        <div class="font-options">
          <button class="font-option ${settings.font === 'sarabun' ? 'selected' : ''}"
                  data-action="set-font" data-font="sarabun" data-font-target="sarabun" type="button">
            <span class="font-option-check">${ICONS.check}</span>
            <p class="font-option-label">Standard font</p>
            <p class="font-option-name">Sarabun</p>
            <p class="font-option-desc">Easy to read for beginners. Traditional Thai letter forms.</p>
            <p class="font-option-preview">ก ข ค ง จ ฉ ช</p>
          </button>
          <button class="font-option ${settings.font === 'noto' ? 'selected' : ''}"
                  data-action="set-font" data-font="noto" data-font-target="noto" type="button">
            <span class="font-option-check">${ICONS.check}</span>
            <p class="font-option-label">Modern font</p>
            <p class="font-option-name">Noto Sans Thai</p>
            <p class="font-option-desc">Commonly used by Thai people in shops, advertisements, and websites.</p>
            <p class="font-option-preview">ก ข ค ง จ ฉ ช</p>
          </button>
        </div>
      </section>

      <section class="hero">
        <p class="hero-thai">เรียนภาษาไทย</p>
        <h1 class="hero-title">Practice the Thai alphabet, your way.</h1>
        <p class="hero-desc">
          A friendly drill app for memorising Thai consonants and vowels.
          Listen and identify, see and pronounce, or match each letter to its description.
        </p>
      </section>

      <h2 class="section-title">Topics</h2>
      <div class="grid cols-2 stagger">
        ${topicCards}
      </div>
    </div>
  `;
}

// ---------- View: Modes ----------

function renderModes() {
  const topic = TOPICS.find(t => t.id === state.topicId);
  const modeCards = MODES.map(m => `
    <button class="card" data-action="open-mode" data-mode="${m.id}">
      <div class="card-icon">${ICONS[m.icon]}</div>
      <p class="card-thai">${escapeHtml(m.subtitle)}</p>
      <h3 class="card-title">${escapeHtml(m.title)}</h3>
      <p class="card-desc">${escapeHtml(m.description)}</p>
      <div class="card-meta">
        <span class="pill">${m.categories.length} categories</span>
        <span class="card-arrow">${ICONS.arrowRight}</span>
      </div>
    </button>
  `).join('');

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: topic.title, current: true },
      ])}
      <header class="page-head">
        <p class="eyebrow"><span class="diamond"></span>Topic</p>
        <h1 class="page-title">${escapeHtml(topic.title)}</h1>
        <p class="page-subtitle"><span class="page-thai">${escapeHtml(topic.subtitle)}</span> · Choose a practice mode</p>
      </header>
      <div class="grid cols-3 stagger">
        ${modeCards}
      </div>
    </div>
  `;
}

// ---------- View: Categories ----------

function renderCategories() {
  const topic = TOPICS.find(t => t.id === state.topicId);
  const mode  = MODES.find(m => m.id === state.modeId);

  const cards = mode.categories.map(c => {
    const count = getEntriesForCategory(c.id).length;
    return `
      <button class="card" data-action="open-category" data-category="${c.id}">
        <div class="card-icon gold">${ICONS.book}</div>
        <p class="card-thai">${escapeHtml(c.subtitle)}</p>
        <h3 class="card-title">${escapeHtml(c.title)}</h3>
        <div class="card-meta">
          <span class="pill">${count} letters</span>
          <span class="card-arrow">${ICONS.arrowRight}</span>
        </div>
      </button>
    `;
  }).join('');

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: topic.title, action: 'go-modes' },
        { label: mode.title, current: true },
      ])}
      <header class="page-head">
        <p class="eyebrow"><span class="diamond"></span>Mode</p>
        <h1 class="page-title">${escapeHtml(mode.title)}</h1>
        <p class="page-subtitle"><span class="page-thai">${escapeHtml(mode.subtitle)}</span> · ${escapeHtml(mode.description)}</p>
      </header>
      <h2 class="section-title">Choose a Category</h2>
      <div class="grid cols-3 stagger">
        ${cards}
      </div>
    </div>
  `;
}

// ---------- View: Count Select ----------

function renderCountSelect() {
  const topic = TOPICS.find(t => t.id === state.topicId);
  const mode  = MODES.find(m => m.id === state.modeId);
  const category = mode.categories.find(c => c.id === state.categoryId);
  const poolSize = getEntriesForCategory(state.categoryId).length;

  const tooltip = 'Questions will be randomized';
  const numberOptions = [5, 10, 15, 20].map(n => `
    <button class="count-btn" data-action="start-quiz-count" data-count="${n}" data-tooltip="${tooltip}">
      ${n}
      <span class="count-btn-label">questions</span>
    </button>
  `).join('');

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: topic.title, action: 'go-modes' },
        { label: mode.title, action: 'go-categories' },
        { label: category.title, current: true },
      ])}

      <div class="count-select-card">
        <div class="count-select-head">
          <p class="count-select-eyebrow">
            <span class="diamond">◆</span>
            ${escapeHtml(category.title)}
            <span class="diamond">◆</span>
          </p>
          <h1 class="count-select-title">How many questions?</h1>
          <p class="count-select-subtitle">Choose your session length — ${poolSize} letters in this category.</p>
        </div>

        <div class="count-options">
          ${numberOptions}
        </div>

        <div class="count-options-special">
          <button class="count-btn-all" data-action="start-quiz-all" type="button"
                  title="No repeats — every letter exactly once, in random order">
            <span class="count-btn-headline"><span class="count-btn-star">★</span>All</span>
            <span class="count-btn-sub">no repeats · ${poolSize} questions</span>
          </button>
          <button class="count-btn-endless" data-action="start-quiz-endless" type="button"
                  title="Practice as long as you want — end the session whenever">
            <span class="count-btn-headline"><span class="count-btn-infinity">∞</span>Endless</span>
            <span class="count-btn-sub">until you stop</span>
          </button>
        </div>

        <div class="count-custom">
          <span class="count-custom-label">Custom</span>
          <div class="count-stepper">
            <button class="count-step-btn" data-action="custom-dec" type="button" aria-label="Decrease">−</button>
            <input id="count-custom-value" type="number" min="1" max="${MAX_CUSTOM}" value="${state.customCount}" inputmode="numeric" />
            <button class="count-step-btn" data-action="custom-inc" type="button" aria-label="Increase">+</button>
          </div>
          <span style="font-size:13px;color:var(--text-muted);">questions (max ${MAX_CUSTOM})</span>
          <div class="count-custom-start">
            <button class="btn btn-primary" data-action="start-quiz-custom" type="button">
              Start ${ICONS.arrowRight}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- View: Quiz ----------

function currentQuestion() {
  if (state.questionMode === 'endless') return state.endlessCurrent;
  return state.questions[state.questionIndex];
}

function totalQuestions() {
  if (state.questionMode === 'endless') return Infinity;
  return state.questions.length;
}

function renderQuiz() {
  const q = currentQuestion();
  if (!q) return '';
  const mode = MODES.find(m => m.id === state.modeId);
  const category = mode.categories.find(c => c.id === state.categoryId);

  const total = totalQuestions();
  const isEndless = state.questionMode === 'endless';

  const progressPct = isEndless
    ? (((state.questionIndex % 10) + (state.hasAnswered ? 1 : 0)) / 10) * 100
    : (state.questionIndex / total) * 100;

  const questionHtml = renderQuestionContent(q);
  const choicesHtml = renderChoices(q);
  const feedbackHtml = state.hasAnswered ? renderFeedback(q) : '';

  const counterText = isEndless
    ? `${state.correctCount} correct · Q${state.questionIndex + 1}`
    : `${state.correctCount} / ${state.questionIndex + (state.hasAnswered ? 1 : 0)} · Q${state.questionIndex + 1} of ${total}`;

  const modeLabel = isEndless ? '∞ Endless'
                  : state.questionMode === 'all' ? '★ All'
                  : `${total} questions`;

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: 'Modes', action: 'go-modes' },
        { label: category.title, action: 'go-categories' },
        { label: `Question ${state.questionIndex + 1}`, current: true },
      ])}

      <div class="quiz-toolbar">
        <button class="btn-icon" data-action="restart-quiz" type="button" title="Restart this quiz">
          ${ICONS.refresh} Restart
        </button>
        ${isEndless ? `
          <button class="btn-icon btn-end" data-action="end-session" type="button" title="End the session">
            ${ICONS.flag} End Session
          </button>
        ` : ''}
        <span style="margin-left:auto;font-size:12px;color:var(--text-muted);font-weight:600;letter-spacing:.04em;">
          ${modeLabel}
        </span>
      </div>

      <div class="quiz-meta">
        <div class="progress" aria-label="Progress">
          <div class="progress-bar" style="width: ${progressPct}%;"></div>
        </div>
        <div class="score ${isEndless ? 'endless' : ''}" title="Correct answers">
          <span class="dot"></span>
          ${counterText}
        </div>
      </div>

      <div class="question-card">
        ${questionHtml}
      </div>

      <div class="choices">
        ${choicesHtml}
      </div>

      ${feedbackHtml}
    </div>
  `;
}

function renderQuestionContent(q) {
  if (q.mode === 'listen') {
    return `
      <p class="question-prompt">Listen carefully</p>
      <button id="main-audio-play" class="audio-play" data-action="replay-audio">
        ${ICONS.speaker} Play Sound
      </button>
      <p class="audio-hint">Tap to play again, then choose the matching letter below.</p>
    `;
  }
  if (q.mode === 'see') {
    const isPlaceholder = q.questionLetter.length > 6;
    if (isPlaceholder) {
      return `
        <p class="question-prompt">Identify the sound</p>
        <p class="thai-letter-display placeholder">${escapeHtml(q.questionLetter)}</p>
      `;
    }
    return `
      <p class="question-prompt">Identify the sound</p>
      <p class="thai-letter-display">${escapeHtml(q.questionLetter)}</p>
    `;
  }
  if (q.mode === 'description') {
    const safe = highlightObsolete(escapeHtml(q.questionDescription));
    return `
      <p class="question-prompt">Match the description</p>
      <p class="description-display">${safe}</p>
    `;
  }
  return '';
}

function renderChoices(q) {
  return q.choices.map((c, idx) => {
    const stateClass = computeChoiceStateClass(c, idx);

    if (c.kind === 'letter') {
      const isPlaceholder = c.letter.length > 6;
      const obs = isObsolete(c.letter);
      const inner = isPlaceholder
        ? `<span class="placeholder-text">${escapeHtml(c.letter)}</span>`
        : `<span class="letter-large ${obs ? 'is-obsolete' : ''}">${escapeHtml(c.letter)}</span>`;
      return `
        <button class="choice ${stateClass}" data-action="select-choice" data-idx="${idx}">
          ${inner}
        </button>
      `;
    }

    if (c.kind === 'sound') {
      // Anonymous play-only buttons. After answering, reveal sound name.
      return `
        <button class="choice choice-audio-only ${stateClass}" data-action="select-choice" data-idx="${idx}">
          <span class="audio-only-btn" data-audio="${escapeHtml(c.audio)}" data-idx="${idx}" aria-hidden="true">
            ${ICONS.play}
          </span>
          <span class="reveal-name">${escapeHtml(c.display)}</span>
        </button>
      `;
    }
    return '';
  }).join('');
}

function computeChoiceStateClass(choice, idx) {
  if (!state.hasAnswered) return '';
  const classes = ['locked'];
  if (choice.isCorrect) classes.push('correct');
  else if (idx === state.selectedChoiceIdx) classes.push('wrong');
  else classes.push('dimmed');
  return classes.join(' ');
}

function renderFeedback(q) {
  const correctChoice = q.choices.find(c => c.isCorrect);
  const wasCorrect = q.choices[state.selectedChoiceIdx]?.isCorrect;

  let detail = '';
  const desc = highlightObsolete(escapeHtml(q.correct.description));
  if (q.mode === 'listen') {
    detail = `Correct letter: <strong>${escapeHtml(correctChoice.letter)}</strong> — ${desc}`;
  } else if (q.mode === 'see') {
    detail = `Correct sound: <strong>${escapeHtml(correctChoice.display)}</strong> — ${desc}`;
  } else if (q.mode === 'description') {
    detail = `Correct letter: <strong>${escapeHtml(correctChoice.letter)}</strong>`;
  }

  const isLast = state.questionMode !== 'endless'
                 && state.questionIndex === state.questions.length - 1;
  const nextLabel = isLast ? 'See Results' : 'Next Question';

  return `
    <div class="feedback ${wasCorrect ? 'success' : 'error'}">
      <div>
        <div class="feedback-text">
          ${wasCorrect ? '✓ Correct!' : '✗ Not quite.'}
        </div>
        <div class="feedback-detail">${detail}</div>
      </div>
      <div class="feedback-actions">
        <button class="btn btn-ghost" data-action="hear-correct">
          ${ICONS.speaker} Hear it
        </button>
        <button class="btn btn-primary" data-action="next-question">
          ${nextLabel} ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// ---------- View: Results ----------

function renderResults() {
  const total = state.questionIndex; // number of answered questions (works for endless too)
  const score = state.correctCount;
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);

  let headline = 'Nice work!';
  let thai = 'เก่งมาก';
  if (total === 0)        { headline = 'No questions answered'; thai = 'ลองอีกครั้งนะ'; }
  else if (pct === 100)   { headline = 'Perfect!';        thai = 'สมบูรณ์แบบ!'; }
  else if (pct >= 80)     { headline = 'Excellent!';      thai = 'ยอดเยี่ยม'; }
  else if (pct >= 60)     { headline = 'Good progress';   thai = 'ก้าวหน้าดี'; }
  else if (pct >= 40)     { headline = 'Keep going';      thai = 'สู้ๆ นะ'; }
  else                    { headline = 'Practice more';   thai = 'ฝึกต่อไป'; }

  const mode = MODES.find(m => m.id === state.modeId);
  const category = mode.categories.find(c => c.id === state.categoryId);
  const elapsed = settings.timerOn ? formatTime(getStopwatchMs()) : null;

  const modeBadge = state.questionMode === 'endless' ? '∞ Endless'
                  : state.questionMode === 'all' ? '★ All'
                  : `${state.questions.length} questions`;

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: 'Modes', action: 'go-modes' },
        { label: category.title, action: 'go-categories' },
        { label: 'Results', current: true },
      ])}

      <div class="results-card">
        <div class="results-icon">${ICONS.trophy}</div>
        <h1 class="results-headline">${headline}</h1>
        <p class="results-thai">${thai}</p>
        <p class="results-score">${score}<span class="total"> / ${total}</span></p>
        <p class="results-percent">
          ${pct}% correct · ${escapeHtml(mode.title)} · ${escapeHtml(category.title)} · ${modeBadge}
          ${elapsed ? ` · ⏱ ${elapsed}` : ''}
        </p>
        <div class="results-actions">
          <button class="btn btn-primary" data-action="retry-quiz">
            ${ICONS.refresh} Try Again
          </button>
          <button class="btn btn-ghost" data-action="go-categories">
            Choose Another Category
          </button>
          <button class="btn btn-ghost" data-action="go-home">
            ${ICONS.home} Home
          </button>
        </div>
      </div>
    </div>
  `;
}

// ---------- Crumbs ----------

function renderCrumbs(items) {
  const lastNav = items.slice().reverse().find(i => !i.current && i.action);
  const backBtn = lastNav
    ? `<button class="back" data-action="${lastNav.action}">${ICONS.arrowLeft} Back</button>`
    : '';

  const trail = items.map((i, idx) => {
    const sep = idx > 0 ? '<span class="sep">/</span>' : '';
    if (i.current) return `${sep}<span class="item current">${escapeHtml(i.label)}</span>`;
    if (i.action) return `${sep}<button class="item" data-action="${i.action}" style="color:inherit;">${escapeHtml(i.label)}</button>`;
    return `${sep}<span class="item">${escapeHtml(i.label)}</span>`;
  }).join(' ');

  return `<nav class="crumbs">${backBtn}<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">${trail}</div></nav>`;
}

// ---------- Quiz starting ----------

function startQuizFixed(count) {
  state.questionMode = 'fixed';
  state.questionCount = count;
  state.questions = buildFixedRound(state.modeId, state.categoryId, count);
  state.questionIndex = 0;
  state.correctCount = 0;
  state.hasAnswered = false;
  state.selectedChoiceIdx = null;
  state.endlessCurrent = null;
  state.view = 'quiz';
  resetStopwatch();
  startStopwatch();
  saveProgress();
  render();
}

function startQuizAll() {
  state.questionMode = 'all';
  state.questions = buildAllRound(state.modeId, state.categoryId);
  state.questionIndex = 0;
  state.correctCount = 0;
  state.hasAnswered = false;
  state.selectedChoiceIdx = null;
  state.endlessCurrent = null;
  state.view = 'quiz';
  resetStopwatch();
  startStopwatch();
  saveProgress();
  render();
}

function startQuizEndless() {
  state.questionMode = 'endless';
  state.questions = [];
  state.questionIndex = 0;
  state.correctCount = 0;
  state.hasAnswered = false;
  state.selectedChoiceIdx = null;
  state.endlessCurrent = nextEndlessQuestion();
  state.view = 'quiz';
  resetStopwatch();
  startStopwatch();
  saveProgress();
  render();
}

// ---------- Actions ----------

function dispatch(action, target, event) {
  switch (action) {
    case 'go-home':
      stopStopwatch();
      state.view = 'home';
      state.topicId = null; state.modeId = null; state.categoryId = null;
      saveProgress();
      render();
      break;

    case 'open-topic':
      state.topicId = target.dataset.topic;
      state.view = 'modes';
      saveProgress();
      render();
      break;

    case 'go-modes':
      stopStopwatch();
      state.view = 'modes';
      state.modeId = null; state.categoryId = null;
      saveProgress();
      render();
      break;

    case 'open-mode':
      state.modeId = target.dataset.mode;
      state.view = 'categories';
      saveProgress();
      render();
      break;

    case 'go-categories':
      stopStopwatch();
      state.view = 'categories';
      state.categoryId = null;
      saveProgress();
      render();
      break;

    case 'open-category': {
      state.categoryId = target.dataset.category;
      state.view = 'count-select';
      saveProgress();
      render();
      break;
    }

    case 'start-quiz-count': {
      const n = Math.max(1, parseInt(target.dataset.count, 10) || 10);
      startQuizFixed(n);
      break;
    }
    case 'start-quiz-all':     startQuizAll(); break;
    case 'start-quiz-endless': startQuizEndless(); break;

    case 'start-quiz-custom': {
      const input = $('#count-custom-value');
      const v = clampCustom(parseInt(input.value, 10));
      state.customCount = v;
      startQuizFixed(v);
      break;
    }
    case 'custom-inc': {
      const input = $('#count-custom-value');
      input.value = clampCustom((parseInt(input.value, 10) || 0) + 1);
      state.customCount = parseInt(input.value, 10);
      saveSettings();
      break;
    }
    case 'custom-dec': {
      const input = $('#count-custom-value');
      input.value = clampCustom((parseInt(input.value, 10) || 0) - 1);
      state.customCount = parseInt(input.value, 10);
      saveSettings();
      break;
    }

    case 'select-choice': {
      if (state.hasAnswered) return;
      const idx = parseInt(target.dataset.idx, 10);
      const q = currentQuestion();
      if (!q) return;
      const choice = q.choices[idx];
      state.selectedChoiceIdx = idx;
      state.hasAnswered = true;
      if (choice.isCorrect) state.correctCount++;
      saveProgress();
      render();
      // After-answer audio: in see-mode, play what the user picked so they hear their choice.
      // In listen/description mode, auto-play the correct audio when wrong as a learning aid.
      if (q.mode === 'see') {
        setTimeout(() => {
          const playedBtn = document.querySelector(`[data-idx="${idx}"] .audio-only-btn`);
          playAudio(choice.audio, playedBtn);
        }, 150);
      } else if (!choice.isCorrect) {
        setTimeout(() => playAudio(q.correct.audio), 150);
      }
      break;
    }

    case 'replay-audio': {
      const q = currentQuestion();
      if (q && q.mode === 'listen') playAudio(q.questionAudio, target);
      break;
    }

    case 'hear-correct': {
      const q = currentQuestion();
      if (q) playAudio(q.correct.audio);
      break;
    }

    case 'next-question': {
      advanceQuestion();
      break;
    }

    case 'restart-quiz': {
      restartCurrentQuiz();
      break;
    }

    case 'end-session': {
      stopStopwatch();
      state.view = 'results';
      saveProgress();
      render();
      break;
    }

    case 'retry-quiz': {
      // Re-run with same parameters
      if (state.questionMode === 'all')          startQuizAll();
      else if (state.questionMode === 'endless') startQuizEndless();
      else                                       startQuizFixed(state.questionCount);
      break;
    }

    case 'set-font': {
      const f = target.dataset.fontTarget || target.dataset.font;
      if (f === 'sarabun' || f === 'noto') {
        settings.font = f;
        applyFontSetting();
        saveSettings();
        // Re-render the home view to update selection
        if (state.view === 'home') render();
      }
      break;
    }

    case 'toggle-timer': {
      settings.timerOn = !settings.timerOn;
      saveSettings();
      if (settings.timerOn) {
        if (state.view === 'quiz' && !stopwatch.running) startStopwatch();
      } else {
        // Pause but don't reset, so toggling back shows current elapsed
        pauseStopwatch();
      }
      refreshTimerUI();
      break;
    }

    case 'open-about':  openAbout();  break;
    case 'close-about': closeAbout(); break;
  }
}

function advanceQuestion() {
  if (state.questionMode === 'endless') {
    state.questionIndex++;
    state.endlessCurrent = nextEndlessQuestion();
    state.hasAnswered = false;
    state.selectedChoiceIdx = null;
    saveProgress();
    render();
    return;
  }
  if (state.questionIndex < state.questions.length - 1) {
    state.questionIndex++;
    state.hasAnswered = false;
    state.selectedChoiceIdx = null;
    saveProgress();
    render();
  } else {
    stopStopwatch();
    state.view = 'results';
    saveProgress();
    render();
  }
}

function restartCurrentQuiz() {
  if (state.questionMode === 'all')          startQuizAll();
  else if (state.questionMode === 'endless') startQuizEndless();
  else                                       startQuizFixed(state.questionCount);
}

function clampCustom(n) {
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > MAX_CUSTOM) return MAX_CUSTOM;
  return Math.floor(n);
}

// ---------- Event delegation ----------

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) {
    // Close modal on backdrop-only click (not clicks inside modal)
    if (e.target.id === 'about-modal') closeAbout();
    return;
  }
  const action = target.dataset.action;
  dispatch(action, target, e);
});

// Custom input — allow typing directly, clamp on blur
document.addEventListener('input', (e) => {
  if (e.target.id === 'count-custom-value') {
    const v = parseInt(e.target.value, 10);
    if (Number.isFinite(v)) state.customCount = v;
  }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'count-custom-value') {
    const v = clampCustom(parseInt(e.target.value, 10));
    e.target.value = v;
    state.customCount = v;
    saveSettings();
  }
});

// Keyboard shortcuts: 1-4 for choices, R to replay, Enter for next, Esc closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = $('#about-modal');
    if (modal && modal.classList.contains('open')) { closeAbout(); return; }
  }

  if (state.view !== 'quiz') return;
  // Ignore when typing in custom-count input
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

  const q = currentQuestion();
  if (!q) return;

  if (!state.hasAnswered && /^[1-4]$/.test(e.key)) {
    const idx = parseInt(e.key, 10) - 1;
    if (idx < q.choices.length) {
      const choice = q.choices[idx];
      state.selectedChoiceIdx = idx;
      state.hasAnswered = true;
      if (choice.isCorrect) state.correctCount++;
      saveProgress();
      render();
      if (q.mode === 'see') {
        setTimeout(() => {
          const playedBtn = document.querySelector(`[data-idx="${idx}"] .audio-only-btn`);
          playAudio(choice.audio, playedBtn);
        }, 150);
      } else if (!choice.isCorrect) {
        setTimeout(() => playAudio(q.correct.audio), 150);
      }
    }
  } else if (e.key === 'r' || e.key === 'R') {
    if (q.mode === 'listen') playAudio(q.questionAudio, $('#main-audio-play'));
  } else if (e.key === 'Enter' && state.hasAnswered) {
    advanceQuestion();
  }
});

// ---------- About modal ----------

function openAbout() {
  $('#about-modal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAbout() {
  $('#about-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ---------- Stopwatch ----------

function startStopwatch() {
  if (!settings.timerOn) return;
  if (stopwatch.running) return;
  stopwatch.startedAt = Date.now();
  stopwatch.running = true;
  if (stopwatch.intervalId) clearInterval(stopwatch.intervalId);
  stopwatch.intervalId = setInterval(refreshTimerUI, 500);
}

function pauseStopwatch() {
  if (!stopwatch.running) return;
  stopwatch.accumulated += Date.now() - stopwatch.startedAt;
  stopwatch.startedAt = null;
  stopwatch.running = false;
  if (stopwatch.intervalId) { clearInterval(stopwatch.intervalId); stopwatch.intervalId = null; }
}

function stopStopwatch() {
  pauseStopwatch();
}

function resetStopwatch() {
  stopwatch.startedAt = null;
  stopwatch.accumulated = 0;
  stopwatch.running = false;
  if (stopwatch.intervalId) { clearInterval(stopwatch.intervalId); stopwatch.intervalId = null; }
}

function getStopwatchMs() {
  return stopwatch.accumulated + (stopwatch.running && stopwatch.startedAt ? Date.now() - stopwatch.startedAt : 0);
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function refreshTimerUI() {
  const display = $('#timer-display');
  const toggle  = $('#timer-toggle');
  if (!display || !toggle) return;
  display.textContent = formatTime(getStopwatchMs());
  toggle.classList.toggle('timer-off', !settings.timerOn);
  toggle.setAttribute('title', settings.timerOn ? 'Stopwatch ON — click to turn off' : 'Stopwatch OFF — click to turn on');
}

// Pause on visibility change / unload
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseStopwatch();
    saveProgress();
  } else if (state.view === 'quiz' && settings.timerOn) {
    startStopwatch();
  }
});

window.addEventListener('beforeunload', () => {
  pauseStopwatch();
  saveProgress();
});
window.addEventListener('pagehide', () => {
  pauseStopwatch();
  saveProgress();
});

// ---------- Persistence ----------

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      font: settings.font,
      timerOn: settings.timerOn,
      customCount: state.customCount,
    }));
  } catch (_) {}
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj.font === 'sarabun' || obj.font === 'noto') settings.font = obj.font;
    if (typeof obj.timerOn === 'boolean') settings.timerOn = obj.timerOn;
    if (Number.isFinite(obj.customCount)) state.customCount = clampCustom(obj.customCount);
  } catch (_) {}
}

function saveProgress() {
  try {
    const snapshot = {
      version: APP_VERSION,
      view: state.view,
      topicId: state.topicId,
      modeId: state.modeId,
      categoryId: state.categoryId,
      questionMode: state.questionMode,
      questionCount: state.questionCount,
      questions: state.questions,
      questionIndex: state.questionIndex,
      correctCount: state.correctCount,
      hasAnswered: state.hasAnswered,
      selectedChoiceIdx: state.selectedChoiceIdx,
      endlessCurrent: state.endlessCurrent,
      stopwatch: {
        accumulated: getStopwatchMs(),
        running: false, // saved as paused; restored as paused, resumed on quiz view
      },
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (_) {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s || s.version !== APP_VERSION) return false;
    // Only resume if user was actively in a quiz
    if (s.view !== 'quiz') return false;

    state.view = s.view;
    state.topicId = s.topicId;
    state.modeId = s.modeId;
    state.categoryId = s.categoryId;
    state.questionMode = s.questionMode || 'fixed';
    state.questionCount = s.questionCount || 10;
    state.questions = Array.isArray(s.questions) ? s.questions : [];
    state.questionIndex = s.questionIndex || 0;
    state.correctCount = s.correctCount || 0;
    state.hasAnswered = !!s.hasAnswered;
    state.selectedChoiceIdx = (typeof s.selectedChoiceIdx === 'number') ? s.selectedChoiceIdx : null;
    state.endlessCurrent = s.endlessCurrent || null;

    if (s.stopwatch) {
      stopwatch.accumulated = Math.max(0, Number(s.stopwatch.accumulated) || 0);
      stopwatch.running = false;
      stopwatch.startedAt = null;
    }
    return true;
  } catch (_) {
    return false;
  }
}

// ---------- Font ----------

function applyFontSetting() {
  document.body.classList.toggle('font-sarabun', settings.font === 'sarabun');
  document.body.classList.toggle('font-noto',     settings.font === 'noto');
}

// ---------- Boot ----------

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applyFontSetting();

  const resumed = loadProgress();
  if (resumed) {
    showToast('Welcome back — continuing where you left off.', 'success');
    if (settings.timerOn) startStopwatch();
  }

  render();
  refreshTimerUI();
});
