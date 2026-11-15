# THE OTHER SIDE (മറുവശം) — Aadhi Voice Continuity Plan

Preparation only: no audio or video generated, no credits spent, nothing purchased. Approved dialogue (all 31 lines,
locked 10–11 Nov), the Dialogue Shot Map and the frozen identity references are unchanged. Line text below is copied
by script from `edits/the-other-side/DIALOGUE_SHOT_MAP.md`.

## 1. Approved voice reference (Aadhi)

| | |
| --- | --- |
| Status | **APPROVED by the user (15 Nov) as Aadhi's official voice reference**: ElevenLabs male voice |
| Drive file (Audio folder) | `L18_Aadhi_Take01.mp3.m4a` · id `15MY1qZ-C7EM5Jp-BjRSqrPRMfoiAv4NV` · uploaded 11 Nov 13:34 |
| Duplicate in Drive | `Poojaveli Thuruthan Kaval Road.m4a` (id `1pPdzG_Oz6JCrnzof0WCUdcggnJKY6pq9`): **identical audio** (decoded PCM matches); only the file's creation-time tag differs (13:31 vs 13:34). Treated as the same take; the L18 file is the reference |
| Frozen local copy | `input/tos_voice/L18_Aadhi_Take01.mp3.m4a`, read-only, 25,619 bytes, sha256 `4a52a2659cb0ac98…` (file), decoded audio `3c61bb618b27e9e6…` |
| Content | Line 18, എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ! (so the reference is also Line 18 take 1) |
| Format | AAC-LC in M4A, mono, 44.1 kHz, ~69 kbps, 2.95 s (the `.mp3.m4a` name suggests an ElevenLabs MP3 converted to M4A) |
| Measured (my analysis) | speech 0.47–2.21 s (1.74 s) after a short click at 0.03 s · median pitch ~142 Hz (10th–90th percentile 93–172 Hz) · −23.3 LUFS integrated, −5.7 dBFS peak · pauses at 1.38–1.46 s and 1.72–1.77 s |
| Listening check (earshot) | earshot hears 'an angry man shouting': strong (z +4.2; 95% vs calm man / woman shouting / frightened whisper); against 'synthetic text-to-speech voice' it reads as a real recorded human voice (>99%); noise floor −44.4 dBFS. Matches Line 18's Angry band |

The file is never edited, re-encoded or renamed. Every trim or conversion for the edit is a new file in `work/`.

**Please record for repeatability** (I could not read these from the file): the ElevenLabs voice name or ID, the model,
the voice settings used (stability, similarity, style, speaker boost, speed) and the language setting. Every later
Aadhi line must use exactly these. Also confirm the voice's licence on your ElevenLabs plan allows use in the film,
and, if it is a cloned voice, that its owner consented. (earshot cannot check licence or provenance.)

## 2. Voice identity lock (all Aadhi lines)

Fixed for every line, never changed between lines:

- **Same voice:** the approved ElevenLabs voice, same model, same settings as the reference; Malayalam text exactly as
  approved (paste from this file, never retype).
- **Accent and language:** Kerala Malayalam, the reference's accent; no English-accented vowels; pronunciation of
  ആദി (Aadhi), the conjuncts and doubled consonants (ട്ട, ന്ന, പ്പ) as in natural speech.
- **Pitch:** the speaker's natural register. The reference is a shout; calm and whispered lines should sit lower and
  narrower. I measure every take's median and range and flag any line whose register jumps against its neighbours in
  the same scene.
- **Tone and style:** one man throughout: dry, close, unperformed; the emotion changes, the voice does not.
- **Delivery format:** download each line as its own file at the best quality your plan gives (WAV or the highest MP3);
  name it `L<ID>_aadhi_v<N>.<ext>` (e.g. `L13_aadhi_v1.wav`); upload to Drive Audio; I never edit the originals.

**What I can and cannot verify here:** pitch, loudness, timing, pauses and (with earshot) the vocal character and
delivery class. Speaker identity as such (same voice or not) needs a speaker-verification model, which is not
installed; the identity check is therefore your ear plus my pitch/character measurements. I can propose installing
one if you want an objective score (needs your OK).

## 3. Every Aadhi line (18 events, from the Dialogue Shot Map)

Emotion bands keep the scenes different while the voice stays the same: **Calm** (low, even), **Frightened**
(quiet, tight, breathy), **Angry** (loud, hard attack, pitch up), **Distressed** (broken, uneven, catching breath),
**Cold / at ease** (the imposter after the turn: slow, low, controlled).

| ID | Time (plan) | Shot | Speaker | Delivery | Lip-sync | Approved Malayalam | English subtitle | Emotion band | Performance note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0:05.5–0:09.5 | 1.2 | Aadhi (V.O.) | Voice-over | No (voice-over) | ഈ വീട്ടിൽ ഞാൻ ഒറ്റയ്ക്കാണ്. | I am alone in this house. | Calm | Intimate, low, still; awake in the dark. Dry V.O. |
| 2a | 0:15.2–0:18.8 | 1.4 | Aadhi (V.O.) | Voice-over | No (voice-over) | അച്ഛൻ പോയതിൽ പിന്നെ, ഇവിടത്തെ കണ്ണാടികളെല്ലാം ഞാൻ തുണിയിട്ട് മൂടി. | After Father passed, I covered every mirror in this house. | Calm | Low, sorrowful, measured; grief under control. Dry V.O. |
| 2b | 0:18.9–0:20.2 | 1.4 (ends 0.2 s into 1.5) | Aadhi (V.O.) | Voice-over | No (voice-over) | ഒരെണ്ണം ഒഴികെ. | All but one. | Calm | Short, quieter, a beat of dread on the last word. Dry V.O. |
| 3 | 0:31.8–0:34.4 | 1.7 | Aadhi | On camera | CONDITIONAL: decide on the plate | ആരാ...? ആരാന്ന്? | Who...? Who is it? | Frightened | Cautious question into the rain; not loud; voice slightly tight. |
| 4 | 0:43.0–0:47.5 | 2.1 | Aadhi (whisper) | Off-screen in scene (face not shown) | No: face not in this shot (candidate) | ഇന്നും... അവൻ... മുട്ടി. | He... knocked... again tonight. | Frightened | Whisper while writing, word by word, as if afraid to be heard. |
| 5 | 1:05.5–1:10.0 | 2.4 | Aadhi | On camera | YES | ഇതൊക്കെ... ഞാനെപ്പോ എഴുതി? | All this... when did I write it? | Frightened | Barely audible, unsettled; trailing off. |
| 7 | 1:22.0–1:25.6 | 3.3 | Aadhi | On camera | YES | ഏഴ് ദിവസമോ? ഡോക്ടർ, ഞാനിവിടെ ഇന്നലെ രാത്രിയല്ലേ എത്തിയത്. | Seven days? Doctor, I only got here last night. | Frightened | Short, half-laughing disbelief, then insistence. |
| 9 | 1:35.4–1:37.7 | 3.5 | Aadhi | On camera | YES | ഞാൻ... ഞാനിങ്ങനെ ഒന്നും അയച്ചിട്ടില്ല. | I... I never sent anything like this. | Frightened | Faltering denial; a stammer on the repeated ഞാൻ. |
| 11 | 1:45.2–1:47.2 | 3.5 | Aadhi | On camera | YES | ആര്? ഡോക്ടർ ആരുടെ കാര്യമാ പറയുന്നത്? | Who? Who are you talking about? | Frightened | Sharper, urgent question; fear rising. |
| 13 | 2:20.4–2:24.6 | 4.6 | Aadhi | On camera | YES | എന്റെ കൈയക്ഷരം... ഞാനാണോ ഇതൊക്കെ...? | My handwriting... did I write all of this? | Frightened | Quiet, confused, close to tears; breath between phrases. |
| 15 | 2:49.3–2:52.6 | 5.5 | Aadhi | On camera | YES | നീ ആരാ? എന്തിനാ നിനക്ക് എന്റെ മുഖം? | Who are you? Why do you have my face? | Angry | Demanding; fear turning to anger; jaw tight, clipped. |
| 18 | 3:02.2–3:04.4 | 5.7 | Aadhi | On camera | YES | എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ! | Get out of my house! | Angry | Shouting, furious and frightened; loud, not a scream. (= approved reference take) |
| 20 | 3:08.9–3:11.8 | 5.9 | Aadhi | Off-screen in scene (face not shown) | No: face not in this shot (candidate) | ഞാനാണോ... ആ എഴുത്തുകളൊക്കെ...? | Was it me... all those notes...? | Distressed | Shaken; breath catches; slow, broken. |
| 24 | 3:28.4–3:31.0 | 5.14 | Aadhi | On camera | YES | നീ തന്നെയല്ലേ എഴുതിയത്? "നീ ഞാനല്ല" എന്ന്. | You wrote it yourself, didn't you? "You are not me." | Cold / at ease | Quiet, cold, controlled; no anger left; unblinking. |
| 26 | 3:57.9–3:59.4 | 6.7 | Aadhi | On camera | YES | ഞാനത് പൊട്ടിച്ചു, ഡോക്ടർ. | I broke it, doctor. | Cold / at ease | Warm, steady, new calm; simple statement. |
| 28 | 4:01.6–4:03.4 | 6.7 | Aadhi | On camera | YES | ഇല്ല. ഇനി ഞാൻ മാത്രം. | No. Now there's only me. | Cold / at ease | Slow, small smile audible in the voice; certain. |
| 30 | 4:05.0–4:07.9 | 6.8 | Aadhi | On camera | YES | ആദ്യമായി... എനിക്ക് ഞാനായി തോന്നുന്നു. | For the first time... I feel like myself. | Cold / at ease | At ease for the first time; quiet and certain; a slight pause after ആദ്യമായി. |
| 31 | 4:19.6–4:22.6 | 7.7 | Real Aadhi (V.O.) | Voice-over | No (voice-over) | ഈ വീട്ടിൽ ഞാൻ ഒറ്റയ്ക്കാണ്. | I am alone in this house. | Distressed (numb) | Flat and numb, emptied; the same words as Line 1, same voice, no colour. |

## 4. Voice-generation checklist (per line)

Before generating (needs your OK for any credits):

- [ ] Same voice, model and settings as the reference (recorded in section 1)
- [ ] Malayalam pasted exactly from section 3; nothing added or changed; English subtitle untouched
- [ ] Emotion band and delivery note from section 3 written into the generation (style/emotion control or a short
      stage direction kept out of the spoken text)
- [ ] V.O. lines (1, 2a, 2b, 31) dry and close; on-camera lines natural room distance

After generating (my check, on the downloaded file):

- [ ] Words complete and correct by your ear (I cannot verify Malayalam words reliably)
- [ ] Duration fits the plan window (section 3) or I re-fit the shot to the take, as decided
- [ ] Pitch register consistent with the reference and with the scene's other lines; flagged if it jumps
- [ ] Loudness and noise: no clicks, clipping or artefacts; peak below −1 dBFS after the mix gain
- [ ] Emotion reads as its band (earshot delivery check); no accidental laugh, sing-song or English accent
- [ ] Original saved read-only in `input/tos_voice/`; edit copies only in `work/`

## 5. Real Aadhi, Reflection and Dr. Thomas

- **Real Aadhi (Line 31, V.O.):** the same approved Aadhi voice, same settings; delivery flat and numb (Distressed →
  emptied). It must be audibly the same man as Line 1, which it repeats word for word.
- **Reflection (Lines 14, 16, 17a, 17b, 19, 21, 22a, 22b, 23a, 23b):** a separate voice, as you directed; not part of
  this plan; it needs its own voice reference and approval.
- **Dr. Thomas (Lines 6, 8a–8c, 10a–10b, 12a–12b, 25, 27, 29):** a separate voice (Google TTS test pending your key),
  always through the phone filter; never lip-synced.

**Decision to confirm (story continuity):** in the screenplay the Reflection *is* the real Aadhi. The plan's dialogue
track was "Aadhi and the Reflection, one actor, two performances", and Line 31 (Real Aadhi) uses Aadhi's voice under
this plan. A different voice for the Reflection means the real Aadhi speaks with one voice in Scene 5 and another in
Scene 7. Two ways to keep it coherent:
(a) the Reflection uses the **same Aadhi voice**, made exhausted and hoarse by performance plus the glass treatment in the
mix (my recommendation, true to the twist); or
(b) a separate Reflection voice, and **Line 31 then uses the Reflection's voice** instead of Aadhi's.
I have followed your instruction (separate Reflection voice; Real Aadhi = Aadhi) and changed nothing else; please
choose (a), (b) or keep as is.

## 6. First lip-sync test: Shot 5.7, Line 18

Uses the approved take itself; the full shot package is `edits/the-other-side/tests/SHOT_5.7_TEST_PACKAGE.md`
(keyframe approved 11 Nov, location pending).

| | |
| --- | --- |
| Audio for lip-sync | `L18_Aadhi_Take01.mp3.m4a` (approved reference) |
| Trim for Kling Lip Sync | 0.27–2.41 s of the take (0.2 s before and after the speech; removes the 0.03 s click) → a new file, `work/tos/L18_aadhi_lipsync_trim.wav`, made only when you start this step |
| Placement in the film | speech starts at 3:02.20 (plan) → take offset 0.47 s at 3:01.73; speech ends ≈3:03.94, inside the 3:02.0–3:05.0 slot and before Line 19 at 3:05.2 |
| Plan vs take | plan window 3:02.2–3:04.4 (2.2 s); take speech 1.74 s; fits, nothing to re-time |
| Mouth checkpoints | the package's seven; the take's pauses at 1.38–1.46 s and 1.72–1.77 s are likely word and consonant boundaries, the second a candidate for the പ്പ lip closure, to be confirmed against the picture |
| Order | keyframe location recorded → your OK for Kling credits → `5.7_v1.mp4` → Kling Lip Sync with the trim → `5.7_v1_lipsync.mp4` → my check (±2 frames on the checkpoints) → flip, grade, mix, subtitle → your review |

Nothing in this section is run until you approve each step.
