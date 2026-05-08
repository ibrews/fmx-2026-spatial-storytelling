#!/usr/bin/env python3
"""
pull-slides.py — fetch video embeds from a Google Slides deck via the
slides-scrape.gs web app, and print paste-ready strings for SECTIONS.

The .pptx exporter rasterizes YouTube/Drive videos to thumbnails. This
script bypasses PPTX entirely and reads the live Slides API.

USAGE
    python3 tools/pull-slides.py            # videos only (most common)
    python3 tools/pull-slides.py --all      # full deck dump → slides.json
    python3 tools/pull-slides.py --slide 14 # one slide

CONFIG (notes-config.json, in repo root):
    {
      "gasUrl":            "https://script.google.com/.../exec",  // notes (existing)
      "slidesScraperUrl":  "https://script.google.com/.../exec",  // NEW — slides-scrape.gs deployment
      "presentationId":    "1AbC...xyz"                           // NEW — Google Slides deck ID
    }

If `slidesScraperUrl` is missing it falls back to `gasUrl` (you can deploy
both .gs files in one Apps Script project sharing one /exec endpoint).
"""

import argparse
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CONFIG = REPO / "notes-config.json"
VIDEOS_JSON = REPO / "videos.json"
SLIDES_JSON = REPO / "slides.json"


def load_config():
    if not CONFIG.exists():
        sys.exit(f"error: {CONFIG} not found. Copy notes-config.json.example and fill it in.")
    cfg = json.loads(CONFIG.read_text())
    url = cfg.get("slidesScraperUrl") or cfg.get("gasUrl")
    pid = cfg.get("presentationId")
    if not url or "PASTE_YOUR_WEB_APP_URL" in url:
        sys.exit("error: notes-config.json needs slidesScraperUrl (or gasUrl) set to the deployed /exec URL.")
    if not pid:
        sys.exit("error: notes-config.json needs presentationId set to your Google Slides deck ID.")
    return url, pid


def call_gas(url, params):
    qs = urllib.parse.urlencode(params)
    full = f"{url}?{qs}"
    with urllib.request.urlopen(full, timeout=60) as r:
        body = json.loads(r.read().decode("utf-8"))
    if not body.get("ok"):
        sys.exit(f"GAS error: {body.get('error')}\n{body.get('stack', '')}")
    return body["result"]


def video_to_embed(v):
    """Return the iframe URL string ready to paste after 'iframe:'."""
    src, vid = v.get("source"), v.get("videoId")
    if src == "YOUTUBE":
        base = f"https://www.youtube.com/embed/{vid}"
        qs = []
        if v.get("autoPlay"): qs.append("autoplay=1")
        if v.get("mute"):     qs.append("mute=1")
        if v.get("start") is not None: qs.append(f"start={int(v['start'])}")
        if v.get("end")   is not None: qs.append(f"end={int(v['end'])}")
        return base + (("?" + "&".join(qs)) if qs else "")
    if src == "DRIVE":
        return f"https://drive.google.com/file/d/{vid}/preview"
    return v.get("url") or ""


def print_videos(result):
    vids = result.get("videos", [])
    if not vids:
        print("No video embeds found in deck.")
        return
    print(f"Found {len(vids)} video embed(s) in '{result.get('title','')}':\n")
    print("Paste-ready (matches existing index.html pattern):\n")
    for v in vids:
        embed = video_to_embed(v)
        pos = v.get("pos", {})
        print(f"  // slide {v['slide']} — {v['source']} {v['videoId']}")
        print(f"  //   pos: L={pos.get('l')}% T={pos.get('t')}% W={pos.get('w')}% H={pos.get('h')}%")
        print(f"  img: 'iframe:{embed}',")
        print()
    VIDEOS_JSON.write_text(json.dumps(vids, indent=2))
    print(f"Also wrote {VIDEOS_JSON.relative_to(REPO)} (machine-readable).")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--all",   action="store_true", help="dump full deck → slides.json")
    ap.add_argument("--slide", type=int, default=None, help="restrict to one slide (0-based)")
    args = ap.parse_args()

    url, pid = load_config()
    params = {"presentationId": pid}
    if args.slide is not None: params["slide"] = args.slide

    if args.all:
        params["action"] = "scrape"
        result = call_gas(url, params)
        SLIDES_JSON.write_text(json.dumps(result, indent=2))
        n = len(result.get("slides", []))
        print(f"Wrote full deck dump → {SLIDES_JSON.relative_to(REPO)} ({n} slide(s)).")
    else:
        params["action"] = "videos"
        result = call_gas(url, params)
        print_videos(result)


if __name__ == "__main__":
    main()
