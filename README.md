# FMX 2026 — Spatial Storytelling

**"Ghosts of Performances Past — Five Years of A Christmas Carol VR"** — a 50-minute talk by **Alex Coulombe** & **David Gochfeld** (Agile Lens) for the Spatial Storytelling track at FMX 2026.

This repo is a [Spatial Deck](https://github.com/ibrews/spatial-deck) fork — single-file HTML, zero build, all content baked into `index.html`.

> **Status (2026-05-06):** First-pass draft of slides 1–29 of ~125. Sections II and III, Years 2–5 of Christmas Carol, and Stage Presence still to land. This is the "are we on the same page?" pass.

## Quickstart

```bash
git clone https://github.com/ibrews/fmx-2026-spatial-storytelling
cd fmx-2026-spatial-storytelling
python3 -m http.server 8080
# open http://localhost:8080
```

## URL modes

| URL | Mode |
|---|---|
| `index.html` | Presentation mode (cover) |
| `index.html?edit` | Edit mode (lands on Settings) |
| `index.html?notes` | Phone speaker view — script + timer + clicker relay |
| `index.html?vertical` | Scroll-through mode (single page) |

## Things to Try

1. **Open `index.html` in any browser** — the Ghost background style is on by default. The cover lingers on "What Is Spatial Storytelling?" with merging color wisps.
2. **Step through with → / Space** — chapter dividers (Ghosts · Why Live? · Christmas Carol) accent in rose / amber / purple. Whoosh on each transition.
3. **Press `N`** to open the presenter notes window (BroadcastChannel-synced) on a second display.
4. **Append `?notes` and open on your phone** — script view with running timer, target finish, projected finish, ⟲ long-press to reset, padlock-clicker to advance the laptop. Cloud sync needs `notes-config.json` populated with a `gasUrl`.
5. **Press `M`** to enter Move mode, drag any element, then `A` to see the auto-saved annotation. Settings round-trip works the same way as in `spatial-deck` main.

## What's in here

- **Sections I–III** of the talk:
  - **I — Ghosts of Performances Past** (rose) — Alex + David intros, Macbeth, Hamlet, Agile Lens, "Client work funds the play."
  - **II — Why Live?** (amber) — 2008 London, Boal, the central question.
  - **III — A Christmas Carol VR** (purple) — audience reactions, ATL setup, MetaHumans.
- **Bonus** — "And This Is Just The First Five Years…" — placeholder for the rest of the talk.
- **Map** — constellation view of the journey, clickable.
- **Custom slides** — track speakers (slide 2) and Topics (slide 4) hand-built outside SECTIONS.

## Layout flags (fork-local extension to spatial-deck)

This fork extends the framework's case-slide build loop with three new layouts:

| Flag | Purpose |
|---|---|
| `layout: 'full'` | Full-bleed image or video with a small overlay caption. Use for hero shots. |
| `layout: 'grid'` | Multi-image artful arrangement. Auto-grids based on `images.length`. |
| `layout: 'big'` | Centered big-text statement. No image. Use for chapter pivots. |

Plus: `.mp4` / `.webm` / `.mov` paths in `c.img` or `c.images[]` auto-render as `<video autoplay loop muted playsinline>`.

## Media

`media/fmx/` contains 54 assets extracted from the source deck:
- 47 PNG / JPG stills
- 7 MP4s (animated GIF source clips re-encoded for delivery — 50 MB → 2.5 MB on the theatre clip)

Total: ~54 MB. All under GitHub's 100 MB per-file limit.

## Speaker notes & cloud sync

`notes-config.json` is committed to `.gitignore` because it carries the Google Apps Script Web App URL for the phone speaker view. Drop your `gasUrl` into it locally:

```json
{
  "gasUrl": "https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec",
  "deckId": "fmx-2026"
}
```

Without a `gasUrl` the phone view falls back to `localStorage`-only.

## Upstream

Framework: [ibrews/spatial-deck](https://github.com/ibrews/spatial-deck). To sync framework updates:

```bash
git fetch upstream
git merge upstream/main
# resolve any conflicts in index.html (SECTIONS / cover stay yours)
```

## Related

- Talk slot: FMX 2026, Spatial Storytelling track, alongside Numena · Innerspace · Liminal.
- Companion talks: NXT BLD 2026 (Blueprint Immersive) — separate fork.
- Original keynote that spawned this framework: [HXR 2026](https://ibrews.github.io/harvardxr-keynote/).
