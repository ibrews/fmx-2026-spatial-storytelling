# FMX 2026 — Spatial Storytelling · AI Agent Handoff

> **READ THIS FILE TOP TO BOTTOM BEFORE TOUCHING ANY SLIDES.**
> Last updated: 2026-05-08 · Session 4 (post-FMX, pre-BPI)

---

## Recommended model

**Try Opus 4.6 Legacy (`claude-opus-4-6`) first.** Alex reports it was significantly more reliable for these tasks than Opus 4.7 or Sonnet 4.6. It's still available in the model picker as "Opus 4.6 Legacy." Note: Anthropic may have adjusted it since 4.7 shipped, so results may vary — but it's the best starting point.

Available models: Opus 4.7 (`claude-opus-4-7`), **Opus 4.6 Legacy (`claude-opus-4-6`)**, Sonnet 4.6 (`claude-sonnet-4-6`), Haiku 4.5 (`claude-haiku-4-5-20251001`).

The Session 4 failures were instruction-following failures, not capability failures — the DO NOT list below is the real fix regardless of model.

**Before any session:** read POST_MORTEM.md.

---

## Current state

**116 slides** across **10 sections** + BONUS (hidden). (Was 120 — removed 3 blank/dup slides at start of Year 5 and the Live demo placeholder per David's post-FMX notes.)

| # | URL hash | Section |
|---|---|---|
| 0 | #0 | Settings/config panel |
| 1 | #1 | Cover |
| 2 | #2 | Track lineup |
| 3 | #3 | Lesson I — Ghosts of Performances Past |
| 4–15 | #4–15 | Section I cases |
| 16 | #16 | Lesson II — Why Live? |
| 17–24 | #17–24 | Section II cases |
| 25 | #25 | Lesson III — A Christmas Carol VR |
| 26–31 | #26–31 | Section III cases (diagram, praise rain, praise wall, ATL, Jettison) |
| 32 | #32 | Lesson IV — Year 1 (2021) |
| 33–56 | #33–56 | Section IV cases (24 slides from export fmx2.pptx) |
| 57 | #57 | Lesson V — "Liveness doesn't preclude prerecorded elements." |
| 58–61 | #58–61 | Section V cases (Year 1 wrap-up: s01–s05) |
| 62 | #62 | Lesson VI — CHRISTMAS CAROL YEAR 2 (2022) |
| 63–77 | #63–77 | Section VI cases (15 slides: Debbie Deer, Orchard, pixel streaming) |
| 78 | #78 | Lesson VII — CHRISTMAS CAROL YEAR 3 (2023) |
| 79–96 | #79–96 | Section VII cases (17 slides: Quest Pro, AI Dickens, live stream) |
| 97 | #97 | Lesson VIII — CHRISTMAS CAROL YEAR 4 (2024) |
| 98–101 | #98–101 | Section VIII cases (Body of Mine, standalone PC, optimization) |
| 102 | #102 | Lesson IX — CHRISTMAS CAROL YEAR 5 (2025) |
| 103–114 | #103–114 | Section IX cases (RSC grant, Replay/Live demo, close of show) |
| 115 | #115 | Lesson X — XR Tools for Live Performance |
| 116–119 | #116–119 | Section X cases (Stage Presence, Halcyon, Future Use, closing image) |
| 120 | #120 | "Let's Talk" closing (agilelens.com / david@agilelens.com) |

**GitHub Pages:** https://ibrews.github.io/fmx-2026-spatial-storytelling/
**Local dev:** `http://localhost:3000`

---

## Source materials

- **Remaining slides source:** `/Users/alex/Desktop/FMX/final.pptx` (71 slides — this is the ONLY correct source for slides added in Session 4. Do NOT use `FMX Spatial Storytelling 2026 Test.pptx`.)
- **Year 1 build:** `/Users/alex/Desktop/FMX/export fmx2.pptx` (24 slides, Section IV)
- **HXR keynote (reference):** `/Users/alex/harvardxr-keynote/` — RSC images at `media/rsc/`, Stage Presence at `media/stage-presence/`
- **videos.json** — maps original Google Slides slide numbers to local video files. Cross-reference this BEFORE building any slide with a full-bleed image under 50KB.

---

## KNOWN ISSUES — fix before BPI

### Video placeholders showing as images
Four slides show a tiny blurry JPG where a video should play. Alex needs to identify the correct video file for each:

| Web deck # | File | Notes |
|---|---|---|
| ~44 | `s11-00-4b69fabb.jpg` (6KB) | Year 1, audience experience passivity |
| ~60 | `s05-00-fadda3a9.jpg` (14KB) | Year 1 wrap, create-your-own-show |
| ~72 | `s19-00-f55f9698.jpg` (7KB) | Year 2, pixel streaming lesson |
| ~113 | `s61-00-11998c28.jpg` (5KB) | Year 5, replay backup |

Local videos available but not yet mapped: `slide53-video-1hP7ODkm.mp4`, `slide54-video-1L4BJ678.mp4`. Ask Alex which slots these belong in.

### NOTE: slides not yet implemented
- **Slide 66 (S66 in final.pptx):** "NOTE: make a cool animated diagram that shows all these projects feeding into Christmas Carol, then going to Stage Presence, then new projects emerging." → Needs a custom SVG/animated diagram showing project lineage. See notes for the narrative.
- **Slide 69 (S69 in final.pptx):** "Note: generate the recap slide in the vein of https://ibrews.github.io/harvardxr-keynote/#47" → Check that URL for reference layout. Speaker notes have the full recap text.

---

## TALK FACTS

- **Alex Coulombe** — Founder · Agile Lens. Theater-design architect turned XR. NOT "XR Director" or "CEO."
- **David Gochfeld** — Director, actor, writer, technologist. NOT affiliated with Agile Lens.
- **Working together since 2017.** Never compute durations.
- **Agile Lens ~10 years old.**
- **`A:` / `D:`** in notes = Alex / David. Preserve verbatim.

---

## DO NOT

1. Generate subtitles/captions unless source has direct body text or NOTE: directive.
2. Put speaker-notes content on the slide — notes are the script, not slide copy.
3. Use `object-fit:cover` on content images (global default is `contain`; only `grid-cover` class uses cover).
4. Add Chapter X/Y indicators to lesson slides.
5. Label David as Agile Lens.
6. Make up titles, roles, or bullets for Alex or David.
7. Compute durations from dates.
8. Use `window.kfOnSlideEnter` for persistent hooks — overwritten by annotation system at line ~1506. Use `MutationObserver` instead.
9. Write Python `\n` (newline char) inside JS single-quoted strings — use `\\n`. Causes `SECTIONS is not defined` syntax error.
10. Remove or re-order slides without explicit instruction.
11. **Use a source file other than what Alex specifies.** If `final.pptx` is specified, use `final.pptx`. Do not substitute.
12. Treat a <50KB full-bleed image as a real slide image — it is a video placeholder. Check `videos.json` first.
13. Commit files to git without running `git ls-files | xargs du -sh | sort -rh | head -20` first. Anything >10MB goes in `.gitignore` before staging.

---

## DO

1. Match source slide count and order.
2. Keep speaker notes verbatim from source.
3. `object-fit:contain` for content images. `grid-cover:true` for intentional fill.
4. `MutationObserver` on `.active` class for slide-activation logic.
5. Convert large GIFs to MP4: `ffmpeg -y -i in.gif -c:v libx264 -pix_fmt yuv420p -movflags +faststart out.mp4`
6. Verify at **1920×1080** before declaring done.
7. **Read POST_MORTEM.md before any session.**
8. **If push fails:** use orphan branch (`git checkout --orphan fresh`, remove large files, force push). Do NOT fight git history. GitHub API file-by-file push works for index.html emergencies.
9. **For video placeholders:** find matching file in `media/fmx/` or `videos.json` before falling back to the tiny JPG.

---

## Codebase orientation

- **Single file:** `index.html`. Zero build. 3 script blocks.
- **Script Block 1** (lines ~15–470): `const SECTIONS = [...]` — 10 sections. Edit content here.
- **Script Block 3** (main JS): Build loop, orbit, praise-rain, Alex/David animations, navigation.

### Key layout types
| `c.layout` | Description |
|---|---|
| `'intro-hxr'` | Alex HXR slide 2 port |
| `'sprite'` | Pixel-art avatar (David) |
| `'orbit'` | Agile Lens monocle + spinning clients |
| `'placed'` | Absolute positioned images using PPTX coords |
| `'carol-diagram'` | Christmas Carol 5-season SVG diagram |
| `'full'` | Full-bleed image/video |
| `'grid'` | Multi-image grid |
| `'big'` | Centered statement text |
| (default) | 2-pane: image left, bullets right |

---

## Git / deployment

- **Local:** `http://localhost:3000` (served by preview server)
- **GitHub Pages:** pushes deploy in ~2 min
- **Emergency push only index.html:** `gh api repos/ibrews/fmx-2026-spatial-storytelling/contents/index.html -X PUT -f message="..." -f content="$(base64 -i index.html)" -f sha="$(gh api repos/ibrews/fmx-2026-spatial-storytelling/contents/index.html --jq '.sha')"`
- **Full push (large repo):** Use orphan branch to avoid carrying git history. See DO #8 above.
- **.gitignore** must exclude: `slide*-video-*.mp4`, any file >10MB before first commit.

---

## Slide-by-slide status

| Range | Status | Notes |
|---|---|---|
| 1–56 | ✓ | Original 4 sections, all verified |
| 57–120 | ✓ | Added Session 4 from final.pptx |
| Video placeholders (4 slides) | ⚠ | See KNOWN ISSUES above |
| Slide 66 (diagram) | ⚠ | NOTE: needs animated diagram |
| Slide 69 (recap) | ⚠ | NOTE: needs HXR-style recap layout |
| Closing slide | ✓ | agilelens.com / david@agilelens.com / QR to GitHub Pages |

---

## How to start next session

1. Read this file top to bottom.
2. Read `POST_MORTEM.md`.
3. `git pull` (or verify orphan branch is what's on remote).
4. Confirm the source file with Alex before touching any content.
5. Run `git ls-files | xargs du -sh | sort -rh | head -10` and verify `.gitignore` covers anything large before staging.
6. Fix one issue at a time. Screenshot at 1920×1080 to confirm before moving on.
