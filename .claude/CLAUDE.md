# FMX 2026 Spatial Storytelling — Claude Code Instructions

## What This Is

This is a **content fork** of the Spatial Deck framework (`~/git/spatial-deck/`), prepared for the FMX 2026 talk "Ghosts of Performances Past." Everything lives in a single `index.html`.

Read `~/git/spatial-deck/.claude/CLAUDE.md` and `HANDOFF_PROMPT.md` in this repo for framework conventions and architecture.

## Fork ↔ Upstream Rules

**Framework-level fixes and features must land in BOTH repos.** This fork inherits the framework from spatial-deck. When you fix a bug or add a feature that isn't FMX-content-specific, port it to spatial-deck in the same session and push both.

What counts as framework-level (must backport):
- Annotation system fixes (anno/move/crop modes, export format)
- Renderer bugs (mediaTag, grid/placed/full layouts, object-position handling)
- Navigation, keyboard shortcuts, presenter view, presenter ribbon
- Settings card, snapshot/restore, search overlay
- Anything in the JS that isn't tied to FMX's SECTIONS content

What stays FMX-only (don't backport):
- Edits to the `SECTIONS` array (slides, talking points, images)
- FMX-specific assets in `media/fmx/`
- `HANDOFF_PROMPT.md` content updates
- POST_MORTEM.md and other talk-specific docs

Workflow: edit + verify here first, then mirror the same edit in `~/git/spatial-deck/index.html`, commit each repo with the same conventional-commit message, push both. The annotation-system fixes from 2026-05-22 (commits cb5d83d → ec85731 in FMX, 24a09e1 → 14993c2 in spatial-deck) are the canonical example pair.

A sibling fork — `~/git/nxtbld-2026-productizing-xr/` — exists too. Fixes flow: any fork → spatial-deck. The other forks can then pull from spatial-deck on their own cadence (don't push the same fix across all three unless asked).

## Annotation Workflow

Alex's working pattern: he uses annotate/move/crop mode in the deck to capture edits, exports them (Copy All button), and pastes the markdown export back into a Claude session. **You apply the changes to SECTIONS** — don't expect him to do it himself. Crop annotations carry the source filename in a `/* */` comment so you can grep SECTIONS to find the right entry.

When applying crops: convert `'media/fmx/x.png'` → `['media/fmx/x.png', '<object-position>']` in the relevant `images` or `placedImages` array. Note that the renderer's style-injection uses `replace('>', ...)` (not `/>$/`) — needed for `<video>` tags which have a closing `</video>`.
