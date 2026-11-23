#!/usr/bin/env bash
# Full-screen reel compositor: 1080x1920 animation + subtitle PNGs + audio. Usage: compose_full.sh <anim.mp4> <audio.wav> <subdir> <"sub_01.png@a-b,..."> <out.mp4>
set -euo pipefail
ANIM=$1 AUDIO=$2 SD=$3 SUBS=$4 OUT=$5
inputs=(-i "$ANIM" -i "$AUDIO"); fc="[0:v]fps=30,scale=1080:1920,format=yuv420p[v0]"; i=2; last=v0
IFS=',' read -ra arr <<< "$SUBS"
for s in "${arr[@]}"; do f=${s%@*}; r=${s#*@}; a=${r%-*}; b=${r#*-}; inputs+=(-loop 1 -i "$SD/$f")
  fc+=";[$last][$i:v]overlay=0:0:enable='between(t,$a,$b)':shortest=1[v$i]"; last=v$i; i=$((i+1)); done
fc+=";[1:a]aresample=48000,loudnorm=I=-14:TP=-1:LRA=11[aud]"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ANIM")
ffmpeg -v error -y "${inputs[@]}" -t "$DUR" -filter_complex "$fc" -map "[$last]" -map "[aud]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 160k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
