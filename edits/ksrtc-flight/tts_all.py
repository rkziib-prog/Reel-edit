# Narration for every line of spoken.txt with Meta MMS Malayalam TTS -> <outdir>/line_NN.wav; prints durations.
import sys, pathlib, torch, scipy.io.wavfile as w
from transformers import VitsModel, AutoTokenizer
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
tok = AutoTokenizer.from_pretrained("facebook/mms-tts-mal"); m = VitsModel.from_pretrained("facebook/mms-tts-mal")
m.speaking_rate = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
lines = [l.strip() for l in open(pathlib.Path(__file__).parent / "spoken.txt", encoding="utf-8") if l.strip()]
for i, text in enumerate(lines, 1):
    torch.manual_seed(i)
    with torch.no_grad(): a = m(**tok(text, return_tensors="pt")).waveform[0].numpy()
    w.write(out / f"line_{i:02d}.wav", m.config.sampling_rate, a)
    print(i, round(len(a) / m.config.sampling_rate, 2))
