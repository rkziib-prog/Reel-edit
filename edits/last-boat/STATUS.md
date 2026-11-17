# The Last Boat (reel #3, mystery thriller) — status

Updated: 2026-11-17

Done
- Script (15 lines, `lines.tsv`); voice = user's ElevenLabs recording `input/boat/voice.mp3`, split per line (35 phrases
  matched) and re-spaced with gaps (`timeline.py`).
- Animation `animations/last-boat/` (shots in `src/scenes/boat.js`); sound `sound.py`.
- v1: `output/last_boat_v1.mp4` (72.5 s, -14.6 LUFS); sent to the user.
  Build: `OV=work/lastboat/overlays edits/ksrtc-flight/compose.sh animations/last-boat/out/boat_anim.mp4 work/lastboat/mix.wav "$(cat work/lastboat/subs.txt)" <out>`

Remaining
- User feedback. Handle on the frame (`@pathira.chindhakal`) still unconfirmed.
