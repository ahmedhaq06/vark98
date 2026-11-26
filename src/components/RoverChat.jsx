import { useState } from 'react';
import { site } from '../config.js';

const LINES = [
  'BOUND4LOVE music video OUT NOW !',
  'SUNDAYS CD (3 pcs) — VARK & .krishav under PRATIYUG.',
  '20 original paintings — framed & shipped All India.',
  '"No creation is larger than the process itself."',
];

/** Windows XP Search Companion-style dog in the bottom-right corner. */
export default function RoverChat() {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [idx, setIdx] = useState(0);

  const open = hovered || pinned;
  const sprite = open ? '/rover/hover.png' : '/rover/idle.png';
  const next = () => setIdx((i) => (i + 1) % LINES.length);

  return (
    <div
      className="rover-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {open && (
        <div className="rover-bubble window" role="status" aria-label={`${site.artist} updates`}>
          <div className="rover-bubble-bar">
            <span>{site.artist}</span>
            <button
              type="button"
              onClick={() => {
                setPinned(false);
                setHovered(false);
              }}
              aria-label="Hide bubble"
              title="Hide"
            >
              ×
            </button>
          </div>
          <p className="rover-say">{LINES[idx]}</p>
          <div className="rover-say-foot">
            <span className="muted">
              {idx + 1} / {LINES.length}
            </span>
            <button type="button" onClick={next}>
              Next &gt;
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="rover-btn"
        onClick={() => {
          if (open) next();
          else setPinned(true);
        }}
        aria-label={open ? 'Next update' : `Show ${site.artist} updates`}
        title={`Hover or click for ${site.artist} updates`}
      >
        <img src={sprite} alt="Desktop dog assistant" />
      </button>
    </div>
  );
}
