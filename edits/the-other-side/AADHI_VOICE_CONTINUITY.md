# THE OTHER SIDE (മറുവശം) — Aadhi Voice Continuity Plan

Preparation only: no audio or video generated, no credits spent, nothing purchased. Approved dialogue (all 31 lines,
locked 10–11 Nov), the Dialogue Shot Map and the frozen identity references are unchanged. Line text below is copied
by script from `edits/the-other-side/DIALOGUE_SHOT_MAP.md`.

## Current status (15 Nov)

| Item | State |
| --- | --- |
| Aadhi voice | ElevenLabs "Abhilash S - Fun, Encouraging Friend": **PROVISIONAL**. Also used for the Reflection (colder delivery) and Real Aadhi |
| Original ElevenLabs sample | Preserved unchanged in Drive Audio and read-only in `input/tos_voice/` (sha256 `3d7143de9756b840…`) |
| Your human recording (Line 18) | Preserved unchanged, read-only (sha256 `4a52a2659cb0ac98…`); the **emotional and timing reference** |
| Exact Line 18 wording in the sample | **VERIFIED from the ElevenLabs screenshot (user, 15 Nov)**: input text `[angry] എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!` (1a) |
| Model and settings | Recorded from the screenshot: Eleven v4, stability ~50, similarity ~99, clone strength 0, language Auto, MP3 44.1 kHz 128 kbps; **hidden settings pending** (1b) |
| Commercial licence | **UNRESOLVED**: stays so until checked against ElevenLabs' official terms and your actual subscription (7) |
| Dr. Thomas | **Separate**: Google Cloud TTS, its own setup and key, never mixed with Aadhi's ElevenLabs voice (5) |
| Generation | None: no audio or video generated or regenerated, no credits spent, approved dialogue unchanged |

The checklist of what is needed from you to finish the voice setup is section 8.

## 1. Provisional voice reference (Aadhi)

**Correction (15 Nov):** the first version of this plan named `L18_Aadhi_Take01.mp3.m4a` as the ElevenLabs reference.
That was wrong. The ElevenLabs sample is the file uploaded today at 16:03 (below). The L18 m4a, and its duplicate
`Poojaveli Thuruthan Kaval Road.m4a` (an iPhone Voice Memos place-name title), is a recorded human take of Line 18;
it stays preserved and is not the voice reference.

| | |
| --- | --- |
| Status | **PROVISIONAL voice reference for Aadhi (user decision, 15 Nov)**; Reflection uses the same voice identity (section 5) |
| Drive file (Audio folder) | `ElevenLabs_2026-11-15T15_54_09_Abhilash S - Fun, Encouraging Friend_pvc_s50_sim99_v4.mp3` · id `1mjhQ2UgRC_6eOTTQOr2SdczVhP7b7jYP` · uploaded 15 Nov 16:03 |
| Frozen local copy | `input/tos_voice/ElevenLabs_2026-11-15T15_54_09_Abhilash_S_pvc_s50_sim99_v4.mp3` (spaces and the comma removed from the local name only), read-only, 44,522 bytes, sha256 `3d7143de9756b840…` |
| Voice | **Abhilash S – Fun, Encouraging Friend** (ElevenLabs Voice Library, Professional Voice Clone `pvc`), confirmed by the screenshot |
| Content | **Line 18, exact wording VERIFIED from the ElevenLabs screenshot** (1a), spoken with the `[angry]` emotion tag |
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

### 1a. Line 18 wording: VERIFIED from the ElevenLabs screenshot

Source: the user's screenshot of the ElevenLabs Text-to-Speech settings for this sample (15 Nov). The values were
read from the screenshot and reported by the user; the image itself was not available to me in Drive or in the chat,
so this record rests on the user's reading.

| | |
| --- | --- |
| Approved Line 18 | **എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!** (locked 10 Nov) |
| Input text in ElevenLabs | `[angry] എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!` |
| Emotion tag | `[angry]`: a delivery tag, not spoken and not part of the dialogue or subtitle |
| Wording status | **VERIFIED**: matches the approved line exactly |

My earlier audio checks agree with this. Whisper translates the sample as "Get out of my house!", and its sound
sequence aligns with your recording (DTW cost 0.65 against 0.91 reversed). The sample is now the Line 18 audio for the
Shot 5.7 lip-sync test (section 6).

### 1b. Model and settings: recorded from the screenshot; hidden ones pending

Every later Aadhi, Reflection and Real Aadhi line uses exactly these. Values are as the user read them from the
screenshot; the sliders show approximate values.

| Setting | Value | Status |
| --- | --- | --- |
| Voice | Abhilash S – Fun, Encouraging Friend (Voice Library, PVC) | Recorded (screenshot) |
| Model | **Eleven v4** (explains the `v4` in the file name) | Recorded (screenshot) |
| Stability | ~50 (file name `s50`) | Recorded, approximate (slider) |
| Similarity | ~99 (file name `sim99`) | Recorded, approximate (slider) |
| Clone strength | 0 | Recorded (screenshot) |
| Language | Auto | Recorded (screenshot) |
| Emotion tag (Line 18) | `[angry]` in the input text | Recorded (screenshot) |
| Output format | MP3, 44.1 kHz, 128 kbps (matches the file: MP3, 44.1 kHz, 128 kbps, mono) | Recorded, confirmed by the file |
| Style exaggeration | — | **PENDING**: not visible / not reported |
| Speaker boost | — | **PENDING** |
| Speed | — | **PENDING** |
| Text normalisation | — | **PENDING** |
| Seed | — | **PENDING** (if the model exposes one) |
| Exact slider values (stability, similarity) | — | **PENDING** if you want them exact rather than approximate |

No value above was inferred or invented; a pending setting stays blank until you report it. Language "Auto" means the
model detects Malayalam from the text. Keep it on Auto for every line so all lines are generated the same way.

**Emotion tags for the other lines:** Line 18 uses `[angry]`. Which tags Eleven v4 accepts for the other bands
(calm, frightened, distressed, cold) is not verified here. Each tag is recorded per line only when you use and approve
it; tags are never added to the dialogue or subtitles.

### 1c. Emotional and timing reference: your recording (user decision, 15 Nov)

`L18_Aadhi_Take01.mp3.m4a` (Drive id `15MY1qZ-C7EM5Jp-BjRSqrPRMfoiAv4NV`, local read-only, sha256 `4a52a2659cb0ac98…`;
the duplicate `Poojaveli Thuruthan Kaval Road.m4a` has identical audio) is the **emotional and timing reference**.
Every generated Aadhi or Reflection line is checked against how you perform it.

For Line 18 the generated take is noticeably faster than yours: 1.29 s of speech against your 1.74 s (about 26% shorter).
Your take also reads as the stronger angry shout (earshot z +4.2 against the sample's +2.8). The 5.7 test can use the sample
as it is (the shot is fitted to the take), but your pacing and anger are the target if Line 18 is regenerated.
Regenerating needs your OK; no credits are spent now.

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

**Decision (15 Nov): Aadhi and the Reflection share one voice identity.** This keeps the twist coherent: the
Reflection *is* the real Aadhi, and Line 31 (Real Aadhi) is now the same voice he used behind the glass.

- **Real Aadhi (Line 31, V.O.):** the same voice and settings; delivery flat and numb, audibly the same man as Line 1,
  which it repeats word for word.
- **Reflection (10 lines):** the same voice, model and settings as Aadhi (1b); only the delivery differs: **colder and
  more unsettling.** Settings are not changed per character, so the identity holds. The difference comes from:
  - performance direction in the generation (where your model supports it);
  - pacing (slower, longer pauses), measured against your recorded performances;
  - the mix: drier and closer, with a faint glass early reflection, as already planned for the Reflection track.

  Any settings change for the Reflection needs your OK first.
- **Dr. Thomas:** a separate voice on a separate system: Google Cloud Text-to-Speech, with its own API key stored as a
  network secret for `texttospeech.googleapis.com`. It never uses the ElevenLabs voice or account and never shares
  settings with Aadhi. Always through the phone filter, never lip-synced. Test pending your key.

**Note on the screenplay's performance notes:** they describe the Reflection as "slower, sadder, never aggressive,
exhausted, pleading". The colder delivery below keeps every word and stays non-aggressive. The coldness reads as
drained stillness, which also strengthens the misdirection (the audience reads him as the threat; he is the victim).
Lines 23a–23b keep the scripted panic, the first loss of control, so the break lands against the cold before it.
Tell me if you want those two cold as well.

| ID | Time (plan) | Shot | Lip-sync | Approved Malayalam | English subtitle | Colder delivery (performance only) |
| --- | --- | --- | --- | --- | --- | --- |
| 14 | 2:44.4–2:48.8 | 5.4 | YES | ആദീ... ഇത്തവണയെങ്കിലും നീ എന്നെ കേൾക്കുമോ? | Aadhi... will you listen to me this time, at least? | Hoarse, near-whisper, too even; a beat too long before ആദീ; no rise of pleading in the pitch. |
| 16 | 2:53.4–2:55.4 | 5.6 | YES | നിന്റെ മുഖം... | Your face... | One dry exhale of a laugh, no warmth, then the words flat (the screenplay's tired, broken laugh, emptied). |
| 17a | 2:56.2–2:58.7 | 5.6 | YES | ഏഴ് ദിവസമായി ഞാൻ ഉറങ്ങിയിട്ടില്ല. | I haven't slept in seven days. | Low, level, matter-of-fact; exhaustion stated, not felt; almost monotone. |
| 17b | 2:58.8–3:01.8 | 5.6 | YES | കണ്ണടച്ചാൽ നീ കടന്നു വരുമെന്ന് എനിക്കറിയാം. | I know if I close my eyes, you'll come through. | Quiet certainty, slow, unblinking; the calm is the unsettling part. |
| 19 | 3:05.2–3:07.7 | 5.8 | YES | നിന്റെ കൈയിലേക്കൊന്ന് നോക്ക്, ആദീ. | Look at your hand, Aadhi. | Soft and intimate, almost a whisper; gentleness that unnerves rather than comforts. |
| 21 | 3:12.3–3:15.8 | 5.10 | YES | അല്ല. ഞാനാ എഴുതിയത്. നിനക്ക് വായിക്കാൻ വേണ്ടി. | No. I wrote them. For you to read. | Flat statement, no emphasis on any word; a small pause after അല്ല. |
| 22a | 3:18.1–3:20.4 | 5.11 | No: wide shot, mouth too small (candidate) | ആ തുണിയെടുത്ത് ഈ കണ്ണാടി മൂട്. | Take that cloth and cover this mirror. | Controlled, low, words spaced; an instruction, not a plea. |
| 22b | 3:20.5–3:22.6 | 5.11 (ends 0.6 s into 5.12) | No: wide shot, mouth too small (candidate) | എന്നിട്ട് തിരിച്ച് പോ. ദയവു ചെയ്ത്. | Then go back. Please. | Same control; ദയവു ചെയ്ത് barely voiced; the only crack in the coldness so far. |
| 23a | 3:25.0–3:26.2 | 5.13 | YES | വേണ്ട! ആദീ, അരുത്! | No! Aadhi, don't! | The cold breaks: real panic, shouting for the first time (the screenplay's 'panic, for the first time'). |
| 23b | 3:26.3–3:28.2 | 5.13 (ends 0.2 s into 5.14) | YES | ഇത് പൊട്ടിയാൽ പിന്നെ ആർക്കും തിരിച്ചു വരാൻ പറ്റില്ല! | If this breaks, no one can ever come back! | Panic continues, fast and raw; the contrast with the cold lines before is the point. |

## 6. First lip-sync test: Shot 5.7, Line 18

Uses the approved ElevenLabs voice. The full shot package is `edits/the-other-side/tests/SHOT_5.7_TEST_PACKAGE.md`
(keyframe approved 11 Nov, location pending).

| | |
| --- | --- |
| Audio for lip-sync | the provisional ElevenLabs sample, **Line 18 wording verified from the screenshot** (1a). Your recording stays the timing and emotion reference (1c); regenerating Line 18 to its pacing needs your OK |
| Trim for Kling Lip Sync | 0.00–1.58 s of the file (0.09 s lead-in, the whole speech, 0.2 s after) → a new file, `work/tos/L18_aadhi_lipsync_trim.wav`, made only when you start this step |
| Placement in the film | speech start at 3:02.20 (plan) → file offset 0.09 s at 3:02.11; speech ends ≈3:03.49, inside the 3:02.0–3:05.0 slot, well before Line 19 at 3:05.2 |
| Plan vs take | plan window 3:02.2–3:04.4 (2.2 s); this take speaks for 1.29 s, about 0.9 s shorter. The shot is fitted to the take: the remaining ~1.5 s of 5.7 carries his breathing after the shout, as the Kling prompt already asks. No shot-length change needed |
| Mouth checkpoints | the package's seven; the take's phrase break at 0.65–0.66 s is the likely boundary between വീട്ടീന്ന് and ഇറങ്ങിപ്പോടാ; the പ്പ lip closure falls inside the second phrase, to be found against the picture |
| Order | keyframe location recorded → your OK for Kling credits → `5.7_v1.mp4` → Kling Lip Sync with the trim → `5.7_v1_lipsync.mp4` → my check (±2 frames on the checkpoints) → flip, grade, mix, subtitle → your review |

Nothing in this section is run until you approve each step.

## 7. ElevenLabs licence for this Voice Library voice: NOT verified

I cannot verify your subscription:
- I have no access to your ElevenLabs account.
- elevenlabs.io is blocked from this session's network, so I could not read the official terms either.

What third-party summaries say, unconfirmed against ElevenLabs' own pages:
- Free plans are for non-commercial use only; paid plans (Starter upward) allow commercial use
  ([costbench summary](https://www.costbench.com/software/ai-voice-tools/elevenlabs/free-plan/),
  [licensing guide](https://licenseorg.com/blog/elevenlabs-licensing-guide-ai-voices)).
- Sources disagree on whether output stays licensed after a subscription ends
  ([terms.law](https://terms.law/ai-output-rights/elevenlabs/)).
- Voice Library voices fall under a separate Voice Library addendum, and a voice's creator may set extra terms
  ([licensing guide](https://licenseorg.com/blog/ai-voice-licensing-elevenlabs)). I found no film-specific rule.

To settle it, please check or send:
1. Your current plan name in ElevenLabs (Subscription page).
2. The ElevenLabs Terms of Service and the Voice Library addendum ([elevenlabs.io/terms-of-use](https://elevenlabs.io/terms-of-use)).
3. The **"Abhilash S - Fun, Encouraging Friend"** voice's own page in the Voice Library: any usage restrictions or notice
   period its creator set.
4. That every line used in the film is generated while a paid plan is active.

Until then the voice stays provisional for the film.

## 8. What I need from you to complete the voice setup

Tick each item as you send it. Nothing is generated, regenerated or bought while these are open.

**A. Line 18 wording in the ElevenLabs sample**

- [x] The exact text typed into ElevenLabs for this sample: `[angry] എന്റെ വീട്ടീന്ന് ഇറങ്ങിപ്പോടാ!` (screenshot, 15 Nov)
- [x] Line 18 wording verified (from the screenshot; no separate check by ear needed)

**B. Model and settings of the sample** (the same History item shows them all)

- [x] Model: Eleven v4
- [x] Stability ~50 (exact value pending if wanted)
- [x] Similarity ~99 (exact value pending if wanted)
- [ ] Style exaggeration
- [ ] Speaker boost: on or off
- [ ] Speed
- [x] Language: Auto
- [ ] Text normalisation (pending)
- [ ] Seed, if the model shows one
- [x] Output format: MP3, 44.1 kHz, 128 kbps
- [x] Clone strength: 0

**C. Licence: commercial use in the film** (stays UNRESOLVED until all four are checked)

- [ ] Your current ElevenLabs plan name and status (Subscription page screenshot)
- [ ] Confirmation from ElevenLabs' official Terms of Use and Voice Library terms that your plan allows commercial use
      of Voice Library voices, for example a link or screenshot of the relevant section. Optionally, allow
      `elevenlabs.io` in this environment's network settings so I can read the official pages myself
- [ ] The **"Abhilash S - Fun, Encouraging Friend"** voice's own Voice Library page: any usage restrictions, notice
      period or terms set by its creator
- [ ] Whether every film line will be generated while a paid plan is active

**D. Production decisions still open**

- [ ] Lines 23a–23b (Reflection's panic): keep the scripted panic (current plan) or make them cold as well
- [ ] Whether Line 18 may later be regenerated to match your recording's pacing and anger (1c); credits only on your OK

**E. Dr. Thomas (separate from Aadhi)**

- [ ] A Google Cloud API key with the Text-to-Speech API enabled, added in the claude.ai environment settings as a
      network secret for `texttospeech.googleapis.com` (header `X-Goog-Api-Key`), or tell me to ask for it again
      through the secure form. Never paste the key in chat

**F. Shot 5.7 (first lip-sync test)**

- [ ] The Drive location of the approved 5.7 keyframe (`5.7_key_v1.png` or its actual file name)
- [ ] Later, your explicit OK to spend Kling credits on the 5.7 clip and Lip Sync

