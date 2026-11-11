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

## Remaining
- [ ] User confirms the other 29 Malayalam lines -> lock screenplay
- [ ] User generates panels in ChatGPT (A1 first), uploads <panel>_vN.png to Drive Edit -> I check each against the
  originals -> assemble the sheet locally -> lock identity
- [ ] Optional: right-wrist watch close-up photo (REF_06)
- [ ] Choose image/video generation tools (sets clip-length splits)
- [ ] Dr. Thomas voice test: choose Google TTS (needs API key) or Meta MMS (noncommercial, timing only)
- [ ] Build the iPad editing dashboard from the plan (after approval)
- [ ] Generate shots scene by scene, check continuity, assemble, subtitles, sound, master (1080p24)

## Next recommended step
User: review the 29 lines; record Line 18 (L18_aadhi.m4a); make keyframes 5.7, 7.4, 3.1 in ChatGPT and upload.
Me: check keyframes against panels; on user OK they run the 3 Kling clips; I review and send a short test edit.
No full production, no Kling credits spent without user approval.
