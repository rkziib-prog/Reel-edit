# From Ticket Checker to Captain Cool (reel #4, MS Dhoni biography tribute) — status

Updated: 2026-11-18

Done
- Script (15 lines, `lines.tsv`, facts as known; user to double-check the IPL title count before posting).
- Voice = user's ElevenLabs recording `input/dhoni/voice.mp3`, 43 phrases matched, re-spaced (`timeline.py`).
- Animation `animations/dhoni-bio/` (shots in `src/scenes/dhoni.js`; stylised long-haired keeper, plain kits, no logos;
  `hairStyle: 'long'` added to person()). Sound `sound.py` (synth music pad + SFX).
- v1: `output/dhoni_bio_v1.mp4` (94.75 s, -14.3 LUFS); sent to the user.
  Build: `OV=work/dhoni/overlays edits/ksrtc-flight/compose.sh animations/dhoni-bio/out/dhoni_anim.mp4 work/dhoni/mix.wav "$(cat work/dhoni/subs.txt)" <out>`

Remaining
- User feedback. Handle on the frame (`@pathira.chindhakal`) still unconfirmed.
