# Builds the KSRTC reel's audio: narration placed on the timeline + synthesized sound effects.
# Writes work/ksrtc/voice_track.wav and work/ksrtc/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
W = "/home/user/Reel-edit/work/ksrtc"
tl = json.load(open(f"{W}/timeline.json"))
TOTAL = tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
S = [0, 5.074, 10.58, 15.846, 19.88, 24.458, 28.556, 31.71, 36.272, 39.954, 44.564, 48.79, 55.864, 59.706]  # shot starts (KT.shots)

# ---------- narration ----------
voice = np.zeros(N)
for i, st in enumerate(tl["starts"], 1):
    sr, a = wf.read(f"{W}/voice/line_{i:02d}.wav")
    a = resample_poly(a.astype(np.float64), SR, sr)
    o = int((st + tl["lead"]) * SR); voice[o:o + len(a)] += a[:N - o]
voice /= np.abs(voice).max() + 1e-9
wf.write(f"{W}/voice_track.wav", SR, (voice * .9).astype(np.float32))

# ---------- sound effects ----------
sfx = np.zeros(N)
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)
def put(t, x, g=1.0):
    o = int(t * SR); x = x[:max(0, N - o)]; sfx[o:o + len(x)] += g * x
def env(n, a=.01, r=.2):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)); return e * np.exp(-np.maximum(0, t - a) / r)
def fade(x, fi=.05, fo=.1):
    n = len(x); ii = np.arange(n); return x * np.minimum(1, ii / (fi * SR + 1)) * np.minimum(1, (n - ii) / (fo * SR + 1))

# engine: low rumble with a firing-rate tone; pitch follows the story's speed
def engine(t0, t1, f0, f1, g):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR; f = np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sign(np.sin(ph)) * .3 + np.sin(ph * .5) * .5 + np.sin(ph * 2) * .15
    x = lp(tone, 400) + lp(rng.standard_normal(n), 180) * .6
    x *= 1 + .15 * np.sin(2 * np.pi * 7 * t)
    put(t0, fade(x / np.abs(x).max(), .3, .4), g)
engine(0, S[3], 32, 40, .22)
engine(S[3], S[4], 40, 78, .3)              # speedometer climbs
engine(S[4], S[5] + 2.0, 70, 74, .25)
# whooshes (bus passing / crossing / descending / leaving)
def whoosh(t0, d, f0, f1, g):
    n = int(d * SR); x = rng.standard_normal(n); c = np.linspace(f0, f1, n); out = np.zeros(n)
    for k in range(0, n, 2400):
        seg = slice(k, min(n, k + 2400)); fc = c[k]; out[seg] = bp(x, fc * .7, min(fc * 1.4, 20000))[seg]
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    put(t0, out * e / (np.abs(out).max() + 1e-9), g)
whoosh(0.2, 1.4, 300, 1800, .5)
whoosh(S[8] + .6, 2.6, 400, 2200, .35)
whoosh(S[10], 2.4, 1800, 400, .4)
whoosh(S[13] + .2, 2.8, 1500, 3000, .3)
# thuds
def thud(t, g, f=60):
    n = int(.5 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt * (1 - .4 * tt)) * env(n, .003, .12) + lp(rng.standard_normal(n), 900) * env(n, .001, .05) * .6
    put(t, x, g)
thud(S[1] + 3.95, .35, 90)            # hero lands on the step
thud(S[5] + 2.0, .9, 55)              # speed bump
thud(S[10] + 2.4, .8, 50)             # landing
put(S[10] + 2.45, lp(rng.standard_normal(int(1.0 * SR)), 2500) * env(int(1.0 * SR), .02, .3), .25)   # skid
# wind while flying
n = int((S[10] + 2.4 - (S[5] + 2.0)) * SR); wind = bp(rng.standard_normal(n), 250, 1400)
tt = np.arange(n) / SR; wind *= .6 + .4 * np.sin(2 * np.pi * .3 * tt) ** 2
gate = np.ones(n); a, b = int((S[7] - S[5] - 2.0) * SR), int((S[8] - S[5] - 2.0) * SR); gate[a:b] = .35   # quieter inside (conductor)
put(S[5] + 2.0, fade(wind * gate / np.abs(wind).max(), .4, .3), .22)
# wing flaps (shot 8)
for k in range(5): put(S[6] + .8 + k * .785, lp(rng.standard_normal(int(.18 * SR)), 500) * env(int(.18 * SR), .02, .06), .5)
# ticket punch, camera shutters
def click(t, g, f=3500): n = int(.06 * SR); put(t, hp(rng.standard_normal(n), f) * env(n, .001, .012), g)
click(S[7] + 1.0, .6); click(S[7] + 1.03, .4, 2000)
for t in (S[9] + 2.1, S[9] + 3.45): click(t, .5, 2500); click(t + .07, .4, 1800)
# crow caws
def caw(t, g):
    for k in range(2):
        n = int(.22 * SR); tt = np.arange(n) / SR; f = 520 - 120 * tt / .22
        x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)); x = bp(x, 700, 2600) * env(n, .02, .1)
        put(t + k * .3, x / (np.abs(x).max() + 1e-9), g)
caw(S[6] + 2.4, .3); caw(S[9] + 3.25, .35)
# glass crack (speedometer)
n = int(.4 * SR); cr = hp(rng.standard_normal(n), 3000) * env(n, .001, .05)
for k in range(6): o = int(rng.uniform(0, .25) * SR); cr[o:o + 300] += hp(rng.standard_normal(300), 5000) * .8
put(S[3] + 3.0, cr / np.abs(cr).max(), .55)
# fish slap
n = int(.15 * SR); put(S[4] + 2.8, lp(rng.standard_normal(n), 1500) * env(n, .001, .03), .7)
# bells for the clocks
def bell(t, g, f=1320):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    put(t, (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 3)) * np.exp(-tt * 2.2), g)
bell(S[1] + .2, .18, 1175); bell(S[11] + .3, .2, 1320); bell(S[11] + .9, .15, 1320)
# question-mark "boing" (shot 1)
n = int(.35 * SR); tt = np.arange(n) / SR; put(S[0] + 2.4, np.sin(2 * np.pi * (300 + 500 * tt) * tt) * env(n, .005, .12), .25)
# sad trombone (shot 15)
for k, (f, d) in enumerate([(392, .32), (370, .32), (349, .32), (330, .9)]):
    n = int(d * SR); tt = np.arange(n) / SR; vib = 1 + (.012 * np.sin(2 * np.pi * 6 * tt) if k == 3 else 0)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f * vib * np.ones(n)) / SR)) * .5 + np.sin(2 * np.pi * f * tt)
    put(S[13] + 2.9 + k * .34, lp(x, 1400) * env(n, .03, d * .6), .28)
sfx /= np.abs(sfx).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (sfx * .9).astype(np.float32))
print("voice + sfx written, total", TOTAL)
