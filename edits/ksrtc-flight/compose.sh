#!/usr/bin/env bash
# Composite a 16:9 animation into the 1080x1920 reel frame with subtitles and narration.
# Usage: compose.sh <anim.mp4> <voice.wav> <subs: "file@start-end,...">  <out.mp4>
#   subs are PNGs from overlays.py (transparent, full 1080x1920), times in seconds.
set -euo pipefail
ANIM=$1 VOICE=$2 SUBS=$3 OUT=$4
OV=/home/user/Reel-edit/work/ksrtc/overlays
inputs=(-loop 1 -i "$OV/frame.png" -i "$ANIM" -loop 1 -i "$OV/cardmask.png" -i "$VOICE")
fc="[1:v]fps=30,scale=1000:563,format=rgba[a];[2:v]format=gray[m];[a][m]alphamerge[card];[0:v][card]overlay=40:600:shortest=1[v0]"
i=4; last=v0
IFS=',' read -ra arr <<< "$SUBS"
for s in "${arr[@]}"; do
  f=${s%@*}; r=${s#*@}; a=${r%-*}; b=${r#*-}
  inputs+=(-loop 1 -i "$OV/$f")
  fc+=";[$last][$i:v]overlay=0:0:enable='between(t,$a,$b)':shortest=1[v$i]"; last=v$i; i=$((i+1))
done
fc+=";[3:a]aresample=48000,loudnorm=I=-14:TP=-1:LRA=11,apad[aud]"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ANIM")
ffmpeg -v error -y "${inputs[@]}" -t "$DUR" -filter_complex "$fc" -map "[$last]" -map "[aud]" -shortest \
  -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 160k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
