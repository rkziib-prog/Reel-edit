---
name: clawd-animation
description: Make short hand-painted 2D cartoon animations (p5.js + p5.brush) starring Clawd or any character you design - storyboard, build shot by shot, check contact sheets, render to MP4. Use when the person asks for a painted/hand-drawn/cartoon animation, a Clawd video, an animated character short, or an animated intro/outro/insert for a reel.
---

# Clawd animation (ClaudeAnimationBase)

Vendored from [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
(`0ac8bf2`, MIT). The kit lives in `kit/` next to this file. Local changes from upstream:
the Permanent Marker font is bundled in `kit/assets/fonts/` instead of loaded from Google Fonts
(headless Chrome here can't reach it), `render.mjs` waits for `load` + fonts instead of
`networkidle0` (page setup takes ~55 s in software WebGL and blocks Chrome's idle check, so the
upstream 30 s navigation timeout always fired), and the 6 MB animated `docs/emotions.webp` is
left out.

## Start a project

Never edit `kit/` in place. Copy it into a project folder (one per video), then work there:

```bash
NAME=butterfly   # short slug for this video
mkdir -p animations && cp -r .claude/skills/clawd-animation/kit animations/$NAME
cd animations/$NAME && npm install --silent
```

Then **read `animations/$NAME/ANIMATION_GUIDE.md` in full before drawing anything** and follow it:
it holds the rules (handmade, alive, one piece, no text, transitions), the storyboard-first
workflow, and the complete engine/character API. Look at `docs/emotions.jpg` and `docs/views.jpg`.
Write the video in `src/scenes/` (replace or copy `demo.js`, and update the `<script>` tag in
`studio.html` if you rename it); set length/tempo in `src/config.js`.

## Rendering in this sandbox (no GPU)

Always pass `--soft-gl` (software WebGL) and the Playwright Chromium:

```bash
CH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux64/chrome | sort -V | tail -1)
node render.mjs --soft-gl --chrome=$CH --sheet=1,4,8 --cols=3 --w=480 --out=out/check/a.jpg   # contact sheet
node render.mjs --soft-gl --chrome=$CH --strip=2.0:2.5 --out=out/check/strip.jpg              # every frame (motion)
node render.mjs --soft-gl --chrome=$CH --frames --workers=4                                   # parallel, resumable
node render.mjs --encode --out=out/video.mp4 [--audio=assets/song.mp3]                         # frames -> MP4
```

- Each Chrome page spends ~55 s on one-time setup (paper texture) before the first frame, so
  batch work: one contact sheet with many times beats many single-frame calls.
- Speed: flat/ink frames take ~0.2 s, but frames with big p5.brush watercolour `fill` shapes took
  ~45 s each on this CPU. Measure early with a contact sheet (the log prints ms/frame). For anything
  longer than a few seconds, keep large watercolour fills few and small (or swap them for flat
  washes) and render with `--frames --workers=4` so it's parallel and resumable.
- Open every contact sheet / strip with the Read tool and fix what you see before the full render.
- Output is 1920x1080 at 24 fps. For a 9:16 reel, either design the scene for a centre-safe crop
  and crop with FFmpeg afterwards (`crop=ih*9/16:ih,scale=1080:1920`), or composite it into a
  vertical edit.
- `out/` and `node_modules/` are git-ignored by the kit's own `.gitignore`; commit the project's
  `src/` so the animation can be re-rendered.
