# Sound for the Dhoni biography: a soft synthesized music pad + SFX (train, birds, crowd, bat, stumps, fireworks, phone).
# Reads work/dhoni/timeline.json; writes work/dhoni/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/dhoni"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
out = np.zeros(N)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'highpass', fs=SR, output='sos'), x)
def put(t, x, g=1.0):
    o = int(t * SR)
    if o >= N or o < 0: return
    x = x[:N - o]; out[o:o + len(x)] += g * x
def env(n, a=.01, r=.2):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)
def fade(x, fi, fo):
    n = len(x); i = np.arange(n); return x * np.minimum(1, i / (fi * SR + 1)) * np.minimum(1, (n - i) / (fo * SR + 1))
def shot(i): return S[i], (S[i + 1] if i + 1 < len(S) else TOTAL)
t = np.arange(N) / SR

# music pad: C - Am - F - G, 4 s per chord, soft sines with slow attack; swells for the big moments
CH = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]]
pad = np.zeros(N)
for k, st in enumerate(np.arange(0, TOTAL, 4.0)):
    n = int(4.4 * SR); tt = np.arange(n) / SR; x = np.zeros(n)
    for f in CH[k % 4]: x += np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f / 2 * tt)
    x *= np.minimum(1, tt / 1.2) * np.minimum(1, (tt[-1] - tt) / 1.0)
    o = int(st * SR); m = min(n, N - o); pad[o:o + m] += x[:m]
lvl = np.interp(t, [0, 3, S[5], S[5] + 1, S[7], S[9] + 1, S[10], S[12], S[12] + 1, S[13], S[14], TOTAL - 1.2, TOTAL],
                   [0, .5, .5, .3, .7, 1.0, .9, .9, .35, .5, .9, .9, 0])
out += lp(pad, 2000) / np.abs(pad).max() * lvl * .5

# train clatter (shots 1, 4)
for i, g in ((0, .35), (3, .2)):
    a, b = shot(i)
    for k in np.arange(a + .1, b, .42):
        n = int(.09 * SR); put(k, lp(rng.standard_normal(n), 900) * env(n, .002, .03), g)
    n = int((b - a) * SR); put(a, fade(lp(rng.standard_normal(n), 300), .3, .3), g * .6)
# birds (shots 2, 3)
for i in (1, 2):
    a, b = shot(i)
    for k in np.arange(a + .3, b - .3, .7):
        m = int(.12 * SR); tt = np.arange(m) / SR; f = 3000 + 1000 * rng.random()
        put(k + .3 * rng.random(), np.sin(2 * np.pi * (f + 1500 * tt) * tt) * env(m, .005, .04), .12)
# crowd bed with roars
def crowd(t0, t1, g, roars=()):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 300, 2500) * (.5 + .15 * np.sin(2 * np.pi * .4 * tt))
    for r in roars: x *= 1 + 2.5 * np.exp(-((tt - (r - t0)) / .9) ** 2) * (tt > r - t0 - .3)
    put(t0, fade(x / np.abs(x).max(), .4, .4), g)
def crack(t0, g=.8): n = int(.12 * SR); put(t0, (hp(rng.standard_normal(n), 1500) + .6 * np.sin(2 * np.pi * 900 * np.arange(n) / SR)) * env(n, .001, .02), g)
def clatter(t0, g=.6):
    for k in range(3): n = int(.05 * SR); put(t0 + k * .05, hp(rng.standard_normal(n), 2500) * env(n, .001, .01), g)
crowd(*shot(5), .25); clatter(A[5] + 3.6 - (A[5] - S[5]) + (A[5] - S[5]), .6)
crowd(*shot(6), .3, [S[6] + (A[6] - S[6]) + 3.0]); [crack(A[6] + d) for d in (.6, 1.8, 3.0)]
crowd(*shot(7), .3, [A[7] + 3.8]); crowd(*shot(8), .3)
crowd(*shot(9), .35, [A[9] + .9]); crack(A[9] + .5, 1.0)
for i in range(5):
    tt0 = A[9] + .8 + i * .35; n = int(.6 * SR); put(tt0, lp(rng.standard_normal(n), 1200) * env(n, .002, .12), .45)
crowd(*shot(11), .35, [E[11] - .3]); crowd(*shot(12), .22)
clatter(A[12] + 3.2, .7)
# trophy shimmers (shot 11)
for d in (.3, .9, 1.6):
    n = int(1.2 * SR); tt = np.arange(n) / SR; put(A[10] + d, (np.sin(2 * np.pi * 1568 * tt) + .5 * np.sin(2 * np.pi * 2349 * tt)) * np.exp(-tt * 3), .12)
# phone notification (shot 14)
for k, f in enumerate((1318.5, 1760.0)):
    n = int(.25 * SR); tt = np.arange(n) / SR; put(A[13] + 2.0 + k * .12, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9), .3)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
