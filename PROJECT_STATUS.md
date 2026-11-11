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
Regenerate A6 (as A6_v3) and A7 with the updated REDO_v2.md prompts, plus B5, C6, C7 (B3 optional); upload;
I review, then assemble the final character sheet.
