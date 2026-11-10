# Reel-edit

Video editing workspace. Claude edits the user's videos here with FFmpeg, Whisper,
yt-dlp, HyperFrames and Remotion.

## Skills

Vendored in `.claude/skills/` (load automatically):

- HyperFrames (from `heygen-com/hyperframes@ad6f785`, `skills/`): `hyperframes`, `hyperframes-cli`,
  `hyperframes-registry`, `media-use`, `figma`, `reverse-any-video`, `remotion-to-hyperframes`,
  `slideshow`, `style-sampling`
- Remotion (from `remotion-dev/skills@1af7e69`, `skills/`): `remotion-*`
- `clawd-animation` (from `JohnHeibel/ClaudeAnimationBase@0ac8bf2`, wrapped as a skill with the
  starter kit in `kit/`; local patches listed in its SKILL.md). Projects go in `animations/<name>/`.
- earshot (from `Leonxlnx/earshot@4ac3d2a`, `skills/`): `earshot` (listen to / judge / time-align audio,
  252-sound SFX bank, `kit` for a film's effects) and `real-sound` (full soundtrack from licensed recordings).
  Needs the `earshot` Python package and its two CPU models (below).
- `lemo-opuscar` (from `lemomo-ai/lemo-opuscar@9eb7739`, `plugin/skills/`): films in 66 code-made styles. On first
  use its `setup.sh` downloads the style library to `~/lemo-opuscar`; `setup.sh deps` installs its packages. Needs
  ffmpeg 7+: use `/opt/ffmpeg8/bin` (below) via `PATH=/opt/ffmpeg8/bin:$PATH` for library commands only.
- `onetake` (from `feitangyuan/onetake@abb6d17`, root skill, case films left out): one-continuous-take product /
  launch motion films. **PolyForm Noncommercial licence: not for client or business work** (that needs onetake Pro).
  Films go in `films/<name>/`. Needs python `playwright==1.63.0` (matches the preinstalled Chromium),
  `opencv-python-headless`, `brotli`.
- `teal-orange-cinematic-grade` and `beat-sync-cinematic-edit` (Look 01 by @shakirc.ai, from a zip the user
  shared on Drive): the LUT grade (`luts/*.cube`) is **for Sony S-Log3 / S-Gamut3.Cine only**: on phone (Rec.709)
  footage it blows skin out to red, so don't use it there. The beat-sync edit needs `rembg[cpu]` (its
  `isnet-general-use` model, 179 MB, downloads to `~/.rembg` on first use).

To update, re-copy the `skills/` folder of each upstream repo over `.claude/skills/`.

## Toolchain (cloud environment "Reel-edit")

| Tool | How it's installed | Notes |
|---|---|---|
| FFmpeg 6.1 | preinstalled | built with libass, x264, x265, vpx, opus, rubberband, vidstab |
| Node 22 / npm / bun | preinstalled | |
| Python 3.13 | preinstalled | pip needs `--break-system-packages` |
| yt-dlp | pip | |
| gdown | pip | Google Drive downloads: `gdown --fuzzy "<share link>" -O input/` (file must be "Anyone with the link") |
| faster-whisper | pip | preferred for transcripts (int8 on CPU); needs `av<16` |
| openai-whisper | pip (CPU torch) | `whisper file --model base.en --fp16 False` |
| hyperframes CLI | `npm i -g hyperframes` | telemetry disabled |
| remotion CLI | `npm i -g remotion` + per-project deps | |
| ffmpeg 8.1 (static) | BtbN build in `/opt/ffmpeg8` (checksum-verified) | only for Lemo-Opuscar; system `ffmpeg` stays 6.1 |
| earshot 0.4.1 | pip from git + `earshot doctor --fetch` (~1.1 GB models in `~/.cache/earshot`) | each CLI call loads models (~20 s); batch via `from earshot import api` |

The cloud container is fresh each session. If `yt-dlp`, `whisper` or `hyperframes` is missing, run:

```bash
pip3 install --break-system-packages -q torch --index-url https://download.pytorch.org/whl/cpu
pip3 install --break-system-packages -q yt-dlp gdown faster-whisper 'av<16' openai-whisper
pip3 install --break-system-packages -q playwright==1.63.0 opencv-python-headless brotli fonttools matplotlib 'rembg[cpu]'
npm install -g --silent hyperframes@latest remotion@latest
hyperframes telemetry disable; hyperframes browser ensure
pip3 install --break-system-packages -q "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@4ac3d2a"
earshot doctor --fetch
# Lemo-Opuscar: ffmpeg 7+ in its own folder, then the library and its core packages
N=ffmpeg-n8.1-latest-linux64-gpl-8.1; curl -sSfLO https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/$N.tar.xz
mkdir -p /opt/ffmpeg8 && tar -xJf $N.tar.xz -C /opt/ffmpeg8 --strip-components=1 && rm $N.tar.xz
PATH=/opt/ffmpeg8/bin:$PATH sh .claude/skills/lemo-opuscar/scripts/setup.sh deps
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
