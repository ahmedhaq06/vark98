import { useEffect } from 'react';
import Icon from './Icon.jsx';

/** Modal message box in the classic style (info / alerts / detail views). */
export default function Dialog({ title, icon, children, onClose, buttons, width = 360 }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="window dialog" role="dialog" aria-modal="true" aria-label={title} style={{ width }}>
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body">
          <div className="dialog-content">
            {icon && <Icon name={icon} scale={2} className="dialog-icon" />}
            <div className="dialog-text">{children}</div>
          </div>
          <div className="dialog-buttons">
            {(buttons || [{ label: 'OK', onClick: onClose, primary: true }]).map((b) => (
              <button key={b.label} className={b.primary ? 'default' : ''} onClick={b.onClick} disabled={b.disabled} autoFocus={b.primary}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
