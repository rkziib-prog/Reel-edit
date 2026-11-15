#!/bin/sh
# Local fix for p5.brush 2.2.3 (re-run after npm install): with pixelDensity < 1 a mask's composite rect can come out
# empty/negative, and new OffscreenCanvas(c, l) throws "Value is not of type 'unsigned long'". Clamp it to >= 1.
F=node_modules/p5.brush/dist/p5.brush.js
grep -q 'c=Math.max(1,Math.round(a.maxX-a.minX)||1)' "$F" && { echo "already patched"; exit 0; }
sed -i 's/c=a.maxX-a.minX,l=a.maxY-a.minY;Kr&&/c=Math.max(1,Math.round(a.maxX-a.minX)||1),l=Math.max(1,Math.round(a.maxY-a.minY)||1);Kr\&\&/' "$F"
grep -q 'c=Math.max(1,Math.round(a.maxX-a.minX)||1)' "$F" && echo patched || { echo "patch FAILED"; exit 1; }
