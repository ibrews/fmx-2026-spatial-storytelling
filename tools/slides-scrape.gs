// =====================================================================
// Spatial Deck — Slides Scraper (Google Apps Script Web App)
// =====================================================================
// Standalone GAS script that pulls a Google Slides deck's full structure
// — including YouTube/Drive video embeds with their source IDs, which
// the .pptx exporter destroys (videos get flattened to thumbnail images).
//
// SETUP
//   1. script.google.com → New project, paste this file in.
//   2. Services (+) → "Google Slides API" (identifier: Slides). Add.
//   3. Deploy → New deployment → Web app
//        Execute as: me
//        Who has access: "Anyone with the link" (or "Only myself" + use
//        an authed fetch — see notes below).
//   4. Authorize when prompted (drive.readonly + presentations.readonly).
//   5. Copy the /exec URL.
//
// USE
//   GET  <URL>?action=scrape&presentationId=<DECK_ID>
//   GET  <URL>?action=scrape&presentationId=<DECK_ID>&slide=12   (one slide, 0-based)
//   GET  <URL>?action=videos&presentationId=<DECK_ID>            (just the videos)
//   GET  <URL>?action=ping
//
// OUTPUT (action=scrape)
//   { ok: true, result: {
//       deckId, title, size:{w,h,unit},
//       slides: [{
//         idx, objectId, notes,
//         elements: [{
//           type: 'video'|'image'|'text'|'table'|'group'|'line'|'sheets'|'wordart'|'other',
//           pos: {l,t,w,h},                    // % of slide (matches extract_pptx2.py)
//           // video:
//           source: 'YOUTUBE'|'DRIVE',
//           videoId, url, start, end, autoPlay, mute,
//           // image:
//           contentUrl, sourceUrl,
//           // text:
//           text, placeholderType,
//           // table:
//           rows: [["cell","cell"], ...]
//         }]
//       }]
//   }}
//
// PRIVATE DECKS
//   The "Anyone with the link" deployment runs as YOU, so any deck you
//   can open is scrapable through it. If you want the endpoint itself
//   restricted, deploy as "Only myself" and call with a Google ID
//   token, OR keep it public and rely on presentationId being secret.
// =====================================================================

function doGet(e)  { return handle_(e); }
function doPost(e) { return handle_(e); }

function handle_(e) {
  try {
    const body = e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};
    const params = e.parameter || {};
    const action = body.action || params.action || 'scrape';
    const presentationId = body.presentationId || params.presentationId;
    const slideIdx = body.slide != null ? Number(body.slide)
                   : params.slide != null ? Number(params.slide)
                   : null;

    let result;
    switch (action) {
      case 'ping':    result = { pong: true, ts: Date.now() }; break;
      case 'scrape':  result = scrape_(presentationId, slideIdx, false); break;
      case 'videos':  result = scrape_(presentationId, slideIdx, true);  break;
      default: throw new Error('Unknown action: ' + action);
    }
    return jsonResponse_({ ok: true, result });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message || err),
                           stack: err && err.stack });
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- Core ----------

function scrape_(presentationId, onlySlideIdx, videosOnly) {
  if (!presentationId) throw new Error('Missing presentationId');

  // Slides advanced service — returns the full REST JSON tree.
  // Enable: Services → Google Slides API.
  const pres = Slides.Presentations.get(presentationId);

  const slideW = pres.pageSize && pres.pageSize.width  ? pres.pageSize.width.magnitude  : 9144000;
  const slideH = pres.pageSize && pres.pageSize.height ? pres.pageSize.height.magnitude : 5143500;
  const unit   = pres.pageSize && pres.pageSize.width  ? pres.pageSize.width.unit       : 'EMU';

  const allSlides = pres.slides || [];
  const slides = (onlySlideIdx != null)
    ? [allSlides[onlySlideIdx]].filter(Boolean).map((s, i) => walkSlide_(s, onlySlideIdx, slideW, slideH, videosOnly))
    : allSlides.map((s, i) => walkSlide_(s, i, slideW, slideH, videosOnly));

  if (videosOnly) {
    return {
      deckId: presentationId,
      title: pres.title,
      videos: slides.flatMap(sl => sl.elements
        .filter(el => el.type === 'video')
        .map(el => Object.assign({ slide: sl.idx }, el)))
    };
  }

  return {
    deckId: presentationId,
    title: pres.title,
    size: { w: slideW, h: slideH, unit: unit },
    slides: slides
  };
}

function walkSlide_(slide, idx, slideW, slideH, videosOnly) {
  const elements = [];
  (slide.pageElements || []).forEach(el => {
    const out = describeElement_(el, slideW, slideH);
    if (!out) return;
    if (videosOnly && out.type !== 'video') {
      // Recurse into groups even in videos-only mode
      if (out.type === 'group' && out.children) {
        out.children.forEach(c => { if (c.type === 'video') elements.push(c); });
      }
      return;
    }
    elements.push(out);
  });

  return {
    idx: idx,
    objectId: slide.objectId,
    notes: extractNotes_(slide),
    elements: elements
  };
}

function describeElement_(el, slideW, slideH) {
  const pos = computePos_(el, slideW, slideH);
  const base = { objectId: el.objectId, pos: pos };

  if (el.video) {
    const v = el.video;
    const vp = v.videoProperties || {};
    return Object.assign(base, {
      type: 'video',
      source: v.source,            // 'YOUTUBE' | 'DRIVE'
      videoId: v.id,
      url: v.url,
      start: vp.start != null ? vp.start : null,
      end:   vp.end   != null ? vp.end   : null,
      autoPlay: !!vp.autoPlay,
      mute:     !!vp.mute,
      outline: vp.outline || null
    });
  }

  if (el.image) {
    return Object.assign(base, {
      type: 'image',
      contentUrl: el.image.contentUrl,
      sourceUrl: el.image.sourceUrl,
      // contentUrl is a temporary Google-hosted URL (~30 min). Use it
      // immediately or download via UrlFetchApp.fetch() and persist.
      altText: el.title || el.description || null
    });
  }

  if (el.shape) {
    const text = extractTextFromShape_(el.shape);
    return Object.assign(base, {
      type: 'text',
      shapeType: el.shape.shapeType,
      placeholderType: el.shape.placeholder ? el.shape.placeholder.type : null,
      text: text
    });
  }

  if (el.table) {
    const rows = (el.table.tableRows || []).map(row =>
      (row.tableCells || []).map(cell => extractTextFromCell_(cell))
    );
    return Object.assign(base, { type: 'table', rows: rows });
  }

  if (el.elementGroup) {
    const children = (el.elementGroup.children || [])
      .map(c => describeElement_(c, slideW, slideH))
      .filter(Boolean);
    return Object.assign(base, { type: 'group', children: children });
  }

  if (el.line)              return Object.assign(base, { type: 'line' });
  if (el.sheetsChart)       return Object.assign(base, { type: 'sheets', chartId: el.sheetsChart.chartId });
  if (el.wordArt)           return Object.assign(base, { type: 'wordart', text: el.wordArt.renderedText });

  return Object.assign(base, { type: 'other' });
}

// Slides position math: the rendered rect is
//   left = transform.translateX
//   top  = transform.translateY
//   width  = size.width.magnitude  * (transform.scaleX || 1)
//   height = size.height.magnitude * (transform.scaleY || 1)
// All in the same unit as pageSize (EMU by default).
function computePos_(el, slideW, slideH) {
  const t = el.transform || {};
  const s = el.size || {};
  const sw = s.width  ? s.width.magnitude  : 0;
  const sh = s.height ? s.height.magnitude : 0;
  const w = sw * (t.scaleX || 1);
  const h = sh * (t.scaleY || 1);
  const l = t.translateX || 0;
  const top = t.translateY || 0;
  const pct = (v, dim) => dim ? Math.round((v / dim) * 10000) / 100 : 0;
  return { l: pct(l, slideW), t: pct(top, slideH), w: pct(w, slideW), h: pct(h, slideH) };
}

function extractTextFromShape_(shape) {
  if (!shape || !shape.text) return '';
  return (shape.text.textElements || [])
    .map(te => te.textRun ? te.textRun.content : '')
    .join('')
    .replace(//g, '\n')
    .trim();
}

function extractTextFromCell_(cell) {
  if (!cell || !cell.text) return '';
  return (cell.text.textElements || [])
    .map(te => te.textRun ? te.textRun.content : '')
    .join('')
    .replace(//g, '\n')
    .trim();
}

function extractNotes_(slide) {
  try {
    const np = slide.slideProperties && slide.slideProperties.notesPage;
    if (!np || !np.pageElements) return '';
    // Notes body lives in the shape whose placeholder.type === 'BODY'
    for (let i = 0; i < np.pageElements.length; i++) {
      const pe = np.pageElements[i];
      if (pe.shape && pe.shape.placeholder && pe.shape.placeholder.type === 'BODY') {
        return extractTextFromShape_(pe.shape);
      }
    }
    // Fallback: first shape with text on the notes page
    for (let i = 0; i < np.pageElements.length; i++) {
      const pe = np.pageElements[i];
      if (pe.shape) {
        const t = extractTextFromShape_(pe.shape);
        if (t) return t;
      }
    }
  } catch (_) {}
  return '';
}

// ---------- Local test (run from the Apps Script editor) ----------
// Set DECK_ID then Run → testScrape. Output appears in Execution log.
function testScrape() {
  const DECK_ID = 'PASTE_DECK_ID_HERE';
  const out = scrape_(DECK_ID, null, true);
  Logger.log(JSON.stringify(out, null, 2));
}
