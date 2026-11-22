# Pathira Puzzle #2 "Ammooma's lock code" — status

Updated: 2026-11-22

Done
- Original lock puzzle, answer 719 (unique; brute-force checked). Script 12 lines (`lines.tsv`).
- Voice = user's recording `input/puzzle2/voice.mp3`, 24 phrases matched; 5 s think gap after line 10 (`timeline.py`).
- First FULL-SCREEN 1080x1920 reel: `animations/puzzle2/` (core.js reads `PROJECT.w/h`; studio canvas + render window
  1080x1920). One continuous scene in `src/scenes/puzzle.js` (timer reaches 0 as the comment CTA starts).
- Full-screen subtitles `subs_full.py` (y≈1490, above Instagram UI) + `compose_full.sh`. Sound `sound.py` (ticks, alarm).
- v1: `output/puzzle2_v1.mp4` (54.5 s, 1080x1920, -14.0 LUFS); sent to the user.

Remaining
- User feedback. Next puzzle reel opens with "Answer #2: 719" + why.
