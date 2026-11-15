# THE OTHER SIDE — Shot 5.7 lip-sync test: readiness audit (15 Nov)

Audit only. Nothing generated, no credits spent, no approved asset, dialogue or identity reference changed. The test
is **NOT started and NOT completed**.

**Update 15 Nov:** keyframe resolved: **v5 `5.7_key_v5.png` approved** (see `SHOT_5.7_V5_REVIEW.md`); the eyeline and
open-mouth issues below are fixed in v5. Still needed to run: the Kling model and clip lengths in your app, and your
explicit OK to spend credits.

## 1. Files

| Item | File and exact location | Status |
| --- | --- | --- |
| Shot 5.7 keyframe (approved 11 Nov, visual) | **Candidate:** Drive Edit `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` (id `1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y`, uploaded 11 Nov 10:06). Read-only copy: `input/tos_keyframes/C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png`, sha256 `e9d3a28fd9f959e4…`, PNG 1672×941 (16:9) | **NEEDS YOUR CONFIRMATION.** It is the only image in Drive uploaded after the package was written, and its content is a 5.7-type frame. No file named `5.7_key_v1.png` exists |
| ElevenLabs Line 18 sample (provisional Aadhi voice) | Drive Audio `ElevenLabs_2026-11-15T15_54_09_Abhilash S - Fun, Encouraging Friend_pvc_s50_sim99_v4.mp3` (id `1mjhQ2UgRC_6eOTTQOr2SdczVhP7b7jYP`). Read-only copy: `input/tos_voice/ElevenLabs_2026-11-15T15_54_09_Abhilash_S_pvc_s50_sim99_v4.mp3`, sha256 `3d7143de9756b840…` | AVAILABLE. Wording verified from your screenshot (`[angry]` + Line 18). Unchanged |
| Your original Line 18 recording (emotion and timing reference) | Drive Audio `L18_Aadhi_Take01.mp3.m4a` (id `15MY1qZ-C7EM5Jp-BjRSqrPRMfoiAv4NV`). Read-only copy: `input/tos_voice/L18_Aadhi_Take01.mp3.m4a`, sha256 `4a52a2659cb0ac98…`. Same audio as Drive Audio `Poojaveli Thuruthan Kaval Road.m4a` (id `1pPdzG_Oz6JCrnzof0WCUdcggnJKY6pq9`) | AVAILABLE. Unchanged |
| Identity references to attach (package section 1) | Identity Board V2 `output/tos_identity_board_v2.jpg` (cc8743ffa2a8); A1 (761e552f0068), A2 (d199801bc614), B4 (9765c1a94f8b), C5 (97627282feaf), C7_v2 (20511660ade9), C4 (9f2c4a4d0843) in `input/tos_panels/` | AVAILABLE. All six panels still read-only and unchanged |
| Kling clip `5.7_v1.mp4` | — | NOT generated (waits for your OK) |
| Lip-synced clip `5.7_v1_lipsync.mp4` | — | NOT generated |
| Lip-sync audio trim `work/tos/L18_aadhi_lipsync_trim.wav` | — | Not made yet (made only when you start the step; the original is never touched) |

## 2. Dialogue duration and timing (Line 18)

| | Plan | ElevenLabs sample (lip-sync audio) | Your recording (reference) |
| --- | --- | --- | --- |
| Text | എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ! | same (verified, `[angry]` tag) | same line |
| Speech | 3:02.2–3:04.4 = 2.2 s | 0.09–1.38 s in the file = **1.29 s** | 0.47–2.21 s in the file = **1.74 s** |
| Phrase break | — | 0.65–0.66 s | 1.38–1.46 s and 1.72–1.77 s |
| Film placement | shot slot 3:02.0–3:05.0 (frames 4368–4439, 3.0 s) | speech 3:02.20–3:03.49; file starts at 3:02.11 | — |
| Fit | — | fits; ~1.5 s of breathing after the line fills the shot | 0.45 s slower than the sample |

Line 19 (Reflection) starts at 3:05.2, after the slot. Lip-sync trim when started: 0.00–1.58 s of the sample.

## 3. Prompt readiness (package `SHOT_5.7_TEST_PACKAGE.md`)

| Item | Status |
| --- | --- |
| Keyframe prompt (section 2) | Ready; already used for the approved keyframe |
| Kling image-to-video prompt and negative prompt (section 3) | **Ready**: handheld MCU, one shouted line at the mirror, breathing after, face unchanged |
| Kling settings (section 3) | Ready: Image to Video, 1080p, 5 s, audio off, no end frame, credit cost checked before Generate. **Model: "newest offered" still unconfirmed:** you have not yet told me which Kling model and lengths your app shows |
| Lip-sync steps and 7 mouth checkpoints (section 4) | Ready; acceptance ±2 frames on the first syllable, the പ്പ closure and the final ടാ |
| QC checklist (section 6) | Ready |

## 4. Continuity check of the candidate keyframe (my look + measurements; your approval stands)

| Aspect | Finding |
| --- | --- |
| Identity | Same man by eye: brows, eyes, nose, beard and moustache, hairline. Face-match (support only): 0.63 vs A1, 0.55 vs A2, **0.70 vs B4 (anger)**, 0.66 vs C7_v2. Lower than the approved panels (0.73–0.96 against your photos), as expected with a wide-open shouting mouth, strong brow furrow and wet hair; please give the face one more look at full size |
| Hair, beard | Shoulder-length, wavy, black, very wet and loose over the forehead (damp is planned from Scene 2; this is wetter than C7_v2); beard and moustache match |
| Wardrobe | Charcoal shirt, collar open, top button open ✓; no necklace or chain visible ✓; the chest pocket is out of frame or in shadow (cannot be checked, not needed in this framing); no hands or watch in frame, so no wrist issue |
| Lighting | Oil lamp at frame-RIGHT as the only key, amber on the face, teal shadows, dark background ✓ (C7_v2 look). After the flip the lamp sits screen-left, as planned |
| Framing | MCU, 16:9; face is 58% of frame height (lip-sync rule: at least a third ✓). Resolution 1672×941 (Kling sets its own output size) |
| **Eyeline / head angle** | **Head nearly frontal (yaw +6.9°; corrected 15 Nov: −5° was the pitch value)**, eyes close to the lens, slightly toward frame-left. The package and plan ask for a three-quarter turn to frame-LEFT toward the off-screen mirror, so that after the flip he faces screen-right toward the Reflection (5.6, 5.8 look frame-left). A near-frontal stare may read as shouting at the audience; it may still cut, so decide on the edit test or adjust before Kling |
| **Mouth** | **Open mid-shout, teeth showing.** The package recommended lips just parted (the instant before the shout), because Kling Lip Sync drives the line from a neutral mouth; a frozen open mouth tends to fight it and can warp the teeth. Not a blocker: the image-to-video clip moves the mouth before lip-sync runs; watch the first syllable (എ) and the teeth on the QC pass |
| Camera | Still frame; handheld movement comes from the Kling prompt ✓ |

## 5. Unrelated to running the test, still open

ElevenLabs commercial licence unresolved; pending ElevenLabs settings (style, speaker boost, speed, text normalisation,
seed). Neither blocks an internal test; both block using the audio in the released film.

## 6. What is needed to run the test

- [ ] Confirm `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` is the approved Shot 5.7 keyframe (or send the right file)
- [ ] Decide: keep this keyframe as is (frontal eyeline, open mouth), or make a corrected one first (no Kling credits
      needed for that; ChatGPT only)
- [ ] Tell me the Kling model and the clip lengths your app offers
- [ ] Your explicit OK to spend Kling credits on `5.7_v1.mp4` (5 s), then on Lip Sync with the ElevenLabs sample
