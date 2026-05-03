/* ============================================================
   app.js — Thai Alphabet Master
   Single-file, no-framework SPA. State machine + render loop.
   ============================================================ */

// ---------- Configuration ----------

// If your audio files use a different format, change this (mp3 / ogg / wav / m4a).
const AUDIO_EXTENSION = 'mp3';
const AUDIO_FOLDER    = 'Sound/';
const QUESTIONS_PER_ROUND = 10;

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
  view: 'home',          // 'home' | 'modes' | 'categories' | 'quiz' | 'results'
  topicId: null,
  modeId: null,
  categoryId: null,
  questions: [],
  questionIndex: 0,
  correctCount: 0,
  hasAnswered: false,
  selectedChoiceIdx: null,
};

let currentAudio = null; // currently playing Audio object

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

function formatAudioName(audioName) {
  // For display: turn "ค_ค_ฅ_ฆ" into "ค ฅ ฆ" (deduped, space-separated)
  const parts = audioName.split('_');
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

// ---------- Audio ----------

function stopAudio() {
  if (currentAudio) {
    try { currentAudio.pause(); } catch (_) {}
    currentAudio.src = '';
    currentAudio = null;
  }
  $$('.audio-play.playing').forEach(el => el.classList.remove('playing'));
}

function playAudio(audioName, button) {
  stopAudio();
  const audio = new Audio(audioPath(audioName));
  currentAudio = audio;
  if (button) button.classList.add('playing');

  audio.addEventListener('ended', () => {
    if (button) button.classList.remove('playing');
    if (currentAudio === audio) currentAudio = null;
  });
  audio.addEventListener('error', () => {
    if (button) button.classList.remove('playing');
    if (currentAudio === audio) currentAudio = null;
    showToast(`Couldn't load audio "${audioName}.${AUDIO_EXTENSION}". Make sure the file is in the Sound folder.`);
  });

  audio.play().catch(() => {
    // Autoplay can fail if no user gesture occurred — that's OK on the first auto-play.
    if (button) button.classList.remove('playing');
  });
}

// ---------- Toast ----------

let toastTimer = null;
function showToast(msg) {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ---------- Question building ----------

function buildQuestion(modeId, pool) {
  const correct = pool[Math.floor(Math.random() * pool.length)];

  if (modeId === 'listen') {
    // Question = audio. Choices = 4 letters. Exclude letters that share the same audio as correct.
    const distractorPool = pool.filter(e => e.audio !== correct.audio);
    const distractors = pickRandom(distractorPool, 3);
    const choices = shuffle([correct, ...distractors]).map(c => ({
      kind: 'letter',
      letter: c.letter,
      isCorrect: c === correct,
      entryId: c.id,
    }));
    return { mode: 'listen', correct, choices, questionAudio: correct.audio };
  }

  if (modeId === 'see') {
    // Question = letter. Choices = 4 audio names (sounds). Distractors = unique audios different from correct's.
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
    // Question = description. Choices = 4 letters. Exclude letters whose description matches correct.
    const distractorPool = pool.filter(e => e.description !== correct.description);
    const distractors = pickRandom(distractorPool, 3);
    const choices = shuffle([correct, ...distractors]).map(c => ({
      kind: 'letter',
      letter: c.letter,
      isCorrect: c === correct,
      entryId: c.id,
    }));
    return { mode: 'description', correct, choices, questionDescription: correct.description };
  }
}

function buildRound(modeId, categoryId) {
  const pool = getEntriesForCategory(categoryId);
  const questions = [];
  for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
    questions.push(buildQuestion(modeId, pool));
  }
  return questions;
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
  info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-6h-4v6a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
};

// ---------- Renderers ----------

const root = () => $('#app');

function render() {
  stopAudio();
  const r = root();
  let html = '';
  switch (state.view) {
    case 'home':       html = renderHome(); break;
    case 'modes':      html = renderModes(); break;
    case 'categories': html = renderCategories(); break;
    case 'quiz':       html = renderQuiz(); break;
    case 'results':    html = renderResults(); break;
  }
  r.innerHTML = html;

  // Auto-play audio on listen-mode question entry (will be allowed since user gesture started the round)
  if (state.view === 'quiz') {
    const q = state.questions[state.questionIndex];
    if (q && q.mode === 'listen') {
      const playBtn = $('#main-audio-play');
      // small delay to let render settle
      setTimeout(() => playAudio(q.questionAudio, playBtn), 120);
    }
  }
}

// ---------- View: Home (topic list) ----------

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
      <button class="card" data-action="start-quiz" data-category="${c.id}">
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

// ---------- View: Quiz ----------

function renderQuiz() {
  const q = state.questions[state.questionIndex];
  const mode = MODES.find(m => m.id === state.modeId);
  const category = mode.categories.find(c => c.id === state.categoryId);

  const progressPct = ((state.questionIndex) / state.questions.length) * 100;

  const questionHtml = renderQuestionContent(q);
  const choicesHtml = renderChoices(q);
  const feedbackHtml = state.hasAnswered ? renderFeedback(q) : '';

  return `
    <div class="container view">
      ${renderCrumbs([
        { label: 'Topics', action: 'go-home' },
        { label: 'Modes', action: 'go-modes' },
        { label: category.title, action: 'go-categories' },
        { label: `Question ${state.questionIndex + 1}`, current: true },
      ])}

      <div class="quiz-meta">
        <div class="progress" aria-label="Progress">
          <div class="progress-bar" style="width: ${progressPct}%;"></div>
        </div>
        <div class="score" title="Correct answers">
          <span class="dot"></span>
          ${state.correctCount} / ${state.questionIndex + (state.hasAnswered ? 1 : 0)} · Q${state.questionIndex + 1} of ${state.questions.length}
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
    const isPlaceholder = q.questionLetter.length > 6; // long text = placeholder note
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
    return `
      <p class="question-prompt">Match the description</p>
      <p class="description-display">${escapeHtml(q.questionDescription)}</p>
    `;
  }
  return '';
}

function renderChoices(q) {
  return q.choices.map((c, idx) => {
    const stateClass = computeChoiceStateClass(c, idx);

    if (c.kind === 'letter') {
      const isPlaceholder = c.letter.length > 6;
      const inner = isPlaceholder
        ? `<span class="placeholder-text">${escapeHtml(c.letter)}</span>`
        : `<span class="letter-large">${escapeHtml(c.letter)}</span>`;
      return `
        <button class="choice ${stateClass}" data-action="select-choice" data-idx="${idx}">
          ${inner}
        </button>
      `;
    }

    if (c.kind === 'sound') {
      return `
        <button class="choice ${stateClass}" data-action="select-choice" data-idx="${idx}">
          <span class="preview-btn" data-action="preview-sound" data-audio="${escapeHtml(c.audio)}" title="Listen">
            ${ICONS.play}
          </span>
          <span class="sound-text">${escapeHtml(c.display)}</span>
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
  if (q.mode === 'listen') {
    detail = `Correct letter: <strong>${escapeHtml(correctChoice.letter)}</strong> — ${escapeHtml(q.correct.description)}`;
  } else if (q.mode === 'see') {
    detail = `Correct sound: <strong>${escapeHtml(correctChoice.display)}</strong> — ${escapeHtml(q.correct.description)}`;
  } else if (q.mode === 'description') {
    detail = `Correct letter: <strong>${escapeHtml(correctChoice.letter)}</strong>`;
  }

  const isLast = state.questionIndex === state.questions.length - 1;
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
        ${q.mode !== 'listen' && q.mode !== 'description' ? '' : ''}
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
  const total = state.questions.length;
  const score = state.correctCount;
  const pct = Math.round((score / total) * 100);

  let headline = 'Nice work!';
  let thai = 'เก่งมาก';
  if (pct === 100)        { headline = 'Perfect!';      thai = 'สมบูรณ์แบบ!'; }
  else if (pct >= 80)     { headline = 'Excellent!';    thai = 'ยอดเยี่ยม'; }
  else if (pct >= 60)     { headline = 'Good progress'; thai = 'ก้าวหน้าดี'; }
  else if (pct >= 40)     { headline = 'Keep going';    thai = 'สู้ๆ นะ'; }
  else                    { headline = 'Practice more'; thai = 'ฝึกต่อไป'; }

  const mode = MODES.find(m => m.id === state.modeId);
  const category = mode.categories.find(c => c.id === state.categoryId);

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
        <p class="results-percent">${pct}% correct · ${escapeHtml(mode.title)} · ${escapeHtml(category.title)}</p>
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
  // Show a back button (left arrow) using the previous breadcrumb
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

// ---------- Actions ----------

function dispatch(action, target) {
  switch (action) {
    case 'go-home':
      state.view = 'home';
      state.topicId = null; state.modeId = null; state.categoryId = null;
      render();
      break;
    case 'open-topic':
      state.topicId = target.dataset.topic;
      state.view = 'modes';
      render();
      break;
    case 'go-modes':
      state.view = 'modes';
      state.modeId = null; state.categoryId = null;
      render();
      break;
    case 'open-mode':
      state.modeId = target.dataset.mode;
      state.view = 'categories';
      render();
      break;
    case 'go-categories':
      state.view = 'categories';
      state.categoryId = null;
      render();
      break;
    case 'start-quiz': {
      state.categoryId = target.dataset.category;
      state.questions = buildRound(state.modeId, state.categoryId);
      state.questionIndex = 0;
      state.correctCount = 0;
      state.hasAnswered = false;
      state.selectedChoiceIdx = null;
      state.view = 'quiz';
      render();
      break;
    }
    case 'select-choice': {
      if (state.hasAnswered) return;
      const idx = parseInt(target.dataset.idx, 10);
      const q = state.questions[state.questionIndex];
      const choice = q.choices[idx];
      state.selectedChoiceIdx = idx;
      state.hasAnswered = true;
      if (choice.isCorrect) state.correctCount++;
      // Auto-play correct audio on wrong answer (helpful learning signal)
      render();
      if (!choice.isCorrect) {
        setTimeout(() => playAudio(q.correct.audio), 150);
      } else if (q.mode === 'see') {
        // for see-mode correct, play the sound to confirm
        setTimeout(() => playAudio(q.correct.audio), 150);
      }
      break;
    }
    case 'preview-sound': {
      const audio = target.dataset.audio;
      playAudio(audio, target);
      break;
    }
    case 'replay-audio': {
      const q = state.questions[state.questionIndex];
      if (q && q.mode === 'listen') playAudio(q.questionAudio, target);
      break;
    }
    case 'hear-correct': {
      const q = state.questions[state.questionIndex];
      if (q) playAudio(q.correct.audio);
      break;
    }
    case 'next-question': {
      if (state.questionIndex < state.questions.length - 1) {
        state.questionIndex++;
        state.hasAnswered = false;
        state.selectedChoiceIdx = null;
        render();
      } else {
        state.view = 'results';
        render();
      }
      break;
    }
    case 'retry-quiz': {
      state.questions = buildRound(state.modeId, state.categoryId);
      state.questionIndex = 0;
      state.correctCount = 0;
      state.hasAnswered = false;
      state.selectedChoiceIdx = null;
      state.view = 'quiz';
      render();
      break;
    }
    case 'open-about': openAbout(); break;
    case 'close-about': closeAbout(); break;
  }
}

// Event delegation
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  // For preview-sound: stop propagation so the parent choice doesn't auto-select
  const action = target.dataset.action;
  if (action === 'preview-sound') {
    e.stopPropagation();
    e.preventDefault();
  }
  dispatch(action, target);
});

// Keyboard shortcuts: numbers 1-4 for choices, R to replay listen audio, Enter for next
document.addEventListener('keydown', (e) => {
  // Close modal on Escape
  if (e.key === 'Escape') {
    const modal = $('#about-modal');
    if (modal && modal.classList.contains('open')) { closeAbout(); return; }
  }

  if (state.view !== 'quiz') return;
  const q = state.questions[state.questionIndex];
  if (!q) return;

  if (!state.hasAnswered && /^[1-4]$/.test(e.key)) {
    const idx = parseInt(e.key, 10) - 1;
    if (idx < q.choices.length) {
      const choice = q.choices[idx];
      state.selectedChoiceIdx = idx;
      state.hasAnswered = true;
      if (choice.isCorrect) state.correctCount++;
      render();
      if (!choice.isCorrect || q.mode === 'see') {
        setTimeout(() => playAudio(q.correct.audio), 150);
      }
    }
  } else if (e.key === 'r' || e.key === 'R') {
    if (q.mode === 'listen') playAudio(q.questionAudio, $('#main-audio-play'));
  } else if (e.key === 'Enter' && state.hasAnswered) {
    dispatch('next-question', document.body);
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

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'about-modal') closeAbout();
});

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', render);
