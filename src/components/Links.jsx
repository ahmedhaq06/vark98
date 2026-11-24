import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { site } from '../config.js';

/** External music & social links, styled as a Windows 98 Favorites / Shortcuts folder. */
export default function Links() {
  return (
    <Window
      id="links"
      title="Links - Favorites"
      icon="globe"
      className="links-win"
      statusBar={[`${site.socials.length} shortcut(s)`, 'Internet']}
    >
      <div className="links-grid sunken-panel">
        {site.socials.map((s) => (
          <a key={s.url} className="link-card" href={s.url} target="_blank" rel="noreferrer">
            <span className="link-card-icon">
              <Icon name="globe" scale={2} />
            </span>
            <span className="link-card-text">
              <b>{s.label}</b>
              {s.sub && <small>{s.sub}</small>}
            </span>
            <span className="link-card-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </Window>
  );
}
