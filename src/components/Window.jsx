import { useState } from 'react';
import Icon from './Icon.jsx';

/**
 * Classic Windows window. Minimize collapses the body, Maximize stretches it full-width,
 * Close hides the body and shows a "click to reopen" stub.
 */
export default function Window({
  id,
  title,
  icon,
  menu,
  statusBar,
  children,
  className = '',
  bodyClassName = '',
  closable = true,
  maximizable = true,
  inactive = false,
}) {
  const [state, setState] = useState('normal'); // normal | minimized | maximized | closed

  const toggle = (s) => setState((cur) => (cur === s ? 'normal' : s));

  return (
    <section
      id={id}
      className={`window win ${className} is-${state}`}
      aria-label={title}
    >
      <div className={`title-bar ${inactive ? 'inactive' : ''}`}>
        <div className="title-bar-text">
          {icon && <Icon name={icon} className="title-icon" />}
          <span>{title}</span>
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => toggle('minimized')} />
          <button
            aria-label={state === 'maximized' ? 'Restore' : 'Maximize'}
            disabled={!maximizable}
            onClick={() => maximizable && toggle('maximized')}
          />
          {closable && <button aria-label="Close" onClick={() => toggle('closed')} />}
        </div>
      </div>

      {state === 'closed' ? (
        <button className="win-reopen" onClick={() => setState('normal')}>
          {title} was closed. Click to reopen.
        </button>
      ) : (
        state !== 'minimized' && (
          <>
            {menu && (
              <nav className="win-menubar">
                {menu.map((m) => (
                  <span key={m}>
                    <u>{m[0]}</u>
                    {m.slice(1)}
                  </span>
                ))}
              </nav>
            )}
            <div className={`window-body ${bodyClassName}`}>{children}</div>
            {statusBar && (
              <div className="status-bar">
                {statusBar.map((s, i) => (
                  <p key={i} className="status-bar-field">
                    {s}
                  </p>
                ))}
              </div>
            )}
          </>
        )
      )}
    </section>
  );
}
