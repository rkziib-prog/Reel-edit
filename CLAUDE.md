# Reel-edit

Video editing workspace. Claude edits the user's videos here with FFmpeg, Whisper,
yt-dlp, HyperFrames and Remotion.

## Skills

Vendored in `.claude/skills/` (load automatically):

- HyperFrames (from `heygen-com/hyperframes@a73572c`, `skills/`): `hyperframes`, `hyperframes-cli`,
  `hyperframes-registry`, `media-use`, `figma`, `reverse-any-video`, `remotion-to-hyperframes`,
  `slideshow`, `style-sampling`
- Remotion (from `remotion-dev/skills@1af7e69`, `skills/`): `remotion-*`
- `clawd-animation` (from `JohnHeibel/ClaudeAnimationBase@0ac8bf2`, wrapped as a skill with the
  starter kit in `kit/`; local patches listed in its SKILL.md). Projects go in `animations/<name>/`.

To update, re-copy the `skills/` folder of each upstream repo over `.claude/skills/`.

## Toolchain (cloud environment "Reel-edit")

| Tool | How it's installed | Notes |
|---|---|---|
| FFmpeg 6.1 | preinstalled | built with libass, x264, x265, vpx, opus, rubberband, vidstab |
| Node 22 / npm / bun | preinstalled | |
| Python 3.13 | preinstalled | pip needs `--break-system-packages` |
| yt-dlp | pip | |
| faster-whisper | pip | preferred for transcripts (int8 on CPU); needs `av<16` |
| openai-whisper | pip (CPU torch) | `whisper file --model base.en --fp16 False` |
| hyperframes CLI | `npm i -g hyperframes` | telemetry disabled |
| remotion CLI | `npm i -g remotion` + per-project deps | |

The cloud container is fresh each session. If `yt-dlp`, `whisper` or `hyperframes` is missing, run:

```bash
pip3 install --break-system-packages -q torch --index-url https://download.pytorch.org/whl/cpu
pip3 install --break-system-packages -q yt-dlp faster-whisper 'av<16' openai-whisper
npm install -g --silent hyperframes@latest remotion@latest
hyperframes telemetry disable; hyperframes browser ensure
```

## Gotchas in this sandbox

- No GPU: always CPU (`device='cpu', compute_type='int8'` for faster-whisper; `--fp16 False` for whisper).
- Node's built-in fetch ignores the HTTPS proxy. Prefix downloads done by Node CLIs with
  `NODE_USE_ENV_PROXY=1`, e.g. `NODE_USE_ENV_PROXY=1 hyperframes transcribe ...`,
  `NODE_USE_ENV_PROXY=1 npx remotion browser ensure`.
- Network is an allowlist. YouTube page/metadata hosts are allowed, but video streams come from
  `*.googlevideo.com`, which needs a wildcard or unrestricted network (set in claude.ai environment
  Settings). If a host is refused, it's the allowlist, not the tool.
- If Remotion can't download its browser, pass
  `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.

## Working conventions

- Put source footage in `input/`, renders in `output/`, scratch in `work/` (all git-ignored).
- Default reel spec: 1080x1920, 30 fps, H.264 CRF ~20, AAC 160k, `-movflags +faststart`,
  loudness `loudnorm=I=-14:TP=-1:LRA=11`.
- Check every render with `ffprobe` (duration, size) and look at a few extracted frames before
  calling it done.
