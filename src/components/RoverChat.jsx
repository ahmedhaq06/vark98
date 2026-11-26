import { useEffect, useState } from 'react';
import { site } from '../config.js';

const LINES = [
  '5th album SHAKTI coming out in 2027.',
  'BOUND4LOVE music video OUT NOW !',
  'SUNDAYS CD (3 pcs) — VARK & .krishav under PRATIYUG.',
  '20 original paintings — framed & shipped All India.',
  '"No creation is larger than the process itself."',
];

/** Windows XP Search Companion-style dog in the bottom-right corner. */
export default function RoverChat() {
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % LINES.length), 8000);
    return () => clearInterval(t);
  }, [open]);

  const sprite = open ? '/rover/chat.png' : hovered ? '/rover/hover.png' : '/rover/idle.png';
  const next = () => setIdx((i) => (i + 1) % LINES.length);

  return (
    <div className="rover-wrap">
      {open && (
        <div className="rover-bubble window" role="status" aria-label={`${site.artist} updates`}>
          <div className="rover-bubble-bar">
            <span>{site.artist}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Hide bubble" title="Hide">
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
        onClick={() => (open ? next() : setOpen(true))}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={open ? 'Next tip' : `Show ${site.artist} updates`}
        title={open ? 'Click for next update' : `Click to hear from ${site.artist}`}
      >
        <img src={sprite} alt="Desktop dog assistant" />
      </button>
    </div>
  );
}
