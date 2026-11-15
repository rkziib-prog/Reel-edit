# KSRTC at plane speed — status (Pathira Chinthakal reel #1)

Updated: 2026-11-15 (v1 delivered)

Done
- Script approved (15 lines, `lines.tsv`: Malayalam narration + English subtitles).
- Style chosen: 2D hand-painted cartoon (clawd-animation kit, `animations/ksrtc-flight/`), made fully in code.
- Voice chosen: free Meta MMS Malayalam TTS (`tts_sample.py`, model facebook/mms-tts-mal).
- Reel frame + subtitles (`overlays.py`, fonts in `fonts/`), compositor (`compose.sh`).
- Test shot (lines 6-7, bus launch) rendered: `output/ksrtc_test_liftoff.mp4`; sent to the user.

- Full reel v1: `output/ksrtc_plane_speed_v1.mp4` (63.9 s, 1080x1920, 30 fps, -14.3 LUFS); sent to the user.
  Rebuild: render frames (`--frames --fps=12 --workers=2`, `--encode --fps=12 --out=out/ksrtc_anim.mp4`),
  `python3 sound.py`, mix (see CLAUDE.md), `compose.sh <anim> work/ksrtc/mix.wav "$(cat work/ksrtc/subs.txt)" <out>`.

Remaining
- User feedback on v1. No music yet (can be added in Instagram).

- v2: `output/ksrtc_plane_speed_v2.mp4` (60.0 s, -14.0 LUFS), voice = user's ElevenLabs "Akhil" recording
  (`input/ksrtc/voice_akhil_el.mp3`, kept with its own pacing; timing from `timeline_el.py`); sent to the user.

Next step: wait for the user's notes on v2.
