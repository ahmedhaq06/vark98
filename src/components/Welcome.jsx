import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { SECTIONS } from './Taskbar.jsx';
import { site } from '../config.js';
import { navigate } from '../router.js';

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Hero section, modelled on the Windows 98 "Welcome" screen. */
export default function Welcome() {
  const links = SECTIONS.filter((s) => s.id !== 'home');
  return (
    <Window id="home" title={`Welcome to ${site.artist}`} icon="computer" className="welcome">
      <div className="welcome-body">
        <div className="welcome-hero">
          <p className="welcome-kicker">Welcome to</p>
          <h1 className="welcome-title">
            {site.artist}
            <sup>98</sup>
          </h1>
          <p className="welcome-tag">{site.tagline}</p>
        </div>
        <div className="welcome-cols">
          <ul className="welcome-links">
            {links.map((s) => (
              <li key={s.id}>
                <button onClick={() => (s.route ? navigate(s.route) : go(s.id))}>
                  <Icon name={s.icon} />
                  <span>{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="welcome-info sunken-panel">
            <p>
              <b>{site.artist}</b> — Music, original paintings &amp; CDs.
            </p>
            <p className="muted">Pick a section on the left or use Start below.</p>
          </div>
        </div>
      </div>
    </Window>
  );
}
