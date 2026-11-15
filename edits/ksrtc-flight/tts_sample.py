# Malayalam TTS sample with Meta MMS (facebook/mms-tts-mal). Usage: python3 tts_sample.py <out.wav> <text...>
import sys, torch, scipy.io.wavfile as w
from transformers import VitsModel, AutoTokenizer
tok = AutoTokenizer.from_pretrained("facebook/mms-tts-mal"); m = VitsModel.from_pretrained("facebook/mms-tts-mal")
print("uroman needed:", getattr(tok, "is_uroman", None))
text = " ".join(sys.argv[2:]); ids = tok(text, return_tensors="pt")
torch.manual_seed(0)
with torch.no_grad(): a = m(**ids).waveform[0].numpy()
w.write(sys.argv[1], m.config.sampling_rate, a); print(len(a) / m.config.sampling_rate, "s")
