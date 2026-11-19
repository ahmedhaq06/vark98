import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { site } from '../config.js';

/** XP-style boot: black screen, logo, sliding blue blocks loader. Click or press any key to skip. */
export default function BootScreen({ durationMs, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLeaving(true);
      setTimeout(onDone, 450);
    };
    const t = setTimeout(finish, durationMs);
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [durationMs, onDone]);

  return (
    <div className={`boot ${leaving ? 'boot-leave' : ''}`} role="status" aria-label="Loading">
      <div className="boot-center">
        <div className="boot-logo">
          <Icon name="flag" scale={5} className="boot-flag" />
          <div className="boot-wordmark">
            <span className="boot-small">Desi Hip Hop</span>
            <span className="boot-name">
              {site.artist}
              <sup>98</sup>
            </span>
          </div>
        </div>
        <div className="boot-loader" aria-hidden="true">
          <div className="boot-blocks">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="boot-footer">
        <span>Copyright © {new Date().getFullYear()} {site.artist}</span>
        <span className="boot-skip">Click anywhere to skip</span>
      </div>
    </div>
  );
}
