# THE OTHER SIDE — Shot 5.7 test clip (Kling) review (18 Nov)

Status: **checked, awaiting your review; not approved.** Lip-sync not run yet. No edit rendered.

| | |
| --- | --- |
| File | Drive **Edit** `2026-11-18 22:44:18.MP4` (id `1cu1l8Uz_YH64F5nCdRcThZpo6TJ4RjXZ`, 18 Nov 17:15, 14,380,442 bytes); not named `5.7_v1.mp4`; the only new video in Edit, so identified as the 5.7 clip |
| Read-only copy | `input/tos_clips/2026-11-18_22-44-18.mp4` (sha256 `5566a73ca43db350…`) |
| Start image | the approved keyframe `5.7_key_v5.png` (frame 0 matches it: face-match 0.95) |
| Format | H.264 1920×1080, **24 fps**, **10.04 s** (241 frames); planned 5 s. AAC stereo audio track present (Kling's own sound, −10.5 LUFS), planned off: it will be muted; the film uses real sound and the Line 18 voice |
| Frame strip | `work/tos/check57/strip.jpg` (every 0.5 s) |

## Measurements (4 frames per second; support only)

| Time in clip | What happens | Identity vs keyframe | Head yaw | Mouth (lip opening / face height) |
| --- | --- | --- | --- | --- |
| 0.0–2.3 s | still, glaring at the mirror, lips nearly closed | 0.93–0.96 | −32° to −33° | 0.10–0.11 |
| 2.5–3.0 s | jaw clenches, teeth bared | 0.74–0.90 | −32° to −39° | 0.13–0.16 |
| 3.25–4.5 s | **the shout**: mouth widest at 4.0–4.25 s | 0.65–0.84 (wide-open mouth lowers the score) | −34° to −38° | 0.15–0.20 |
| 4.75–10.0 s | settles, breathing, eyes still on the mirror | 0.92–0.95 | −34° to −37° | 0.10–0.12 |

## Findings

| Check | Result |
| --- | --- |
| Identity | ✅ Same man on every frame by eye; 0.93–0.96 against the keyframe whenever the mouth is closed (mean 0.90 over the clip); against A1/A2 it stays at the keyframe's own level (about 0.52 / 0.58). The dips to 0.65–0.84 are only during the wide shout |
| Head and eyeline | ✅ Stays three-quarter toward frame-LEFT (−32° to −39°), upright (roll within ±2°); eyes on the off-screen mirror throughout; after the flip he faces the Reflection |
| Performance | ✅ Builds from glare, to clenched teeth, to a hard shout, then breathing: fury with fear, not a scream or grimace |
| Lamp, lighting, costume | ✅ Lamp at frame-right with its chimney as in v5, amber key on the lamp side of the face, teal shadows; charcoal shirt, wet hair; no necklace; flicker natural |
| Camera | ✅ Gentle handheld feel, no zoom, cut or warp |
| Length | ⚠️ 10 s instead of 5 s (more credits than planned; more material to choose from) |
| Audio | ⚠️ Kling sound present: muted in the edit |

## Usable window for the 3 s slot (3:02.0–3:05.0)

About **2.4–5.4 s** of the clip: clench → shout → first breaths. The Line 18 audio (ElevenLabs, 1.29 s of speech) starts at
3:02.20 in the film. The final timing is set after lip-sync, which re-drives the mouth to the actual words.

## Next step (needs your OK for credits)

Kling **Lip Sync** on this clip with the Line 18 ElevenLabs audio: trim 0.00–1.58 s of
`ElevenLabs_2026-11-15T15_54_09_Abhilash S - Fun, Encouraging Friend_pvc_s50_sim99_v4.mp3`. If you prefer to keep lip-sync
short, the clip can first be trimmed to the 2.4–5.4 s window. Then I check the seven mouth checkpoints (package section 4).
