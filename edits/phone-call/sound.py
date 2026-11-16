# Sound design for "The 2 AM Call": synthesized drone, crickets, clock ticks, phone bell, breathing, knocks, chair, sting.
# Reads work/phonecall/timeline.json; writes work/phonecall/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/phonecall"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(11)
out = np.zeros(N)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'highpass', fs=SR, output='sos'), x)
def put(t, x, g=1.0):
    o = int(t * SR)
    if o >= N: return
    x = x[:N - o]; out[o:o + len(x)] += g * x
def env(n, a=.01, r=.2):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)
def fade(x, fi, fo):
    n = len(x); i = np.arange(n); return x * np.minimum(1, i / (fi * SR + 1)) * np.minimum(1, (n - i) / (fo * SR + 1))
def shot(i): return S[i], (S[i + 1] if i + 1 < len(S) else TOTAL)

# drone: low sines + dark noise, louder in the tense middle, gone in the morning attic
t = np.arange(N) / SR
drone = .5 * np.sin(2 * np.pi * 55 * t) + .3 * np.sin(2 * np.pi * 82.4 * t + .3 * np.sin(2 * np.pi * .07 * t)) + .25 * lp(rng.standard_normal(N), 140)
lvl = np.interp(t, [0, 2, S[4], S[5], S[6], S[7], S[11], S[12], S[12] + .8, S[13], S[14], TOTAL - 1.2, TOTAL],
                   [0, .5, .6, .8, 1.0, .7, .9, .9, 0, .9, .7, .7, 0])
out += drone / np.abs(drone).max() * lvl * .5

# crickets on the outdoor shots
def crickets(t0, t1, g):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR
    chirp = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > .2) * (np.sin(2 * np.pi * 1.6 * tt) > -.2)
    chirp2 = np.sin(2 * np.pi * 5100 * tt) * (np.sin(2 * np.pi * 31 * tt + 1) > .3) * (np.sin(2 * np.pi * 1.1 * tt + 2) > 0)
    put(t0, fade(chirp * .5 + chirp2 * .35, .4, .4), g)
for i in (1, 8, 9): crickets(*shot(i), .12)

# clock ticks
def tick(t0, g=.35): n = int(.03 * SR); put(t0, hp(rng.standard_normal(n), 2500) * env(n, .001, .006), g)
for i in (0, 2, 10, 11, 14):
    a, b = shot(i)
    for k in np.arange(a + .3, b, 1.0): tick(k, .18)
tick(A[2] + .35, .6); tick(E[14] + .2, .7)

# old phone bell: two detuned bells, hammered at 20 Hz
def bell(t0, d, g):
    n = int(d * SR); tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 1180 * tt) + .8 * np.sin(2 * np.pi * 1420 * tt) + .3 * np.sin(2 * np.pi * 2900 * tt)) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 20 * tt)))
    put(t0, fade(x / 2.1, .01, .08), g)
def rings(t0, t1, g):
    k = t0
    while k < t1 - .3: bell(k, min(1.1, t1 - k), g); k += 1.6
bell(S[1] - .9, .55, .32)                               # shot 1 tease
rings(A[2] + 1.2, S[3], .42)                            # shot 3
bell(E[14] + .5, 1.0, .5)                               # shot 15: one last ring

# pick-up click and breathing (shot 5)
n = int(.08 * SR); put(S[4] + .1, lp(rng.standard_normal(n), 3000) * env(n, .001, .02), .6)
for k in range(2):
    n = int(1.3 * SR); br = bp(rng.standard_normal(n), 300, 1800) * np.sin(np.pi * np.arange(n) / n) ** 2
    put(A[4] + 1.0 + k * 1.4, br / np.abs(br).max(), .28)

# a hit when the reflection smiles (shot 7) and on the smash cut (shot 14)
def sting(t0, g, hi=True):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 45 * tt) * np.exp(-tt * 2.5) + .5 * lp(rng.standard_normal(n), 400) * np.exp(-tt * 4)
    if hi: x += .35 * bp(rng.standard_normal(n), 2500, 6000) * np.exp(-tt * 1.8) * (1 + .5 * np.sin(2 * np.pi * 9 * tt))
    put(t0, x / np.abs(x).max(), g)
sting(A[6] + 1.2, .5, False)
sting(E[13] - .55, .85)

# knocks (shot 8): wood thumps
for k in (.2, .75, 1.3):
    n = int(.35 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 95 * tt) * env(n, .002, .06) + .6 * bp(rng.standard_normal(n), 300, 1500) * env(n, .001, .025)
    put(E[7] + k, x / np.abs(x).max(), .9)

# chair scrape (shot 12)
n = int(1.0 * SR); tt = np.arange(n) / SR
sc = bp(rng.standard_normal(n), 600, 2600) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 13 * tt))) * np.sin(np.pi * tt / tt[-1])
put(A[11] + .4, sc / np.abs(sc).max(), .45)

# receiver creak (shot 11)
a, b = shot(10)
for k in np.arange(a + .3, b - .3, 1.43):
    n = int(.4 * SR); tt = np.arange(n) / SR; put(k, np.sin(2 * np.pi * (300 + 90 * tt) * tt) * np.sin(np.pi * tt / tt[-1]) * .3, .25)

# morning: birds (shot 13)
a, b = shot(12)
for k in np.arange(a + .4, b - .5, .9):
    n = int(.12 * SR); tt = np.arange(n) / SR; f = 3200 + 900 * rng.random()
    put(k + .3 * rng.random(), np.sin(2 * np.pi * (f + 1500 * tt) * tt) * env(n, .005, .04), .16)

out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
