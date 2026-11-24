import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { SECTIONS } from './Taskbar.jsx';
import { site } from '../config.js';
import { navigate } from '../router.js';

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Minimalist Windows 98 Welcome window. */
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
              <b>{site.artist}</b> is a soul-full, surrealist, abstract expressionist, New Age radical artist — on a journey, exploring, learning, and making sense of it all.
            </p>
            <p>
              They make rap music, paint, direct &amp; draw. Boundaries don&apos;t exist when it comes to expressing yourself, and the whole point of creating is the process itself. <em>No creation is larger than the process itself.</em>
            </p>
            <p>
              <b>U CAN FEEL IT IN THE MUSIC.</b> So far, they&apos;ve put out 4 albums, 2 EPs, and 100+ songs — debuting with <b>INSAANIYAT SE MUSHKIL</b>, and now on the way to their 5th album, <b>SHAKTI</b>, concluding the GREEN, BLUE &amp; RED series.
            </p>
          </div>
        </div>
      </div>
    </Window>
  );
}
