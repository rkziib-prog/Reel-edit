# Sound for "Hairpin 9": rain, bike engine, drone, wind, frost, lorry horn + brakes, stones, dawn birds and kettle, stings.
# Reads work/hairpin9/timeline.json; writes work/hairpin9/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/hairpin9"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(31)
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
DAWN0, DAWN1 = S[11], S[13]

# rain everywhere except the dawn tea stall
rain = bp(rng.standard_normal(N), 1500, 9000) * .6 + lp(rng.standard_normal(N), 400) * .4
rl = np.interp(t, [0, 1, DAWN0 - .3, DAWN0, DAWN1, DAWN1 + .5, TOTAL - 1, TOTAL], [0, 1, 1, 0, 0, .9, .9, 0])
out += rain / np.abs(rain).max() * rl * .28
# drone
drone = .5 * np.sin(2 * np.pi * 52 * t) + .3 * np.sin(2 * np.pi * 77.8 * t + .3 * np.sin(2 * np.pi * .06 * t)) + .3 * lp(rng.standard_normal(N), 130)
dl = np.interp(t, [0, 2, S[4], S[5], S[6], S[8], S[9], S[10], S[11], DAWN0 + .3, DAWN1, DAWN1 + .5, TOTAL - 1, TOTAL], [0, .4, .5, .7, .9, .9, .5, .8, .6, 0, 0, .6, .6, 0])
out += drone / np.abs(drone).max() * dl * .42
# bike engine: putter while riding (shots 2, 5, 9), idle in shot 4, off after the stop
def engine(t0, t1, f, g):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * f * tt)) * .4 + np.sin(2 * np.pi * f * .5 * tt) * .6
    put(t0, fade(lp(x, 500) * (1 + .2 * np.sin(2 * np.pi * 9 * tt)), .3, .3), g)
engine(*shot(1), 38, .16); engine(S[2], S[2] + 2.5, 36, .14); engine(*shot(3), 18, .08); engine(*shot(4), 38, .16)
engine(S[8], A[8] + 2.2, 40, .18)
# frost on the shoulder (shot 7)
n = int(1.2 * SR); put(A[6] + 1.5, hp(rng.standard_normal(n), 5000) * np.sin(np.pi * np.arange(n) / n) * .6, .3)
# stings: the hand, the man's name, the final wave
def sting(t0, g, hi=True):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 45 * tt) * np.exp(-tt * 2.5) + .5 * lp(rng.standard_normal(n), 400) * np.exp(-tt * 4)
    if hi: x += .35 * bp(rng.standard_normal(n), 2500, 6000) * np.exp(-tt * 1.8) * (1 + .5 * np.sin(2 * np.pi * 9 * tt))
    put(t0, x / np.abs(x).max(), g)
sting(A[6] + .6, .55); sting(A[12] + 2.3, .45, False); sting(E[14] - 1.0, .4, False)
# lorry: horn + brakes skid (shot 9)
n = int(1.6 * SR); tt = np.arange(n) / SR
horn = (np.sign(np.sin(2 * np.pi * 330 * tt)) + np.sign(np.sin(2 * np.pi * 415 * tt))) * np.minimum(1, tt / .05) * np.minimum(1, (tt[-1] - tt) / .2)
put(A[8] + .8, lp(horn, 2500) * .5, .45)
n = int(1.4 * SR); put(A[8] + 2.2, bp(rng.standard_normal(n), 1500, 5000) * np.exp(-np.arange(n) / SR * 1.8) * (1 + .4 * np.sin(2 * np.pi * 40 * np.arange(n) / SR)), .45)
n = int(2.4 * SR); put(A[8] + .2, fade(lp(rng.standard_normal(n), 200) * np.linspace(.2, 1, n), .2, .3), .5)
# stones falling (shot 10)
a, b = shot(9)
for k in np.arange(a + .4, b - .3, .55): m = int(.06 * SR); put(k + .2 * rng.random(), bp(rng.standard_normal(m), 800, 4000) * env(m, .001, .015), .25)
# dawn: birds and the tea kettle (shots 12-13)
for k in np.arange(DAWN0 + .4, DAWN1 - .4, .75):
    m = int(.12 * SR); tt = np.arange(m) / SR; f = 3000 + 1000 * rng.random(); put(k + .3 * rng.random(), np.sin(2 * np.pi * (f + 1500 * tt) * tt) * env(m, .005, .04), .13)
n = int((DAWN1 - DAWN0) * SR); put(DAWN0, fade(bp(rng.standard_normal(n), 2500, 6000) * .3, .5, .5), .12)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
