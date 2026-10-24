# Short Script Studio

Single-file web app (no build step) that turns a topic into a short-video (15/30/60s) script:
scenes, bilingual narration (EN/VI), per-scene image prompts, SRT subtitles, 3-platform post pack,
channel profile, reference-script library (few-shot style), batch idea generation, and a posting tracker.

## Run
- Open `index.html` in a browser, or serve the folder: `npx serve .` / `python3 -m http.server`.
- Needs an AI source (see below). Data is stored in the browser's localStorage (keys `sf_*`, incl. `sf_refs`).

## AI source
The app calls `window.claude.use("sample")`. Two modes:
1. Inside claude.ai (artifact): works with no key.
2. Anywhere else (your repo / hosting): a built-in fallback calls the Gemini API.
   Open "Cài đặt AI (Gemini)" in the page, paste your key, and optionally a model name
   (default `gemini-2.0-flash`; change it if Google retires that name).
   The key lives in localStorage on the user's own browser. For a public deployment,
   move the call behind your own backend instead of shipping keys to browsers.

## Where to hook in
- `gs.json(prompt)` (search for `const gs`) is the only network call. Replace it to use any LLM or your backend.
- Prompts: search `const prompt=` (script), `async function rewrite`, `async function makePack`, `ideaBtn`, `refsText` (few-shot reference scripts).
- Subtitle logic: `makeSRT` (3 words per line, time split by character count).

## Known limits
- SRT timing is an estimate; align to the real voice-over in CapCut.
- Tracker is local only (no accounts, no sync).
