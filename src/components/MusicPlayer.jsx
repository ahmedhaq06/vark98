import { useEffect, useRef, useState } from 'react';
import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { tracks } from '../data/tracks.js';
import { formatTime } from '../format.js';

/**
 * Music player, layout based on the client's "Spotify 98" reference.
 * Functional placeholder — final styling will be swapped for the client's design.
 */
export default function MusicPlayer() {
  const audio = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState({});
  const [showQueue, setShowQueue] = useState(true);

  const track = tracks[index];
  const empty = tracks.length === 0;

  useEffect(() => {
    const a = audio.current;
    if (!a || !track) return;
    a.src = track.src;
    if (playing) a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const toggle = () => {
    const a = audio.current;
    if (!a || empty) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (!a.src) a.src = track.src;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const step = (dir) => {
    if (empty) return;
    if (shuffle && tracks.length > 1) {
      let n;
      do n = Math.floor(Math.random() * tracks.length);
      while (n === index);
      setIndex(n);
    } else {
      setIndex((i) => (i + dir + tracks.length) % tracks.length);
    }
  };

  const onEnded = () => {
    if (repeat) {
      audio.current.currentTime = 0;
      audio.current.play();
    } else if (index < tracks.length - 1 || shuffle) step(1);
    else setPlaying(false);
  };

  const playAt = (i) => {
    setIndex(i);
    setPlaying(true);
    if (i === index) audio.current?.play();
  };

  return (
    <div id="music" className="win-group music">
      <Window title={`${track ? track.title : 'VARK'} - Player`} icon="note" className="player" closable={false} maximizable={false}>
        <audio
          ref={audio}
          preload="metadata"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onEnded}
        />
        <div className="player-art field-border">
          {track?.cover ? <img src={track.cover} alt={`${track.title} cover`} /> : <Icon name="cd" scale={5} />}
        </div>

        <div className="player-meta">
          <div className="player-title" title={track?.title}>
            {empty ? 'No tracks loaded yet' : track.title}
          </div>
          <button
            className={`player-like ${liked[track?.id] ? 'on' : ''}`}
            onClick={() => track && setLiked((l) => ({ ...l, [track.id]: !l[track.id] }))}
            aria-label="Like"
            disabled={empty}
          >
            <Icon name={liked[track?.id] ? 'heart' : 'heartOff'} />
          </button>
        </div>

        <input
          className="player-seek"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={time}
          disabled={empty}
          onChange={(e) => {
            audio.current.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          aria-label="Seek"
        />
        <div className="player-times">
          <span>{formatTime(time)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="player-controls">
          <button className={`icon-btn ${shuffle ? 'pressed' : ''}`} onClick={() => setShuffle((s) => !s)} aria-label="Shuffle">
            <Icon name="shuffle" />
          </button>
          <div className="player-transport">
            <button className="icon-btn" onClick={() => step(-1)} disabled={empty} aria-label="Previous">
              <Icon name="prev" />
            </button>
            <button className="icon-btn play" onClick={toggle} disabled={empty} aria-label={playing ? 'Pause' : 'Play'}>
              <Icon name={playing ? 'pause' : 'play'} scale={playing ? 1 : 1} />
            </button>
            <button className="icon-btn" onClick={() => step(1)} disabled={empty} aria-label="Next">
              <Icon name="next" />
            </button>
          </div>
          <button className={`icon-btn ${repeat ? 'pressed' : ''}`} onClick={() => setRepeat((r) => !r)} aria-label="Repeat">
            <Icon name="repeat" />
          </button>
        </div>

        <div className="player-footer">
          <button className="icon-btn" aria-label="Devices" title="Devices">
            <Icon name="device" />
          </button>
          <button className={`icon-btn ${showQueue ? 'pressed' : ''}`} onClick={() => setShowQueue((q) => !q)} aria-label="Queue" title="Queue">
            <Icon name="queue" />
          </button>
        </div>
      </Window>

      {showQueue && (
        <Window title="Playlist" icon="cd" className="playlist" statusBar={[`${tracks.length} track(s)`, empty ? 'Waiting for audio' : playing ? 'Playing' : 'Stopped']}>
          <div className="sunken-panel playlist-panel">
            <table className="interactive">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={3} className="empty-cell">
                      Tracks coming soon.
                    </td>
                  </tr>
                ) : (
                  tracks.map((t, i) => (
                    <tr key={t.id} className={i === index ? 'highlighted' : ''} onDoubleClick={() => playAt(i)} onClick={() => playAt(i)}>
                      <td>{i + 1}</td>
                      <td>{t.title}</td>
                      <td>{t.artist || 'VARK'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Window>
      )}
    </div>
  );
}
