# Reel-edit

Video editing workspace. Claude edits the user's videos here with FFmpeg, Whisper,
yt-dlp, HyperFrames and Remotion.

## About the user

A tattoo artist making Instagram reels of their work (first edit: a Shiva backpiece, process to reveal; see
`edits/tattoo-backpiece/`). Typical footage: iPhone 4K/60 vertical clips of the session plus photos of the
healed or finished piece. Clips go in the Drive **Edit** folder and music in **Audio** (see Google Drive below).

**Standing rule for every tattoo reel: trim dead starts (and dead ends) before editing.** The cameraman often
starts recording before the work begins (no hands in frame, hand not on skin, wiping/setting up, camera still
being aimed or settled). Run `python3 tools/clip_starts.py <folder> --seconds 8`: it flags camera shake/settling
and writes a timestamped strip per clip to `work/starts/`. Then look at every strip and set each clip's in point
at the first moment the needle is on skin (or the shot is properly framed for reveal clips). Do the same for the
last seconds (camera lowered, reaching to stop). Audio can't detect this: room noise and talking mask the machine.

## THE OTHER SIDE (മറുവശം) — film project

Malayalam psychological thriller short, 4:28 (268 s), 16:9 1920x1080, 24 fps, AI-generated footage.
- Screenplay: Drive PDF `THE OTHER SIDE (മറുവശം).pdf` (id `1JHUjXhfC13J8ZdAWRiWH8fqDIHSW1Dnl`). Its text layer breaks
  Malayalam conjuncts; use the restored lines in the plan doc, not the raw PDF text.
- Production plan (Claude Docs, the working source of truth): https://claude.ai/artifact/LLEWBct3zUjBXM8c5dNtiv
- Character references (verified 10 Nov; copies in `input/tos_refs/`, originals in Drive Edit): REF_01 front = IMG_8749,
  REF_02 three-quarter (head to frame-left) = IMG_8708, REF_03 three-quarter (frame-right) = IMG_8722, REF_04 profile =
  IMG_8729, REF_05 full body = IMG_8759, extra back view = IMG_8772; added 11 Nov: REF_04b right profile = IMG_8780, REF_07 fear = IMG_8799, REF_08 smile
  = IMG_8813 (cold smile; IMG_8832 warm grin kept but unused), REF_06 watch = IMG_8843: the user's own black digital watch
  is the LOCKED prop (user decision 11 Nov; do not suggest a steel watch). Its lettering mirrors on flipped imposter shots.
  Identity board (real photos, no AI): V1 `output/tos_identity_board.jpg`, V2 (current) `output/tos_identity_board_v2.jpg` (`--v2`), from `edits/the-other-side/identity_board.py`. Visible look: shoulder-length wavy black hair swept
  back, short trimmed beard and moustache. He wears a thin chain in the photos: prompts must say no necklace.
- Progress: `PROJECT_STATUS.md` (update at the end of every task: done, remaining, next step).
- Locked decisions: English subtitles only (Malayalam is spoken, never on screen); smash exactly at 3:33.00
  (frame 5112); realistic sound design, a subtle drone only in Scenes 4-5; watch on the RIGHT wrist and right
  hand dominant in every generated frame, imposter shots flipped in the edit only.

### Working rules (from the user)

1. Never reinstall tools that are already installed; check with `command -v` / import first.
2. Never rescan the whole project; inspect only the files the task needs.
3. Prefer FFmpeg batch scripts for repetitive video operations.
4. Short answers: no unnecessary explanations or repeated confirmations.
5. Before every major operation, say which files will be created or modified.
6. Never overwrite original footage: sources stay read-only in `input/`; every output gets a new name.
7. Keep workflows iPad-friendly: results via Drive / SendUserFile, review in Claude Docs or hosted pages.
8. Keep this file current with every important project instruction.
9. No generating footage, building the dashboard or rendering until the user approves each step.

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
| insightface 2.1 + onnxruntime | pip; models `buffalo_l` (auto) and `inswapper_128.onnx` from insightface's GitHub release, in `~/.insightface/models` | face swap: see `edits/couple-cinema/faceswap_reel.py` (match faces by identity, not gender) |
| earshot 0.4.1 | pip from git + `earshot doctor --fetch` (~1.1 GB models in `~/.cache/earshot`) | each CLI call loads models (~20 s); batch via `from earshot import api` |

The cloud container is fresh each session. If `yt-dlp`, `whisper` or `hyperframes` is missing, run:

```bash
pip3 install --break-system-packages -q torch --index-url https://download.pytorch.org/whl/cpu
pip3 install --break-system-packages -q yt-dlp gdown faster-whisper 'av<16' openai-whisper
pip3 install --break-system-packages -q playwright==1.63.0 opencv-python-headless brotli fonttools matplotlib 'rembg[cpu]' insightface onnxruntime
mkdir -p ~/.insightface/models && curl -sSLo ~/.insightface/models/inswapper_128.onnx https://github.com/deepinsight/insightface/releases/download/model-zoo/inswapper_128.onnx
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

## Google Drive (connected)

The user's Drive (`btattoo09@gmail.com`) is connected through the Google Drive connector (`mcp__Google_Drive__*`):
use it to find and list files. Its download/upload tools pass content through the chat, so don't use them for
videos: download with `curl -L "https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t"`
(the `doc-*-docs.googleusercontent.com` hosts gdown uses are blocked). That needs link sharing, which the user
turned on for these folders (view-only, by link):

- **Edit** (clips to edit): `15wLpsUzKk8bN_Cdat31XAfWClJ6ul3YN`
- **Audio** (music for reels): `1dq-9BE4ufQt1bxQ1AstxteERaRH9RiXU`
- **Result** (`1t2vaQ-tsyGi8Uv3z-y-tJ0hSYCZuumLU`) is private; finished reels are too big to upload through the
  connector, so send them with SendUserFile instead.

## Working conventions

- Put source footage in `input/`, renders in `output/`, scratch in `work/` (all git-ignored).
- Default reel spec: 1080x1920, 30 fps, H.264 CRF ~20, AAC 160k, `-movflags +faststart`,
  loudness `loudnorm=I=-14:TP=-1:LRA=11`.
- Check every render with `ffprobe` (duration, size) and look at a few extracted frames before
  calling it done.
