# The 2 AM Call (reel #2, mystery thriller) — status

Updated: 2026-11-16

Done
- Script (15 lines, `lines.tsv`); voice = user's ElevenLabs recording `input/phonecall/voice.mp3`, split per line and
  re-spaced with tense gaps (`timeline.py`; the AI ignored the break tags).
- Animation `animations/phone-call/` (copy of the KSRTC kit project; shots in `src/scenes/phone.js`).
- Sound `sound.py` (synthesized drone, crickets, ticks, bell, breathing, knocks, chair, sting, birds).
- v1: `output/phone_call_v1.mp4` (66.5 s, -14.4 LUFS); sent to the user.
  Build: `OV=work/phonecall/overlays edits/ksrtc-flight/compose.sh animations/phone-call/out/phone_anim.mp4 work/phonecall/mix.wav "$(cat work/phonecall/subs.txt)" <out>`

Remaining
- User feedback. Handle on the frame is a guess (`@pathira.chindhakal`); confirm with the user.
