// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
const PROJECT = { w: 1080, h: 1920, duration: 41.14, bpm: 110, offset: 0, density: .5 };   // duration = KT.total (ksrtc_times.js); density: local patch (see core.js)
