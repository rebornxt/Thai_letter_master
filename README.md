# Thai Letter Master  (v1.3.3)

A friendly drill app for memorising the Thai alphabet — built for Om's italki students.
Three practice modes (Listen / See / Match Description) covering 83 consonants and vowels,
with adjustable session length, persistent progress, a stopwatch, and a font picker.

Static, single-page, no build step. Drop the folder onto GitHub Pages (or any static host) and go.

---

## Folder layout

```
thai-app/
├── index.html        ← entry point
├── styles.css        ← all visual styling
├── app.js            ← state machine + render loop
├── data.js           ← the 83-letter dataset
├── README.md         ← this file
├── Sound/            ← YOUR audio files go here  (you provide)
└── Sarabun/          ← YOUR Sarabun font files   (you provide)
```

You provide two folders the app expects to find next to `index.html`:

- **`Sound/`** — one `.mp3` per audio name in `data.js`
  (e.g. `ก.mp3`, `ค_ค_ฅ_ฆ.mp3`, `สระ-อะ.mp3`, ...).
  Filenames must match the `audio` field of each entry exactly. If a file is
  missing, the app shows a small toast — it will never crash.

- **`Sarabun/`** — the standard-font option. The app loads it via
  `@font-face` from this folder.

The **modern font** option (Noto Sans Thai) is loaded from Google Fonts at
runtime — no local files required.

---

## Running locally

Just open `index.html` in a browser. Audio playback may need a real HTTP
server in some browsers (Chromium blocks `file://` audio). The simplest:

```
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Deploying to GitHub Pages

1. Commit the whole folder to a repo.
2. In the repo's **Settings → Pages**, choose the branch and `/` (root).
3. Done — your site is at `https://<user>.github.io/<repo>/`.

The `Sound/` and `Sarabun/` folders just need to be in the same folder as
`index.html`. Make sure they aren't gitignored.

---

## What's in v1.1

### Bug fixes
- The About-modal **close button** now reliably closes the dialog.
- "See the Letter, Choose the Sound" mode no longer reveals the answer —
  the four choices are anonymous play buttons until you commit.
- The spurious "Couldn't load audio" toast that appeared when answering or
  replaying quickly is gone (race-safe abort handling).

### New features
- **Session length picker**. After choosing a category, pick how many
  questions you want: `5`, `10`, `15`, `20`, **All** (every letter once,
  no repeats — gold animated button), `Custom` (1–99 with `−` / `+`), or
  **Endless** (random forever, with an "End Session" button).
- **Stopwatch** in the top-right of the header, only visible during a
  quiz. Click to toggle on/off. Auto-pauses when the tab is hidden.
- **Restart button** in every quiz toolbar — start the same session over
  with a fresh shuffle.
- **Auto-save / resume**. Closing or reloading mid-quiz preserves your
  progress; you'll land back on the same question on return.
- **Font picker on the home page** — choose between Sarabun (traditional,
  good for beginners) and Noto Sans Thai (modern shop / signage style).
  Selection persists across sessions.
- **Obsolete letters** in the CSV (entries containing "(Obsolete)") are
  highlighted in red wherever they appear.
- New logo "อ" and updated header text *Thai Letter Master · เรียนภาษาไทย
  กับนาย "ออม"*.

### How "All" mode works
Each unique question (one per letter or one per audio group, depending
on mode) is asked exactly once in a randomised order. When the queue
runs out, you go straight to the results screen.

### How "Endless" mode works
Random questions are generated indefinitely. The progress bar fills in
loops of 10 just to give a sense of motion. Click **End Session** in the
quiz toolbar to jump to results with whatever score you have.

---

## Modes & categories

| Mode                    | What you see                       | What you pick           |
|-------------------------|------------------------------------|-------------------------|
| Listen & Choose         | a sound (auto-plays, replayable)   | the matching letter     |
| See the Letter, Choose the Sound | a Thai letter             | the matching sound (anonymous play buttons) |
| Match the Description   | an English description             | the matching letter     |

Categories for **Listen** and **See** modes:
Middle, High, Low-Pair, Low-Single, Mixed-3-Consonant-Groups, Vowels,
and Mixed-Consonants-+-Vowels.

Categories for **Description** mode:
Mixed-3-Consonant-Groups, Vowels, Mixed-Consonants-+-Vowels.

---

## Data file (`data.js`)

A single global `ALPHABET_DATA` array of 83 entries. Each entry:

```js
{
  letter:      'ก',                 // what's drawn on screen
  audio:       'ก',                 // matches Sound/ก.mp3
  description: 'Middle class sounds like ~ goat, gum',
  group:       'middle',            // middle | high | lowPair | lowSingle | vowels
}
```

Entries grouped by `audio` (e.g. `ค_ค_ฅ_ฆ`) all share one audio file.
Categories filter the array by `group` and combinations.
The helper `getEntriesForCategory(categoryId)` returns the right slice.

---

## Customising

- **Audio extension**: change `AUDIO_EXTENSION` at the top of `app.js`
  (`'mp3'` → `'ogg'` etc.).
- **Theme colours**: see the `:root` token block at the top of
  `styles.css`. The palette is warm cream + deep teal + temple gold.
- **Add a topic**: append to the `TOPICS` array in `app.js` and add a
  matching set of modes/categories. The home page picks them up
  automatically.

---

## Browser support

Modern Chromium, Firefox, and Safari (desktop + mobile). The app uses
`localStorage` for persistence; if a browser blocks it (private mode in
some configs), the app still works — it just won't auto-resume.

---

Made with care for Thai language learners. Enjoy the practice. 🇹🇭
