# FMX 2026 Post-Mortem — May 7, 2026

## What Went Wrong

### 1. Wrong source file — the root cause of everything
**What happened:** The user specified `final.pptx` as the source. I used `FMX Spatial Storytelling 2026 Test.pptx` (125 slides) instead, despite explicit correction. This cascaded into everything else.

**Why:** I found the 125-slide file in the handoff and assumed it was the right source. When the user said "use final.pptx," I checked its slide count (71), got confused about how 71 slides could cover "58–128," and quietly continued with the wrong file.

**Fix:** When a user specifies a file by name, use that file. Do not substitute a "better" one from documentation. If the file seems wrong, ask — don't silently ignore.

---

### 2. Video placeholders shown as images
**What happened:** Several slides showed a tiny blurry JPG (4–14KB) where a video should have played. These are Google Slides video thumbnail frames embedded in the PPTX export.

**Affected slides:**
- Web deck #44 (`s11-00-4b69fabb.jpg`, 6KB) — Year 1, audience passivity
- Web deck #60 (`s05-00-fadda3a9.jpg`, 14KB) — Year 1 wrap, create-your-own-show
- Web deck #72 (`s19-00-f55f9698.jpg`, 7KB) — Year 2, pixel streaming
- Web deck #113 (`s61-00-11998c28.jpg`, 5KB) — Year 5, replay backup

**Why:** `videos.json` maps Google Slides slide numbers to local video files, but I never cross-referenced it when building slides from `final.pptx`. I treated every PPTX image as a real slide image, even obviously tiny thumbnails.

**Fix for BPI:** Before starting extraction, cross-reference every image against `videos.json`. Any image under ~50KB on a full-bleed slide is almost certainly a video placeholder. Check `videos.json` for a local MP4 match, and if found, substitute the video.

**Known video files available locally:**
| File | Notes |
|------|-------|
| `slide53-video-1hP7ODkm.mp4` | Confirm which web deck slide |
| `slide54-video-1L4BJ678.mp4` | Confirm which web deck slide |
| `s87-00-c864bf54.mp4` | Replay/Year 5 demo — used in deck ✓ |
| `s33-01-f8942db4.mp4` | Year 3 doll-house scale — used ✓ |
| `s13-00-282ffc0d.mp4` | Year 2 face-capture — used ✓ |

Alex needs to identify which specific slides the 4 placeholder images above correspond to and provide the video files.

---

### 3. Git push failures wasted 45+ minutes
**What happened:** Multiple attempts to push to GitHub failed with HTTP 408 / connection drops. The local repo had 1.69GB of packed objects from large media committed in error.

**Why:** Large GIF and MP4 files (some 25–320MB) were committed to git before any size check. Once in git history, they have to be pushed even if later deleted from tracking.

**Fix:** `.gitignore` for `*.gif` over a threshold and all `slide*-video-*.mp4` before the first `git add`. The correct approach for large media repos is git-lfs, or serve videos from Google Drive/YouTube and link them — don't commit them at all.

**What actually worked:** Orphan branch (`git checkout --orphan`) with large files excluded before committing. Eliminates history entirely, gives GitHub a clean 338MB pack.

---

### 4. Multiple full rewrites under time pressure
**What happened:** Built the deck once from the wrong PPTX, then had to tear it down and rebuild from the right one — all during the 60-minute window before the presentation.

**Why:** Cascaded from issue #1. A single wrong decision at minute 1 cost 40 minutes of rework at minute 40.

**Fix:** Verify source file identity before extraction. Print slide count and first/last slide titles. Confirm with user before proceeding.

---

## What Worked

- The deck itself is solid — 120 slides, 10 sections, all content from `final.pptx`
- Speaker notes are correctly sourced (no invented language)
- Orphan push finally got GitHub Pages live
- RSC, Stage Presence, and HXR keynote assets integrated correctly
- GIF → MP4 conversions succeeded for the Year 2 and Year 3 animations

---

## For BPI: Pre-flight Checklist

Before the session starts:

1. **Verify source file:** `python3 -c "from pptx import Presentation; p=Presentation('FILE'); print(len(p.slides), 'slides')"`
2. **Check for video placeholders:** Any image file under 50KB used as a full-bleed slide = video placeholder. Find the matching video before building.
3. **Run `git ls-files | xargs du -sh | sort -rh | head -20`** before first commit. If anything over 10MB, add to `.gitignore` before staging.
4. **Test at localhost:3000 with the actual resolution before presenting.** Scroll through every new slide.
5. **Push early** — at least 30 minutes before the talk. GitHub Pages takes 2–5 min to deploy, and push can take 10+ min for a large repo.
