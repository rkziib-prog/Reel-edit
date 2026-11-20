# Sound for the FASTag explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/fastag/timeline.json; writes work/fastag/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/fastag"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(5)
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
t = np.arange(N) / SR

# music bed: 100 bpm, soft plucked arpeggio over C - G - Am - F, light kick on beats 1 and 3
BEAT = .6; CH = [[261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]]
k = 0
for b in np.arange(0, TOTAL - 1.5, BEAT / 2):
    chord = CH[int(b // (BEAT * 4)) % 4]; f = chord[k % 3] * (2 if k % 6 >= 3 else 1); k += 1
    n = int(.4 * SR); tt = np.arange(n) / SR
    put(b, (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 9), .09)
for b in np.arange(0, TOTAL - 1.5, BEAT * 2):
    n = int(.25 * SR); tt = np.arange(n) / SR; put(b, np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14), .25)
fade = np.interp(t, [0, 1, TOTAL - 2, TOTAL - .5], [0, 1, 1, 0]); out *= fade
# UI sounds
def pop(t0, g=.35, f=900):
    n = int(.09 * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * (f + 900 * tt / tt[-1]) * tt) * env(n, .002, .03), g)
def whoosh(t0, d, g):
    n = int(d * SR); x = bp(rng.standard_normal(n), 600, 4000) * np.sin(np.pi * np.arange(n) / n) ** 2; put(t0, x / np.abs(x).max(), g)
def beep(t0, f, d=.12, g=.25): n = int(d * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * f * tt) * env(n, .003, d * .5), g)
whoosh(S[0] + .5, 1.6, .3)                                        # car through the lane
pop(A[0] + 2.0, .3, 600)                                          # "?"
whoosh(S[1] + 1.4, 1.2, .25); pop(S[1] + 3.0)                     # zoom to the sticker + label
for d in (1.0, 1.6): pop(A[2] + d)
beep(A[2] + 2.8, 220, .3, .2)                                     # battery crossed
for k2 in np.arange(S[3] + .3, S[5], .9): beep(k2, 1500, .06, .08)  # reader pulses
pop(A[3] + .8)
n = int(.8 * SR); tt = np.arange(n) / SR; put(A[4] + 1.8, np.sin(2 * np.pi * (500 + 1200 * tt) * tt) * env(n, .02, .3), .2)   # chip wakes
pop(A[4] + 2.2)
beep(A[5] + .4, 1800, .08, .2); beep(A[5] + 1.6, 2400, .1, .2); pop(E[5] - 2.2)
for d in (.2, 1.3, 2.6): pop(A[6] + d)
pop(A[7] + 1.0); pop(A[7] + 3.4)
for d in (.3, .5, .7): beep(A[8] + d, 1200, .05, .15)            # balance ticking down
n = int(.7 * SR); put(A[8] + 1.1, bp(rng.standard_normal(n), 200, 1200) * np.sin(np.pi * np.arange(n) / n), .25)   # barrier motor
pop(A[8] + 2.6)
for k2 in np.arange(A[9] + 1.0, A[9] + 2.2, .15): beep(k2, 2000, .03, .06)
beep(E[9] - 1.0, 1320, .12, .2); beep(E[9] - .88, 1760, .16, .2)  # matched
for d in (0, .12): beep(A[10] + 1.0 + d, 1318.5 if not d else 1760, .2, .25)   # SMS
beep(E[11] - 1.2, 330, .35, .3); beep(E[11] - .85, 262, .45, .3)  # blacklisted
n = int(.3 * SR); put(E[12] - 2.0, lp(rng.standard_normal(n), 600) * env(n, .002, .06), .6)   # stamp
for d in (.6, 1.6, 3.0): beep(A[13] + d, 1046.5, .1, .2); beep(A[13] + d + .08, 1568, .14, .2)
beep(E[14] - 1.0, 880, .1, .25); beep(E[14] - .9, 1320, .15, .25)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
