# THE OTHER SIDE (മറുവശം) — Test shot 5.7 production package

First video-generation test (Test A, dialogue). Preparation only: nothing is generated, no credits spent, no
subscription bought. Script, dialogue and character identity are unchanged. Sources: production plan (shot 5.7,
prompt blocks, Scene 5 light), Dialogue Shot Map (Line 18 row), frozen character panels, continuity rules.

## Status

| Stage | State |
| --- | --- |
| Keyframe `5.7_key_v1.png` | **APPROVED by the user (11 Nov), visual approval.** Approved image location: _pending, the user will provide it_ |
| My keyframe checklist (section 6) | To run as a record once the file location is provided; the approval stands as given |
| Line 18 recording `L18_aadhi.m4a` | Not yet received |
| Kling clip `5.7_v1.mp4` | NOT generated; waits for the user's explicit OK to spend credits. Prompts in section 3, ready |
| Lip-sync `5.7_v1_lipsync.mp4` | Not started; needs the clip and the Line 18 take. Requirements in section 4, ready |
| Identity references | Unchanged: the six frozen files in section 1 stay the references for every later stage |

## The shot

| | |
| --- | --- |
| Shot | 5.7, Scene 5 (The confrontation), central hall at the antique mirror, mirror side, night |
| Slot | 3:02.0–3:05.0, 3.0 s (frames 4368–4439 at 24 fps) |
| Framing | Medium close-up, Aadhi, handheld (handheld from 2:49 on) |
| Who | Aadhi, the man we follow (secretly the imposter) |
| Flip | YES, mirrored in the edit. So he is generated looking frame-LEFT with the lamp on frame-RIGHT; on screen he looks right, lamp on the left |
| Dialogue | Line 18 (locked 10 Nov), 3:02.2–3:04.4, Aadhi, visible lip-sync: YES |
| Before / after | 5.6 Reflection close-up (Lines 16, 17a–17b, ends 3:01.8) · 5.8 Reflection close-up (Line 19 from 3:05.2) |
| Sound | Line 18 only, over rain and the wrong-rhythm clock; drone under (Scenes 4–5) |

## 1. Identity references to attach (exact files)

All approved and frozen; attach as they are, never edited. Check strip: `output/tos_5.7_reference_set.jpg`.

| # | Reference | File in Drive Edit | Local frozen copy (sha256, first 12) | Role |
| --- | --- | --- | --- | --- |
| 1 | Identity Board V2 | `tos_identity_board_v2.jpg` (also in `output/`) | `output/tos_identity_board_v2.jpg` (cc8743ffa2a8) | Real photos: face, hair, beard |
| 2 | A1 front | `A49AE7DA-8122-41F1-8A52-67D603C8C121.PNG` | `input/tos_panels/A49AE7DA.png` (761e552f0068) | Identity anchor |
| 3 | A2 three-quarter, head to frame-left | `98B62E03-E52E-4E25-850B-A87415D83639.PNG` | `input/tos_panels/98B62E03.png` (d199801bc614) | Head angle for this shot |
| 4 | B4 anger | `05C021BC-DD98-4487-A270-2481B3B126C5.PNG` | `input/tos_panels/05C021BC.png` (9765c1a94f8b) | Expression base |
| 5 | C5 shirt detail | `C735A6EB-B7C6-4606-AFBB-6D0EF63952EA.PNG` | `input/tos_panels/C735A6EB.png` (97627282feaf) | Costume: pocket on LEFT chest, top button open |
| 6 | C7_v2 lamp night | `C85B0EF3-8449-49D6-AC01-B1553D116781.png` | `input/tos_panels/C7_1eLJfMK6.png` (20511660ade9) | Light and colour; also night-look identity |

Only if his hands come into frame in your take: add C4 `5B48BC7A-5074-436F-B13E-7E3B78C14E3A.PNG` (watch on the
RIGHT wrist). The planned MCU keeps the wrists out of frame.

## 2. Keyframe prompt (ChatGPT Image Generation, iPad)

New chat · attach the 6 files above · paste the block below · save the result to Drive Edit as `5.7_key_v1.png`.

Change from the earlier Test A draft: the keyframe is the instant **before** the shout (lips just parted, breath
drawn), not mid-word. Kling's lip-sync then drives the whole line from a neutral mouth; a still frozen mid-shout
fights it and tends to warp teeth. The plan's shot (MCU, frame-left eyeline, lamp frame-right, furious and
frightened) is unchanged.

```text
Use the attached Identity Board V2 and panels A1, A2, B4, C5 and C7_v2 as the only reference for this man. Keep exactly the same face, facial structure, skin tone, hairline, shoulder-length wavy black hair swept back, and short trimmed beard and moustache; natural skin texture with pores, no beautification, no slimming, no de-ageing.

Film still, 16:9, medium close-up from mid-chest to just above the head. He stands in the dark central hall of an old Kerala tharavad at night, head and shoulders turned three-quarter toward frame-LEFT as in panel A2, eyes locked on a tall antique mirror just off-screen at frame-left. It is the split second before he shouts: breath drawn in, lips just parted, jaw tight, brows down and drawn together, nostrils slightly flared, eyes wide with fury and fear at once (the anger of panel B4, stronger, with fear under it). Not a grimace, not horror.

Wardrobe exactly as in panel C5: charcoal-grey cotton shirt, one chest pocket on his LEFT chest, top button open, no logo. No necklace, no chain, no jewellery. Hair slightly damp from the monsoon humidity, a few strands loose.

Light exactly in the mood of panel C7_v2: a single oil lamp at frame-RIGHT is the only key light, warm amber on the right side of his face as we see it, the other side falling into deep teal shadow; laterite wall and a teak pillar soft and dark behind him; monsoon night. Photorealistic, cinematic, 35 mm film look, shallow depth of field, eye-level camera.

Avoid: text, letters, numerals, logos, captions, watermark, necklace, chain, watch on the left wrist, a different face, beautified or smoothed skin, extra fingers, distorted hands, cartoon, 3D render, illustration, a second person, a figure behind him, horror makeup, open screaming mouth.
```

## 3. Image-to-video prompt (Kling, only after the keyframe is approved and you OK the credits)

Image to Video · upload the approved `5.7_key_v1.png` · newest model your app offers · Professional / high quality ·
1080p · **5 s** (3 s slot + handles) · aspect from the image (16:9) · native audio **off** · no end frame ·
the credit cost shows on the Generate button: stop there unless you have approved it. Save as `5.7_v1.mp4`.

```text
Handheld camera with a slight breathing sway, medium close-up, eye level. He shouts one short, hard line at the mirror off-screen to the left, then stops, chest heaving, breathing hard through his mouth, eyes still locked on the mirror. The oil-lamp flame flickers softly on his face. His face, hair, beard and shirt stay exactly the same throughout.
```

Negative prompt:

```text
face change, morphing, identity drift, distorted mouth, extra teeth, smiling, laughing, extra people, text, logo, camera cut, zoom, whip pan, slow motion, motion blur on the face
```

## 4. Malayalam lip-sync: Line 18

| | |
| --- | --- |
| Line | 18, Aadhi, **എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!** (locked 10 Nov; exact, never altered) |
| Pronounced | Ente veettīnn̆ irangippōḍā! |
| Subtitle | Get out of my house! |
| Plan timing | 3:02.2–3:04.4 (2.2 s) inside the 3:02.0–3:05.0 slot; your recorded take sets the final timing |
| Delivery | Shouted at the mirror, furious and frightened; loud, not a scream |

**Record first** (Voice Memos on iPhone or iPad): quiet room with soft furnishings, phone 20–30 cm from the mouth and
a little to the side, fans off; three takes with 2 s of silence before each, then 10 s of room silence. Upload to
Drive Edit as `L18_aadhi.m4a`. I measure each take; the shot is fitted to the one you choose.

**Mouth shapes the sync must show** (the checkpoints I judge, in order):

1. **എ (E-)**: mouth opens mid-wide on the first syllable, no lag after the sound starts.
2. **ന്റെ (-nte)**: brief tongue-tip contact, jaw half closed.
3. **വീ (vee-)**: upper teeth touch the lower lip (labiodental v), then lips spread on the long ī.
4. **ട്ടീന്ന് (-ttīnn̆)**: spread lips, quick jaw beats on the doubled tt and nn.
5. **ഇറങ്ങി (iraṅṅi-)**: spread, jaw mostly closed.
6. **പ്പോ (-ppō-)**: **full lip closure** on the doubled pp (the clearest test: lips must meet and hold briefly), then
   rounded lips on ō.
7. **ടാ! (-ḍā!)**: widest open mouth of the line on the final ā, held as the shout peaks.

**Lip-sync workflow:** after `5.7_v1.mp4` is approved, run Kling Lip Sync on it with the chosen take (trim the take to
the line plus 0.2 s of lead-in, or select that range in the app). Save as `5.7_v1_lipsync.mp4`. Sync runs on the
unflipped clip; the flip in the edit changes neither timing nor sound. Acceptance: mouth within ±2 frames of the audio
on checkpoints 1, 6 and 7; no teeth or lip artefacts; the face outside the mouth stays identical.

## 5. Camera, expression and light

- **Camera:** medium close-up, eye level, mid-chest to just above the head; handheld with a slight breathing sway,
  never a whip or zoom; the face stays sharp through the line (no motion blur on the mouth). Face at least a third
  of frame height. Generated eyeline to frame-left; after the flip he faces screen-right toward the mirror,
  matching the Reflection's frame-left eyeline in 5.6 and 5.8.
- **Expression:** fury with fear underneath (B4, stronger): brows down and together, jaw tight, flared nostrils,
  eyes wide and locked on the mirror, unblinking through the line. After the line: chest heaving, mouth open,
  breathing. Never a grimace, a scream or horror makeup. The face itself never changes; only the muscles act.
- **Light:** one oil lamp at frame-RIGHT (screen-left after the flip) is the only key: warm amber on the lit side,
  deep teal shadow on the other, soft flicker; dark laterite wall and teak pillar behind; the lamp must reach the
  mouth. Grade later to the lamp-night look matched to C7_v2.
- **Continuity:** damp hair; charcoal shirt, pocket on the LEFT chest before the flip (the right on screen after it,
  intended); no necklace; if a wrist shows, his own black digital watch on the RIGHT wrist before the flip.

## 6. Quality-control checklist

Keyframe `5.7_key_v1.png` (before any Kling credits):

- [ ] Face matches A1 and the Identity Board: eyes, brows, nose, lips, jawline, beard and moustache density, hairline, skin tone, age
- [ ] Hair: shoulder-length, wavy, black, swept back, slightly damp; same volume as A2
- [ ] Head angle three-quarter to frame-LEFT as in A2; eyes off-screen left
- [ ] Expression: fury with fear underneath, lips just parted, not mid-word; no grimace
- [ ] Costume as C5: charcoal shirt, one pocket on his LEFT chest, top button open, no logo
- [ ] No necklace, chain or jewellery; no text, logos or numerals anywhere
- [ ] Light: single lamp key from frame-RIGHT, amber against teal, matching C7_v2; mouth lit
- [ ] Framing: MCU, 16:9, face at least a third of frame height, mouth fully visible
- [ ] Photoreal skin, no smoothing; hands absent or correct (5 fingers, watch on the RIGHT wrist)

Clip `5.7_v1.mp4` (after your OK and the generation):

- [ ] 5 s, 1080p, 16:9; usable 3 s window with the line's action inside it
- [ ] Identity holds on every frame (I check a frame strip by eye; face-match scores are support only)
- [ ] Handheld sway gentle; no zoom, cut or warp; no motion blur on the mouth
- [ ] Shout performance reads as planned; eyes stay on the mirror; breathing after the line
- [ ] Lamp flicker natural; background stays still and dark; nothing appears behind him

Lip-sync `5.7_v1_lipsync.mp4`:

- [ ] All 7 mouth checkpoints above; ±2 frames on 1, 6 and 7
- [ ] Full lip closure on പ്പോ; widest mouth on the final ടാ
- [ ] No tooth, tongue or lip artefacts; face outside the mouth unchanged

Edit test (after approval, by me):

- [ ] Flipped; on screen he faces right, lamp on the left; pocket and any watch now on the left (intended)
- [ ] Cut into the slot 3:02.0–3:05.0 between 5.6 and 5.8; Line 18 where your take puts it
- [ ] Lamp-night grade; rain, wrong-rhythm clock and drone under; subtitle "Get out of my house!" for the line
- [ ] Sent to you for approval before any other shot is generated

## Approval gates

1. You record Line 18 → `L18_aadhi.m4a`.
2. You make the keyframe → `5.7_key_v1.png`; I run the keyframe checklist and report.
3. On your explicit OK (credits), you run Kling → `5.7_v1.mp4`; I check it.
4. You run Lip Sync → `5.7_v1_lipsync.mp4`; I check it and send the edit test.
5. Tests 7.4 and 3.1 follow the same way; full production only after all three are approved.
