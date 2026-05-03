# Master Thai — Thai Alphabet Learning Web App

A clean, modern, mobile-friendly site for helping students memorize the Thai alphabet through interactive quizzes. Built as a static site so it can be hosted directly on **GitHub Pages** with no build step.

---

## ✨ What's inside

**Topic 1 — Master the Thai Alphabet** has three quiz modes:

1. **Listen and Choose** — hear an audio cue, pick the correct Thai letter.
2. **See the Letter and Choose the Sound** — see a Thai letter, pick the correct romanized sound name (with a "preview" button to listen before answering).
3. **Match the Letter With Its Description** — read the letter's meaning, pick the correct Thai letter.

Each mode is split into categories (Middle / High / Low pair / Low single consonants, Vowels, and mixed sets). Each round is **10 questions**, followed by a results screen.

---

## 📁 Required folder structure

After cloning/uploading this repo, your folder should look like this:

```
your-repo/
├── index.html
├── styles.css
├── data.js
├── app.js
├── README.md
├── Sarabun/        ← you add this
│   ├── Sarabun-Light.ttf
│   ├── Sarabun-Regular.ttf
│   ├── Sarabun-Medium.ttf
│   ├── Sarabun-SemiBold.ttf
│   ├── Sarabun-Bold.ttf
│   └── Sarabun-ExtraBold.ttf
└── Sound/          ← you add this
    ├── ก ไก่.mp3
    ├── ข ไข่.mp3
    ├── ...
    └── (one file per row in the CSV, named exactly per Column C)
```

### `Sarabun/` folder

Download the [Sarabun font from Google Fonts](https://fonts.google.com/specimen/Sarabun) and place the `.ttf` files inside `Sarabun/` at the project root. The CSS expects these exact filenames (Google's default naming):

- `Sarabun-Light.ttf` (300)
- `Sarabun-Regular.ttf` (400)
- `Sarabun-Medium.ttf` (500)
- `Sarabun-SemiBold.ttf` (600)
- `Sarabun-Bold.ttf` (700)
- `Sarabun-ExtraBold.ttf` (800)

If your files are named differently, update the `@font-face` block at the top of `styles.css`.

### `Sound/` folder

Place one audio file per CSV row inside `Sound/`. The filename must exactly match **Column C** of the CSV plus the `.mp3` extension. For example, the row for `ก` has `ก ไก่` in Column C, so the file should be `Sound/ก ไก่.mp3`.

**Default extension is `.mp3`.** To use a different format (e.g. `.m4a`, `.wav`), edit a single line near the top of `app.js`:

```js
const AUDIO_EXTENSION = '.mp3';
```

> Thai filenames in URLs are handled automatically with `encodeURI` — you do not need to URL-encode the filenames yourself.

---

## 🚀 Deploying to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this project, plus your `Sarabun/` and `Sound/` folders, to the repo root.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then save.
5. Wait ~1 minute. Your site will be live at `https://<your-username>.github.io/<your-repo>/`.

That's it — no build step, no dependencies.

---

## ⌨️ Keyboard shortcuts

During a quiz, students can use:

- **1 – 4** — pick a choice
- **R** — replay the audio (in Listen mode)
- **Enter** — go to the next question after answering
- **Esc** — close the About pop-up

---

## 🛠 Customizing the content

### Adding or fixing a letter

Edit `data.js` — each entry has the shape:

```js
{ thai: 'ก', group: 'middle', audio: 'ก ไก่', description: 'Chicken' }
```

Group values: `middle`, `high`, `lowPair`, `lowSingle`, `vowel`.

### Adding a new topic / mode

1. Add an entry to the `TOPICS` array in `app.js`.
2. Add corresponding modes to the `MODES` map.
3. Add a new question-builder branch in `buildQuestion()` if the new mode uses different question/answer types.

The current architecture (state machine + render functions) is designed so adding topics requires editing config arrays at the top of `app.js`, not touching the render or quiz logic.

### Changing the design

All design tokens live as CSS variables at the top of `styles.css` (`:root { --bg, --primary, --accent, ... }`). Adjusting these will propagate site-wide.

---

## 🧑‍🏫 About the teacher

Built for the students of **Om** (italki teacher).

- **italki:** [Profile](https://www.italki.com/en/teacher/16591055) · [Referral link](https://www.italki.com/en/i/ref/fdBGcf?hl=en&utm_medium=user_referral&utm_source=copylink_share)
- **Instagram:** [@amanvslang](https://www.instagram.com/amanvslang/)
- **TikTok:** [@paskornlar](https://www.tiktok.com/@paskornlar)

---

## 📜 License / credits

Sarabun font © Cadson Demak, licensed under the SIL Open Font License.
Site code is yours to modify and adapt for your students.
