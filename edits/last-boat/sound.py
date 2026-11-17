# Sound design for "The Last Boat": water, frogs, drone, lantern creak, drips, whisper air, splash + underwater, birds, stings.
# Reads work/lastboat/timeline.json; writes work/lastboat/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/lastboat"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(23)
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
t = np.arange(N) / SR

# drone (night), off in the morning shots, back for the flashback
drone = .5 * np.sin(2 * np.pi * 49 * t) + .3 * np.sin(2 * np.pi * 73.4 * t + .4 * np.sin(2 * np.pi * .05 * t)) + .3 * lp(rng.standard_normal(N), 120)
lvl = np.interp(t, [0, 2, S[3], S[4], S[6], S[8], S[9], S[10], S[11], S[11] + .6, S[13], S[13] + .5, TOTAL - 1.2, TOTAL],
                   [0, .45, .5, .8, .8, .9, 1.0, .9, .9, 0, 0, .9, .7, 0])
out += drone / np.abs(drone).max() * lvl * .45
# water lapping under every night water shot
lap = lp(rng.standard_normal(N), 500) * (.6 + .4 * np.sin(2 * np.pi * .35 * t) ** 2)
wl = np.interp(t, [0, 1, S[5], S[5] + .3, S[7], S[8], S[9], S[10] + 1.0, S[10] + 1.3, S[11], S[12], S[12] + .3, TOTAL], [0, .8, .8, .3, .3, .8, .8, .8, 0, .5, .5, 0, 0])
out += lap / np.abs(lap).max() * wl * .25
# frogs on the outdoor night shots
def frogs(t0, t1, g):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR
    x = np.zeros(n)
    for k in np.arange(0, t1 - t0, .45):
        o = int((k + .2 * rng.random()) * SR); m = int(.09 * SR); f = 380 + 120 * rng.random()
        if o + m < n: x[o:o + m] += np.sign(np.sin(2 * np.pi * f * tt[:m])) * env(m, .005, .03)
    put(t0, fade(bp(x, 300, 2000), .5, .5), g)
for i in (0, 1, 2, 3, 9): frogs(*shot(i), .07)
# lantern creak as the boat arrives, and on the boat shots
for i in (3, 4, 9):
    a, b = shot(i)
    for k in np.arange(a + .5, b - .4, 1.6):
        n = int(.5 * SR); tt = np.arange(n) / SR; put(k, np.sin(2 * np.pi * (260 + 120 * tt) * tt) * np.sin(np.pi * tt / tt[-1]) * (1 + .5 * np.sign(np.sin(2 * np.pi * 30 * tt))), .06)
# drips on the wet passengers and the empty seat
for i in (5, 6, 8, 14):
    a, b = shot(i)
    for k in np.arange(a + .2, b - .2, .55):
        n = int(.05 * SR); tt = np.arange(n) / SR; put(k + .2 * rng.random(), np.sin(2 * np.pi * (1400 - 6000 * tt) * tt) * env(n, .001, .015), .22)
# ticket paper rustle
n = int(.6 * SR); put(S[7] + .2, hp(rng.standard_normal(n), 2000) * np.sin(np.pi * np.arange(n) / n) * .5, .3)
# stings: "Get in", the child turning, "eleven"
def sting(t0, g, hi=True):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 45 * tt) * np.exp(-tt * 2.5) + .5 * lp(rng.standard_normal(n), 400) * np.exp(-tt * 4)
    if hi: x += .35 * bp(rng.standard_normal(n), 2500, 6000) * np.exp(-tt * 1.8) * (1 + .5 * np.sin(2 * np.pi * 9 * tt))
    put(t0, x / np.abs(x).max(), g)
sting(E[4] - .4, .4, False)
sting(A[8] + 1.5, .5, False)
sting(E[13] - .4, .8)
# splash + underwater rumble (shot 11)
a, b = shot(10); j = A[10] + .9
n = int(1.2 * SR); put(j - .1, lp(rng.standard_normal(n), 3000) * env(n, .005, .25), .9)
n = int((b - j) * SR); put(j, fade(lp(rng.standard_normal(n), 250), .1, .8), .5)
for k in np.arange(j + .2, b - .5, .3):
    m = int(.08 * SR); tt = np.arange(m) / SR; put(k + .1 * rng.random(), np.sin(2 * np.pi * (300 + 900 * tt / tt[-1]) * tt) * env(m, .005, .03), .2)
# morning birds (shots 12-13)
for i in (11, 12):
    a, b = shot(i)
    for k in np.arange(a + .4, b - .5, .8):
        m = int(.12 * SR); tt = np.arange(m) / SR; f = 3000 + 1000 * rng.random()
        put(k + .3 * rng.random(), np.sin(2 * np.pi * (f + 1500 * tt) * tt) * env(m, .005, .04), .14)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
