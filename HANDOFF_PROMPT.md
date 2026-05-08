# FMX 2026 — Spatial Storytelling · AI Agent Handoff

> **READ THIS FILE TOP TO BOTTOM BEFORE TOUCHING ANY SLIDES.**
> Last updated: 2026-05-07 · Session 3

---

## Current state

**59 slides** across **4 sections** + BONUS (year V, hidden).

| # | URL hash | Slide |
|---|---|---|
| 0 | #0 | Settings/config panel |
| 1 | #1 | Cover |
| 2 | #2 | Track lineup (2×2 speaker grid) |
| 3 | #3 | **Lesson I — Ghosts of Performances Past** (chapter header) |
| 4 | #4 | Topics/agenda |
| 5 | #5 | Alex Coulombe intro (HXR-style animated) |
| 6 | #6 | Macbeth grid |
| 7 | #7 | Image trio |
| 8 | #8 | Re-show Macbeth |
| 9 | #9 | David Gochfeld intro (sprite · "SPEAKER" eyebrow · "Director & XR Creator") |
| 10 | #10 | Hamlet (2017) |
| 11 | #11 | Agile Lens orbit (monocle + spinning clients) |
| 12 | #12 | 3×3 client image grid |
| 13 | #13 | Tech Prototypes / categories |
| 14 | #14 | "Client work funds the play" big text |
| 15 | #15 | Theatre video (full-bleed) |
| 16 | #16 | **Lesson II — WHY LIVE?** |
| 17–24 | #17–24 | Section II: 2008 London, Music/Opera/Dance/Theatre, Boal, abstracts, big Q, flash forward |
| 25 | #25 | **Lesson III — A Christmas Carol VR** |
| 26 | #26 | 5-season diagram (tech pipeline + 3-axis table) |
| 27 | #27 | Appreciative audience (praise rain — 2 steps) |
| 28 | #28 | Praise wall (placed, 14 images) |
| 29 | #29 | ATL setup (placed, exact PPTX coords) |
| 30 | #30 | Jettison + La Pasión XR (placed, 4-col: s29-00.mp4, s29-01.png, s29-04.jpg, s29-05.png) |
| 31 | #31 | **Lesson IV — YEAR 1 (2021)** (tagline hidden; title shifted +62px) |
| 32–55 | #32–55 | Section IV: 24 slides from export fmx2.pptx (2021 Year 1 build) |
| 56 | #56 | BONUS (year V, hidden) |

**GitHub Pages:** https://ibrews.github.io/fmx-2026-spatial-storytelling/

---

## TALK FACTS

- **Alex Coulombe** — Founder · Agile Lens. Theater-design architect turned XR. NOT "XR Director" or "CEO."
- **David Gochfeld** — Director, actor, writer, technologist. NOT affiliated with Agile Lens.
- **Working together since 2017.** Never compute durations.
- **Agile Lens ~10 years old.**
- **50-minute talk**, FMX 2026, Stuttgart. Target: **1920×1080**.
- **`A:` / `D:`** in notes = Alex / David. Preserve verbatim.

---

## DO NOT

1. Generate subtitles/captions unless source has direct body text or NOTE: directive.
2. Put speaker-notes content on the slide — notes are the script, not slide copy.
3. Use `object-fit:cover` on content images (global default is `contain`; only `grid-cover` class uses cover).
4. Add Chapter X/Y indicators to lesson slides.
5. Label David as Agile Lens.
6. Make up titles or roles for Alex or David.
7. Make up bullets or bio content for David — his slide intentionally shows only name + "Director & XR Creator" subtitle.
8. Compute durations from dates.
9. Define "spatial storytelling" on the cover.
10. Change slide 29 to placed layout — Alex never asked for that; reverted. Leave it as grid.
11. Use `window.kfOnSlideEnter` for persistent hooks — overwritten by annotation system at line ~1506. Use `MutationObserver` instead.
12. Write Python `\n` (newline char) inside JS single-quoted strings — use `\\n` for the escape sequence. This was the cause of the "SECTIONS is not defined" syntax error.
13. Remove or re-order slides without explicit instruction.

---

## DO

1. Match source slide count and order.
2. Keep speaker notes verbatim from source.
3. `object-fit:contain` for content images (grid/placed). `grid-cover:true` flag for slides where fill/crop is intentional (slides 12, 13).
4. `MutationObserver` on `.active` class for any slide-activation logic (orbit, animations).
5. Convert large GIFs to MP4 before adding (`ffmpeg -i in.gif -c:v libx264 out.mp4`).
6. Verify at **1920×1080** before declaring done.
7. `layout:'placed'` with exact PPTX coords for deliberate spatial compositions (praise wall, ATL).
8. Add `.case-slide.layout-grid .fmx-grid{grid-row:2}` is already in CSS — this forces fmx-grid into the 1fr row regardless of whether a header is present. Don't break this.

---

## Codebase orientation

- **Single file:** `index.html`. Zero build. 3 script blocks.
- **Script Block 1** (lines ~15–210): `const SECTIONS = [...]` — 4 sections. Edit content here.
- **Script Block 3** (main JS): Build loop, orbit, praise-rain, Alex/David animations, navigation.

### Key layout types
| `c.layout` | Description |
|---|---|
| `'intro-hxr'` | Alex HXR slide 2 port — full `.intro-grid` HTML + SVG stage |
| `'sprite'` | Pixel-art avatar + name/role/bullets (David uses this) |
| `'orbit'` | Agile Lens monocle + spinning clients SVG |
| `'placed'` | Absolute positioned images using PPTX coordinates |
| `'carol-diagram'` | Christmas Carol 5-season SVG diagram |
| `'full'` | Full-bleed image/video |
| `'grid'` | Multi-image grid |
| `'big'` | Centered statement text |
| (default) | 2-pane: image left, bullets right |

### Alex intro (layout:'intro-hxr')
- Walk-in plays automatically on slide enter.
- Eyebrow label is **"SPEAKER"** (not "Your Speaker" — that was changed session 3).
- Stat label `.intro-stat .lbl` has `line-height:1.3` (no `white-space:nowrap`) — "Years at Agile Lens" wraps to 2 lines.
- **Press → three times** to see all steps:
  1. Bio text (Speaker, name, description)
  2. UE5 Gold block drops, Alex 2× powerup, run+shoot fireballs
  3. Tally counters count up: 16 / 10 / 8 / 100+
- `buildUE5Block()`, `paintWornHeadset()`, `shootFireball()` in main script.
- `GoldAuthorized.png` and `ue5logo.png` are in repo root.

### David intro (layout:'sprite')
- `eyebrow:'Speaker'`, `subtitle:'Director & XR Creator'` — do not add bullets or expand bio.
- `withBeard:true, withGlasses:true, hairColor:'#484848'...` in SECTIONS
- Shoots comedy/tragedy theater mask SVGs instead of Unreal logos
- Still uses bearded pixel-art silhouette — no real David sprite (no usable photo)

### Orbit (slide 11)
- MutationObserver starts/stops `lensStep()` + hum oscillators
- `monocle-white.png` is in repo root (pulsing glow overlay)
- AGILE LENS, IMMERSIVE DESIGN STUDIO, EST. 2016, NYC labels at center

### Praise rain (slide 27)
- `slideSteps`: first → starts rain, second → triggers frenzy
- 30 real A Christmas Carol VR audience quotes

### Lesson slides
- No Chapter X/Y badge
- Lesson I has: floating ghost particles + staggered text reveals + Agile Lens logo at bottom
- Lesson IV title is `'YEAR 1 (2021)'`; tagline hidden via IIFE; title shifted +62px transform
- **Agile Lens SVG monocle icon** (slides 1 + 3 bottom logos): the monocle is a `<circle>` clasp at the lower-right of the ring, NOT a `<line>`. Do not change back to a line — that looks like a magnifying glass.
- New order: Cover → Track → **Lesson I** → **Topics** → Section I cases

### Split presenter view (Shift+P), haptic pacing, `?notes`
All from 473f677 cherry-pick. See codebase orientation section in previous handoff for details.

### Notes sync
`tools/notes-sync.gs` pre-configured for FMX sheet ID.
`notes-config.json.example` ready. Alex needs one browser session to deploy GAS.

---

## Slide-by-slide status

| Slide | Status | Notes |
|---|---|---|
| 1 (Cover) | ✓ | Title only; Agile Lens SVG logo — monocle is `<circle cx="122" cy="124" r="9">` clasp (not a line) |
| 2 (Track) | ✓ | 2×2 grid, photos: Andreea/Balthazar/Robyn correct |
| 3 (Lesson I) | ✓ | Ghost particles, staggered reveals, same monocle clasp logo, glow pulse |
| 4 (Topics) | ✓ | After Lesson I, kinetic stagger animation |
| 5 (Alex) | ✓ | Eyebrow "SPEAKER"; stat labels wrap (no white-space:nowrap); 3-step sequence, all SFX |
| 6 (Macbeth) | ✓ | 3 images, contain |
| 7 (trio) | ✓ | Grid row 2 fix applied, images fill slide |
| 8 (re-Macbeth) | ✓ | Same images as 6 |
| 9 (David) | ✓ | "SPEAKER" eyebrow; "Director & XR Creator" subtitle; glasses, gray hair, theater mask fireballs |
| 10 (Hamlet) | ✓ | "2017 — live mocap actors..." subtitle restored |
| 11 (Orbit) | ✓ | Full HXR port: monocle PNG, hum, MutationObserver |
| 12 (clients) | ✓ | 3×3 grid (9 images), gridCover, BPI+brockman added |
| 13 (categories) | ✓ | lateshow02_unity.png in slot 2 |
| 14 (big text) | ✓ | "Client work funds the play", no bigCaption |
| 15 (theatre) | ✓ | contain |
| 16 (Lesson II) | ✓ | |
| 17–22 | ✓ | Subtitles cleaned, contains fixed |
| 23 (big Q) | ✓ | "What can technology / learn from / front-row live / entertainment?" — 4-line break |
| 24 (flash fwd) | ✓ | Local MP4 (was broken Google Drive iframe, replaced session 3) |
| 25 (Lesson III) | ✓ | |
| 26 (carol diagram) | ⚠ | Year 1 filled; Years 2–5 need content when assets arrive |
| 27 (appreciative) | ✓ | Praise rain: step 1 fill, step 2 frenzy |
| 28 (praise wall) | ✓ | placed, exact PPTX coords (14/14 verified) |
| 29 (ATL) | ✓ | placed, exact PPTX coords |
| 30 (Jettison/LaPasión) | ✓ | placed 4-col layout: s29-00.mp4, s29-01.png, s29-04.jpg, s29-05.png |
| 31 (Lesson IV) | ✓ | Title "YEAR 1 (2021)"; tagline hidden; title +62px transform (IIFE baked) |
| 32 (headdress design) | ✓ | 3-col placed: s01-01 pair, s01-02 color render, s01-00 photo (duplicate removed) |
| 33–55 (Sec IV) | ✓ | From export fmx2.pptx; large GIFs → MP4 |

---

## Outstanding / needs Alex's input

1. **Slide 26 (carol diagram)** — Years 2–5 cells need real content + images per year.
2. **David sprite** — no actual David photo usable; using gray-hair/glasses bearded sprite.
3. **Slide 25 (Lesson III source notes)** — David's exact script notes worth checking.
4. **Slide 29 (MetaHumans)** — Alex confirmed images show Christmas Carol but no title is shown (correct per PPTX). Images disappearing in MOVE MODE fixed.
5. **Notes sync** — deploy GAS: Sheet → Extensions → Apps Script → paste `tools/notes-sync.gs` → Deploy as Web App → copy URL to `notes-config.json`.
6. **Slides for Years 2–5** — talk continues past slide 55. BONUS (year V) is placeholder.
7. **Slide 4 "extra text"** — Alex said there was extra text; HTML shows 4 clean topic items. Might need visual confirmation of what he was seeing.
8. **Section IV review** — 24 slides from SIGGRAPH 2022 source; slides 7 and 13 have SIGGRAPH footer artifacts stripped; slide 23 has a NOTE: about trimming a video at 0:32.

---

## Source materials

- **Full source PPTX:** `/Users/alex/Desktop/FMX/FMX Spatial Storytelling 2026 Test.pptx` (382 MB, 125 slides)
- **First 29 slides:** `/Users/alex/Desktop/FMX/FMX_first29.pptx`
- **Year 1 build:** `/Users/alex/Desktop/FMX/export fmx2.pptx` (24 slides, added this session)
- **HXR keynote (reference):** `/Users/alex/harvardxr-keynote/` — avatar code, orbit, monocle, SFX, media

## Critical gotchas

1. **Python `\n` in JS strings**: Always `\\n` in Python when generating `\n` JS escape sequences. Literal newlines inside JS single-quoted strings cause `SyntaxError: Invalid or unexpected token` that manifests as `SECTIONS is not defined` — misleading secondary error.
2. **kfOnSlideEnter overwritten**: Annotation system at line ~1506 replaces it. Use `MutationObserver`.
3. **PPTX Google Slides images**: Use `hasattr(shape, 'image')` not `shape.shape_type == 13`.
4. **Slide count shifts annotation selectors**: Adding a case mid-deck shifts all `nth-of-type` selectors. Warn Alex before inserting.
5. **Alex intro steps need → press**: Walk-in is automatic; bio/UE5/tallies each require pressing →.
6. **Don't change slide 29 layout**: Was changed to placed without authorization; reverted. Grid with no title is correct (PPTX has no title text).

## How to start next session

1. Read this file top to bottom.
2. `git pull` to get latest.
3. Check `media/fmx/` for any new assets Alex added.
4. Before editing any slide: state the plan and confirm with Alex.
5. Fix one slide at a time. Screenshot at 1920×1080 to confirm before moving on.
