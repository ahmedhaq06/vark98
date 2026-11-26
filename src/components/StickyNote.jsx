import { useState } from 'react';

/** Faux Windows-style Sticky Note pinned to the top-right corner of the desktop. */
export default function StickyNote() {
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside className={`sticky-note ${minimized ? 'is-minimized' : ''}`} aria-label="Sticky Note">
      <div className="sticky-bar">
        <span className="sticky-title">Sticky Note</span>
        <div className="sticky-controls">
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? 'Expand note' : 'Minimize note'}
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? '+' : '_'}
          </button>
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Close note"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      {!minimized && (
        <div className="sticky-body">
          <p className="sticky-text">5th album SHAKTI coming out in 2027.</p>
          <span className="sticky-sign">— VARK</span>
        </div>
      )}
    </aside>
  );
}
