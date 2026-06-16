# Gallery Media

Drop **images and videos** into this folder — they appear in the gallery slider
automatically.

- **Images:** `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif` — shown with a big
  index number (no caption).
- **Videos:** `.mp4` `.webm` `.mov` — autoplay inline, loop, no controls; click
  a video to pause / play.

Order is controlled by file name (numeric, ascending): `1-nova.mp4`, `01.1.jpg`, …
A leading number prefix is stripped from the video name shown as the title.

## ⚠️ Keep videos small (web-optimized)

GitHub rejects files over 100 MB. Compress videos before adding them
(720p H.264 is plenty for the web — the clips here are ~1–7 MB each).

Example using ffmpeg:

```
ffmpeg -i big-input.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset veryfast \
  -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart out.mp4
```
