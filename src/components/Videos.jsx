import { useRef, useState } from 'react';
import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { formatTime } from '../format.js';

const VIDEOS = [
  {
    id: 'lenslady-x-vark',
    title: 'Lenslady x VARK',
    subtitle: 'BOUND4LOVE music video OUT NOW !',
    src: '/videos/lenslady-x-vark.mp4',
  },
];

/** Music Videos section styled as Windows Media Player 6.4 (omitted from bottom taskbar). */
export default function Videos() {
  const video = VIDEOS[0];
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setTime(0);
    setPlaying(false);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const onVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setMuted(val === 0);
  };

  const fullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <Window
      id="videos"
      title={`${video.title} - Windows Media Player`}
      icon="speaker"
      className="wmp-win"
      menu={['File', 'View', 'Play', 'Favorites', 'Go', 'Help']}
      statusBar={[playing ? 'Playing' : time > 0 ? 'Paused' : 'Ready', `${formatTime(time)} / ${formatTime(duration)}`]}
    >
      <div className="wmp-screen field-border" onClick={togglePlay}>
        <video
          ref={videoRef}
          preload="metadata"
          playsInline
          src={video.src}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      </div>

      <div className="wmp-controls">
        <input
          className="wmp-seek"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={time}
          onChange={(e) => {
            const t = Number(e.target.value);
            if (videoRef.current) videoRef.current.currentTime = t;
            setTime(t);
          }}
          aria-label="Video seek"
        />

        <div className="wmp-bar">
          <div className="wmp-transport">
            <button className={`icon-btn ${playing ? 'pressed' : ''}`} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'}>
              <Icon name={playing ? 'pause' : 'play'} />
            </button>
            <button className="icon-btn" onClick={stop} aria-label="Stop" title="Stop">
              <Icon name="stop" />
            </button>
          </div>

          <div className="wmp-lcd field-border">
            <span className="wmp-lcd-title">
              {video.title} — {video.subtitle}
            </span>
            <span className="wmp-lcd-time">
              {formatTime(time)} / {formatTime(duration)}
            </span>
          </div>

          <div className="wmp-vol-wrap">
            <button className={`icon-btn ${muted ? 'pressed' : ''}`} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} title={muted ? 'Unmute' : 'Mute'}>
              <Icon name="speaker" />
            </button>
            <input
              className="wmp-vol"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={onVolume}
              aria-label="Volume"
            />
            <button className="wmp-fs-btn" onClick={fullscreen} title="Full Screen" aria-label="Full Screen">
              [ ]
            </button>
          </div>
        </div>
      </div>
    </Window>
  );
}
