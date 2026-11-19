import { useEffect } from 'react';

/** "It's now safe to turn off your computer." Click / key to reboot. */
export default function ShutDown({ onRestart }) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.addEventListener('pointerdown', onRestart, { once: true });
      window.addEventListener('keydown', onRestart, { once: true });
    }, 300);
    return () => {
      clearTimeout(t);
      window.removeEventListener('pointerdown', onRestart);
      window.removeEventListener('keydown', onRestart);
    };
  }, [onRestart]);

  return (
    <div className="shutdown">
      <p>
        It's now safe to turn off
        <br />
        your computer.
      </p>
      <small>Click anywhere to restart</small>
    </div>
  );
}
