# THE OTHER SIDE (മറുവശം) — Aadhi Voice Continuity Plan

Preparation only: no audio or video generated, no credits spent, nothing purchased. Approved dialogue (all 31 lines,
locked 10–11 Nov), the Dialogue Shot Map and the frozen identity references are unchanged. Line text below is copied
by script from `edits/the-other-side/DIALOGUE_SHOT_MAP.md`.

## 1. Approved voice reference (Aadhi)

**Correction (15 Nov):** the first version of this plan named `L18_Aadhi_Take01.mp3.m4a` as the ElevenLabs reference.
That was wrong. The ElevenLabs sample is the file uploaded today at 16:03 (below). The L18 m4a, and its duplicate
`Poojaveli Thuruthan Kaval Road.m4a` (an iPhone Voice Memos place-name title), is a recorded human take of Line 18;
it stays preserved and is not the voice reference.

| | |
| --- | --- |
| Status | **APPROVED by the user (15 Nov) as Aadhi's official voice reference** |
| Drive file (Audio folder) | `ElevenLabs_2026-11-15T15_54_09_Abhilash S - Fun, Encouraging Friend_pvc_s50_sim99_v4.mp3` · id `1mjhQ2UgRC_6eOTTQOr2SdczVhP7b7jYP` · uploaded 15 Nov 16:03 |
| Frozen local copy | `input/tos_voice/ElevenLabs_2026-11-15T15_54_09_Abhilash_S_pvc_s50_sim99_v4.mp3` (spaces and the comma removed from the local name only), read-only, 44,522 bytes, sha256 `3d7143de9756b840…` |
| Voice (from the file name) | ElevenLabs Voice Library voice **"Abhilash S - Fun, Encouraging Friend"**, a Professional Voice Clone (`pvc`). `s50` and `sim99` read as stability 50 and similarity 99 in ElevenLabs' download names; `v4` is not decodable from the name; please confirm the model and any style/speed settings |
| Content | Please confirm which words it speaks. Its two speech phrases (0.09–0.65 s and 0.66–1.38 s) fit Line 18's shape (എന്റെ വീട്ടീന്ന് / ഇറങ്ങിപ്പോടാ!), but I cannot read Malayalam words from audio reliably |
| Format | MP3, 128 kbps, mono, 44.1 kHz, 1.72 s |
| Measured (my analysis) | speech 0.09–1.38 s (1.29 s) · median pitch ~216 Hz (10th–90th percentile 150–278 Hz), a shouted register · −14.2 LUFS (earshot), −17.7 LUFS integrated (ffmpeg), −2.5 dBFS peak, noise floor −40 dBFS |
| Listening check (earshot) | 'an angry man shouting': plausible (z +2.8; 99% vs calm man / woman shouting / frightened whisper). 'A synthetic text-to-speech voice': **strong** (z +4.3; 94% vs a real recorded voice). Closest overall descriptions: 'funk music', 'celebratory and joyful music' (z +3.1), 'cheerful ukulele music' (z +2.7) |

**What the measurements flag (for your judgement, not a verdict on taste):** the voice reads as synthetic, and its
overall character leans cheerful, consistent with its library name "Fun, Encouraging Friend". For a dark thriller,
check by ear that the anger reads as menace, not energy. The recorded human take of Line 18 measured the opposite:
a strong 'angry man shouting' (z +4.2) and a real voice (>99%). If the generated lines keep reading bright, an
ElevenLabs voice with a darker default character, or speech-to-speech driven by your own takes, may hold the tone
better. I change nothing without your decision.

The reference file is never edited, re-encoded or renamed (only the local copy's name drops spaces). Every trim or
conversion for the edit is a new file in `work/`.

**Please record for repeatability:** the model used (the `v4` in the name?), any style, speed and speaker-boost
settings, and the language setting. Every later Aadhi line must use exactly these. Also confirm that your ElevenLabs
plan allows this Voice Library voice in the film (Voice Library voices carry their own sharing terms). earshot cannot
check licence or provenance.

**Also preserved (not the reference):** `L18_Aadhi_Take01.mp3.m4a` (Drive id `15MY1qZ-C7EM5Jp-BjRSqrPRMfoiAv4NV`, local
read-only, sha256 `4a52a2659cb0ac98…`), a recorded take of Line 18 in a different, lower voice (median ~142 Hz, 1.74 s
of speech). The duplicate `Poojaveli Thuruthan Kaval Road.m4a` has identical audio. Useful only as a timing and
emotion guide if you want it; tell me if it should be used or set aside.

## 2. Voice identity lock (all Aadhi lines)

Fixed for every line, never changed between lines:

- **Same voice:** the approved ElevenLabs voice, same model, same settings as the reference; Malayalam text exactly as
  approved (paste from this file, never retype).
- **Accent and language:** Kerala Malayalam, the reference's accent; no English-accented vowels; pronunciation of
  ആദി (Aadhi), the conjuncts and doubled consonants (ട്ട, ന്ന, പ്പ) as in natural speech.
- **Pitch:** the speaker's natural register. The reference is a shout (median ~216 Hz); calm and whispered lines should
  sit lower and narrower. I measure every take's median and range and flag any line whose register jumps against its neighbours in
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

Uses the approved ElevenLabs voice. The full shot package is `edits/the-other-side/tests/SHOT_5.7_TEST_PACKAGE.md`
(keyframe approved 11 Nov, location pending).

| | |
| --- | --- |
| Audio for lip-sync | the approved reference file, **if you confirm it speaks Line 18 exactly** (എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!). If it speaks other words, Line 18 must be generated in this voice with the same settings (needs your OK; no credits spent until then) |
| Trim for Kling Lip Sync | 0.00–1.58 s of the file (0.09 s lead-in, the whole speech, 0.2 s after) → a new file, `work/tos/L18_aadhi_lipsync_trim.wav`, made only when you start this step |
| Placement in the film | speech start at 3:02.20 (plan) → file offset 0.09 s at 3:02.11; speech ends ≈3:03.49, inside the 3:02.0–3:05.0 slot, well before Line 19 at 3:05.2 |
| Plan vs take | plan window 3:02.2–3:04.4 (2.2 s); this take speaks for 1.29 s, about 0.9 s shorter. The shot is fitted to the take: the remaining ~1.5 s of 5.7 carries his breathing after the shout, as the Kling prompt already asks. No shot-length change needed |
| Mouth checkpoints | the package's seven; the take's phrase break at 0.65–0.66 s is the likely boundary between വീട്ടീന്ന് and ഇറങ്ങിപ്പോടാ; the പ്പ lip closure falls inside the second phrase, to be found against the picture |
| Order | you confirm the words → keyframe location recorded → your OK for Kling credits → `5.7_v1.mp4` → Kling Lip Sync with the trim → `5.7_v1_lipsync.mp4` → my check (±2 frames on the checkpoints) → flip, grade, mix, subtitle → your review |

Nothing in this section is run until you approve each step.
