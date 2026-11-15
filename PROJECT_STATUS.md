# PROJECT_STATUS — THE OTHER SIDE (മറുവശം)

Updated: 2026-11-10

## Completed
- Environment inspected; disk cleaned (pip cache, scratch clones/test renders): ~6 GB free.
- Screenplay read from Drive (Draft 3, 20 pages).
- Production plan doc: 7 scenes / 59 shots / exactly 268 s, image + video prompts per shot, timed subtitles,
  sound plan, asset list: https://claude.ai/artifact/LLEWBct3zUjBXM8c5dNtiv
- Applied review: English-only subtitles, Scene 3 retimed (cuts between sentences), drone in Scenes 4-5 only,
  3:33 smash kept, right-wrist/right-hand continuity check, Dr. Thomas voice test prepared (not generated).
- Lines 18 and 30 LOCKED by the user (10 Nov): എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ! / ആദ്യമായി... എനിക്ക് ഞാനായി തോന്നുന്നു.
- Reference-photo spec for the character sheet given (5 photos, full-res, soft daylight; upload to Drive Edit
  folder 15wLpsUzKk8bN_Cdat31XAfWClJ6ul3YN, file names REF_01..REF_05).

- Six reference photos verified (accessible, 3024x4032 iPhone 17 Pro Max, sharp faces, no clipping); mapped to
  REF_01..REF_05 + back view; copies in input/tos_refs/.

- Assessment APPROVED by user; extra photos being shot.
- Reference assessment delivered: identity, 3/4 x2, one profile, back, full body sufficient; gaps = second
  profile and expressions (optional extra photos REF_04b, REF_07 fear, REF_08 imposter smile, REF_06 watch).

- All 10 references verified; identity board built from originals only: output/tos_identity_board.jpg
  (script edits/the-other-side/identity_board.py). Issues: REF_08 is a warm grin (not cold smile); necklace still
  on in fear/smile; watch photo is a digital model (position only) and wrist ownership to confirm.

- Identity board V2 built (V1 kept unchanged): cold smile IMG_8813; user's digital watch locked as the prop;
  plan doc wardrobe prompt and continuity checklist updated to the digital watch.

- Identity board V2 APPROVED (11 Nov).
- AI character-sheet prompts written (not run): edits/the-other-side/prompts/ — _common.md (identity, light,
  negative), A turnaround (8 panels), B expressions (5), C costume & continuity (8 incl. day-7 and light tests).

- User's identity-lock wording adopted as the master IDENTITY block (prompts/_common.md).

- Prompts A/B/C APPROVED; tool = ChatGPT Image Generation (iPad). 21 exact copy-paste prompts in
  edits/the-other-side/prompts/CHATGPT_PANELS.md.

- All 21 ChatGPT panel prompts (A1-A8, B1-B5, C1-C8) handed to the user one by one (11 Nov).

- 21 generated panels found in Drive Edit (UUID names, uploaded together); copies in input/tos_panels/.
  Mapping: A1 A49AE7DA, A2 98B62E03, A3 97BE6DC9, A4 31F18098, A5 A64DD957, A6 E3FC0924, A7 19846521, A8 020E8ADD,
  B1 C70DA14A, B2 772986A4, B3 AB7E0F4D, B4 05C021BC, B5 CDAE5B09, C1 92B8149B, C2 D86B337D, C3 A51F5074,
  C4 5B48BC7A, C5 C735A6EB, C6 BABDDB70, C7 C4EA58E9, C8 8E112F8E.
- A1-A8 checked (ArcFace similarity to originals 0.69-0.94, profile lower as expected; A8 back no face): identity
  PASS; minor notes: slightly neater hair, slightly fuller arms in A6/A7. Lower scores to review later: C6 0.64,
  C7 0.59.

- Visual review of all 21 panels done (11 Nov). APPROVED: A1-A5, A8, B1, B2, B4, C1, C2, C3, C4, C5, C8.
  REGENERATE: A6, A7 (build too muscular), B5 (smile too faint), C6 (aged/gaunt, reads older), C7 (brows, eyes,
  moustache drift in lamp light). OPTIONAL: B3 (glare, slightly gaunter). Redo prompts: prompts/REDO_v2.md.

- A6 redo received (9DCC9524, single image, not a full A1-A8 sheet): build now slim and matches IMG_8759; but it
  copied the orange T-shirt with printed brand text from the reference -> fails costume. A7 redo not received.
  REDO_v2 A6/A7 prompts now say: do not copy the reference clothing or text.

- A6_v3 (D9F5F235) APPROVED: plain charcoal tee, no text, slim build (shoulders a touch broader than IMG_8759,
  acceptable), face 0.78. Approved A6 = A6_v3; old A6 (E3FC0924) and 9DCC9524 superseded.

- A7_v2 (0312E52C) APPROVED: turned frame-left like IMG_8708, plain charcoal tee, slim build consistent with
  A6_v3, face 0.86 vs own ref. A-set complete: A1-A5, A6_v3, A7_v2, A8.
- Review tool: edits/the-other-side/review_panel.py (copy, scores, side-by-side; visual check decides).

- B5_v2 (CE4713CD) reviewed: visible closed-lip smile, mouth corners lifted, calm unsmiling eyes; identity
  matches approved B1 (0.87) and IMG_8749 (0.85); hair, beard, plain charcoal tee, no necklace OK.
  Verdict: PASS. APPROVED by user (11 Nov): B5 = B5_v2.

- C6_v2 (FE23E826) reviewed: clear improvement over old C6 (no forehead lines, less ageing; 0.74 vs IMG_8749,
  old 0.64). Exhaustion cues correct (bloodshot eyes, cracked lips, damp hair, skin sheen; costume OK). Remaining
  drift: face slightly narrower with mild hollowing under the cheekbones, and very dark, sunken under-eyes add a
  few years. Verdict: ONE CORRECTION recommended (C6_v3), not approved yet.

- C6_v3 (B6AA8B88) final review: face width and cheek fullness back to C5 / IMG_8749, no hollowing; nose, brow
  shape and jawline match; natural age; exhaustion only through eyes (bloodshot, mild under-eyes, wet), lips, skin
  sheen and damp hair; costume, beard, skin texture OK. APPROVED by user (11 Nov): C6 = C6_v3.

- C7_v2 (1eLJfMK6, C85B0EF3) APPROVED by user (11 Nov): C7 = C7_v2. All panels approved.
- FROZEN (11 Nov, user): approved panels are final; never modify or regenerate. Read-only copies in input/tos_panels/:
  A1 A49AE7DA, A2 98B62E03, A3 97BE6DC9, A4 31F18098, A5 A64DD957, A6_v3 D9F5F235_A6_v3, A7_v2 A7_1s2_1QR9,
  A8 020E8ADD, B1 C70DA14A, B2 772986A4, B4 05C021BC, B5_v2 B5_1RU_e6JO, C1 92B8149B, C2 D86B337D, C3 A51F5074,
  C4 5B48BC7A, C5 C735A6EB, C6_v3 C6_1Fdez8s5, C7_v2 C7_1eLJfMK6, C8 8E112F8E.

- Character identity sheet V1 (13 panels) reviewed by user; asked to add B2, B4, C1-C4, C8.
- Character identity sheet V2 (11 Nov): all 20 approved panels, frozen files, crop and scale only (script asserts
  20/20 placed and 20/20 compared). p1 turnaround A1-A8 + C1-C3; p2 emotional progression in plan-doc story order
  (B1 baseline -> C7_v2 Sc1-2 -> B2 Sc3-4 -> B4 Sc5 -> C6_v3 Sc5 reflection -> C8 Sc6 -> B5_v2 Sc7), costume and watch
  continuity (C4 + C1/C2/C3 wrist crops: watch on his RIGHT wrist in all; C5 pocket on LEFT chest), hair strip of 19
  panels; p3 all 20 panels vs originals (face match 0.73-0.96 over 17 face panels, median 0.86; A8/C3 back views,
  C4 watch vs IMG_8843).

- Final verification of sheet V2 (11 Nov, `character_sheet.py --verify`): 20/20 panels placed, each exactly once
  per section (turnaround 11 + progression 7 + C4/C5 = 20 primary tiles; C1-C3 also as wrist crops); page 2
  head-scale strip 19 tiles (C4 excluded), no duplicates; page 3 20/20 correct comparisons; watch on the RIGHT wrist
  in C1-C4 (checked by eye), shirt pocket LEFT chest, no necklace; 20/20 frozen panels byte-identical (sha256) to the
  Drive originals and read-only; exported pages = a fresh render (max pixel diff 0) = the files sent. ALL PASS.

- CHARACTER IDENTITY SHEET APPROVED by user (11 Nov): output/tos_character_sheet_p1-3.jpg, all 20 panels.
  Panels stay frozen and read-only; never regenerate or modify. Face, build, hair, beard, costume and watch locked.
- Editing execution plan written (Claude Docs): https://claude.ai/artifact/WqHq7p9THMuo4WZEjYt2FT
  All 7 scenes / 59 shots: duration, panel refs per shot, camera and cuts, grade per look, sound tracks A1-A7,
  music (none; drone Sc4-5 only), VFX, subtitles, masters, gates. Found: 13 production-plan prompts still say
  "steel watch" (1.2 1.7 1.8 2.1 2.3 4.5 5.2b 5.3 5.9 6.5 6.6 7.2 7.5): fix only with user OK.

- User decisions (11 Nov): Kling AI = video tool (image-to-video from ChatGPT keyframes made with the frozen
  panels; clips planned <= 10 s; Kling 4.0 reported 3-30 s, 3.0 up to 15 s, unverified: kling.ai blocked here);
  Dr. Thomas = Google Cloud TTS test first (key form declined: waiting; user can add a network secret for
  texttospeech.googleapis.com, header X-Goog-Api-Key); user records Aadhi + Reflection, shots fit to takes,
  lip-sync only where the mouth is clearly visible; no background score (drone Sc4-5 only); panels frozen.
- Production plan: the 13 "steel watch" prompts changed to "black digital watch" (0 "steel" left; nothing else).
- Malayalam dialogue review doc (29 lines, restored vs PDF text, verdict dropdowns, nothing assumed approved):
  https://claude.ai/artifact/48jnz6JzsTKhmrHUfycwmD
- Test-shot doc (Kling workflow, splits for 2.3/3.3/3.5/6.7, Tests A 5.7 Line 18, B 7.4, C 3.1/K3, prompts,
  settings, review checklist): https://claude.ai/artifact/4TxzAyd9mATow64pAEPbBS

- MALAYALAM DIALOGUE APPROVED by user (11 Nov), no wording changes; review doc updated (all 29 verdicts Approved):
  Lines 1-17 approved as written; Line 18 locked earlier (10 Nov); Lines 19-29 approved as written; Line 30 locked
  earlier (10 Nov); Line 31 covered by the Line 1 approval (intentional repetition). Malayalam and English subtitles
  unchanged. All 31 lines locked; the screenplay dialogue is final.

- DIALOGUE SHOT MAP v2 (11 Nov, preparation only): edits/the-other-side/DIALOGUE_SHOT_MAP.md from dialogue_shot_map.py.
  Timing reference = the approved plan's subtitle list (42 IDs incl. splits 2a/2b, 8a-c, 10a/b, 12a/b, 17a/b, 22a/b,
  23a/b; speakers and start/end times kept exactly; user named it "the list provided in this conversation": no list
  was pasted, so this one was used). Classes: Aadhi/Real Aadhi (V.O.) = voice-over; Aadhi, Reflection = visible
  lip-sync candidates; Dr. Thomas = phone, never on screen; N1-N3 = text overlays. Shots: visible lip-sync 14 (2.4,
  3.3, 3.5, 4.6, 5.4-5.8, 5.10, 5.13, 5.14, 6.7, 6.8), conditional 1.7, spoken-not-synced 2.1, 5.9, 5.11; V.O. 1.2,
  1.4, 7.7; phone 3.3-3.6, 6.7; text 4.2-4.4. NEEDS CONFIRMATION: none. Overhangs: 2b +0.2 s into 1.5, 22b +0.6 s
  into 5.12 (planned), 23b +0.2 s into 5.14, 29 +0.7 s into 6.8. Dialogue, shot order and durations unchanged.

- TEST SHOT 5.7 PACKAGE ready (11 Nov, preparation only): edits/the-other-side/tests/SHOT_5.7_TEST_PACKAGE.md +
  reference strip output/tos_5.7_reference_set.jpg. Attach: Identity Board V2, A1, A2, B4, C5, C7_v2 (frozen; sha256
  checked; C4 only if hands show). Keyframe = instant before the shout (better for Kling lip-sync); Kling 5 s, 1080p,
  audio off; Line 18 lip-sync checkpoints (pp closure, final aa) within 2 frames; full QC checklist. Test doc Test A
  points to the package. Nothing generated, no credits spent.

- SHOT 5.7 KEYFRAME APPROVED by user (11 Nov, visual approval). Approved image location: PENDING (user to provide;
  record it here and in tests/SHOT_5.7_TEST_PACKAGE.md). Frozen identity references unchanged. Kling animation prompt
  and Line 18 lip-sync requirements stay ready in the package. No video generated, no Kling credits spent.

- AADHI VOICE (15 Nov): user approved the ElevenLabs male voice sample as Aadhi's official voice reference:
  Drive Audio `ElevenLabs_2026-11-15T15_54_09_Abhilash S - Fun, Encouraging Friend_pvc_s50_sim99_v4.mp3`
  (id 1mjhQ2UgRC_6eOTTQOr2SdczVhP7b7jYP), Voice Library PVC "Abhilash S", s50/sim99; frozen read-only copy in
  input/tos_voice/ (sha256 3d7143de9756b840). 1.29 s speech, median f0 ~216 Hz, -14.2 LUFS. earshot: synthetic TTS
  strong (z +4.3); angry shout plausible (z +2.8); overall character leans cheerful (funk / celebratory, z +3.1):
  flagged for the user's ear. CORRECTION: the first plan version wrongly named L18_Aadhi_Take01.mp3.m4a (a recorded
  human take, duplicate "Poojaveli Thuruthan Kaval Road.m4a") as the ElevenLabs reference; it is preserved, not the
  reference. Plan: edits/the-other-side/AADHI_VOICE_CONTINUITY.md (18 Aadhi events incl. Real Aadhi L31, emotion
  bands, identity lock, per-line checklist; Shot 5.7 / Line 18 lip-sync test with the ElevenLabs file if it speaks
  Line 18: trim 0.00-1.58 s, speech at 3:02.20). Reflection and Dr. Thomas separate voices (user). OPEN: confirm the
  sample's words; model/settings; Voice Library licence; Reflection = real Aadhi decision (a)/(b)/keep; what to do
  with the human L18 take. No audio or video generated, no credits spent.

- VOICE DECISIONS (15 Nov, user): ElevenLabs "Abhilash S" sample = PROVISIONAL Aadhi voice reference. Line 18 check:
  Whisper translates sample and human take as "Get out of my house!" (meaning = Line 18); Malayalam transcription
  unusable; MFCC/DTW vs human take 0.65 fwd vs 0.91 reversed: EXACT WORDING NOT VERIFIED (needs ElevenLabs History
  text or the user's ear). Settings preserved: voice Abhilash S (PVC), stability 50, similarity 99; MISSING: model
  ("v4" ambiguous), style, speaker boost, speed, language, seed, output format, input text (MP3 tags hold none).
  Reflection = same voice identity, same settings, colder/unsettling delivery (10-line plan; 23a-b keep scripted panic).
  Human take L18_Aadhi_Take01 = emotional + timing reference (1.74 s vs sample 1.29 s). Licence NOT verified: no
  account access, elevenlabs.io blocked; user to check plan, ToS/Voice Library addendum, the voice's own terms.
  AADHI_VOICE_CONTINUITY.md updated. No audio/video generated, no credits spent, dialogue unchanged.

- VOICE PLAN UPDATED (15 Nov): status table and section 8 checklist (what the user must provide) added to
  AADHI_VOICE_CONTINUITY.md: A Line 18 wording, B model/settings (9 items), C licence (4 checks; UNRESOLVED until
  official terms + actual subscription), D open decisions (23a-b, Line 18 regeneration), E Dr. Thomas Google key
  (separate from ElevenLabs), F 5.7 keyframe location + Kling OK. ElevenLabs voice stays PROVISIONAL; sample and
  human take preserved (sha256 unchanged). No audio generated, no credits spent, dialogue unchanged.

- ELEVENLABS SETTINGS RECORDED (15 Nov, from the user's screenshot; image not seen by me: not in Drive or chat):
  Line 18 input text "[angry] എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!" = approved Line 18: WORDING VERIFIED. Voice Abhilash S -
  Fun, Encouraging Friend; model Eleven v4; stability ~50; similarity ~99; clone strength 0; language Auto; output MP3
  44.1 kHz 128 kbps (matches the file). PENDING: style exaggeration, speaker boost, speed, text normalisation, seed,
  exact slider values. Voice still PROVISIONAL; licence UNRESOLVED. Sample cleared as Line 18 audio for the 5.7
  lip-sync test. No audio generated, no credits spent, dialogue unchanged.

- SHOT 5.7 READINESS AUDIT (15 Nov): edits/the-other-side/tests/SHOT_5.7_READINESS.md. NOT READY / NOT STARTED.
  Keyframe candidate (needs user confirmation): Drive Edit C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png (11 Nov 10:06),
  read-only copy input/tos_keyframes/; 5.7-type frame (MCU, lamp frame-right, teal, charcoal shirt, no necklace) but
  head near-frontal (yaw ~-5 deg, not 3/4 frame-left) and mouth open mid-shout; face-match 0.63 A1 / 0.70 B4 (support).
  Audio: ElevenLabs Line 18 sample 1.29 s speech (verified wording), human take 1.74 s; plan 2.2 s; fits slot
  3:02.0-3:05.0. Prompts ready; Kling model/lengths unconfirmed. Needed: keyframe confirmation, keep-or-fix decision,
  Kling model, explicit credit OK.

- SHOT 5.7 KEYFRAME CORRECTION PROPOSED (15 Nov, not generated): edits/the-other-side/tests/SHOT_5.7_KEYFRAME_CORRECTION.md
  + brief output/tos_5.7_correction_brief.jpg. ChatGPT edit of the approved original C55A5E62...png (kept unchanged,
  still the approved version): head 3/4 to frame-left toward the mirror, mouth nearly closed; everything else kept.
  Result to be saved as 5.7_key_v2.png (Drive Edit). User generates; I check; user approves v2 or keeps the original.
  No video, no Kling credits.

- SHOT 5.7 KEYFRAME v2 REVIEWED (15 Nov, NOT approved): Drive Edit 086CA352-00B1-4BCA-A7A9-7428FAE0BDA0.png (17:03;
  no file named 5.7_key_v2.png: user to confirm), read-only copy in input/tos_keyframes/. Mouth FIXED (nearly closed).
  MISMATCHES: head turned toward frame-RIGHT (yaw +13.7 deg; target ~-25..-35 like A2 at -35.9), eyes not clearly on the
  frame-left mirror; minor: lamp larger/closer, more head tilt. Identity same as original (0.86; A1 0.60). Review:
  edits/the-other-side/tests/SHOT_5.7_V2_REVIEW.md with a v3 prompt fix. Original C55A5E62 unchanged, still approved.
  Readiness doc corrected (original yaw +6.9, not -5). No video, no credits.

- 15 Nov re-check: no new keyframe uploaded. The v2 file (Drive id 19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp, byte-identical) was
  renamed in Drive to "5.7_key_v1.png" at 17:04; it is still the PROPOSED v2, not the approved original. Review unchanged.

- SHOT 5.7 KEYFRAME (15 Nov 17:27): the 17:11 v3 (id 1QCOcDkXnH3pOK5F_x7G-kiEwCoDLXIHv, gaunt identity) is in the Drive
  TRASH. Drive Edit "5.7_key_v3.png" is now the v2 image (id 19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp, sha256 4f45300c32c58797):
  identity OK (A1 0.60, original 0.86), face shape/lips/chin within the A1/A2/B4 range, mouth nearly closed, costume,
  lighting, framing OK; BUT head turned toward frame-RIGHT (yaw +13.7, target ~-30 like A2), eyes near the lens, lamp
  larger, more tilt. Neither image has both fixes. AWAITING USER APPROVAL; nothing marked approved. Original C55A5E62
  unchanged (e9d3a28fd9f959e4). Local copy input/tos_keyframes/5.7_key_v3.png = the trashed 17:11 image. Record:
  edits/the-other-side/tests/SHOT_5.7_V3_REVIEW.md. No video, no credits.

- SHOT 5.7 v4 CORRECTION PROMPT prepared (15 Nov, not generated, awaiting user review):
  edits/the-other-side/tests/SHOT_5.7_V4_PROMPT.md. ChatGPT edit of the current Drive 5.7_key_v3.png (v2 image): ONLY head
  ~30 deg to frame-left (A2 attached for direction only) + eyes to the frame-left mirror; face, mouth, chin, beard, hair,
  expression, skin, shirt, lighting, lamp, framing preserved; Identity Board/A1 deliberately not attached. Acceptance
  checks listed (yaw -25..-35, face-match vs base ~0.8+, lips 0.17, chin 0.39). Open: keep v3's larger lamp or restore the
  original's. Output name 5.7_key_v4.png (new file). No video, no credits.

## Remaining
- [x] User confirms the other 29 Malayalam lines -> lock screenplay (done 11 Nov)
- [ ] User generates panels in ChatGPT (A1 first), uploads <panel>_vN.png to Drive Edit -> I check each against the
  originals -> assemble the sheet locally -> lock identity
- [ ] Optional: right-wrist watch close-up photo (REF_06)
- [ ] Choose image/video generation tools (sets clip-length splits)
- [ ] Dr. Thomas voice test: choose Google TTS (needs API key) or Meta MMS (noncommercial, timing only)
- [ ] Build the iPad editing dashboard from the plan (after approval)
- [ ] Generate shots scene by scene, check continuity, assemble, subtitles, sound, master (1080p24)

## Next recommended step
User: decide the 5.7 keyframe: (a) approve the current 5.7_key_v3.png (v2 image) as is, (b) keep the original, or
(c) one more ChatGPT edit of the current file: head ~30 deg to frame-left like A2, eyes to the mirror, keep face, mouth,
lamp size. Kling only after approval and an explicit credit OK.
