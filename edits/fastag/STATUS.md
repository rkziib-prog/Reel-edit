# How FASTag works (reel #6, explainer) — status

Updated: 2026-11-20

Done
- Format from a user-shared reference (explainer: hook, mechanism step by step with labelled cards, "remember" list,
  follow CTA). Script 15 lines (`lines.tsv`); user to check the current no-FASTag penalty (line 13) before posting.
- Voice = user's ElevenLabs recording `input/fastag/voice.mp3`, 34 phrases matched, short gaps (`timeline.py`).
- Animation `animations/fastag/` (`src/scenes/fastag.js`: bright toll plaza, `card()` infographic labels, BASE colours).
- Sound `sound.py` (synth music bed 100 bpm + UI pops/beeps/whooshes).
- v1: `output/fastag_v1.mp4` (77.7 s, -13.8 LUFS); sent to the user.

Remaining
- User feedback. Handle on the frame (`@pathira.chindhakal`) still unconfirmed.
